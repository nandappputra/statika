import { ConnectionElement } from "./diagram_elements/ConnectionElement";
import { LinkageElement } from "./diagram_elements/LinkageElement";

export class Structure {
  private _linkages: LinkageElement[];
  private _connections: ConnectionElement[];

  constructor(linkages: LinkageElement[], connections: ConnectionElement[]) {
    this._linkages = linkages;
    this._connections = connections;
  }

  generateAllEquilibirum(): string[] {
    let equations: string[] = [];

    this._linkages.forEach((linkage) => {
      equations = equations.concat(linkage.generateEquilibrium());
    });

    this._connections.forEach((connection) => {
      equations = equations.concat(connection.generateEquilibrium());
    });

    return equations;
  }
}
