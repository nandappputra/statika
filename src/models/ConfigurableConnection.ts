import { fabric } from "fabric";

export class ConfigurableConnection {
  private _name: string;
  private _icon: fabric.Object;

  constructor(name: string, x: number, y: number, pointName: string) {
    this._name = name;
    this._icon = new fabric.Circle({
      radius: 5,
      originX: "center",
      originY: "center",
      left: x,
      top: y,
      data: { name, pointName },
    });
    this._icon.hasControls = false;
  }

  public setPosition(x: number, y: number) {
    this._icon.set("left", x);
    this._icon.set("top", y);
    this.icon.setCoords();
  }

  get icon() {
    return this._icon;
  }
}
