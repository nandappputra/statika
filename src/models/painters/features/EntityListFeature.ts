/* eslint-disable @typescript-eslint/no-empty-function */
import { MovePointEvent } from "../../Event";
import { Point } from "../../Point";
import { DiagramElement } from "../../diagram_elements/DiagramElement";
import { Linkage } from "../../diagram_elements/Linkage";
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
    _painter: Painter,
    _linkage: Linkage,
    _point: Point
  ): void {}

  handlePointRemoval(
    _painter: Painter,
    _linkage: Linkage,
    _point: Point
  ): void {}

  handlePointUpdate(_painter: Painter, _movePointEvent: MovePointEvent): void {}
}
