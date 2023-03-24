import { Connection } from "./connections/Connection";
import { Linkage } from "./Linkage";

export class Structure {
  private _linkages: Linkage[];
  private _connections: Connection[];

  constructor() {
    this._linkages = [];
    this._connections = [];
  }

  addAllLinkages(linkages: Linkage[]): void {
    this._linkages = linkages;
  }

  addAllConnections(connections: Connection[]): void {
    this._connections = connections;
  }

  generateAllEquations(): string[] {
    let equations: string[] = [];

    this._linkages.forEach((linkage) => {
      equations = equations.concat(linkage.generateEquations());
    });

    this._connections.forEach((connection) => {
      equations = equations.concat(connection.generateEquations());
    });

    return equations;
  }
}
