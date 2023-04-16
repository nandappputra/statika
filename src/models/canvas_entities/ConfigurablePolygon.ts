/*
    reference: http://fabricjs.com/custom-controls-polygon
*/

import { fabric } from "fabric";

import { Coordinate } from "../Coordinate";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { Linkage } from "../diagram_elements/Linkage";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ExternalForce } from "../ExternalForce";

interface ControlMap {
  [key: string]: fabric.Control;
}

// temporary solution until fabric 6.0.0 exposes setDimensions
interface PolygonWithSetPositionDimension extends fabric.Polygon {
  _setPositionDimensions(argument: object): unknown;
}

export class ConfigurablePolygon implements CanvasEntity {
  private _name: string;
  private _nameToIndexMap: Map<string, number>;
  private _indexToNameMap: Map<number, string>;
  private _nameToIconMap: Map<string, (fabric.Group | fabric.Object)[]>;
  private _polygon: PolygonWithSetPositionDimension;
  private _eventMediator: EventMediator;

  constructor(
    linkage: Linkage,
    eventMediator: EventMediator,
    options: fabric.IPolylineOptions | undefined
  ) {
    this._name = linkage.name;
    this._nameToIndexMap = new Map<string, number>();
    this._indexToNameMap = new Map<number, string>();
    this._nameToIconMap = new Map<string, (fabric.Group | fabric.Object)[]>();
    const coordinates: Coordinate[] = [];

    const points = linkage.points;
    points.forEach((point, index) => {
      this._nameToIndexMap.set(point.name, index);
      this._indexToNameMap.set(index, point.name);
      coordinates.push({ x: point.x, y: point.y });

      const icon: (fabric.Group | fabric.Object)[] = [];
      icon.push(this.buildPointIcon(point));
      if (point.hasExternalForce()) {
        point.externalForces.forEach((force) => {
          icon.push(this.buildArrowIcon(force, point));
        });
      }
      this._nameToIconMap.set(point.name, icon);
    });

    this._polygon = new fabric.Polygon(
      coordinates,
      options
    ) as PolygonWithSetPositionDimension;
    this._polygon.perPixelTargetFind = true;

    this._eventMediator = eventMediator;
    this._buildControlForPolygon();
  }

  private buildArrowIcon(force: ExternalForce, point: Point) {
    const line = new fabric.Line([0, 0, 0, 50], {
      originY: "center",
      originX: "center",
      stroke: "black",
      strokeWidth: 3,
    });
    const cap = new fabric.Triangle({
      width: 15,
      height: 15,
      originY: "bottom",
      originX: "center",
      top: 50,
      angle: 180,
    });

    const arrow = new fabric.Group([line, cap], {
      originX: "center",
      originY: "bottom",
      angle:
        (Math.atan2(parseFloat(force.symbolF_y), parseFloat(force.symbolF_x)) *
          180) /
          3.14 -
        90,
      left: point.x,
      top: point.y,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      data: { name: force.name },
    });

    return arrow;
  }

  private buildPointIcon(point: Point) {
    return new fabric.Circle({
      radius: 4,
      originX: "center",
      originY: "center",
      left: point.x,
      top: point.y,
      selectable: false,
      hoverCursor: "default",
    });
  }

  public updatePosition(movePointEvent: MovePointEvent) {
    const pointIndex = this._nameToIndexMap.get(movePointEvent.name);
    if (
      typeof pointIndex === "undefined" ||
      typeof this._polygon.points === "undefined"
    ) {
      throw new Error("missing point");
    }

    this._polygon.points[pointIndex].x = movePointEvent.coordinate.x;
    this._polygon.points[pointIndex].y = movePointEvent.coordinate.y;
    this._polygon.dirty = true;

    const icons = this._nameToIconMap.get(movePointEvent.name);
    if (icons) {
      icons.forEach((icon) => {
        icon.left = movePointEvent.coordinate.x;
        icon.top = movePointEvent.coordinate.y;
      });
    }

    this._updateBoundingBox(this._polygon);
  }

  public getObjectsToDraw() {
    const objects: (fabric.Object | fabric.Group)[] = [];
    objects.push(this._polygon);
    this._nameToIconMap.forEach((icons) => {
      icons.forEach((icon) => {
        objects.push(icon);
      });
    });

    return objects;
  }

  private _buildControlForPolygon(): void {
    this._polygon.cornerStyle = "circle";
    this._polygon.cornerColor = "rgba(255,255,255,0.5)";
    this._polygon.lockMovementX = true;
    this._polygon.lockMovementY = true;
    this._polygon.controls = this._buildControlForPoints();
  }

  private _buildControlForPoints(): ControlMap {
    const points = this._polygon.points;
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

  private _updateBoundingBox(polygon: fabric.Polygon) {
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

  get name() {
    return this._name;
  }

  public addExternalForce(location: Point, externalForce: ExternalForce) {
    const icons = this._nameToIconMap.get(location.name);
    const force = this.buildArrowIcon(externalForce, location);

    if (!icons) {
      this._nameToIconMap.set(location.name, [force]);
    } else {
      icons.push(force);
    }

    return force;
  }

  public removeExternalForce(location: Point, externalForce: ExternalForce) {
    const icons = this._nameToIconMap.get(location.name);

    if (!icons) {
      throw new Error("icons not found");
    }

    const force = icons.find((icon) => icon.data?.name === externalForce.name);
    if (!force) {
      throw new Error("force not found");
    }

    this._nameToIconMap.set(
      location.name,
      icons.filter((icon) => icon.name !== externalForce.name)
    );

    return force;
  }

  public addPoint(point: Point) {
    if (!this._polygon.points) {
      throw new Error("missing points in polygon");
    }

    this._polygon.points.push(new fabric.Point(point.x, point.y));
    const index = this._polygon.points.length - 1;

    this._indexToNameMap.set(index, point.name);
    this._nameToIndexMap.set(point.name, index);

    this._buildControlForPolygon();
    this._polygon._setPositionDimensions({});
    this._polygon.dirty = true;
    const pointIcon = this.buildPointIcon(point);
    this._nameToIconMap.set(point.name, [pointIcon]);

    return pointIcon;
  }

  public deletePoint(point: Point) {
    if (!this._polygon.points) {
      throw new Error("missing points in polygon");
    }

    const index = this._nameToIndexMap.get(point.name);
    if (!index) {
      throw new Error("point not found in polygon");
    }

    const icons = this._nameToIconMap.get(point.name);
    if (!icons) {
      throw new Error("icons not found in polygon");
    }

    this._polygon.points.splice(index, 1);
    this.updateIndexAfterPointDeletion(point.name, index);

    this._buildControlForPolygon();
    this._polygon._setPositionDimensions({});
    this._polygon.dirty = true;

    this._nameToIconMap.delete(point.name);

    return icons;
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
}
