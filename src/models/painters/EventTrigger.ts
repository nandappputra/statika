import { MovePointEvent } from "../Event";

export interface EventSubscriber {
  notifyMovePointEvent(movePointEvent: MovePointEvent): void;
}

interface EventTriggerer {
  setMovePointEventHandler(
    callback: (movePointEvent: MovePointEvent) => void
  ): void;
}

export class EventTrigger implements EventSubscriber, EventTriggerer {
  private _callback: (movePointEvent: MovePointEvent) => void;

  constructor() {
    this._callback = (_movePointEvent: MovePointEvent) => {
      throw new Error("missing event handler");
    };
  }

  public notifyMovePointEvent(movePointEvent: MovePointEvent): void {
    this._callback(movePointEvent);
  }

  public setMovePointEventHandler(
    callback: (movePointEvent: MovePointEvent) => void
  ): void {
    this._callback = callback;
  }
}
