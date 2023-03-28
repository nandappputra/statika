import { Linkage } from "./Linkage";
import { ConfigurablePolygon } from "./ConfigurablePolygon";

export class Painter {
  drawLinkage(linkage: Linkage) {
    const points = linkage.points;
    const coordinates = points.map((point) => ({ x: point.x, y: point.y }));
    return new ConfigurablePolygon(coordinates, { stroke: "black" });
  }
}
