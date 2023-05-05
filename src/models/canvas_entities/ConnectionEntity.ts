import { fabric } from "fabric";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ConnectionType, ElementType } from "../../utils/Constants";
import { ExternalForce } from "../ExternalForce";
import { IGroupOptions } from "fabric/fabric-impl";

export class ConnectionEntity implements CanvasEntity {
  private _name: string;
  private _connection: ConnectionElement;
  private _eventMediator: EventMediator;
  private _icon: fabric.Object;

  constructor(connection: ConnectionElement, eventMediator: EventMediator) {
    this._name = connection.name;
    this._connection = connection;
    this._eventMediator = eventMediator;
    this._icon = this.buildIcon(connection, connection.type);
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    this._icon.set("left", movePointEvent.coordinate.x);
    this._icon.set("top", movePointEvent.coordinate.y);
    this._icon.setCoords();

    this.propagateEvent({ ...movePointEvent, source: this._connection.name });
  }

  public getObjectsToDraw() {
    return this._icon;
  }

  private propagateEvent(movePointEvent: MovePointEvent) {
    this._connection.points.forEach((point) => {
      const moveEvent: MovePointEvent = { ...movePointEvent, name: point.name };
      this._eventMediator.updatePointPosition(moveEvent);
    });

    const moveEvent: MovePointEvent = { ...movePointEvent, name: this._name };
    this._eventMediator.updatePointPosition(moveEvent);
  }

  get name() {
    return this._name;
  }

  get x() {
    return this._connection.points[0].x;
  }

  get y() {
    return this._connection.points[0].y;
  }

  public getAllPoints() {
    return this._connection.points;
  }

  public addPoint(point: Point) {
    this._connection.addPoint(point);
  }

  public deletePoint(point: Point) {
    if (!this._icon.data?.pointName) {
      throw new Error("missing pointName in metadata");
    }

    this._icon.data.pointName = this._connection.points[0].name;

    this._connection.removePoint(point);
  }

  public addExternalForce(externalForce: ExternalForce) {
    this._connection.addExternalForce(externalForce);
  }

  public removeExternalForce(externalForce: ExternalForce) {
    this._connection.removeExternalForce(externalForce);
  }

  public getElement() {
    return this._connection;
  }

  public getConnectionType() {
    return this._connection.type;
  }

  public changeConnectionType(connectionType: ConnectionType) {
    this._connection.changeConnectionType(connectionType);
    this._icon = this.buildIcon(this._connection, connectionType);
  }

  private buildIcon(
    connection: ConnectionElement,
    connectionType: ConnectionType
  ) {
    switch (connectionType) {
      case ConnectionType.FIXED:
        return this.buildFixedIcon(connection);
      case ConnectionType.VERTICAL_ROLLER:
        return this.buildVerticalRollerIcon(connection);
      case ConnectionType.HORIZONTAL_ROLLER:
        return this.buildHorizontalRollerIcon(connection);
      case ConnectionType.PIN_JOINT:
        return this.buildPinJointIcon(connection);
      case ConnectionType.PIN:
        return this.buildPinIcon(connection);
    }
  }

  private buildFixedIcon(connection: ConnectionElement) {
    const reference = connection.points[0];

    const base = this.buildFixedBase(connection);

    const icon = new fabric.Group([base], {
      originX: "center",
      originY: "bottom",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });

    return icon;
  }

  private buildVerticalRollerIcon(connection: ConnectionElement) {
    const icon = this.buildHorizontalRollerIcon(connection);
    icon.rotate(90);

    return icon;
  }

  private buildHorizontalRollerIcon(connection: ConnectionElement) {
    const reference = connection.points[0];

    const box = new fabric.Rect({
      originY: "center",
      originX: "center",
      left: reference.x,
      top: reference.y,
      width: 30,
      height: 40,
      visible: false,
    });

    const base = this.buildFixedBase(connection, {
      top: reference.y - 25,
    });

    const ellipse = new fabric.Ellipse({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      originX: "center",
      originY: "center",
      width: 20,
      height: 20,
      left: reference.x,
      top: reference.y - 4,
      rx: 6.5,
      ry: 10,
    });

    const circle = new fabric.Circle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      radius: 5,
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
    });

    return new fabric.Group([box, ellipse, base, circle], {
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });
  }

  private buildPinJointIcon(connection: ConnectionElement) {
    return new fabric.Circle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      radius: 5,
      originX: "center",
      originY: "center",
      left: connection.points[0].x,
      top: connection.points[0].y,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
      hasControls: false,
    });
  }

  private buildPinIcon(connection: ConnectionElement) {
    const reference = connection.points[0];
    const box = new fabric.Rect({
      originY: "center",
      originX: "center",
      left: reference.x,
      top: reference.y,
      width: 30,
      height: 40,
      visible: false,
    });

    const base = this.buildFixedBase(connection, {
      top: reference.y - 25,
    });

    const triangle = new fabric.Triangle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      originX: "center",
      originY: "center",
      angle: 180,
      width: 20,
      height: 20,
      left: reference.x,
      top: reference.y - 5,
    });

    const circle = new fabric.Circle({
      fill: "white",
      stroke: "black",
      strokeWidth: 3,
      radius: 5,
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
    });

    return new fabric.Group([box, triangle, base, circle], {
      originX: "center",
      originY: "center",
      left: reference.x,
      top: reference.y,
      hasControls: false,
      data: {
        name: connection.name,
        pointName: connection.points[0].name,
        type: ElementType.CONNECTION,
      },
    });
  }

  private buildFixedBase(
    connection: ConnectionElement,
    options: IGroupOptions | undefined = undefined
  ) {
    const reference = connection.points[0];

    const box = new fabric.Rect({
      originY: "bottom",
      originX: "center",
      left: reference.x,
      top: reference.y,
      width: 30,
      height: 6,
      fill: "white",
    });
    const baseLine = new fabric.Line(
      [reference.x - 15, reference.y, reference.x + 15, reference.y],
      {
        originX: "center",
        stroke: "black",
        strokeWidth: 3,
        strokeLineCap: "round",
      }
    );

    const line1 = new fabric.Line(
      [reference.x - 13, reference.y, reference.x - 8, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
        strokeLineCap: "round",
      }
    );
    const line2 = new fabric.Line(
      [reference.x - 2, reference.y, reference.x + 3, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
        strokeLineCap: "round",
      }
    );
    const line3 = new fabric.Line(
      [reference.x + 8, reference.y, reference.x + 13, reference.y - 10],
      {
        stroke: "black",
        strokeWidth: 3,
        strokeLineCap: "round",
      }
    );

    return new fabric.Group([box, baseLine, line1, line2, line3], options);
  }
}
