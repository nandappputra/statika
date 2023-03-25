import { Linkage } from "./Linkage";
import { fabric } from "fabric";

export class Painter {
  drawLinkage(linkage: Linkage) {
    const points = linkage.points;
    const coordinates = points.map((point) => ({ x: point.x, y: point.y }));

    return new fabric.Polygon(coordinates, { stroke: "black" });
  }
}
