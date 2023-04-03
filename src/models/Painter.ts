import { Linkage } from "./Linkage";
import { ConfigurablePolygon } from "./ConfigurablePolygon";
import { Coordinate } from "./Coordinate";
import { Point } from "./Point";
import { MovePointEvent } from "./Event";
import { Connection } from "./connections/Connection";
import { ConfigurableConnection } from "./ConfigurableConnection";

interface ParsePointResult {
  nameToIndexMap: Map<string, number>;
  indexToNameMap: Map<number, string>;
  coordinates: Coordinate[];
}

export class Painter {
  private _canvas: fabric.Canvas;
  private _pointToPolygon: Map<string, ConfigurablePolygon>;
  private _pointToPoint: Map<string, string[]>;
  private _pointToConnection: Map<string, ConfigurableConnection>;

  constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this._pointToPolygon = new Map<string, ConfigurablePolygon>();
    this._pointToPoint = new Map<string, string[]>();
    this._pointToConnection = new Map<string, ConfigurableConnection>();
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
      { stroke: "black", fill: "white" }
    );

    linkage.points.forEach((point) => {
      this._pointToPolygon.set(point.name, polygon);
    });

    this._canvas.add(polygon);

    return polygon;
  }

  public updatePoint(movePointEvent: MovePointEvent) {
    this.updateTargetPolygon(movePointEvent);
    this.updateConnectedPolygon(movePointEvent);
    this.updateConnectionIcon(movePointEvent);

    this._canvas.renderAll();
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

  private updateConnectedPolygon(movePointEvent: MovePointEvent) {
    const points = this._pointToPoint.get(movePointEvent.name);
    if (typeof points === "undefined") {
      return;
    }

    points.forEach((point) => {
      const polygon = this._pointToPolygon.get(point);

      polygon?.updatePoint({ ...movePointEvent, name: point });
    });
  }

  private updateConnectionIcon(movePointEvent: MovePointEvent) {
    const connection = this._pointToConnection.get(movePointEvent.name);
    if (typeof connection === "undefined") {
      return;
    }

    connection.setPosition(
      movePointEvent.coordinate.x,
      movePointEvent.coordinate.y
    );
  }

  public addConnection(connection: Connection) {
    const connectionIcon = new ConfigurableConnection("conn");
    connectionIcon.setPosition(connection.points[0].x, connection.points[0].y);

    this.registerPointEvent(connection);
    this.registerConnectionEvent(connection, connectionIcon);

    this._canvas.add(connectionIcon.icon);

    this._canvas.renderAll();
  }

  private registerPointEvent(connection: Connection) {
    connection.points.forEach((point1) => {
      connection.points.forEach((point2) => {
        if (point1.name === point2.name) {
          return;
        }

        const points = this._pointToPoint.get(point1.name);
        if (typeof points === "undefined") {
          this._pointToPoint.set(point1.name, [point2.name]);
        } else {
          this._pointToPoint.set(point1.name, [...points, point2.name]);
        }
      });
    });
  }

  private registerConnectionEvent(
    connection: Connection,
    connectionIcon: ConfigurableConnection
  ) {
    connection.points.forEach((point) => {
      this._pointToConnection.set(point.name, connectionIcon);
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
