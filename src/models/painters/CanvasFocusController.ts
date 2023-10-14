import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { LinkageEntity } from "../canvas_entities/LinkageEntity";

export class CanvasFocusController {
  private _canvas: fabric.Canvas;
  private _reconstructEventListener: () => void;
  private _shade: fabric.Object;
  private _entityIdToEntity: Map<number, CanvasEntity>;
  private _lastSelected: CanvasEntity[] = [];

  constructor(
    canvas: fabric.Canvas,
    reconstructEventListener: () => void,
    entityIdToEntity: Map<number, CanvasEntity>
  ) {
    this._canvas = canvas;
    this._reconstructEventListener = reconstructEventListener;
    this._shade = this._buildShade();
    this._entityIdToEntity = entityIdToEntity;
  }

  public toggle(isActive: boolean) {
    if (isActive) {
      this._activateFocusMode();
    } else {
      this._disableFocusMode();
    }
  }

  private _activateFocusMode() {
    this._canvas.off();
    this._canvas.forEachObject((element) => {
      element.lockMovementX = true;
      element.lockMovementY = true;
    });

    this._canvas.on("selection:updated", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:created", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:cleared", () =>
      this._handleObjectSelectionClearEvent()
    );
  }

  private _handleObjectSelectionEvent(event: IEvent<MouseEvent>): void {
    const id: unknown = event.selected?.[0].data?.id;
    if (typeof id !== "number") {
      return;
    }

    console.log("EVENT", event.selected?.[0].data?.id);
    console.log("BUILDING SHADE");
    this._buildShadeAtCurrentScreen();

    const entity = this._entityIdToEntity.get(id);
    if (!entity) {
      return;
    }

    if (entity instanceof LinkageEntity) {
      const pointIds = entity.getAllPoints().map((point) => point.id);
      pointIds.forEach((pointId) => {
        const pointEntity = this._entityIdToEntity.get(pointId);
        if (!pointEntity) {
          return;
        }

        this._lastSelected.push(pointEntity);
        pointEntity.moveToFront();
      });
    }

    this._canvas.renderAll();
  }

  private _handleObjectSelectionClearEvent(): void {
    console.log("FOCUS CLEARED");
    this._setShadeVisibility(false);
    this._lastSelected.forEach((entity) => entity.returnToOriginalPosition());
    this._lastSelected = [];
    this._canvas.renderAll();
  }

  private _disableFocusMode() {
    this._canvas.off();
    this._reconstructEventListener();
  }

  private _buildShade() {
    const width = this._canvas.getWidth() + 10;
    const height = this._canvas.getHeight() + 10;

    const shade = new fabric.Rect({
      height,
      width,
      opacity: 0.7,
      visible: false,
      selectable: false,
      hasControls: false,
      fill: "white",
      hoverCursor: "pointer",
    });

    this._canvas.add(shade);

    this._buildEventListener(this._canvas, shade);

    return shade;
  }

  private _buildEventListener(canvas: fabric.Canvas, shade: fabric.Object) {
    window.addEventListener(
      "resize",
      function (_event) {
        shade.height = window.innerHeight + 10;
        shade.width = window.innerWidth + 10;
        const center = canvas.getVpCenter();
        shade.left = center.x - (canvas.getWidth() + 10) / 2;
        shade.top = center.y - (canvas.getHeight() + 10) / 2;
        canvas.renderAll();
      },
      true
    );
  }

  private _setShadeVisibility(isVisible: boolean) {
    this._shade.visible = isVisible;
  }

  private _buildShadeAtCurrentScreen() {
    const center = this._canvas.getVpCenter();
    this._shade.left = center.x - (this._canvas.getWidth() + 10) / 2;
    this._shade.top = center.y - (this._canvas.getHeight() + 10) / 2;
    this._shade.bringToFront();
    this._setShadeVisibility(true);
  }
}
