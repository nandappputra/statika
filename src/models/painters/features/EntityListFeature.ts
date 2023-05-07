/* eslint-disable @typescript-eslint/no-empty-function */
import { MovePointEvent } from "../../Event";
import { ExternalForce } from "../../diagram_elements/ExternalForce";
import { Point } from "../../diagram_elements/Point";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { LinkageElement } from "../../diagram_elements/LinkageElement";
import { ConnectionElement } from "../../diagram_elements/ConnectionElement";
import { Painter } from "../Painter";
import { Feature } from "./Feature";

export class EntityListFeature implements Feature {
  private _setElementList: (elements: string[]) => void;

  constructor(setElementList: (elements: string[]) => void) {
    this._setElementList = setElementList;
  }

  handleElementAddition(painter: Painter, _element: DiagramElement): void {
    this._setElementList(painter.getAllEntityName());
  }

  handleElementRemoval(painter: Painter, _element: DiagramElement): void {
    this._setElementList(painter.getAllEntityName());
  }

  handlePointAddition(
    painter: Painter,
    _linkage: LinkageElement,
    _point: Point
  ): void {
    this._setElementList(painter.getAllEntityName());
  }

  handlePointRemoval(
    painter: Painter,
    _linkage: LinkageElement,
    _point: Point
  ): void {
    this._setElementList(painter.getAllEntityName());
  }

  handlePointUpdate(_painter: Painter, _movePointEvent: MovePointEvent): void {}

  handleObjectDrop(_painter: Painter): void {}

  handlePointDisconnection(
    _painter: Painter,
    _connection: ConnectionElement,
    _point: Point
  ): void {}

  handleForceAddition(
    painter: Painter,
    _point: Point,
    _externalForce: ExternalForce
  ): void {
    this._setElementList(painter.getAllEntityName());
  }

  handleForceRemoval(
    painter: Painter,
    _point: Point,
    _externalForce: ExternalForce
  ): void {
    this._setElementList(painter.getAllEntityName());
  }
}
