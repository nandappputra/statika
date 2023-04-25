import { Coordinate } from "../models/Coordinate";
import { ExternalForce } from "../models/ExternalForce";
import { Point } from "../models/Point";
import { LinkageElement } from "../models/diagram_elements/LinkageElement";
import { Connection } from "../models/diagram_elements/connections/Connection";
import { FixedConnection } from "../models/diagram_elements/connections/FixedConnection";
import { FreeConnection } from "../models/diagram_elements/connections/FreeConnection";
import { HorizontalRollerConnection } from "../models/diagram_elements/connections/HorizontalRollerConnection";
import { PinConnection } from "../models/diagram_elements/connections/PinConnection";
import { ConnectionType, ElementType } from "../utils/Constants";

export class ElementFactory {
  private _linkageCounter = 1;
  private _externalForceCounter = 1;
  private _connectionCounter = 1;
  private _pointCounter = 1;

  private static instance: ElementFactory;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ElementFactory();
    }

    return this.instance;
  }

  public buildPoint(coordinate: Coordinate) {
    const name = `${ElementType.POINT}${this._pointCounter}`;
    this._pointCounter++;

    return new Point(name, coordinate.x, coordinate.y);
  }

  public buildLinkage(point1: Point, point2: Point) {
    const name = `${ElementType.LINKAGE}${this._linkageCounter}`;
    this._linkageCounter++;

    return new LinkageElement(name, point1, point2);
  }

  public buildConnection(
    points: Point[],
    connectionType: ConnectionType
  ): Connection {
    const name = `${ElementType.CONNECTION}${this._connectionCounter}`;
    this._connectionCounter++;
    switch (connectionType) {
      case ConnectionType.FIXED: {
        return new FixedConnection(name, points);
      }
      case ConnectionType.PIN: {
        return new PinConnection(name, points);
      }
      case ConnectionType.HORIZONTAL_ROLLER: {
        return new HorizontalRollerConnection(name, points);
      }
      default: {
        return new FreeConnection(name, points);
      }
    }
  }

  public buildExternalForce(F_x: number, F_y: number) {
    const name = `${ElementType.FORCE}${this._externalForceCounter}`;
    this._externalForceCounter++;

    return new ExternalForce(name, F_x, F_y);
  }
}
