import { fabric } from "fabric";
import { MovePointEvent } from "../Event";

export interface CanvasEntity {
  name: string;
  snapArea: Map<string, fabric.Object>;

  updatePosition(movePointEvent: MovePointEvent): void;
  getObjectsToDraw(): fabric.Object[];
}
