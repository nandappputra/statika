import { fabric } from "fabric";
import { Point } from "../Point";
import { EventMediator } from "../painters/EventMediator";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";

export class PointEntity implements CanvasEntity {
  private _name: string;
  private _point: Point;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(point: Point, eventMediator: EventMediator) {
    this._name = point.name;
    this._point = point;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(point);
  }

  public updatePosition(movePointEvent: MovePointEvent): void {
    this._icon.left = movePointEvent.coordinate.x;
    this._icon.top = movePointEvent.coordinate.y;
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

  private _buildIcon(point: Point) {
    return new fabric.Circle({
      radius: 4,
      originX: "center",
      originY: "center",
      left: point.x,
      top: point.y,
      selectable: false,
      hoverCursor: "default",
    });
  }
}
