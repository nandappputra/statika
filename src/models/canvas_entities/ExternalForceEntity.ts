import { fabric } from "fabric";
import { ExternalForce } from "../ExternalForce";
import { EventMediator } from "../painters/EventMediator";
import {
  ElementType,
  RADIAN_TO_DEGREE_MULTIPLIER,
} from "../../utils/Constants";
import { Point } from "../Point";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";

const ARROW_ANGLE_ADJUSTMENT = 90;

export class ExternalForceEntity implements CanvasEntity {
  private _name: string;
  private _externalForce: ExternalForce;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(
    externalForce: ExternalForce,
    point: Point,
    eventMediator: EventMediator
  ) {
    this._name = externalForce.name;
    this._externalForce = externalForce;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(externalForce, point);
  }

  public updatePosition(movePointEvent: MovePointEvent): void {
    this._icon.left = movePointEvent.coordinate.x;
    this._icon.top = movePointEvent.coordinate.y;

    this._icon.setCoords();
  }

  public getObjectsToDraw(): (fabric.Object | fabric.Group)[] {
    return [this._icon];
  }

  public getFocusableObject(): fabric.Object {
    return this._icon;
  }

  get name() {
    return this._name;
  }

  private _buildIcon(force: ExternalForce, point: Point) {
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
      angle:
        Math.atan2(parseFloat(force.symbolF_y), parseFloat(force.symbolF_x)) *
          RADIAN_TO_DEGREE_MULTIPLIER -
        ARROW_ANGLE_ADJUSTMENT,
      left: point.x,
      top: point.y,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      data: { name: force.name, type: ElementType.FORCE },
    });

    return arrow;
  }
}