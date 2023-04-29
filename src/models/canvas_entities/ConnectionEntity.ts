import { fabric } from "fabric";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ConnectionType, ElementType } from "../../utils/Constants";

export class ConnectionEntity implements CanvasEntity {
  private _name: string;
  private _connection: ConnectionElement;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(connection: ConnectionElement, eventMediator: EventMediator) {
    this._name = connection.name;
    this._connection = connection;
    this._eventMediator = eventMediator;
    this._icon = this.buildIcon(connection, connection.type);
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    this._icon.set("left", movePointEvent.coordinate.x);
    this._icon.set("top", movePointEvent.coordinate.y);
    this._icon.setCoords();

    this.propagateEvent({ ...movePointEvent, source: this._connection.name });
  }

  public getObjectsToDraw() {
    return this._icon;
  }

  private propagateEvent(movePointEvent: MovePointEvent) {
    this._connection.points.forEach((point) => {
      const moveEvent: MovePointEvent = { ...movePointEvent, name: point.name };
      this._eventMediator.updatePointPosition(moveEvent);
    });
  }

  get name() {
    return this._name;
  }

  get x() {
    return this._connection.points[0].x;
  }

  get y() {
    return this._connection.points[0].y;
  }

  public getAllPoints() {
    return this._connection.points;
  }

  public addPoint(point: Point) {
    this._connection.addPoint(point);
  }

  public deletePoint(point: Point) {
    if (!this._icon.data?.pointName) {
      throw new Error("missing pointName in metadata");
    }

    this._icon.data.pointName = this._connection.points[0].name;

    this._connection.removePoint(point);
  }

  public getElement() {
    return this._connection;
  }

  public changeConnectionType(connectionType: ConnectionType) {
    this._connection.changeConnectionType(connectionType);
    this._icon = this.buildIcon(this._connection, connectionType);
  }

  private buildIcon(
    connection: ConnectionElement,
    connectionType: ConnectionType
  ) {
    switch (connectionType) {
      case ConnectionType.FIXED:
        return this.buildFixedIcon(connection);
      case ConnectionType.FREE:
        return this.buildFreeIcon(connection);
      case ConnectionType.HORIZONTAL_ROLLER:
        return this.buildHorizontalRollerIcon(connection);
      case ConnectionType.PIN:
        return this.buildPinIcon(connection);
    }
  }

  private buildFixedIcon(connection: ConnectionElement) {
    const reference = connection.points[0];

    const baseLine = new fabric.Line(
      [reference.x - 15, reference.y, reference.x + 15, reference.y],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );

    const line1 = new fabric.Line(
      [reference.x - 12, reference.y, reference.x - 8, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );
    const line2 = new fabric.Line(
      [reference.x, reference.y, reference.x + 5, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );
    const line3 = new fabric.Line(
      [reference.x + 8, reference.y, reference.x + 12, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );

    const icon = new fabric.Group([baseLine, line1, line2, line3], {
      originX: "center",
      originY: "top",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });

    return icon;
  }

  private buildFreeIcon(connection: ConnectionElement) {
    const reference = connection.points[0];

    const line1 = new fabric.Line(
      [reference.x - 10, reference.y - 10, reference.x + 10, reference.y + 10],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );
    const line2 = new fabric.Line(
      [reference.x + 10, reference.y - 10, reference.x - 10, reference.y + 10],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );

    const icon = new fabric.Group([line1, line2], {
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });

    return icon;
  }

  private buildHorizontalRollerIcon(connection: ConnectionElement) {
    const reference = connection.points[0];

    const baseLine = new fabric.Line(
      [
        reference.x - 15,
        reference.y - 2.5,
        reference.x + 15,
        reference.y - 2.5,
      ],
      {
        stroke: "black",
        strokeWidth: 3,
      }
    );

    const roller = new fabric.Circle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      radius: 5,
      left: connection.points[0].x,
      top: connection.points[0].y,
      hasControls: false,
    });

    const icon = new fabric.Group([baseLine, roller], {
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });

    return icon;
  }

  private buildPinIcon(connection: ConnectionElement) {
    return new fabric.Circle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      radius: 5,
      originX: "center",
      originY: "center",
      left: connection.points[0].x,
      top: connection.points[0].y,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
      hasControls: false,
    });
  }
}
