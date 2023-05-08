import { CanvasEventSubscriber } from "./canvas_event_subscribers/CanvasEventSubscriber";

export interface CanvasEventPublisher {
  subscribe(subscriber: CanvasEventSubscriber): void;
}
