import { fabric } from "fabric";
import { MovePointEvent } from "../Event";

export interface CanvasEntity {
  name: string;

  updatePosition(movePointEvent: MovePointEvent): void;
  getObjectsToDraw(): (fabric.Object | fabric.Group)[];
  getFocusableObject(): fabric.Object;
}
