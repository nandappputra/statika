import { fabric } from "fabric";
import { EventMediator } from "../painters/EventMediator";
import { EntityKind, EntityPrefix } from "../../utils/Constants";
import { Point } from "../diagram_elements/Point";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { Moment } from "../diagram_elements/Moment";

export class MomentEntity implements CanvasEntity {
  private _kind = EntityKind.MOMENT;

  private _moment: Moment;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;
  private _location: Point | ConnectionElement;
  private _canvas: fabric.Canvas;
  private _lastIndex = 0;

  constructor(
    moment: Moment,
    location: Point | ConnectionElement,
    eventMediator: EventMediator,
    canvas: fabric.Canvas,
    isSelectable = true,
    color = "black"
  ) {
    this._moment = moment;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(moment, location, isSelectable, color);
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
    return this._moment.name;
  }

  get id() {
    return this._moment.id;
  }

  get kind() {
    return this._kind;
  }

  private _buildIcon(
    moment: Moment,
    location: Point | ConnectionElement,
    isSelectable: boolean,
    color: string
  ) {
    const circle = new fabric.Circle({
      radius: 20,
      originY: "center",
      originX: "center",
      stroke: color,
      strokeWidth: 3,
      fill: "transparent",
      startAngle: 0,
      endAngle: 270,
    });
    const cap = new fabric.Triangle({
      width: 15,
      height: 15,
      originY: "bottom",
      originX: "center",
      stroke: color,
      angle: 90,
      fill: color,
      left: 0,
      top: -20,
    });

    const arrow = new fabric.Group([circle, cap], {
      originX: "center",
      originY: "center",
      left: location.x,
      top: location.y,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      hasBorders: false,
      hoverCursor: "pointer",
      selectable: isSelectable,
      data: { name: moment.name, type: EntityPrefix.MOMENT, id: moment.id },
    });

    if (moment.M_z >= 0) {
      arrow.flipY = false;
    } else {
      arrow.flipY = true;
    }

    return arrow;
  }

  public getElement() {
    return this._moment;
  }

  get location() {
    return this._location;
  }

  set location(location: Point | ConnectionElement) {
    this._location = location;
  }

  public setAmount(M_z: number) {
    this._moment.M_z = M_z;

    this._rotateIcon(M_z);
  }

  private _rotateIcon(M_z: number) {
    if (M_z >= 0) {
      this._icon.flipY = true;
    } else {
      this._icon.flipY = false;
    }
    this._icon.setCoords();
    this._icon.dirty = true;
  }
}
