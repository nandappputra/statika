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
    let sigmaF_x = "";
    let sigmaF_y = "";
    let sigmaM_z = "";

    this._linkages.forEach((linkage) => {
      const equations = linkage.generateEquilibrium();
      sigmaF_x += `+${equations[0]}`;
      sigmaF_y += `+${equations[1]}`;
      sigmaM_z += `+${equations[2]}`;
    });

    this._connections.forEach((connection) => {
      const equations = connection.generateEquilibrium();
      sigmaF_x += `+${equations[0]}`;
      sigmaF_y += `+${equations[1]}`;
    });

    return [sigmaF_x, sigmaF_y, sigmaM_z];
  }
}
