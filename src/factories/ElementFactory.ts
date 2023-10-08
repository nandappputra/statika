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
  private _idCounter = 1;

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
    const id = this._idCounter;
    this._idCounter++;

    return new Point(name, id, coordinate.x, coordinate.y);
  }

  public buildLinkage(point1: Point, point2: Point) {
    const name = `${EntityPrefix.LINKAGE}${this._linkageCounter}`;
    this._linkageCounter++;
    const id = this._idCounter;
    this._idCounter++;

    return new LinkageElement(name, id, point1, point2);
  }

  public buildConnection(
    points: Point[],
    connectionType: ConnectionKind
  ): ConnectionElement {
    const name = `${EntityPrefix.CONNECTION}${this._connectionCounter}`;
    this._connectionCounter++;
    const id = this._idCounter;
    this._idCounter++;

    return new ConnectionElement(name, id, points, connectionType);
  }

  public buildExternalForce(F_x: number, F_y: number) {
    const name = `${EntityPrefix.FORCE}${this._externalForceCounter}`;
    this._externalForceCounter++;
    const id = this._idCounter;
    this._idCounter++;

    return new ExternalForce(name, id, F_x, F_y);
  }

  public reset() {
    this._linkageCounter = 1;
    this._connectionCounter = 1;
    this._externalForceCounter = 1;
    this._pointCounter = 1;
    this._idCounter = 1;
  }

  public getState() {
    return {
      linkageCounter: this._linkageCounter,
      connectionCounter: this._connectionCounter,
      externalForceCounter: this._externalForceCounter,
      pointCounter: this._pointCounter,
      idCounter: this._idCounter,
    };
  }

  private _set(
    linkageCounter: number,
    connectionCounter: number,
    externalForceCounter: number,
    pointCounter: number,
    idCounter: number
  ) {
    this._linkageCounter = linkageCounter;
    this._connectionCounter = connectionCounter;
    this._externalForceCounter = externalForceCounter;
    this._pointCounter = pointCounter;
    this._idCounter = idCounter;
  }

  public loadStateFromJson(obj: object) {
    if (
      !("_linkageCounter" in obj && typeof obj._linkageCounter === "number") ||
      !(
        "_connectionCounter" in obj &&
        typeof obj._connectionCounter === "number"
      ) ||
      !(
        "_externalForceCounter" in obj &&
        typeof obj._externalForceCounter === "number"
      ) ||
      !("_pointCounter" in obj && typeof obj._pointCounter === "number") ||
      !("_idCounter" in obj && typeof obj._idCounter === "number")
    ) {
      throw new Error("invalid JSON for ElementFactory");
    }

    this._set(
      obj._linkageCounter,
      obj._connectionCounter,
      obj._externalForceCounter,
      obj._pointCounter,
      obj._idCounter
    );
  }
}
