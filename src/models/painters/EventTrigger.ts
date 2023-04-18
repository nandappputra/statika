import { MovePointEvent, ObjectSelectionEvent } from "../Event";

export interface EventSubscriber {
  notifyMovePointEvent(movePointEvent: MovePointEvent): void;
  notifyObjectSelectionEvent(objectSelectionEvent: ObjectSelectionEvent): void;
}

interface EventTriggerer {
  setMovePointEventHandler(
    callback: (movePointEvent: MovePointEvent) => void
  ): void;
  setObjectSelectionEventHandler(
    callback: (objectSelectionEvent: ObjectSelectionEvent) => void
  ): void;
}

export class EventTrigger implements EventSubscriber, EventTriggerer {
  private _movePointEventCallback: (movePointEvent: MovePointEvent) => void;
  private _objectSelectionEventCallback: (
    objectSelectionEvent: ObjectSelectionEvent
  ) => void;

  constructor() {
    this._movePointEventCallback = (_movePointEvent: MovePointEvent) => {
      throw new Error("missing event handler");
    };
    this._objectSelectionEventCallback = (
      _objectSelectionEvent: ObjectSelectionEvent
    ) => {
      throw new Error("missing event handler");
    };
  }

  public notifyMovePointEvent(movePointEvent: MovePointEvent): void {
    this._movePointEventCallback(movePointEvent);
  }

  public notifyObjectSelectionEvent(
    objectSelectionEvent: ObjectSelectionEvent
  ): void {
    this._objectSelectionEventCallback(objectSelectionEvent);
  }

  public setMovePointEventHandler(
    callback: (movePointEvent: MovePointEvent) => void
  ): void {
    this._movePointEventCallback = callback;
  }

  public setObjectSelectionEventHandler(
    callback: (objectSelectionEvent: ObjectSelectionEvent) => void
  ): void {
    this._objectSelectionEventCallback = callback;
  }
}
