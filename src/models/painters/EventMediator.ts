import { MovePointEvent } from "../Event";

export interface EventMediator {
  updatePointPosition(movePointEvent: MovePointEvent): void;
}
