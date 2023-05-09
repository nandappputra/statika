import { ElementFactory } from "../../../factories/ElementFactory";
import { ConnectionKind } from "../../../utils/Constants";
import { Coordinate } from "../../Coordinate";
import { ObjectDropEvent } from "../../Event";
import { ConnectionEntity } from "../../canvas_entities/ConnectionEntity";
import { PointEntity } from "../../canvas_entities/PointEntity";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { Point } from "../../diagram_elements/Point";
import { Painter } from "../Painter";
import { BaseSubscriber } from "./BaseSubscriber";

export class PointSnapFeature extends BaseSubscriber {
  private _freePoints: Set<string>;
  private _connections: Set<string>;
  private _elementFactory: ElementFactory;

  constructor(elementFactory: ElementFactory) {
    super();
    this._freePoints = new Set<string>();
    this._connections = new Set<string>();
    this._elementFactory = elementFactory;
  }

  override handleElementAddition(
    painter: Painter,
    element: DiagramElement
  ): void {
    if (element instanceof LinkageElement) {
      element.points.forEach((point) => {
        this._freePoints.add(point.name);
      });
    } else if (element instanceof ConnectionElement) {
      element.points.forEach((point) => {
        this._freePoints.delete(point.name);
      });
      this._connections.add(element.name);
    }
  }

  override handleElementRemoval(
    painter: Painter,
    element: DiagramElement
  ): void {
    if (element instanceof LinkageElement) {
      element.points.forEach((point) => {
        this._freePoints.delete(point.name);
      });
    } else if (element instanceof ConnectionElement) {
      element.points.forEach((point) => {
        this._freePoints.add(point.name);
      });
      this._connections.delete(element.name);
    }
  }

  override handleObjectDrop(
    painter: Painter,
    movePointEvent: ObjectDropEvent
  ): void {
    const entity = movePointEvent.entity;
    if (
      !(entity instanceof PointEntity) ||
      !this._freePoints.has(movePointEvent.name)
    ) {
      return;
    }

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
            ConnectionKind.PIN_JOINT
          );

          painter.addElement(newConnection);
          added = true;

          painter.updatePointPosition({
            name: p1.name,
            source: newConnection.name,
            coordinate: { x: p2.x, y: p2.y },
          });
          painter.setFocus(newConnection.name);
        }
      }
    });

    if (added) {
      return;
    }

    const toRemove: string[] = [];
    this._connections.forEach((connection) => {
      if (added) {
        return;
      }

      const connectionEntity = painter.getEntityByName(connection);

      if (
        !connectionEntity ||
        !(connectionEntity instanceof ConnectionEntity)
      ) {
        throw new Error("mising connection");
      }

      if (
        movePointEvent.name != connection &&
        this.distance(
          { x: entity.getElement().x, y: entity.getElement().y },
          {
            x: connectionEntity.x,
            y: connectionEntity.y,
          }
        ) < 20
      ) {
        const point = entity.getElement();
        const p2 = connectionEntity;

        painter.addPointToConnection(point, connectionEntity.getElement());
        added = true;
        toRemove.push(point.name);

        painter.updatePointPosition({
          name: point.name,
          source: connectionEntity.getElement().name,
          coordinate: { x: p2.x, y: p2.y },
        });
      }
    });

    toRemove.forEach((point) => this._freePoints.delete(point));
  }

  override handlePointAddition(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void {
    this._freePoints.add(point.name);
  }

  override handlePointRemoval(
    painter: Painter,
    linkage: LinkageElement,
    point: Point
  ): void {
    this._freePoints.delete(point.name);
  }

  override handlePointDisconnection(
    _painter: Painter,
    _connection: ConnectionElement,
    point: Point
  ): void {
    this._freePoints.add(point.name);
  }

  private distance(coordinate1: Coordinate, coordinate2: Coordinate) {
    return (
      Math.abs(coordinate1.x - coordinate2.x) +
      Math.abs(coordinate1.y - coordinate2.y)
    );
  }
}
