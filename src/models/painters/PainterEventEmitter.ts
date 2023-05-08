import fabric from "fabric/fabric-impl";
import { ConnectionKind } from "../../utils/Constants";
import { MovePointEvent } from "../Event";
import { Structure } from "../Structure";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { LinkageEntity } from "../canvas_entities/LinkageEntity";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { LinkageElement } from "../diagram_elements/LinkageElement";
import { Point } from "../diagram_elements/Point";
import { CanvasBinder } from "./CanvasBinder";
import { Painter } from "./Painter";

export class PainterEventEmitter implements CanvasBinder {
  private _painter: Painter;

  constructor(painter: Painter) {
    this._painter = painter;
  }

  getEntityByName(name: string): CanvasEntity | undefined {
    return this._painter.getEntityByName(name);
  }

  getAllEntityName(): string[] {
    return this._painter.getAllEntityName();
  }

  getCanvasEntity(diagramElement: DiagramElement): CanvasEntity | undefined {
    return this._painter.getCanvasEntity(diagramElement);
  }

  getPoint(pointName: string): Point | undefined {
    return this._painter.getPoint(pointName);
  }

  getLinkageFromPoint(point: Point): LinkageEntity | undefined {
    return this._painter.getLinkageFromPoint(point);
  }

  getCanvasCenter(): fabric.Point {
    return this._painter.getCanvasCenter();
  }

  setFocus(name: string): void {
    return this._painter.setFocus(name);
  }

  clearFocus(): void {
    return this._painter.clearFocus();
  }

  updatePointPosition(movePointEvent: MovePointEvent): void {
    return this._painter.updatePointPosition(movePointEvent);
  }

  addElement(diagramElement: DiagramElement): CanvasEntity {
    return this._painter.addElement(diagramElement);
  }

  removeElement(diagramElement: DiagramElement): void {
    return this._painter.removeElement(diagramElement);
  }

  addPointToLinkage(point: Point, linkage: LinkageElement): void {
    return this._painter.addPointToLinkage(point, linkage);
  }

  removePointFromLinkage(point: Point, linkage: LinkageElement): void {
    return this._painter.removePointFromLinkage(point, linkage);
  }

  addPointToConnection(point: Point, connection: ConnectionElement): void {
    return this._painter.addPointToConnection(point, connection);
  }

  removePointFromConnection(point: Point, connection: ConnectionElement): void {
    return this._painter.removePointFromConnection(point, connection);
  }

  addExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ): void {
    return this._painter.addExternalLoad(location, externalLoad);
  }

  removeExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ): void {
    return this._painter.removeExternalLoad(location, externalLoad);
  }

  updateForce(externalForce: ExternalForce, F_x: number, F_y: number): void {
    return this._painter.updateForce(externalForce, F_x, F_y);
  }

  changeConnectionType(
    connection: ConnectionElement,
    connectionType: ConnectionKind
  ): void {
    return this._painter.changeConnectionType(connection, connectionType);
  }

  buildStructure(): Structure {
    return this._painter.buildStructure();
  }
}
