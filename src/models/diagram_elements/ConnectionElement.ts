import { ConnectionType } from "../../utils/Constants";
import { formatForceForSolver } from "../../utils/SolverUtils";
import { ExternalForce } from "../ExternalForce";
import { Point } from "../Point";
import { DiagramElement } from "./DiagramElement";
import { Connection } from "./connections/Connection";
import { FixedConnection } from "./connections/FixedConnection";
import { FreeConnection } from "./connections/FreeConnection";
import { HorizontalRollerConnection } from "./connections/HorizontalRollerConnection";
import { PinConnection } from "./connections/PinConnection";

export class ConnectionElement implements DiagramElement {
  private _name: string;
  private _points: Point[];
  private _connection: Connection;
  private _externalForces: ExternalForce[];
  private _type: ConnectionType;

  constructor(name: string, points: Point[], connectionType: ConnectionType) {
    this._name = name;
    this._points = points;
    this._type = connectionType;
    this._connection = this.retrieveConnectionInstance(connectionType);
    this._points.forEach((point) =>
      this._connection.applyBoundaryCondition(point)
    );
    this._externalForces = [];
  }

  private retrieveConnectionInstance(
    connectionType: ConnectionType
  ): Connection {
    switch (connectionType) {
      case ConnectionType.PIN:
        return PinConnection.getInstance();
      case ConnectionType.FIXED:
        return FixedConnection.getInstance();
      case ConnectionType.FREE:
        return FreeConnection.getInstance();
      case ConnectionType.HORIZONTAL_ROLLER:
        return HorizontalRollerConnection.getInstance();
    }
  }

  get points() {
    return this._points;
  }

  get name() {
    return this._name;
  }

  addExternalForce(externalForce: ExternalForce) {
    this._externalForces.push(externalForce);
  }

  generateEquilibrium(): string[] {
    if (this._points.length == 1) {
      return [];
    }
    
    const sigmaF_x: string[] = [];
    const sigmaF_y: string[] = [];

    this._points.forEach((point) => {
      sigmaF_x.push(formatForceForSolver(point.symbolF_x));
      sigmaF_y.push(formatForceForSolver(point.symbolF_y));
    });

    this._externalForces.forEach((force) => {
      sigmaF_x.push(formatForceForSolver(force.symbolF_x));
      sigmaF_y.push(formatForceForSolver(force.symbolF_y));
    });

    return [sigmaF_x.join("+"), sigmaF_y.join("+")];
  }

  public addPoint(point: Point) {
    this._connection.applyBoundaryCondition(point);
    this.points.push(point);
  }

  public removePoint(deletedPoint: Point) {
    deletedPoint.removeConditions();
    this._points = this.points.filter(
      (point) => point.name !== deletedPoint.name
    );
  }

  public changeConnectionType(connectionType: ConnectionType) {
    this._points.forEach((point) => point.removeConditions());
    this._connection = this.retrieveConnectionInstance(connectionType);
    this._points.forEach((point) =>
      this._connection.applyBoundaryCondition(point)
    );
    this._type = connectionType;
  }

  get type() {
    return this._type;
  }
}
