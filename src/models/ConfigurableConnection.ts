import { fabric } from "fabric";

export class ConfigurableConnection {
  private _name: string;
  private _icon: fabric.Object;

  constructor(name: string) {
    this._name = name;
    this._icon = new fabric.Circle({
      radius: 5,
      originX: "center",
      originY: "center",
    });
    this._icon.controls = {};
  }

  public setPosition(x: number, y: number) {
    this._icon.set("left", x);
    this._icon.set("top", y);
  }

  get icon() {
    return this._icon;
  }
}
