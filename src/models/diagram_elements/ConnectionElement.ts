import { ConnectionKind, USER_ID } from "../../utils/Constants";
import {
  formatForceForSolver,
  formatMomentForSolver,
} from "../../utils/SolverUtils";
import { ExternalForce } from "./ExternalForce";
import { Point } from "./Point";
import { DiagramElement } from "./DiagramElement";
import { Connection } from "./connections/Connection";
import { FixedConnection } from "./connections/FixedConnection";
import { HorizontalRollerConnection } from "./connections/HorizontalRollerConnection";
import { PinConnection } from "./connections/PinConnection";
import { PinJointConnection } from "./connections/PinJointConnection";
import { VerticalRoller } from "./connections/VerticalRollerConnection";

export class ConnectionElement implements DiagramElement {
  private _name: string;
  private _id: number;
  private _points: Point[];
  private _connection: Connection;
  private _externalForces: ExternalForce[];
  private _boundaryCondition: Point | undefined;

  constructor(
    name: string,
    id: number,
    points: Point[],
    connectionType: ConnectionKind
  ) {
    this._name = name;
    this._id = id;
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

  get id() {
    return this._id;
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

  loadSolution(solutionMap: Map<string, number>) {
    this._boundaryCondition = new Point(
      "boundary_conditon",
      USER_ID,
      this.x,
      this.y
    );
    this._boundaryCondition.F_x =
      solutionMap.get(`F_${this.name}x_ground`) || 0;
    this._boundaryCondition.F_y =
      solutionMap.get(`F_${this.name}y_ground`) || 0;
    this._boundaryCondition.M_z =
      solutionMap.get(`M_${this.name}z_ground`) || 0;
  }

  clearSolution() {
    this._boundaryCondition = undefined;
  }

  get boundaryCondition() {
    return this._boundaryCondition;
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

  static fromJson(obj: object, pointMap: Map<number, Point>) {
    if (
      !("_name" in obj && typeof obj._name === "string") ||
      !("_id" in obj && typeof obj._id === "number") ||
      !("_points" in obj && Array.isArray(obj._points)) ||
      !(
        "_connection" in obj &&
        obj._connection &&
        typeof obj._connection === "object" &&
        "_kind" in obj._connection &&
        typeof obj._connection._kind === "string" &&
        Object.values<string>(ConnectionKind).includes(obj._connection._kind)
      )
    ) {
      throw new Error("Invalid JSON for Connection");
    }

    const points: Point[] = [];

    obj._points.forEach((point: object) => {
      points.push(Point.fromJson(point, pointMap));
    });

    const connection = new ConnectionElement(
      obj._name,
      obj._id,
      points,
      obj._connection._kind as ConnectionKind
    );

    if ("_externalForces" in obj && Array.isArray(obj._externalForces)) {
      obj._externalForces.forEach((force: object) => {
        connection.addExternalForce(ExternalForce.fromJson(force));
      });
    }

    return connection;
  }
}
