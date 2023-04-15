import { fabric } from "fabric";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { Coordinate } from "../Coordinate";

export class ConfigurablePoint implements CanvasEntity {
  private _name: string;
  private _icon: fabric.Object;
  private _position: Coordinate;

  constructor(name: string, position: Coordinate) {
    this._name = name;
    this._position = position;

    this._icon = this.buildIcon();
  }

  private buildIcon() {
    return new fabric.Circle({
      radius: 4,
      originX: "center",
      originY: "center",
      left: this._position.x,
      top: this._position.y,
      selectable: false,
      hoverCursor: "default",
    });
  }

  updatePosition(movePointEvent: MovePointEvent): void {
    this._icon.top = movePointEvent.coordinate.y;
    this._icon.left = movePointEvent.coordinate.x;
    this._icon.setCoords();
  }

  getObjectsToDraw() {
    return [this._icon];
  }

  get name() {
    return this._name;
  }
}
