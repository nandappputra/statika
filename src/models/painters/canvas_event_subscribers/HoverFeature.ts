import { fabric } from "fabric";
import { USER_ID } from "../../../utils/Constants";
import { ObjectOverEvent } from "../../Event";
import { BaseSubscriber } from "./BaseSubscriber";

export class HoverFeature extends BaseSubscriber {
  private TEXT_GAP = 5;
  private _canvas: fabric.Canvas;
  private _icon: fabric.Object[] = [];

  constructor(canvas: fabric.Canvas) {
    super();
    this._canvas = canvas;
  }

  handleObjectOverEvent(objectOverEvent: ObjectOverEvent): void {
    this._drawIcon(
      objectOverEvent.name,
      objectOverEvent.top,
      objectOverEvent.height,
      objectOverEvent.width,
      objectOverEvent.left
    );
  }

  handleObjectOutEvent(): void {
    this._canvas.remove(...this._icon);
    this._icon = [];
  }

  private _drawIcon(
    name: string,
    top: number,
    height: number,
    width: number,
    left: number
  ) {
    const text = new fabric.Text(" " + name + " ", {
      fill: "white",
      textBackgroundColor: "grey",
      fontFamily: "helvetica",
      fontSize: 14,
      textAlign: "center",
      top: top + height + this.TEXT_GAP,
      flipY: true,
      data: { id: USER_ID },
    });
    const textWidth = text.width || 0;
    text.left = left + width / 2 - textWidth / 2;

    this._icon.push(text);
    this._canvas.add(text);
    this._canvas.renderAll();
  }
}
