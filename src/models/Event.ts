import { ElementType } from "../utils/Constants";
import { Coordinate } from "./Coordinate";

export interface MovePointEvent {
  name: string;
  source: string;
  coordinate: Coordinate;
}

export interface ObjectSelectionEvent {
  name: string;
  type: ElementType;
}
