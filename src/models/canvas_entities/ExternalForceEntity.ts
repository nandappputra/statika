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
import { ConnectionElement } from "../diagram_elements/ConnectionElement";

const ARROW_ANGLE_ADJUSTMENT = 90;

export class ExternalForceEntity implements CanvasEntity {
  private _name: string;
  private _externalForce: ExternalForce;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;
  private _location: Point | ConnectionElement;

  constructor(
    externalForce: ExternalForce,
    location: Point | ConnectionElement,
    eventMediator: EventMediator
  ) {
    this._name = externalForce.name;
    this._externalForce = externalForce;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(externalForce, location);
    this._location = location;
  }

  public updatePosition(movePointEvent: MovePointEvent): void {
    this._icon.left = movePointEvent.coordinate.x;
    this._icon.top = movePointEvent.coordinate.y;

    this._icon.setCoords();
  }

  public getObjectsToDraw() {
    return this._icon;
  }

  get name() {
    return this._name;
  }

  private _buildIcon(
    force: ExternalForce,
    location: Point | ConnectionElement
  ) {
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
      left: location.x,
      top: location.y,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      hasBorders: false,
      data: { name: force.name, type: ElementType.FORCE },
    });

    return arrow;
  }

  public getElement() {
    return this._externalForce;
  }

  get location() {
    return this._location;
  }

  public setForceComponents(F_x: number, F_y: number) {
    this._externalForce.F_x = F_x;
    this._externalForce.F_y = F_y;

    this._rotateIcon(F_x, F_y);
  }

  private _rotateIcon(F_x: number, F_y: number) {
    this._icon.set(
      "angle",
      Math.atan2(F_y, F_x) * RADIAN_TO_DEGREE_MULTIPLIER -
        ARROW_ANGLE_ADJUSTMENT
    );
    this._icon.setCoords();
    this._icon.dirty = true;
  }
}
