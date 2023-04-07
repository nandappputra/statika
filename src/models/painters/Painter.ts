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

interface NamedObject {
  name: string;
  pointName: string;
}

export class Painter implements EventMediator {
  private _canvas: fabric.Canvas;
  private _pointToEntity: Map<string, Set<CanvasEntity>>;
  private _freePoints: Set<string>;
  private _elementToEntity: Map<DiagramElement, CanvasEntity>;

  constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this._pointToEntity = new Map<string, Set<CanvasEntity>>();
    this._freePoints = new Set<string>();
    this._elementToEntity = new Map<DiagramElement, CanvasEntity>();

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

    linkage.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, polygon);
      this._freePoints.add(point.name);
    });

    this._canvas.add(...polygon.getObjectsToDraw());
    polygon.snapCorner.forEach((corner) => {
      this._canvas.add(corner);
    });

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
    this._updateCanvasEntity(movePointEvent);

    // if (this._freePoints.has(movePointEvent.name)) {
    //   this._freePoints.forEach((point) => {
    //     const snapArea = this._pointToPolygon
    //       .get(point)
    //       ?.getSnapCornerByName(point);
    //     if (!snapArea || !snapArea.left || !snapArea.top) {
    //       console.log(snapArea);
    //       throw new Error("missing point");
    //     }

    //     if (
    //       movePointEvent.name != point &&
    //       this.distance(movePointEvent.coordinate, {
    //         x: snapArea.left,
    //         y: snapArea.top,
    //       }) < 10
    //     ) {
    //       const p1 = new Point(
    //         movePointEvent.name,
    //         movePointEvent.coordinate.x,
    //         movePointEvent.coordinate.y
    //       );
    //       const p2 = new Point(point, snapArea.left, snapArea.top);
    //       const newConnection = new PinConnection(`${p1}-${p2}`, [p1, p2]);

    //       this.addConnection(newConnection);
    //     }
    //   });
    // }

    this._canvas.renderAll();
  }

  // private distance(coordinate1: Coordinate, coordinate2: Coordinate) {
  //   return (
  //     Math.abs(coordinate1.x - coordinate2.x) +
  //     Math.abs(coordinate1.y - coordinate2.y)
  //   );
  // }

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

    this._elementToEntity.set(connection, connectionIcon);
    connection.points.forEach((point) => {
      this._addCanvasEntityToMap(point.name, connectionIcon);

      // const snapArea = this._pointToPolygon
      //   .get(point.name)
      //   ?.getSnapCornerByName(point.name);
      // if (snapArea) {
      //   this._canvas.remove(snapArea);
      // }
      // this._freePoints.delete(point.name);
    });

    this._canvas.add(...connectionIcon.getObjectsToDraw());

    this._canvas.renderAll();
  }

  public removeConnection(connection: Connection) {
    const connectionObject = this._elementToEntity.get(connection);
    if (!connectionObject) {
      throw new Error("no such connection");
    }

    this._canvas.remove(...connectionObject.getObjectsToDraw());

    connection.points.forEach((point) => {
      this._pointToEntity.get(point.name)?.delete(connectionObject);
      // const snapArea = this._pointToPolygon
      //   .get(point.name)
      //   ?.getSnapCornerByName(point.name);
      // if (snapArea) {
      //   this._canvas.add(snapArea);
      // }
      // this._freePoints.add(point.name);
    });
  }
}
