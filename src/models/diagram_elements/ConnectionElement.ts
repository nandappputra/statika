import { ConnectionKind } from "../../utils/Constants";
import {
  formatForceForSolver,
  formatMomentForSolver,
} from "../../utils/SolverUtils";
import { ExternalForce } from "../ExternalForce";
import { Point } from "../Point";
import { DiagramElement } from "./DiagramElement";
import { Connection } from "./connections/Connection";
import { FixedConnection } from "./connections/FixedConnection";
import { HorizontalRollerConnection } from "./connections/HorizontalRollerConnection";
import { PinConnection } from "./connections/PinConnection";
import { PinJointConnection } from "./connections/PinJointConnection";
import { VerticalRoller } from "./connections/VerticalRollerConnection";

export class ConnectionElement implements DiagramElement {
  private _name: string;
  private _points: Point[];
  private _connection: Connection;
  private _externalForces: ExternalForce[];

  constructor(name: string, points: Point[], connectionType: ConnectionKind) {
    this._name = name;
    this._points = points;
    this._connection = this.retrieveConnectionInstance(connectionType);
    this._externalForces = [];
    this._points.forEach((point) => this._moveForce(point));
    this._points.forEach((point) => {
      this._connection.applyBoundaryCondition(point);
    });
  }

  private _moveForce(point: Point) {
    const forces = [...point.externalForces];

    forces.forEach((force) => {
      point.removeExternalForce(force);
      this._externalForces.push(force);
    });
  }

  private retrieveConnectionInstance(
    connectionType: ConnectionKind
  ): Connection {
    switch (connectionType) {
      case ConnectionKind.PIN_JOINT:
        return PinJointConnection.getInstance();
      case ConnectionKind.FIXED:
        return FixedConnection.getInstance();
      case ConnectionKind.VERTICAL_ROLLER:
        return VerticalRoller.getInstance();
      case ConnectionKind.HORIZONTAL_ROLLER:
        return HorizontalRollerConnection.getInstance();
      case ConnectionKind.PIN:
        return PinConnection.getInstance();
    }
  }

  get points() {
    return this._points;
  }

  get name() {
    return this._name;
  }

  get externalForces() {
    return this._externalForces;
  }

  get x() {
    return this._points[0].x;
  }

  get y() {
    return this._points[0].y;
  }

  addExternalForce(externalForce: ExternalForce) {
    this._externalForces.push(externalForce);
  }

  removeExternalForce(externalForce: ExternalForce) {
    this._externalForces = this._externalForces.filter(
      (force) => force.name !== externalForce.name
    );
  }

  generateEquilibrium(): string[] {
    const sigmaF_x: string[] = [];
    const sigmaF_y: string[] = [];
    const sigmaM_z: string[] = [];

    this._points.forEach((point) => {
      sigmaF_x.push(formatForceForSolver(point.symbolF_x, true));
      sigmaF_y.push(formatForceForSolver(point.symbolF_y, true));
      sigmaM_z.push(formatMomentForSolver(1, point.symbolM_z, true));
    });

    this._externalForces.forEach((force) => {
      sigmaF_x.push(formatForceForSolver(force.symbolF_x));
      sigmaF_y.push(formatForceForSolver(force.symbolF_y));
    });

    sigmaF_x.push(this._connection.getF_x(this._name));
    sigmaF_y.push(this._connection.getF_y(this._name));
    sigmaM_z.push(this._connection.getM_z(this._name));

    return [sigmaF_x.join("+"), sigmaF_y.join("+"), sigmaM_z.join("+")];
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

  public changeConnectionType(connectionType: ConnectionKind) {
    this._points.forEach((point) => point.removeConditions());
    this._connection = this.retrieveConnectionInstance(connectionType);
    this._points.forEach((point) =>
      this._connection.applyBoundaryCondition(point)
    );
  }

  get kind() {
    return this._connection.kind;
  }
}
