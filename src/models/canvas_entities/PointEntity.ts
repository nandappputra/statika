import { fabric } from "fabric";
import { Point } from "../diagram_elements/Point";
import { EventMediator } from "../painters/EventMediator";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";
import { ElementType } from "../../utils/Constants";

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
    this._icon.setCoords();

    this._point.x = movePointEvent.coordinate.x;
    this._point.y = movePointEvent.coordinate.y;
  }

  public getObjectsToDraw() {
    return this._icon;
  }

  get name() {
    return this._name;
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
        pointName: point.name,
        type: ElementType.POINT,
      },
    });
  }
}
