import { Coordinate } from "./Coordinate";
import { CanvasEntity } from "./canvas_entities/CanvasEntity";

export interface MovePointEvent {
  name: string;
  source: string;
  coordinate: Coordinate;
}

export interface ObjectSelectionEvent {
  name: string;
  entity: CanvasEntity;
}

export interface objectDropEvent {
  name: string;
  entity: CanvasEntity;
}
