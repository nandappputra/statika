import { fabric } from "fabric";
import { Connection } from "../diagram_elements/connections/Connection";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ElementType } from "../../utils/Constants";

export class ConnectionEntity implements CanvasEntity {
  private _name: string;
  private _connection: Connection;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(connection: Connection, eventMediator: EventMediator) {
    this._name = connection.name;
    this._connection = connection;
    this._eventMediator = eventMediator;
    this._icon = this.buildConnectionIcon(connection);
  }

  private buildConnectionIcon(connection: Connection) {
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

  public updatePosition(movePointEvent: MovePointEvent) {
    this._icon.set("left", movePointEvent.coordinate.x);
    this._icon.set("top", movePointEvent.coordinate.y);
    this._icon.setCoords();

    this.propagateEvent({ ...movePointEvent, source: this._connection.name });
  }

  public getObjectsToDraw() {
    return [this._icon];
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

  public deletePoint(point: Point) {
    if (!this._icon.data?.pointName) {
      throw new Error("missing pointName in metadata");
    }

    this._connection.removePoint(point);

    this._icon.data.pointName = this._connection.points[0].name;
  }

  public getFocusableObject(): fabric.Object {
    return this._icon;
  }
}
