import { fabric } from "fabric";
import { Point } from "../diagram_elements/Point";
import { EventMediator } from "../painters/EventMediator";
import { CanvasEntity } from "./CanvasEntity";
import { MovePointEvent } from "../Event";
import { EntityKind, EntityPrefix, USER_ID } from "../../utils/Constants";
import { ExternalForceEntity } from "./ExternalForceEntity";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { Moment } from "../diagram_elements/Moment";
import { MomentEntity } from "./MomentEntity";

export class PointEntity implements CanvasEntity {
  private _kind = EntityKind.POINT;

  private _point: Point;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;
  private _canvas: fabric.Canvas;
  private _lastIndex = 0;
  private _lastVisibility: boolean | undefined = true;

  private _internalReactions: fabric.Object[] = [];

  constructor(
    point: Point,
    eventMediator: EventMediator,
    canvas: fabric.Canvas
  ) {
    this._point = point;
    this._eventMediator = eventMediator;
    this._icon = this._buildIcon(point);
    this._canvas = canvas;
  }

  moveToFront(): void {
    this._lastIndex = this._canvas.getObjects().indexOf(this._icon);
    this._lastVisibility = this._icon.visible;
    this.setVisible(true);
    this._icon.bringToFront();
  }

  returnToOriginalPosition(): void {
    this._icon.moveTo(this._lastIndex);
    this._icon.visible = this._lastVisibility;
  }

  buildInternalReactions() {
    const F_x = this._point.F_x;
    const F_y = this._point.F_y;
    const M_z = this._point.M_z;

    this.buildInternalForces(F_x, F_y);
    this.buildInternalMoment(M_z);
  }

  buildInvertedInternalReactions() {
    const F_x = -this._point.F_x;
    const F_y = -this._point.F_y;
    const M_z = -this._point.M_z;

    this.buildInternalForces(F_x, F_y);
    this.buildInternalMoment(M_z);
  }

  private buildInternalForces(F_x: number, F_y: number) {
    if (F_x === 0 && F_y === 0) {
      return;
    }

    const force = new ExternalForce("internal", USER_ID, F_x, F_y);
    const reactionForce = new ExternalForceEntity(
      force,
      this._point,
      this._eventMediator,
      this._canvas,
      false,
      "green"
    );
    this._canvas.add(reactionForce.getObjectsToDraw());
    this._internalReactions.push(reactionForce.getObjectsToDraw());
  }

  private buildInternalMoment(M_z: number) {
    if (M_z === 0) {
      return;
    }

    const moment = new Moment("internal", USER_ID, M_z);
    const reactionMoment = new MomentEntity(
      moment,
      this._point,
      this._eventMediator,
      this._canvas,
      false,
      "blue"
    );

    this._canvas.add(reactionMoment.getObjectsToDraw());
    this._internalReactions.push(reactionMoment.getObjectsToDraw());
  }

  removeInternalReactions() {
    this._canvas.remove(...this._internalReactions);
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
