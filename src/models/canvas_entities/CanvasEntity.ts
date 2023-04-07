import { fabric } from "fabric";
import { MovePointEvent } from "../Event";

export interface CanvasEntity {
  updatePosition(movePointEvent: MovePointEvent): void;
  getObjectsToDraw(): fabric.Object[];
}
