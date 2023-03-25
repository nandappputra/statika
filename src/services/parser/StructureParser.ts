import { Point } from "../../models/Point";
import { Connection } from "../../models/connections/Connection";
import { PinConnection } from "../../models/connections/PinConnection";
import { FixedConnection } from "../../models/connections/FixedConnection";
import { HorizontalRollerConnection } from "../../models/connections/HorizontalRollerConnection";
import { FreeConnection } from "../../models/connections/FreeConnection";
import { ExternalForce } from "../../models/ExternalForce";
import { Linkage } from "../../models/Linkage";
import { Structure } from "../../models/Structure";

export enum ConnectionType {
  PIN = "PIN",
  FIXED = "FIXED",
  FREE = "FREE",
  HORIZONTAL_ROLLER = "HORIZONTAL_ROLLER",
}

interface PointJson {
  name: string;
  x: number;
  y: number;
}

interface ConnectionJson {
  type: ConnectionType;
  points: string[];
}

interface ForceJson {
  name: string;
  x: number;
  y: number;
  magnitudeX: number;
  magnitudeY: number;
}

interface LinkageJson {
  name: string;
  forces: string[];
  points: string[];
}

export interface StructureJson {
  points: PointJson[];
  connections: ConnectionJson[];
  forces: ForceJson[];
  linkages: LinkageJson[];
}

export function buildStructure(structureJson: StructureJson) {
  const points: Point[] = buildPoints(structureJson.points);
  const connections: Connection[] = buildConnections(
    points,
    structureJson.connections
  );
  const forces: ExternalForce[] = buildForces(structureJson.forces);
  const linkages: Linkage[] = buildLinkages(
    points,
    forces,
    structureJson.linkages
  );

  return new Structure(linkages, connections);
}

function buildPoints(pointJsons: PointJson[]): Point[] {
  return pointJsons.map((point) => new Point(point.name, point.x, point.y));
}

function buildConnections(
  points: Point[],
  connectionJsons: ConnectionJson[]
): Connection[] {
  const connections: Connection[] = [];
  connectionJsons.forEach((connectionJson) => {
    const pointsToConnect = points.filter((point) =>
      connectionJson.points.includes(point.name)
    );

    switch (connectionJson.type) {
      case ConnectionType.PIN:
        connections.push(new PinConnection(pointsToConnect));
        break;
      case ConnectionType.FIXED:
        connections.push(new FixedConnection(pointsToConnect));
        break;
      case ConnectionType.HORIZONTAL_ROLLER:
        connections.push(new HorizontalRollerConnection(pointsToConnect));
        break;
      case ConnectionType.FREE:
        connections.push(new FreeConnection(pointsToConnect));
        break;
    }
  });

  return connections;
}

function buildForces(forceJsons: ForceJson[]): ExternalForce[] {
  return forceJsons.map(
    (force) =>
      new ExternalForce(
        force.name,
        force.x,
        force.y,
        force.magnitudeX,
        force.magnitudeY
      )
  );
}

function buildLinkages(
  points: Point[],
  forces: ExternalForce[],
  linkageJsons: LinkageJson[]
): Linkage[] {
  const linkages: Linkage[] = [];
  linkageJsons.forEach((linkageJson) => {
    const appliedForces = forces.filter((force) =>
      linkageJson.forces.includes(force.name)
    );

    const connectedPoints = points.filter((point) =>
      linkageJson.points.includes(point.name)
    );

    const newLinkage = new Linkage(
      linkageJson.name,
      connectedPoints[0],
      connectedPoints[1]
    );
    appliedForces.forEach((force) => newLinkage.addExternalForce(force));

    linkages.push(newLinkage);
  });

  return linkages;
}
