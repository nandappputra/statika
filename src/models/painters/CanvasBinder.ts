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

export interface CanvasBinder {
  getEntityById(id: number): CanvasEntity | undefined;
  getAllEntityName(): string[];
  getAllEntities(): CanvasEntity[];
  getCanvasEntity(diagramElement: DiagramElement): CanvasEntity | undefined;
  getPoint(pointId: number): Point | undefined;
  getLinkageFromPoint(point: Point): LinkageEntity | undefined;
  getCanvasCenter(): fabric.Point;

  setFocus(id: number): void;
  clearFocus(): void;

  updatePointPosition(movePointEvent: MovePointEvent): void;

  addElement(diagramElement: DiagramElement): CanvasEntity;
  removeElement(diagramElement: DiagramElement): void;

  addPointToLinkage(point: Point, linkage: LinkageElement): void;
  removePointFromLinkage(point: Point, linkage: LinkageElement): void;

  addPointToConnection(point: Point, connection: ConnectionElement): void;
  removePointFromConnection(point: Point, connection: ConnectionElement): void;

  addExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ): void;
  removeExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ): void;
  updateForce(externalForce: ExternalForce, F_x: number, F_y: number): void;

  changeConnectionType(
    connection: ConnectionElement,
    connectionType: ConnectionKind
  ): void;

  buildStructure(): Structure;
}
