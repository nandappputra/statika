import { CanvasMode } from "./CanvasMode";

export class CanvasDefaultMode implements CanvasMode {
  private _canvas: fabric.Canvas;
  private _reconstructEventListener: () => void;

  constructor(canvas: fabric.Canvas, reconstructEventListener: () => void) {
    this._canvas = canvas;
    this._reconstructEventListener = reconstructEventListener;
  }

  public activate() {
    this._canvas.off();
    this._reconstructEventListener();
  }

  public disable() {
    this._canvas.off();
  }
}
