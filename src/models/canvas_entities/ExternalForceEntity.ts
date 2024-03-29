import { fabric } from "fabric";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { EventMediator } from "../painters/EventMediator";
import {
  EntityKind,
  EntityPrefix,
  RADIAN_TO_DEGREE_MULTIPLIER,
} from "../../utils/Constants";
import { Point } from "../diagram_elements/Point";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";

const ARROW_ANGLE_ADJUSTMENT = 90;

export class ExternalForceEntity implements CanvasEntity {
  private _kind = EntityKind.FORCE;

  private _externalForce: ExternalForce;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;
  private _location: Point | ConnectionElement;
  private _canvas: fabric.Canvas;
  private _lastIndex = 0;

  constructor(
    externalForce: ExternalForce,
    location: Point | ConnectionElement,
    eventMediator: EventMediator,
    canvas: fabric.Canvas,
    isSelectable = true,
    color = "black"
  ) {
    this._externalForce = externalForce;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(externalForce, location, isSelectable, color);
    this._location = location;
    this._canvas = canvas;
  }

  moveToFront(): void {
    this._lastIndex = this._canvas.getObjects().indexOf(this._icon);
    this._icon.bringToFront();
  }

  returnToOriginalPosition(): void {
    this._icon.moveTo(this._lastIndex);
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
    return this._externalForce.name;
  }

  get id() {
    return this._externalForce.id;
  }

  get kind() {
    return this._kind;
  }

  private _buildIcon(
    force: ExternalForce,
    location: Point | ConnectionElement,
    isSelectable: boolean,
    color: string
  ) {
    const line = new fabric.Line([0, 0, 0, 50], {
      originY: "center",
      originX: "center",
      stroke: color,
      strokeWidth: 3,
      fill: color,
    });
    const cap = new fabric.Triangle({
      width: 15,
      height: 15,
      originY: "bottom",
      originX: "center",
      stroke: color,
      top: 50,
      angle: 180,
      fill: color,
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
      hoverCursor: "pointer",
      selectable: isSelectable,
      data: { name: force.name, type: EntityPrefix.FORCE, id: force.id },
    });

    return arrow;
  }

  public getElement() {
    return this._externalForce;
  }

  get location() {
    return this._location;
  }

  set location(location: Point | ConnectionElement) {
    this._location = location;
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
