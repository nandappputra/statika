import { fabric } from "fabric";
import { Connection } from "./connections/Connection";
import { MovePointEvent } from "./Event";

export class ConfigurableConnection {
  private _name: string;
  private _connection: Connection;
  private _updateCallback: (movePointEvent: MovePointEvent) => void;
  private _icon: fabric.Object;

  constructor(
    connection: Connection,
    updateCallback: (movePointEvent: MovePointEvent) => void
  ) {
    this._name = connection.name;
    this._connection = connection;
    this._updateCallback = updateCallback;
    this._icon = new fabric.Circle({
      radius: 5,
      originX: "center",
      originY: "center",
      left: connection.points[0].x,
      top: connection.points[0].y,
      data: { name: connection.name, pointName: connection.points[0].name },
    });
    this._icon.hasControls = false;
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    this._icon.set("left", movePointEvent.coordinate.x);
    this._icon.set("top", movePointEvent.coordinate.y);
    this.icon.setCoords();

    this.propagateEvent({ ...movePointEvent, source: this._connection.name });
  }

  private propagateEvent(movePointEvent: MovePointEvent) {
    this._connection.points.forEach((point) => {
      const moveEvent: MovePointEvent = { ...movePointEvent, name: point.name };
      this._updateCallback(moveEvent);
    });
  }

  get icon() {
    return this._icon;
  }

  get name() {
    return this._name;
  }
}
