import { fabric } from "fabric";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../diagram_elements/Point";
import { EntityKind, EntityPrefix } from "../../utils/Constants";

// temporary solution until fabric 6.0.0 exposes setDimensions
interface PolygonWithSetPositionDimension extends fabric.Polygon {
  _setPositionDimensions(argument: object): unknown;
}

export class LinkageEntity implements CanvasEntity {
  private _kind = EntityKind.LINKAGE;

  private _idToIndexMap: Map<number, number>;
  private _indexToIdMap: Map<number, number>;
  private _polygon: fabric.Polygon;
  private _eventMediator: EventMediator;
  private _linkage: LinkageElement;

  constructor(
    linkage: LinkageElement,
    eventMediator: EventMediator,
    options: fabric.IPolylineOptions | undefined
  ) {
    this._linkage = linkage;
    this._idToIndexMap = new Map<number, number>();
    this._indexToIdMap = new Map<number, number>();
    const coordinates: fabric.Point[] = [];

    const points = linkage.points;
    points.forEach((point, index) => {
      this._idToIndexMap.set(point.id, index);
      this._indexToIdMap.set(index, point.id);
      coordinates.push(new fabric.Point(point.x, point.y));
    });

    this._eventMediator = eventMediator;
    this._polygon = new fabric.Polygon(coordinates, options);
    this._polygon.data = {
      name: this._linkage.name,
      id: this._linkage.id,
      type: EntityPrefix.LINKAGE,
    };
    this._polygon.hasControls = false;
    this._polygon.lockMovementX = true;
    this._polygon.lockMovementY = true;
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    const pointIndex = this._idToIndexMap.get(movePointEvent.id);
    if (
      typeof pointIndex === "undefined" ||
      typeof this._polygon.points === "undefined"
    ) {
      throw new Error("failed to update linkage: missing point");
    }

    this._polygon.points[pointIndex].x = movePointEvent.coordinate.x;
    this._polygon.points[pointIndex].y = movePointEvent.coordinate.y;
    this._polygon.setCoords();
    this._setPolygonPositionDimension(this._polygon);
    this._polygon.dirty = true;
  }

  private _setPolygonPositionDimension(polygon: fabric.Polygon) {
    const castedPolygon = polygon as PolygonWithSetPositionDimension;
    castedPolygon._setPositionDimensions({});
  }

  public getObjectsToDraw() {
    return this._polygon;
  }

  get name() {
    return this._linkage.name;
  }

  get id() {
    return this._linkage.id;
  }

  get kind() {
    return this._kind;
  }

  public addPoint(point: Point) {
    if (!this._polygon.points) {
      throw new Error("missing points in polygon");
    }

    this._linkage.addPoint(point);

    this._polygon.points.push(new fabric.Point(point.x, point.y));

    const index = this._polygon.points.length - 1;
    this._indexToIdMap.set(index, point.id);
    this._idToIndexMap.set(point.id, index);
    this._setPolygonPositionDimension(this._polygon);
    this._polygon.dirty = true;
  }

  public deletePoint(point: Point) {
    const index = this._idToIndexMap.get(point.id);
    if (index === undefined || !this._polygon.points) {
      throw new Error("failed to delete point: point not found in polygon");
    }

    this._linkage.removePoint(point);

    this._polygon.points.splice(index, 1);

    this.updateIndexAfterPointDeletion(point.id, index);

    this._setPolygonPositionDimension(this._polygon);
    this._polygon.dirty = true;
  }

  private updateIndexAfterPointDeletion(id: number, index: number) {
    this._idToIndexMap.delete(id);
    this._indexToIdMap.delete(index);

    const newIdToIndexMap = new Map<number, number>();
    const newIndexToIdMap = new Map<number, number>();

    this._idToIndexMap.forEach((value, key) => {
      if (value > index) {
        newIdToIndexMap.set(key, value - 1);
      } else {
        newIdToIndexMap.set(key, value);
      }
    });

    this._indexToIdMap.forEach((value, key) => {
      if (key > index) {
        newIndexToIdMap.set(key - 1, value);
      } else {
        newIndexToIdMap.set(key, value);
      }
    });

    this._idToIndexMap = newIdToIndexMap;
    this._indexToIdMap = newIndexToIdMap;
  }

  public getAllPoints(): Point[] {
    return this._linkage.points;
  }

  public getElement() {
    return this._linkage;
  }

  public getCenter() {
    return this._polygon.getCenterPoint();
  }
}
