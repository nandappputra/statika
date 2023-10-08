import { ConnectionElement } from "./diagram_elements/ConnectionElement";
import { LinkageElement } from "./diagram_elements/LinkageElement";
import { Point } from "./diagram_elements/Point";

export class Structure {
  private _linkages: LinkageElement[];
  private _connections: ConnectionElement[];

  constructor(linkages: LinkageElement[], connections: ConnectionElement[]) {
    this._linkages = linkages;
    this._connections = connections;
  }

  generateAllEquilibirum(): string[] {
    const equations: string[] = [];

    this._linkages.forEach((linkage) => {
      equations.push(...linkage.generateEquilibrium());
    });

    this._connections.forEach((connection) => {
      equations.push(...connection.generateEquilibrium());
    });

    return equations;
  }

  get linkages() {
    return this._linkages;
  }

  get connections() {
    return this._connections;
  }

  static fromJson(obj: object) {
    const pointMap: Map<number, Point> = new Map<number, Point>();

    if (
      !("_linkages" in obj && Array.isArray(obj._linkages)) ||
      !("_connections" in obj && Array.isArray(obj._connections))
    ) {
      throw new Error("Invalid JSON");
    }

    const linkages: LinkageElement[] = [];
    const connections: ConnectionElement[] = [];

    obj._linkages.forEach((linkage: object) => {
      linkages.push(LinkageElement.fromJson(linkage, pointMap));
    });

    obj._connections.forEach((connection: object) => {
      connections.push(ConnectionElement.fromJson(connection, pointMap));
    });

    return new Structure(linkages, connections);
  }
}
