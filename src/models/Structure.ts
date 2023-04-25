import { Connection } from "./diagram_elements/connections/Connection";
import { LinkageElement } from "./diagram_elements/LinkageElement";

export class Structure {
  private _linkages: LinkageElement[];
  private _connections: Connection[];

  constructor(linkages: LinkageElement[], connections: Connection[]) {
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
