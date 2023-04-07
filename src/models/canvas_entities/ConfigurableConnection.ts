import { fabric } from "fabric";
import { Connection } from "../diagram_elements/connections/Connection";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";

export class ConfigurableConnection implements CanvasEntity {
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
    this._icon.setCoords();

    this.propagateEvent({ ...movePointEvent, source: this._connection.name });
  }

  public getObjectsToDraw() {
    return [this._icon];
  }

  private propagateEvent(movePointEvent: MovePointEvent) {
    this._connection.points.forEach((point) => {
      const moveEvent: MovePointEvent = { ...movePointEvent, name: point.name };
      this._updateCallback(moveEvent);
    });
  }

  get name() {
    return this._name;
  }
}
