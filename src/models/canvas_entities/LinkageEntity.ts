import { fabric } from "fabric";
import { Coordinate } from "../Coordinate";
import { MovePointEvent } from "../Event";
import { CanvasEntity } from "./CanvasEntity";
import { Linkage } from "../diagram_elements/Linkage";
import { EventMediator } from "../painters/EventMediator";
import { Point } from "../Point";
import { ExternalForce } from "../ExternalForce";
import { ConfigurablePolygon } from "./ConfigurablePolygon";
import { RADIAN_TO_DEGREE_MULTIPLIER } from "../../utils/Constants";

const ARROW_ANGLE_ADJUSTMENT = 90;

export class LinkageEntity implements CanvasEntity {
  private _name: string;
  private _nameToIndexMap: Map<string, number>;
  private _indexToNameMap: Map<number, string>;
  private _nameToIconMap: Map<string, (fabric.Group | fabric.Object)[]>;
  private _polygon: ConfigurablePolygon;
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

    this._eventMediator = eventMediator;
    this._polygon = new ConfigurablePolygon(
      points,
      this._indexToNameMap,
      this._eventMediator,
      options
    );
    this._polygon.data = { name: this._name };
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
        Math.atan2(parseFloat(force.symbolF_y), parseFloat(force.symbolF_x)) *
          RADIAN_TO_DEGREE_MULTIPLIER -
        ARROW_ANGLE_ADJUSTMENT,
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

    this._polygon.updateBoundingBox();
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
    const index = this._polygon.points.length - 1;

    this._polygon.addPoint(point);

    this._indexToNameMap.set(index, point.name);
    this._nameToIndexMap.set(point.name, index);

    const pointIcon = this.buildPointIcon(point);
    this._nameToIconMap.set(point.name, [pointIcon]);

    return pointIcon;
  }

  public deletePoint(point: Point) {
    const index = this._nameToIndexMap.get(point.name);
    if (!index) {
      throw new Error("point not found in polygon");
    }

    this._polygon.deletePoint(point, index);

    const icons = this._nameToIconMap.get(point.name);
    if (!icons) {
      throw new Error("icons not found in polygon");
    }
    this._nameToIconMap.delete(point.name);

    this.updateIndexAfterPointDeletion(point.name, index);

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
