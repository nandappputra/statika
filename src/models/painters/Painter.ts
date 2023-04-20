import { Linkage } from "../diagram_elements/Linkage";
import { LinkageEntity } from "../canvas_entities/LinkageEntity";
import { MovePointEvent } from "../Event";
import { Connection } from "../diagram_elements/connections/Connection";
import { ConnectionEntity } from "../canvas_entities/ConnectionEntity";
import { IEvent } from "fabric/fabric-impl";
import { ElementType, USER } from "../../utils/Constants";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { EventMediator } from "./EventMediator";
import { Feature } from "./features/Feature";
import { Point } from "../Point";
import { IPolylineOptions } from "fabric/fabric-impl";
import { ICircleOptions } from "fabric/fabric-impl";
import { ExternalForce } from "../ExternalForce";
import { EventSubscriber } from "./EventTrigger";

interface NamedObject {
  name: string;
  pointName: string;
}

export interface EntityConfig {
  linkageConfig: IPolylineOptions;
  connectionConfig: ICircleOptions;
}

export class Painter implements EventMediator {
  private _canvas: fabric.Canvas;
  private _eventSubscribers: EventSubscriber[];
  private _entityNameToEntity: Map<string, CanvasEntity>;
  private _painterFeatures: Feature[];
  private _pointNameToPoint: Map<string, Point>;
  private _entityConfig: EntityConfig;

  private _pointNameToPolygon: Map<string, LinkageEntity>;
  private _pointNameToConnection: Map<string, ConnectionEntity>;

  constructor(
    canvas: fabric.Canvas,
    eventSubscriber: EventSubscriber[],
    painterFeatures: Feature[],
    entityConfig: EntityConfig
  ) {
    this._canvas = canvas;
    this._eventSubscribers = eventSubscriber;
    this._entityNameToEntity = new Map<string, CanvasEntity>();
    this._painterFeatures = painterFeatures;
    this._pointNameToPoint = new Map<string, Point>();
    this._entityConfig = entityConfig;

    this._pointNameToPolygon = new Map<string, LinkageEntity>();
    this._pointNameToConnection = new Map<string, ConnectionEntity>();

    this._canvas.on("object:moving", (event) => this.handleMouseEvent(event));
    this._canvas.on("selection:updated", (event) =>
      this.handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:created", (event) =>
      this.handleObjectSelectionEvent(event)
    );
  }

  private handleObjectSelectionEvent(_event: IEvent<MouseEvent>) {
    const name: unknown = this._canvas.getActiveObject()?.data?.name;
    const elementType: unknown = this._canvas.getActiveObject()?.data?.type;

    if (
      !(typeof name === "string") ||
      !(typeof elementType === "string") ||
      !Object.values<string>(ElementType).includes(elementType)
    ) {
      return;
    }

    const canvasEntity = this._entityNameToEntity.get(name);

    if (!canvasEntity) {
      return;
    }

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.notifyObjectSelectionEvent({
        name,
        entity: canvasEntity,
      });
    });
  }

  public getAllEntityName() {
    return [...this._entityNameToEntity.keys()];
  }

  public setFocus(name: string) {
    const entity = this._entityNameToEntity.get(name);
    if (!entity) {
      throw new Error("failed to set focus");
    }

    this._canvas.setActiveObject(entity.getFocusableObject());
    this._canvas.renderAll();
  }

  private handleMouseEvent(event: IEvent<MouseEvent>) {
    const metadata: unknown = event.target?.data;
    const coordinate = event.target?.getCenterPoint();

    if (typeof coordinate === "undefined") {
      return;
    }

    if (!this.isNamedObject(metadata)) {
      return;
    }

    this.updatePointPosition({
      name: metadata.pointName,
      source: USER,
      coordinate: {
        x: coordinate.x,
        y: coordinate.y,
      },
    });
  }

  private isNamedObject(metadata: unknown): metadata is NamedObject {
    return (
      metadata !== null &&
      typeof metadata === "object" &&
      "name" in metadata &&
      "pointName" in metadata
    );
  }

  private _addCanvasEntityToMap(key: string, canvasEntity: CanvasEntity) {
    if (canvasEntity instanceof LinkageEntity) {
      this._pointNameToPolygon.set(key, canvasEntity);
    } else if (canvasEntity instanceof ConnectionEntity) {
      this._pointNameToConnection.set(key, canvasEntity);
    }
  }

  public updatePointPosition(movePointEvent: MovePointEvent) {
    const pointToUpdate = this._pointNameToPoint.get(movePointEvent.name);
    if (!pointToUpdate) {
      throw new Error("missing point");
    }

    pointToUpdate.x = movePointEvent.coordinate.x;
    pointToUpdate.y = movePointEvent.coordinate.y;

    this._updateCanvasEntity(movePointEvent);

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.notifyMovePointEvent(movePointEvent);
    });

    this._painterFeatures.forEach((feature) => {
      feature.handlePointUpdate(this, movePointEvent);
    });

    this._canvas.renderAll();
  }

  public addExternalLoad(
    location: Point | Connection,
    externalLoad: ExternalForce
  ) {
    if (location instanceof Point) {
      const affectedPolygon = this._pointNameToPolygon.get(location.name);
      if (!affectedPolygon) {
        throw new Error("unrecognized point");
      }

      const arrow = affectedPolygon.addExternalForce(location, externalLoad);
      this._canvas.add(arrow);
    }
  }

  public removeExternalLoad(
    location: Point | Connection,
    externalLoad: ExternalForce
  ) {
    if (location instanceof Point) {
      const affectedPolygon = this._pointNameToPolygon.get(location.name);
      if (!affectedPolygon) {
        throw new Error("unrecognized point");
      }

      const arrow = affectedPolygon.removeExternalForce(location, externalLoad);
      this._canvas.remove(arrow);
    }

    this._canvas.renderAll();
  }

  private _updateCanvasEntity(movePointEvent: MovePointEvent) {
    const polygon = this._pointNameToPolygon.get(movePointEvent.name);
    if (polygon && movePointEvent.source != polygon.name) {
      polygon.updatePosition(movePointEvent);
    }

    const connection = this._pointNameToConnection.get(movePointEvent.name);
    if (connection && movePointEvent.source != connection.name) {
      connection.updatePosition(movePointEvent);
    }
  }

  public addElement(diagramElement: DiagramElement) {
    let entity: CanvasEntity;

    if (diagramElement instanceof Linkage) {
      entity = new LinkageEntity(
        diagramElement,
        this,
        this._entityConfig.linkageConfig
      );
    } else if (diagramElement instanceof Connection) {
      entity = new ConnectionEntity(diagramElement, this);
    } else {
      throw new Error("unknown type of element");
    }

    this._entityNameToEntity.set(diagramElement.name, entity);

    diagramElement.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, entity);
      this._pointNameToPoint.set(point.name, point);
    });

    this._painterFeatures.forEach((feature) => {
      feature.handleElementAddition(this, diagramElement);
    });

    this._canvas.add(...entity.getObjectsToDraw());

    return entity;
  }

  public removeElement(diagramElement: DiagramElement) {
    const entity = this._entityNameToEntity.get(diagramElement.name);
    if (!entity) {
      throw new Error("no such entity");
    }

    this._canvas.remove(...entity.getObjectsToDraw());
    this._entityNameToEntity.delete(diagramElement.name);

    diagramElement.points.forEach((point) => {
      if (entity instanceof LinkageEntity) {
        this._pointNameToPolygon.delete(point.name);
      } else if (entity instanceof ConnectionEntity) {
        this._pointNameToConnection.delete(point.name);
      }
    });

    this._painterFeatures.forEach((feature) => {
      feature.handleElementRemoval(this, diagramElement);
    });
  }

  public getCanvasEntity(diagramElement: DiagramElement) {
    return this._entityNameToEntity.get(diagramElement.name);
  }

  public getPoint(pointName: string) {
    return this._pointNameToPoint.get(pointName);
  }

  public addPointToLinkage(point: Point, linkage: Linkage) {
    this._pointNameToPoint.set(point.name, point);

    const entity = this._entityNameToEntity.get(linkage.name);
    if (!entity || !(entity instanceof LinkageEntity)) {
      throw new Error("missing or invalid entity found");
    }

    this._pointNameToPolygon.set(point.name, entity);

    const configurablePoint = entity.addPoint(point);
    this._canvas.add(configurablePoint);

    this._painterFeatures.forEach((feature) =>
      feature.handlePointAddition(this, linkage, point)
    );
  }

  public removePointFromLinkage(point: Point, linkage: Linkage) {
    const targetLinkage = this._pointNameToPolygon.get(point.name);
    if (!targetLinkage) {
      throw new Error("target linkage not found");
    }

    this._pointNameToPoint.delete(point.name);

    const canvasElement = targetLinkage?.deletePoint(point);
    canvasElement.forEach((ent) => {
      this._canvas.remove(ent);
    });

    const affectedConnection = this._pointNameToConnection.get(point.name);
    affectedConnection?.deletePoint(point);

    this._painterFeatures.forEach((feature) =>
      feature.handlePointRemoval(this, linkage, point)
    );
  }

  public getCanvasCenter() {
    return this._canvas.getCenter();
  }
}
