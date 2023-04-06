import { Linkage } from "./Linkage";
import { ConfigurablePolygon } from "./ConfigurablePolygon";
import { Coordinate } from "./Coordinate";
import { Point } from "./Point";
import { MovePointEvent } from "./Event";
import { Connection } from "./connections/Connection";
import { ConfigurableConnection } from "./ConfigurableConnection";
import { IEvent } from "fabric/fabric-impl";
import { USER } from "../utils/Constants";
import { PinConnection } from "./connections/PinConnection";

interface ParsePointResult {
  nameToIndexMap: Map<string, number>;
  indexToNameMap: Map<number, string>;
  coordinates: Coordinate[];
}

interface NamedObject {
  name: string;
  pointName: string;
}

export class Painter {
  private _canvas: fabric.Canvas;
  private _pointToPolygon: Map<string, ConfigurablePolygon>;
  private _pointToConnection: Map<string, ConfigurableConnection>;
  private _freePoints: Set<string>;

  constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this._pointToPolygon = new Map<string, ConfigurablePolygon>();
    this._pointToConnection = new Map<string, ConfigurableConnection>();
    this._freePoints = new Set<string>();

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

    this.updatePoint({
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
    const parsedPoints = this.parsePoints(linkage.points);

    const updateCallback = (movePointEvent: MovePointEvent) => {
      this.updatePoint(movePointEvent);
    };

    const polygon = new ConfigurablePolygon(
      parsedPoints.nameToIndexMap,
      parsedPoints.indexToNameMap,
      parsedPoints.coordinates,
      updateCallback,
      { stroke: "black", strokeWidth: 3, fill: "white" }
    );

    linkage.points.forEach((point) => {
      this._pointToPolygon.set(point.name, polygon);
      this._freePoints.add(point.name);
    });

    this._canvas.add(polygon);
    polygon.snapCorner.forEach((corner) => {
      this._canvas.add(corner);
    });

    return polygon;
  }

  public updatePoint(movePointEvent: MovePointEvent) {
    this.updateTargetPolygon(movePointEvent);
    this.updateConnectionIcon(movePointEvent);

    if (this._freePoints.has(movePointEvent.name)) {
      this._freePoints.forEach((point) => {
        const snapArea = this._pointToPolygon
          .get(point)
          ?.getSnapCornerByName(point);
        if (!snapArea || !snapArea.left || !snapArea.top) {
          console.log(snapArea);
          throw new Error("missing point");
        }

        if (
          movePointEvent.name != point &&
          this.distance(movePointEvent.coordinate, {
            x: snapArea.left,
            y: snapArea.top,
          }) < 10
        ) {
          const p1 = new Point(
            movePointEvent.name,
            movePointEvent.coordinate.x,
            movePointEvent.coordinate.y
          );
          const p2 = new Point(point, snapArea.left, snapArea.top);
          const newConnection = new PinConnection(`${p1}-${p2}`, [p1, p2]);

          this.addConnection(newConnection);
        }
      });
    }

    this._canvas.renderAll();
  }

  private distance(coordinate1: Coordinate, coordinate2: Coordinate) {
    return (
      Math.abs(coordinate1.x - coordinate2.x) +
      Math.abs(coordinate1.y - coordinate2.y)
    );
  }

  private updateTargetPolygon(movePointEvent: MovePointEvent) {
    const targetPolygon = this._pointToPolygon.get(movePointEvent.name);
    if (typeof targetPolygon === "undefined") {
      throw new Error("polygon doesn't exist");
    }

    if (movePointEvent.source !== movePointEvent.name) {
      targetPolygon.updatePoint(movePointEvent);
    }
  }

  private updateConnectionIcon(movePointEvent: MovePointEvent) {
    const connection = this._pointToConnection.get(movePointEvent.name);
    if (typeof connection === "undefined") {
      return;
    }

    if (connection.name != movePointEvent.source) {
      connection.updatePosition(movePointEvent);
    }
  }

  public addConnection(connection: Connection) {
    const updateCallback = (movePointEvent: MovePointEvent) => {
      this.updatePoint(movePointEvent);
    };

    const connectionIcon = new ConfigurableConnection(
      connection,
      updateCallback
    );

    connection.points.forEach((point) => {
      this._pointToConnection.set(point.name, connectionIcon);
      const snapArea = this._pointToPolygon
        .get(point.name)
        ?.getSnapCornerByName(point.name);
      if (snapArea) {
        this._canvas.remove(snapArea);
      }
      this._freePoints.delete(point.name);
    });

    this._canvas.add(connectionIcon.icon);

    this._canvas.renderAll();
  }

  public removeConnection(connection: Connection) {
    const connectionObject = this._pointToConnection.get(
      connection.points[0].name
    );

    if (!connectionObject) {
      throw new Error("no such connection");
    }

    this._canvas.remove(connectionObject.icon);

    connection.points.forEach((point) => {
      this._pointToConnection.delete(point.name);
      const snapArea = this._pointToPolygon
        .get(point.name)
        ?.getSnapCornerByName(point.name);
      if (snapArea) {
        this._canvas.add(snapArea);
      }
      this._freePoints.add(point.name);
    });
  }

  private parsePoints(points: Point[]): ParsePointResult {
    const nameToIndexMap = new Map<string, number>();
    const indexToNameMap = new Map<number, string>();
    const coordinates: Coordinate[] = [];

    points.forEach((point, index) => {
      nameToIndexMap.set(point.name, index);
      indexToNameMap.set(index, point.name);
      coordinates.push({ x: point.x, y: point.y });
    });

    return {
      nameToIndexMap,
      indexToNameMap,
      coordinates,
    };
  }
}
