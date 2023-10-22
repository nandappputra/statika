import { IEvent } from "fabric/fabric-impl";
import { CanvasMode } from "./CanvasMode";

export class CanvasPanMode implements CanvasMode {
  private _canvas: fabric.Canvas;
  private _reconstructEventListener: () => void;
  private _isDragging = false;
  private _lastX = 0;
  private _lastY = 0;

  constructor(canvas: fabric.Canvas, reconstructEventListener: () => void) {
    this._canvas = canvas;
    this._reconstructEventListener = reconstructEventListener;
  }

  public activate() {
    this._canvas.off();
    this._canvas.forEachObject((element) => (element.selectable = false));

    this._canvas.on("mouse:down", (event) => this._handleMouseDown(event));
    this._canvas.on("mouse:move", (event) => this._handleMouseDrag(event));
    this._canvas.on("mouse:up", (_event) => this._handleMouseUp());
    this._canvas.defaultCursor = "move";
  }

  public disable() {
    this._canvas.off();
    this._canvas.forEachObject((element) => (element.selectable = true));
    this._reconstructEventListener();
    this._canvas.defaultCursor = "default";
  }

  private _handleMouseDown(event: IEvent<MouseEvent>) {
    this._isDragging = true;
    this._lastX = event.e.clientX;
    this._lastY = event.e.clientY;
  }

  private _handleMouseDrag(event: IEvent<MouseEvent>) {
    if (!this._isDragging || !this._canvas.viewportTransform) {
      return;
    }

    const viewportTransform = this._canvas.viewportTransform.slice();
    viewportTransform[4] += event.e.clientX - this._lastX;
    viewportTransform[5] += event.e.clientY - this._lastY;

    this._lastX = event.e.clientX;
    this._lastY = event.e.clientY;

    this._canvas.setViewportTransform(viewportTransform);
  }

  private _handleMouseUp() {
    this._isDragging = false;
  }
}
