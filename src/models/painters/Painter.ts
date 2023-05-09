import { LinkageElement } from "../diagram_elements/LinkageElement";
import { LinkageEntity } from "../canvas_entities/LinkageEntity";
import { MovePointEvent } from "../Event";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { ConnectionEntity } from "../canvas_entities/ConnectionEntity";
import { IEvent } from "fabric/fabric-impl";
import { ConnectionKind, EntityPrefix, USER } from "../../utils/Constants";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { EventMediator } from "./EventMediator";
import { Point } from "../diagram_elements/Point";
import { IPolylineOptions } from "fabric/fabric-impl";
import { ICircleOptions } from "fabric/fabric-impl";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { ExternalForceEntity } from "../canvas_entities/ExternalForceEntity";
import { PointEntity } from "../canvas_entities/PointEntity";
import { Structure } from "../Structure";
import { CanvasBinder } from "./CanvasBinder";
import { CanvasEventSubscriber } from "./canvas_event_subscribers/CanvasEventSubscriber";

interface NamedObject {
  name: string;
  pointName: string;
}

export interface EntityConfig {
  linkageConfig: IPolylineOptions;
  connectionConfig: ICircleOptions;
}

export class Painter implements EventMediator, CanvasBinder {
  private _canvas: fabric.Canvas;
  private _eventSubscribers: CanvasEventSubscriber[];
  private _entityNameToEntity: Map<string, CanvasEntity>;
  private _pointNameToPoint: Map<string, Point>;
  private _entityConfig: EntityConfig;

  private _pointNameToLinkageEntity: Map<string, LinkageEntity>;
  private _pointNameToConnectionEntity: Map<string, ConnectionEntity>;
  private _locationNameToExternalForceEntity: Map<
    string,
    Set<ExternalForceEntity>
  >;
  private _pointNameToPointEntity: Map<string, PointEntity>;

  private _isDragging = false;

  constructor(
    canvas: fabric.Canvas,
    eventSubscriber: CanvasEventSubscriber[],
    entityConfig: EntityConfig
  ) {
    this._canvas = canvas;
    this._eventSubscribers = eventSubscriber;
    this._entityNameToEntity = new Map<string, CanvasEntity>();
    this._pointNameToPoint = new Map<string, Point>();
    this._entityConfig = entityConfig;

    this._pointNameToLinkageEntity = new Map<string, LinkageEntity>();
    this._pointNameToConnectionEntity = new Map<string, ConnectionEntity>();
    this._locationNameToExternalForceEntity = new Map<
      string,
      Set<ExternalForceEntity>
    >();
    this._pointNameToPointEntity = new Map<string, PointEntity>();

    this._canvas.on("object:moving", (event) =>
      this._handleObjectMotionEvent(event)
    );
    this._canvas.on("mouse:up", (event) => this._handleMouseUpEvent(event));
    this._canvas.on("selection:updated", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:created", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:cleared", () =>
      this._handleObjectSelectionClearEvent()
    );
    this._canvas.on("mouse:wheel", (event) => this._handleMouseScroll(event));
  }

  private _handleMouseUpEvent(_event: IEvent<MouseEvent>) {
    if (this._isDragging) {
      const name: unknown = this._canvas.getActiveObject()?.data?.name;
      const elementType: unknown = this._canvas.getActiveObject()?.data?.type;

      if (
        !(typeof name === "string") ||
        !(typeof elementType === "string") ||
        !Object.values<string>(EntityPrefix).includes(elementType)
      ) {
        return;
      }

      const canvasEntity = this._entityNameToEntity.get(name);
      if (!canvasEntity) {
        return;
      }

      this._eventSubscribers.forEach((feature) =>
        feature.handleObjectDrop(this, {
          name,
          entity: canvasEntity,
        })
      );
      this._isDragging = false;
    }
  }

  private _handleObjectSelectionEvent(_event: IEvent<MouseEvent>) {
    const name: unknown = this._canvas.getActiveObject()?.data?.name;
    const elementType: unknown = this._canvas.getActiveObject()?.data?.type;

    if (
      !(typeof name === "string") ||
      !(typeof elementType === "string") ||
      !Object.values<string>(EntityPrefix).includes(elementType)
    ) {
      return;
    }

    const canvasEntity = this._entityNameToEntity.get(name);
    if (!canvasEntity) {
      return;
    }

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleObjectSelectionEvent({
        name,
        entity: canvasEntity,
      });
    });
  }

  private _handleObjectSelectionClearEvent() {
    this._isDragging = false;
    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleObjectSelectionClearEvent();
    });
  }

  private _handleMouseScroll(event: IEvent<WheelEvent>) {
    if (!this._canvas.viewportTransform) {
      return;
    }

    const viewportTransform = this._canvas.viewportTransform.slice();
    viewportTransform[4] -= event.e.deltaX;
    viewportTransform[5] -= event.e.deltaY;

    this._canvas.setViewportTransform(viewportTransform);
  }

  public getAllEntityName() {
    return [...this._entityNameToEntity.keys()];
  }

  public getEntityByName(name: string) {
    return this._entityNameToEntity.get(name);
  }

  public setFocus(name: string) {
    const entity = this._entityNameToEntity.get(name);
    if (!entity) {
      throw new Error("failed to set focus: object not found");
    }

    this._canvas.setActiveObject(entity.getObjectsToDraw());
    this._canvas.renderAll();
  }

  private _handleObjectMotionEvent(event: IEvent<MouseEvent>) {
    this._isDragging = true;
    const metadata: unknown = event.target?.data;
    const coordinate = event.target?.getCenterPoint();

    if (typeof coordinate === "undefined") {
      return;
    }

    if (!this._isNamedObject(metadata)) {
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

  private _isNamedObject(metadata: unknown): metadata is NamedObject {
    return (
      metadata !== null &&
      typeof metadata === "object" &&
      "name" in metadata &&
      "pointName" in metadata
    );
  }

  private _addCanvasEntityToMap(key: string, canvasEntity: CanvasEntity) {
    if (canvasEntity instanceof LinkageEntity) {
      this._pointNameToLinkageEntity.set(key, canvasEntity);
    } else if (canvasEntity instanceof ConnectionEntity) {
      this._pointNameToConnectionEntity.set(key, canvasEntity);
    }
  }

  public updatePointPosition(movePointEvent: MovePointEvent) {
    this._updateCanvasEntity(movePointEvent);

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handlePointUpdate(this, movePointEvent);
    });

    this._canvas.renderAll();
  }

  private _updateCanvasEntity(movePointEvent: MovePointEvent) {
    const linkageEntity = this._pointNameToLinkageEntity.get(
      movePointEvent.name
    );
    if (linkageEntity && movePointEvent.source != linkageEntity.name) {
      linkageEntity.updatePosition(movePointEvent);
    }

    const pointEntity = this._pointNameToPointEntity.get(movePointEvent.name);
    if (pointEntity && movePointEvent.source != pointEntity.name) {
      pointEntity.updatePosition(movePointEvent);
    }

    const forceEntitySet = this._locationNameToExternalForceEntity.get(
      movePointEvent.name
    );
    if (forceEntitySet) {
      forceEntitySet.forEach((force) => {
        force.updatePosition(movePointEvent);
      });
    }

    const connection = this._pointNameToConnectionEntity.get(
      movePointEvent.name
    );
    if (connection && movePointEvent.source != connection.name) {
      connection.updatePosition(movePointEvent);
    }
  }

  public addExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ) {
    let externalForce = this._entityNameToEntity.get(
      externalLoad.name
    ) as ExternalForceEntity;
    if (externalForce === undefined) {
      externalForce = new ExternalForceEntity(externalLoad, location, this);
      this._canvas.add(externalForce.getObjectsToDraw());
    }

    this._entityNameToEntity.set(externalForce.name, externalForce);

    externalForce.location = location;
    const affectedForces = this._locationNameToExternalForceEntity.get(
      location.name
    );
    if (!affectedForces || affectedForces.size == 0) {
      const forceSet = new Set<ExternalForceEntity>();
      forceSet.add(externalForce);
      this._locationNameToExternalForceEntity.set(location.name, forceSet);
    } else {
      affectedForces.add(externalForce);
    }

    location.addExternalForce(externalLoad);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handleForceAddition(this, location, externalLoad)
    );
  }

  public removeExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ) {
    const entity = this._entityNameToEntity.get(externalLoad.name);
    const affectedForce = this._locationNameToExternalForceEntity.get(
      location.name
    );
    if (!affectedForce || !entity) {
      throw new Error("failed to remove force: unrecognized force or location");
    }

    this._entityNameToEntity.delete(externalLoad.name);
    this._locationNameToExternalForceEntity
      .get(location.name)
      ?.delete(entity as ExternalForceEntity);
    this._canvas.remove(entity.getObjectsToDraw());
    location.removeExternalForce(externalLoad);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handleForceRemoval(this, location, externalLoad)
    );

    this._canvas.renderAll();
  }

  public addElement(diagramElement: DiagramElement) {
    let entity: CanvasEntity;

    if (diagramElement instanceof LinkageElement) {
      entity = new LinkageEntity(
        diagramElement,
        this,
        this._entityConfig.linkageConfig
      );
    } else if (diagramElement instanceof ConnectionElement) {
      entity = new ConnectionEntity(diagramElement, this);
    } else {
      throw new Error("unknown type of element");
    }

    this._entityNameToEntity.set(diagramElement.name, entity);
    this._canvas.add(entity.getObjectsToDraw());

    diagramElement.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, entity);
      this._pointNameToPoint.set(point.name, point);

      if (!this._pointNameToPointEntity.get(point.name)) {
        const newPoint = new PointEntity(point, this);
        this._pointNameToPointEntity.set(point.name, newPoint);
        this._entityNameToEntity.set(point.name, newPoint);

        this._canvas.add(newPoint.getObjectsToDraw());
      }

      if (diagramElement instanceof ConnectionElement) {
        this._pointNameToPointEntity.get(point.name)?.setVisible(false);
      }
    });

    if (diagramElement instanceof ConnectionElement) {
      const forces = [...diagramElement.externalForces];
      forces.forEach((force) => {
        diagramElement.removeExternalForce(force);
        this.addExternalLoad(diagramElement, force);
      });
    }

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleElementAddition(this, diagramElement);
    });

    return entity;
  }

  public removeElement(diagramElement: DiagramElement) {
    const entity = this._entityNameToEntity.get(diagramElement.name);
    if (!entity) {
      throw new Error("no such entity");
    }

    if (entity instanceof ConnectionEntity) {
      const forces = [...entity.getElement().externalForces];
      forces.forEach((force) => {
        this.removeExternalLoad(entity.getElement(), force);
      });
    }

    const points = [...diagramElement.points];

    points.forEach((point) => {
      const pointEntity = this._pointNameToPointEntity.get(point.name);
      if (!pointEntity) {
        return;
      }

      if (entity instanceof LinkageEntity) {
        const affectedConnection = this._pointNameToConnectionEntity.get(
          point.name
        );
        if (affectedConnection) {
          this.removePointFromConnection(
            point,
            affectedConnection.getElement()
          );
        }
        const affectedForce = this._locationNameToExternalForceEntity.get(
          point.name
        );
        affectedForce?.forEach((force) =>
          this.removeExternalLoad(point, force.getElement())
        );

        this._pointNameToLinkageEntity.delete(point.name);

        this._canvas.remove(pointEntity.getObjectsToDraw());

        this._pointNameToLinkageEntity.delete(point.name);
        this._entityNameToEntity.delete(point.name);
        this._pointNameToPointEntity.delete(point.name);
      } else if (entity instanceof ConnectionEntity) {
        this._pointNameToConnectionEntity.delete(point.name);
        this.removePointFromConnection(point, entity.getElement());
      }
    });

    this._entityNameToEntity.delete(diagramElement.name);
    this._canvas.remove(entity.getObjectsToDraw());

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleElementRemoval(this, diagramElement);
    });

    this._canvas.renderAll();
  }

  public getCanvasEntity(diagramElement: DiagramElement) {
    return this._entityNameToEntity.get(diagramElement.name);
  }

  public getPoint(pointName: string) {
    return this._pointNameToPoint.get(pointName);
  }

  public addPointToLinkage(point: Point, linkage: LinkageElement) {
    const entity = this._entityNameToEntity.get(linkage.name);
    if (!entity || !(entity instanceof LinkageEntity)) {
      throw new Error(
        "failed to add point to linkage: missing or invalid entity found"
      );
    }

    this._pointNameToPoint.set(point.name, point);
    this._pointNameToLinkageEntity.set(point.name, entity);
    entity.addPoint(point);

    const pointEntity = new PointEntity(point, this);
    this._canvas.add(pointEntity.getObjectsToDraw());
    this._pointNameToPointEntity.set(point.name, pointEntity);
    this._entityNameToEntity.set(point.name, pointEntity);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointAddition(this, linkage, point)
    );
  }

  public removePointFromLinkage(point: Point, linkage: LinkageElement) {
    const affectedPoint = this._pointNameToPointEntity.get(point.name);
    if (!affectedPoint) {
      throw new Error(
        "failed to remove point from linkage: unrecognized point"
      );
    }

    const affectedConnection = this._pointNameToConnectionEntity.get(
      point.name
    );
    if (affectedConnection) {
      this.removePointFromConnection(point, affectedConnection.getElement());
    }

    this._entityNameToEntity.delete(point.name);
    this._pointNameToPointEntity.delete(point.name);
    this._canvas.remove(affectedPoint.getObjectsToDraw());

    this._pointNameToPoint.delete(point.name);

    const targetLinkage = this._pointNameToLinkageEntity.get(point.name);
    targetLinkage?.deletePoint(point);

    const affectedForce = this._locationNameToExternalForceEntity.get(
      point.name
    );
    affectedForce?.forEach((force) =>
      this.removeExternalLoad(point, force.getElement())
    );

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointRemoval(this, linkage, point)
    );

    if (targetLinkage && targetLinkage?.getAllPoints().length == 1) {
      this.removeElement(targetLinkage.getElement());
    }
  }

  public addPointToConnection(point: Point, connection: ConnectionElement) {
    const affectedPoint = this.getEntityByName(point.name);
    const affectedConnection = this.getCanvasEntity(connection);
    if (
      !(affectedConnection instanceof ConnectionEntity) ||
      !(affectedPoint instanceof PointEntity)
    ) {
      throw new Error(
        "failed to add point to connection: missing or invalid entity"
      );
    }

    affectedPoint.setVisible(false);
    this._pointNameToConnectionEntity.set(point.name, affectedConnection);
    affectedConnection.addPoint(point);

    const forces = affectedPoint.getElement().externalForces;
    forces.forEach((force) => {
      this.removeExternalLoad(affectedPoint.getElement(), force);
      this.addExternalLoad(affectedConnection.getElement(), force);
    });

    this._canvas.renderAll();
  }

  public removePointFromConnection(
    point: Point,
    connection: ConnectionElement
  ) {
    const affectedPoint = this.getEntityByName(point.name);
    const affectedConnection = this.getCanvasEntity(connection);
    if (
      !(affectedConnection instanceof ConnectionEntity) ||
      !(affectedPoint instanceof PointEntity)
    ) {
      throw new Error(
        "failed to remove point to connection: missing or invalid entity"
      );
    }

    affectedPoint.setVisible(true);

    this._pointNameToConnectionEntity.delete(point.name);
    affectedConnection.deletePoint(point);
    if (affectedConnection.getAllPoints().length === 0) {
      this.removeElement(connection);
    }
    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointDisconnection(this, connection, point)
    );
  }

  public getLinkageFromPoint(point: Point) {
    return this._pointNameToLinkageEntity.get(point.name);
  }

  public getCanvasCenter() {
    return this._canvas.getVpCenter();
  }

  public updateForce(externalForce: ExternalForce, F_x: number, F_y: number) {
    const externalForceEntity = this._entityNameToEntity.get(
      externalForce.name
    );
    if (!(externalForceEntity instanceof ExternalForceEntity)) {
      throw new Error("failed to update force: missing or invalid force");
    }

    externalForceEntity.setForceComponents(F_x, F_y);
    this._canvas.renderAll();
  }

  public changeConnectionType(
    connection: ConnectionElement,
    connectionType: ConnectionKind
  ) {
    const connectionEntity = this._entityNameToEntity.get(connection.name);
    if (!connectionEntity || !(connectionEntity instanceof ConnectionEntity)) {
      throw new Error(
        "failed to add change connection type: missing or invalid entity found"
      );
    }

    this._canvas.remove(connectionEntity.getObjectsToDraw());

    connectionEntity.changeConnectionType(connectionType);

    this._canvas.add(connectionEntity.getObjectsToDraw());

    this._canvas.renderAll();
  }

  public buildStructure() {
    const linkages: LinkageElement[] = [];
    const connections: ConnectionElement[] = [];

    this._entityNameToEntity.forEach((entity) => {
      if (entity instanceof LinkageEntity) {
        linkages.push(entity.getElement());
      } else if (entity instanceof ConnectionEntity) {
        connections.push(entity.getElement());
      }
    });

    return new Structure(linkages, connections);
  }

  public clearFocus() {
    this._canvas.discardActiveObject();
  }
}
