import { Coordinate } from "./Coordinate";

export interface MovePointEvent {
  name: string;
  source: string;
  coordinate: Coordinate;
}
