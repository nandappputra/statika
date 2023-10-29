import { Coordinate } from "./Coordinate";
import { CanvasEntity } from "./canvas_entities/CanvasEntity";

export interface MovePointEvent {
  id: number;
  source: number;
  coordinate: Coordinate;
}

export interface ObjectSelectionEvent {
  id: number;
  entity: CanvasEntity;
}

export interface ObjectDropEvent {
  id: number;
  entity: CanvasEntity;
}

export interface ObjectOverEvent {
  top: number;
  left: number;
  height: number;
  width: number;
  name: string;
}
