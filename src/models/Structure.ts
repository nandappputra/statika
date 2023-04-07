import { Connection } from "./diagram_elements/connections/Connection";
import { Linkage } from "./diagram_elements/Linkage";

export class Structure {
  private _linkages: Linkage[];
  private _connections: Connection[];

  constructor(linkages: Linkage[], connections: Connection[]) {
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
