import { Coordinate } from "../../Coordinate";
import { MovePointEvent } from "../../Event";
import { Point } from "../../Point";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Linkage } from "../../diagram_elements/Linkage";
import { Connection } from "../../diagram_elements/connections/Connection";
import { PinConnection } from "../../diagram_elements/connections/PinConnection";
import { Painter } from "../Painter";
import { Feature } from "./Feature";

export class PointSnapFeature implements Feature {
  private _freePoints: Set<string>;

  constructor() {
    this._freePoints = new Set<string>();
  }

  handleElementAddition(painter: Painter, element: DiagramElement): void {
    if (element instanceof Linkage) {
      element.points.forEach((point) => {
        this._freePoints.add(point.name);
      });
    } else if (element instanceof Connection) {
      element.points.forEach((point) => {
        this._freePoints.delete(point.name);
      });
    }
  }

  handleElementRemoval(painter: Painter, element: DiagramElement): void {
    if (element instanceof Connection) {
      element.points.forEach((point) => {
        this._freePoints.add(point.name);
      });
    }
  }

  handlePointUpdate(painter: Painter, movePointEvent: MovePointEvent): void {
    if (this._freePoints.has(movePointEvent.name)) {
      let added = false;
      this._freePoints.forEach((point) => {
        if (!added) {
          const referencePoint = painter.getPoint(point);

          if (!referencePoint) {
            throw new Error("mising reference point");
          }

          if (
            movePointEvent.name != point &&
            this.distance(movePointEvent.coordinate, {
              x: referencePoint.x,
              y: referencePoint.y,
            }) < 10
          ) {
            const p1 = painter.getPoint(movePointEvent.name);
            const p2 = referencePoint;

            if (!p1) {
              throw new Error("mising reference point");
            }

            const newConnection = new PinConnection(`${p1}-${p2}`, [p1, p2]);

            painter.addElement(newConnection);
            console.log("SNAPPING:", p1.name, p2.name);
            added = true;
          }
        }
      });
    }
  }

  handlePointAddition(painter: Painter, linkage: Linkage, point: Point): void {
    this._freePoints.add(point.name);
  }

  handlePointRemoval(painter: Painter, linkage: Linkage, point: Point): void {
    this._freePoints.delete(point.name);
  }

  private distance(coordinate1: Coordinate, coordinate2: Coordinate) {
    return (
      Math.abs(coordinate1.x - coordinate2.x) +
      Math.abs(coordinate1.y - coordinate2.y)
    );
  }
}
