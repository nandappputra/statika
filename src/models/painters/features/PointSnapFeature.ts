import { ElementFactory } from "../../../factories/ElementFactory";
import { ConnectionType } from "../../../utils/Constants";
import { Coordinate } from "../../Coordinate";
import { MovePointEvent, objectDropEvent } from "../../Event";
import { Point } from "../../Point";
import { PointEntity } from "../../canvas_entities/PointEntity";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Linkage } from "../../diagram_elements/Linkage";
import { Connection } from "../../diagram_elements/connections/Connection";
import { Painter } from "../Painter";
import { Feature } from "./Feature";

export class PointSnapFeature implements Feature {
  private _freePoints: Set<string>;
  private _elementFactory: ElementFactory;

  constructor(elementFactory: ElementFactory) {
    this._freePoints = new Set<string>();
    this._elementFactory = elementFactory;
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
            }) < 20
          ) {
            const p1 = painter.getPoint(movePointEvent.name);
            const p2 = referencePoint;

            if (!p1) {
              throw new Error("mising reference point");
            }

            console.log("ABLE TO COMBINE:", p1.name, p2.name);
            added = true;
          }
        }
      });
    }
  }

  handleObjectDrop(painter: Painter, movePointEvent: objectDropEvent): void {
    const entity = movePointEvent.entity;
    if (!(entity instanceof PointEntity)) {
      return;
    }

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
            this.distance(
              { x: entity.getElement().x, y: entity.getElement().y },
              {
                x: referencePoint.x,
                y: referencePoint.y,
              }
            ) < 20
          ) {
            const p1 = painter.getPoint(movePointEvent.name);
            const p2 = referencePoint;

            if (!p1) {
              throw new Error("mising reference point");
            }

            const newConnection = this._elementFactory.buildConnection(
              [p2, p1],
              ConnectionType.PIN
            );

            painter.addElement(newConnection);
            added = true;

            painter.updatePointPosition({
              name: p1.name,
              source: newConnection.name,
              coordinate: { x: p2.x, y: p2.y },
            });
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
