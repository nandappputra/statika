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
}
