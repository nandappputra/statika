import { Linkage } from "../diagram_elements/Linkage";
import { ConfigurablePolygon } from "../canvas_entities/ConfigurablePolygon";
import { MovePointEvent } from "../Event";
import { Connection } from "../diagram_elements/connections/Connection";
import { ConfigurableConnection } from "../canvas_entities/ConfigurableConnection";
import { IEvent } from "fabric/fabric-impl";
import { USER } from "../../utils/Constants";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { EventMediator } from "./EventMediator";
import { Feature } from "./features/Feature";
import { Point } from "../Point";

interface NamedObject {
  name: string;
  pointName: string;
}

export class Painter implements EventMediator {
  private _canvas: fabric.Canvas;
  private _pointToEntity: Map<string, Set<CanvasEntity>>;
  private _nameToEntity: Map<string, CanvasEntity>;
  private _elementToEntity: Map<DiagramElement, CanvasEntity>;
  private _painterFeatures: Feature[];
  private _nameToPoint: Map<string, Point>;

  constructor(canvas: fabric.Canvas, painterFeatures: Feature[]) {
    this._canvas = canvas;
    this._pointToEntity = new Map<string, Set<CanvasEntity>>();
    this._nameToEntity = new Map<string, CanvasEntity>();
    this._elementToEntity = new Map<DiagramElement, CanvasEntity>();
    this._painterFeatures = painterFeatures;
    this._nameToPoint = new Map<string, Point>();

    this._canvas.on("object:moving", (event) => this.handleMouseEvent(event));
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

  public drawLinkage(linkage: Linkage) {
    const polygon = new ConfigurablePolygon(linkage, this, {
      stroke: "black",
      strokeWidth: 3,
      fill: "white",
    });

    this._nameToEntity.set(linkage.name, polygon);

    linkage.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, polygon);
      this._nameToPoint.set(point.name, point);
    });

    this._painterFeatures.forEach((feature) => {
      feature.handleElementAddition(this, linkage);
    });

    this._canvas.add(...polygon.getObjectsToDraw());

    return polygon;
  }

  private _addCanvasEntityToMap(key: string, canvasEntity: CanvasEntity) {
    const entitySet = this._pointToEntity.get(key);

    if (!entitySet) {
      const newEntitySet = new Set<CanvasEntity>();
      newEntitySet.add(canvasEntity);

      this._pointToEntity.set(key, newEntitySet);
    } else {
      entitySet.add(canvasEntity);
    }
  }

  public updatePointPosition(movePointEvent: MovePointEvent) {
    const pointToUpdate = this._nameToPoint.get(movePointEvent.name);
    if (!pointToUpdate) {
      throw new Error("missing point");
    }

    pointToUpdate.x = movePointEvent.coordinate.x;
    pointToUpdate.y = movePointEvent.coordinate.y;

    this._updateCanvasEntity(movePointEvent);

    this._painterFeatures.forEach((feature) => {
      feature.handlePointUpdate(this, movePointEvent);
    });

    this._canvas.renderAll();
  }

  private _updateCanvasEntity(movePointEvent: MovePointEvent) {
    const affectedEntity = this._pointToEntity.get(movePointEvent.name);
    if (typeof affectedEntity === "undefined") {
      throw new Error("unrecognized point");
    }

    affectedEntity.forEach((entity) => {
      if (movePointEvent.source != entity.name) {
        entity.updatePosition(movePointEvent);
      }
    });
  }

  public addConnection(connection: Connection) {
    const connectionIcon = new ConfigurableConnection(connection, this);

    this._nameToEntity.set(connection.name, connectionIcon);
    this._elementToEntity.set(connection, connectionIcon);

    connection.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, connectionIcon);
    });

    this._painterFeatures.forEach((feature) => {
      feature.handleElementAddition(this, connection);
    });

    this._canvas.add(...connectionIcon.getObjectsToDraw());

    this._canvas.renderAll();
  }

  public removeConnection(connection: Connection) {
    this._nameToEntity.delete(connection.name);
    const connectionObject = this._elementToEntity.get(connection);
    if (!connectionObject) {
      throw new Error("no such connection");
    }

    this._canvas.remove(...connectionObject.getObjectsToDraw());

    connection.points.forEach((point) => {
      this._pointToEntity.get(point.name)?.delete(connectionObject);
    });

    this._painterFeatures.forEach((feature) => {
      feature.handleElementRemoval(this, connection);
    });
  }

  public getCanvasEntity(diagramElement: DiagramElement) {
    return this._nameToEntity.get(diagramElement.name);
  }

  public getPoint(pointName: string) {
    return this._nameToPoint.get(pointName);
  }
}
