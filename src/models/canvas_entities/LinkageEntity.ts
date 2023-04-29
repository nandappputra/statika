import { fabric } from "fabric";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ElementType } from "../../utils/Constants";

// temporary solution until fabric 6.0.0 exposes setDimensions
interface PolygonWithSetPositionDimension extends fabric.Polygon {
  _setPositionDimensions(argument: object): unknown;
}

export class LinkageEntity implements CanvasEntity {
  private _name: string;
  private _nameToIndexMap: Map<string, number>;
  private _indexToNameMap: Map<number, string>;
  private _polygon: fabric.Polygon;
  private _eventMediator: EventMediator;
  private _linkage: LinkageElement;

  constructor(
    linkage: LinkageElement,
    eventMediator: EventMediator,
    options: fabric.IPolylineOptions | undefined
  ) {
    this._name = linkage.name;
    this._linkage = linkage;
    this._nameToIndexMap = new Map<string, number>();
    this._indexToNameMap = new Map<number, string>();
    const coordinates: fabric.Point[] = [];

    const points = linkage.points;
    points.forEach((point, index) => {
      this._nameToIndexMap.set(point.name, index);
      this._indexToNameMap.set(index, point.name);
      coordinates.push(new fabric.Point(point.x, point.y));
    });

    this._eventMediator = eventMediator;
    this._polygon = new fabric.Polygon(coordinates, options);
    this._polygon.data = { name: this._name, type: ElementType.LINKAGE };
    this._polygon.hasControls = false;
    this._polygon.lockMovementX = true;
    this._polygon.lockMovementY = true;
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    const pointIndex = this._nameToIndexMap.get(movePointEvent.name);
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
    return this._name;
  }

  public addPoint(point: Point) {
    if (!this._polygon.points) {
      throw new Error("missing points in polygon");
    }

    this._linkage.addPoint(point);

    this._polygon.points.push(new fabric.Point(point.x, point.y));

    const index = this._polygon.points.length - 1;
    this._indexToNameMap.set(index, point.name);
    this._nameToIndexMap.set(point.name, index);
    this._setPolygonPositionDimension(this._polygon);
    this._polygon.dirty = true;
  }

  public deletePoint(point: Point) {
    const index = this._nameToIndexMap.get(point.name);
    if (index === undefined || !this._polygon.points) {
      throw new Error("failed to delete point: point not found in polygon");
    }

    this._linkage.removePoint(point);

    this._polygon.points.splice(index, 1);

    this.updateIndexAfterPointDeletion(point.name, index);

    this._setPolygonPositionDimension(this._polygon);
    this._polygon.dirty = true;
  }

  private updateIndexAfterPointDeletion(pointName: string, index: number) {
    this._nameToIndexMap.delete(pointName);
    this._indexToNameMap.delete(index);

    const newNameToIndexMap = new Map<string, number>();
    const newIndexToNameMap = new Map<number, string>();

    this._nameToIndexMap.forEach((value, key) => {
      if (value > index) {
        newNameToIndexMap.set(key, value - 1);
      } else {
        newNameToIndexMap.set(key, value);
      }
    });

    this._indexToNameMap.forEach((value, key) => {
      if (key > index) {
        newIndexToNameMap.set(key - 1, value);
      } else {
        newIndexToNameMap.set(key, value);
      }
    });

    this._nameToIndexMap = newNameToIndexMap;
    this._indexToNameMap = newIndexToNameMap;
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
