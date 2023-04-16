/*
    reference: http://fabricjs.com/custom-controls-polygon
*/

import { IPolylineOptions } from "fabric/fabric-impl";
import { Coordinate } from "../Coordinate";
import { fabric } from "fabric";
import { Point } from "../Point";
import { EventMediator } from "../painters/EventMediator";

interface ControlMap {
  [key: string]: fabric.Control;
}

// temporary solution until fabric 6.0.0 exposes setDimensions
interface PolygonWithSetPositionDimension extends fabric.Polygon {
  _setPositionDimensions(argument: object): unknown;
}

export class ConfigurablePolygon extends fabric.Polygon {
  private _indexToNameMap: Map<number, string>;
  private _eventMediator: EventMediator;
  constructor(
    points: Coordinate[],
    indexToNameMap: Map<number, string>,
    eventMediator: EventMediator,
    options: IPolylineOptions | undefined
  ) {
    super(points, options);

    this._indexToNameMap = indexToNameMap;
    this._eventMediator = eventMediator;

    this._buildControlForPolygon();
  }

  private _buildControlForPolygon(): void {
    this.cornerStyle = "circle";
    this.cornerColor = "rgba(255,255,255,0.5)";
    this.lockMovementX = true;
    this.lockMovementY = true;
    this.controls = this._buildControlForPoints();
  }

  private _buildControlForPoints(): ControlMap {
    const points = this.points;
    if (typeof points === "undefined") {
      throw new Error("Missing points");
    }

    const controlMap: ControlMap = {};

    points.map((point, index) => {
      const anchor = index > 0 ? index - 1 : points.length - 1;
      const key = `P${index}`;
      const control = new fabric.Control({
        actionName: "modifyPolygon",
        positionHandler: this._placeControllerAtPoint(point),
        actionHandler: this._handleControllerMovement(anchor, index),
      });

      controlMap[key] = control;
    });

    return controlMap;
  }

  public addPoint(point: Point) {
    if (!this.points) {
      throw new Error("missing points in polygon");
    }

    this.points.push(new fabric.Point(point.x, point.y));
    this._rebuiltControl();
  }

  public deletePoint(point: Point, index: number) {
    if (!this.points) {
      throw new Error("missing points in polygon");
    }

    this.points.splice(index, 1);
    this._rebuiltControl();
  }

  private _rebuiltControl() {
    this._buildControlForPolygon();
    this.updateBoundingBox();
    this.dirty = true;
  }

  private _placeControllerAtPoint(
    point: fabric.Point
  ): (
    dim: Coordinate,
    finalMatrix: unknown,
    fabricObject: fabric.Path,
    currentControl: fabric.Control
  ) => fabric.Point {
    return (
      _dim: Coordinate,
      _finalMatrix: unknown,
      fabricPolygon: fabric.Path,
      _currentControl: fabric.Control
    ) => {
      const coordinate = {
        x: point.x - fabricPolygon.pathOffset.x,
        y: point.y - fabricPolygon.pathOffset.y,
      };

      const objectSpacePosition = new fabric.Point(coordinate.x, coordinate.y);

      let totalTransformationMatrix: unknown[];

      const objectToCanvasSpaceTransformationMatrix =
        fabricPolygon.calcTransformMatrix();

      if (!this._isNumberArray(objectToCanvasSpaceTransformationMatrix)) {
        throw new Error("invalid transformation matrix");
      }

      if (fabricPolygon.canvas?.viewportTransform) {
        totalTransformationMatrix = fabric.util.multiplyTransformMatrices(
          fabricPolygon.canvas?.viewportTransform,
          objectToCanvasSpaceTransformationMatrix
        );
      } else {
        totalTransformationMatrix = objectToCanvasSpaceTransformationMatrix;
      }

      return fabric.util.transformPoint(
        objectSpacePosition,
        totalTransformationMatrix
      );
    };
  }

  private _handleControllerMovement(anchorIndex: number, pointIndex: number) {
    return (
      pointeventData: MouseEvent,
      transform: fabric.Transform,
      x: number,
      y: number
    ) => {
      if (!(transform.target instanceof fabric.Polygon)) {
        throw "Invalid object type";
      }

      const polygon = transform.target as PolygonWithSetPositionDimension;

      if (typeof polygon.points === "undefined") {
        throw "Missing points";
      }

      const referencePointBeforeModification = new fabric.Point(
        polygon.points[anchorIndex].x - polygon.pathOffset.x,
        polygon.points[anchorIndex].y - polygon.pathOffset.y
      );

      const canvasSpaceReferencePosition = fabric.util.transformPoint(
        referencePointBeforeModification,
        polygon.calcTransformMatrix()
      );

      const isMovementApplied = this._movePointOnControllerMovement(
        pointeventData,
        transform,
        x,
        y,
        pointIndex
      );

      const referencePointAfterModification = new fabric.Point(
        polygon.points[anchorIndex].x - polygon.pathOffset.x,
        polygon.points[anchorIndex].y - polygon.pathOffset.y
      );
      const canvasSpaceReferencePositionAfterModification =
        fabric.util.transformPoint(
          referencePointAfterModification,
          polygon.calcTransformMatrix()
        );

      const centerFinal = polygon.getCenterPoint();
      const translation = canvasSpaceReferencePosition.subtract(
        canvasSpaceReferencePositionAfterModification
      );

      polygon.setPositionByOrigin(
        translation.add(centerFinal),
        "center",
        "center"
      );

      // temporary solution until fabric 6.0.0 exposes setDimensions
      polygon._setPositionDimensions({});

      return isMovementApplied;
    };
  }

  public updateBoundingBox() {
    this._setPositionDimension(this);
  }

  private _setPositionDimension(polygon: fabric.Polygon) {
    const extendedPolygon = polygon as PolygonWithSetPositionDimension;
    extendedPolygon._setPositionDimensions({});
  }

  private _movePointOnControllerMovement(
    _pointeventData: MouseEvent,
    transform: fabric.Transform,
    x: number,
    y: number,
    pointIndex: number
  ): boolean {
    const polygon = transform.target;

    if (!(polygon instanceof fabric.Polygon)) {
      throw "Invalid object type";
    }

    if (!polygon.points) {
      throw "Missing points";
    }

    const objectSpaceSize = this._getObjectSizeWithStroke(polygon);
    const canvasSpaceSize = polygon._getTransformedDimensions();

    const mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    );

    const finalPointPosition = {
      x:
        mouseLocalPosition.x * (objectSpaceSize.x / canvasSpaceSize.x) +
        polygon.pathOffset.x,
      y:
        mouseLocalPosition.y * (objectSpaceSize.y / canvasSpaceSize.y) +
        polygon.pathOffset.y,
    };

    polygon.points[pointIndex].x = finalPointPosition.x;
    polygon.points[pointIndex].y = finalPointPosition.y;
    polygon.dirty = true;

    const origin = this._indexToNameMap.get(pointIndex);
    if (typeof origin === "undefined") {
      throw new Error("missing point");
    }

    this._eventMediator.updatePointPosition({
      name: origin,
      source: origin,
      coordinate: {
        x: finalPointPosition.x,
        y: finalPointPosition.y,
      },
    });

    return true;
  }

  private _getObjectSizeWithStroke(object: fabric.Object) {
    const scaleX = object.scaleX ? object.scaleX : 1;
    const scaleY = object.scaleY ? object.scaleY : 1;
    const strokeWidth = object.strokeWidth ? object.strokeWidth : 0;

    const stroke = new fabric.Point(
      object.strokeUniform ? 1 / scaleX : 1,
      object.strokeUniform ? 1 / scaleY : 1
    ).multiply(strokeWidth);

    const width = object.width ? object.width : 0;
    const height = object.height ? object.height : 0;

    return new fabric.Point(width + stroke.x, height + stroke.y);
  }

  private _isNumberArray(anyArray: unknown[]): anyArray is number[] {
    anyArray.forEach((element) => {
      if (typeof element !== "number") {
        return false;
      }
    });

    return true;
  }
}
