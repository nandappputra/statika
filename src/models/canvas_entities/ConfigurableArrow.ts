import { fabric } from "fabric";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { Coordinate } from "../Coordinate";

export class ConfigurableArrow implements CanvasEntity {
  private _name: string;
  private _icon: fabric.Group;
  private _position: Coordinate;

  constructor(name: string, position: Coordinate, F_x: number, F_y: number) {
    this._name = name;
    this._position = position;

    this._icon = this.buildArrow(F_x, F_y);
  }

  private buildArrow(F_x: number, F_y: number): fabric.Group {
    const line = new fabric.Line([0, 0, 0, 50], {
      originY: "center",
      originX: "center",
      stroke: "black",
      strokeWidth: 3,
    });
    const cap = new fabric.Triangle({
      width: 15,
      height: 15,
      originY: "bottom",
      originX: "center",
      top: 50,
      angle: 180,
    });

    const arrow = new fabric.Group([line, cap], {
      originX: "center",
      originY: "bottom",
      angle: (Math.atan2(F_y, F_x) * 180) / 3.14 - 90,
      left: this._position.x,
      top: this._position.y,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
    });

    return arrow;
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
