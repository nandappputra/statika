import { fabric } from "fabric";
import { MovePointEvent } from "../Event";
import { EntityKind } from "../../utils/Constants";

export interface CanvasEntity {
  name: string;
  id: number;
  kind: EntityKind;

  updatePosition(movePointEvent: MovePointEvent): void;
  getObjectsToDraw(): fabric.Object | fabric.Group;
  moveToFront(): void;
  returnToOriginalPosition(): void;
}
