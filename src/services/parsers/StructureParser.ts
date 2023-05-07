import { Point } from "../../models/Point";
import { ConnectionElement } from "../../models/diagram_elements/ConnectionElement";
import { PinJointConnection } from "../../models/diagram_elements/connections/PinJointConnection";
import { FixedConnection } from "../../models/diagram_elements/connections/FixedConnection";
import { HorizontalRollerConnection } from "../../models/diagram_elements/connections/HorizontalRollerConnection";
import { FreeConnection } from "../../models/diagram_elements/connections/FreeConnection";
import { ExternalForce } from "../../models/diagram_elements/ExternalForce";
import { LinkageElement } from "../../models/diagram_elements/LinkageElement";
import { Structure } from "../../models/Structure";
import { ConnectionKind } from "../../utils/Constants";

interface PointJson {
  name: string;
  x: number;
  y: number;
}

interface ConnectionJson {
  type: ConnectionKind;
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
  const connections: ConnectionElement[] = buildConnections(
    points,
    structureJson.connections
  );
  const forces: ExternalForce[] = buildForces(structureJson.forces);
  const linkages: LinkageElement[] = buildLinkages(
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
): ConnectionElement[] {
  const connections: ConnectionElement[] = [];
  connectionJsons.forEach((connectionJson) => {
    const pointsToConnect = points.filter((point) =>
      connectionJson.points.includes(point.name)
    );

    switch (connectionJson.type) {
      case ConnectionKind.PIN_JOINT:
        connections.push(new PinJointConnection(pointsToConnect));
        break;
      case ConnectionKind.FIXED:
        connections.push(new FixedConnection(pointsToConnect));
        break;
      case ConnectionKind.HORIZONTAL_ROLLER:
        connections.push(new HorizontalRollerConnection(pointsToConnect));
        break;
      case ConnectionKind.FREE:
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
): LinkageElement[] {
  const linkages: LinkageElement[] = [];
  linkageJsons.forEach((linkageJson) => {
    const appliedForces = forces.filter((force) =>
      linkageJson.forces.includes(force.name)
    );

    const connectedPoints = points.filter((point) =>
      linkageJson.points.includes(point.name)
    );

    const newLinkage = new LinkageElement(
      linkageJson.name,
      connectedPoints[0],
      connectedPoints[1]
    );
    appliedForces.forEach((force) => newLinkage.addExternalForce(force));

    linkages.push(newLinkage);
  });

  return linkages;
}
