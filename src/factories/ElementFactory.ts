import { Coordinate } from "../models/Coordinate";
import { ExternalForce } from "../models/diagram_elements/ExternalForce";
import { Point } from "../models/diagram_elements/Point";
import { LinkageElement } from "../models/diagram_elements/LinkageElement";
import { ConnectionElement } from "../models/diagram_elements/ConnectionElement";
import { ConnectionKind, EntityPrefix } from "../utils/Constants";

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
    const name = `${EntityPrefix.POINT}${this._pointCounter}`;
    this._pointCounter++;

    return new Point(name, coordinate.x, coordinate.y);
  }

  public buildLinkage(point1: Point, point2: Point) {
    const name = `${EntityPrefix.LINKAGE}${this._linkageCounter}`;
    this._linkageCounter++;

    return new LinkageElement(name, point1, point2);
  }

  public buildConnection(
    points: Point[],
    connectionType: ConnectionKind
  ): ConnectionElement {
    const name = `${EntityPrefix.CONNECTION}${this._connectionCounter}`;
    this._connectionCounter++;
    return new ConnectionElement(name, points, connectionType);
  }

  public buildExternalForce(F_x: number, F_y: number) {
    const name = `${EntityPrefix.FORCE}${this._externalForceCounter}`;
    this._externalForceCounter++;

    return new ExternalForce(name, F_x, F_y);
  }

  public reset() {
    this._linkageCounter = 1;
    this._connectionCounter = 1;
    this._externalForceCounter = 1;
    this._pointCounter = 1;
  }
}
