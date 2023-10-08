import { fabric } from "fabric";
import { Point } from "../diagram_elements/Point";
import { EventMediator } from "../painters/EventMediator";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";
import { EntityKind, EntityPrefix } from "../../utils/Constants";

export class PointEntity implements CanvasEntity {
  private _kind = EntityKind.POINT;

  private _point: Point;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(point: Point, eventMediator: EventMediator) {
    this._point = point;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(point);
  }

  public updatePosition(movePointEvent: MovePointEvent): void {
    this._icon.left = movePointEvent.coordinate.x;
    this._icon.top = movePointEvent.coordinate.y;
    this._icon.setCoords();

    this._point.x = movePointEvent.coordinate.x;
    this._point.y = movePointEvent.coordinate.y;
  }

  public getObjectsToDraw() {
    return this._icon;
  }

  get name() {
    return this._point.name;
  }

  get id() {
    return this._point.id;
  }

  get kind() {
    return this._kind;
  }

  public getElement() {
    return this._point;
  }

  public setVisible(isVisible: boolean) {
    this._icon.visible = isVisible;
  }

  private _buildIcon(point: Point) {
    return new fabric.Circle({
      radius: 4,
      originX: "center",
      originY: "center",
      left: point.x,
      top: point.y,
      hasControls: false,
      data: {
        name: point.name,
        id: point.id,
        type: EntityPrefix.POINT,
      },
    });
  }
}
