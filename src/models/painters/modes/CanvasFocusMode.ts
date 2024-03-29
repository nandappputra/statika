import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { CanvasEntity } from "../../canvas_entities/CanvasEntity";
import { LinkageEntity } from "../../canvas_entities/LinkageEntity";
import { PointEntity } from "../../canvas_entities/PointEntity";
import { ConnectionEntity } from "../../canvas_entities/ConnectionEntity";
import { CanvasMode } from "./CanvasMode";

export class CanvasFocusMode implements CanvasMode {
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

  public activate() {
    this._canvas.off("object:moving");
    this._canvas.off("mouse:up");
    this._canvas.off("selection:updated");
    this._canvas.off("selection:created");
    this._canvas.off("selection:created");
    this._canvas.off("selection:cleared");
    this._canvas.off("mouse:wheel");
    this._canvas.forEachObject((element) => {
      element.lockMovementX = true;
      element.lockMovementY = true;
    });

    this._canvas.on("selection:updated", (event) => {
      this._handleObjectSelectionClearEvent();
      this._handleObjectSelectionEvent(event);
    });
    this._canvas.on("selection:created", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:cleared", () =>
      this._handleObjectSelectionClearEvent()
    );
    this._canvas.on("mouse:wheel", (event) => this._handleMouseScroll(event));
  }

  private _handleObjectSelectionEvent(event: IEvent<MouseEvent>): void {
    const id: unknown = event.selected?.[0].data?.id;
    if (typeof id !== "number") {
      return;
    }

    this._buildShadeAtCurrentScreen();

    const entity = this._entityIdToEntity.get(id);
    if (!entity) {
      return;
    }

    if (entity instanceof LinkageEntity) {
      const pointIds = entity.getAllPoints().map((point) => point.id);
      pointIds.forEach((pointId) => {
        const pointEntity = this._entityIdToEntity.get(pointId);
        if (!pointEntity || !(pointEntity instanceof PointEntity)) {
          return;
        }

        pointEntity.getElement().externalForces.forEach((force) => {
          const forceId = force.id;
          const forceEntity = this._entityIdToEntity.get(forceId);
          if (!forceEntity) {
            return;
          }
          forceEntity.moveToFront();
          this._lastSelected.push(forceEntity);
        });

        this._lastSelected.push(pointEntity);
        pointEntity.moveToFront();
        pointEntity.buildInternalReactions();
      });
    } else if (entity instanceof ConnectionEntity) {
      entity.buildBoundaryCondition();
      this._lastSelected.push(entity);

      const pointIds = entity.getAllPoints().map((point) => point.id);
      pointIds.forEach((pointId) => {
        const pointEntity = this._entityIdToEntity.get(pointId);
        if (!pointEntity || !(pointEntity instanceof PointEntity)) {
          return;
        }

        pointEntity.getElement().externalForces.forEach((force) => {
          const forceId = force.id;
          const forceEntity = this._entityIdToEntity.get(forceId);
          if (!forceEntity) {
            return;
          }
          forceEntity.moveToFront();
          this._lastSelected.push(forceEntity);
        });

        this._lastSelected.push(pointEntity);
        pointEntity.buildInvertedInternalReactions();
      });

      entity.getElement().externalForces.forEach((force) => {
        const forceId = force.id;
        const forceEntity = this._entityIdToEntity.get(forceId);
        if (!forceEntity) {
          return;
        }
        forceEntity.moveToFront();
        this._lastSelected.push(forceEntity);
      });
    }

    this._canvas.renderAll();
  }

  private _handleObjectSelectionClearEvent(): void {
    this._setShadeVisibility(false);
    this._lastSelected.forEach((entity) => {
      entity.returnToOriginalPosition();

      if (entity instanceof PointEntity) {
        entity.removeInternalReactions();
      } else if (entity instanceof ConnectionEntity) {
        entity.removeBoundaryCondition();
      }
    });
    this._lastSelected = [];
    this._canvas.renderAll();
  }

  private _handleMouseScroll(event: IEvent<WheelEvent>) {
    if (!this._canvas.viewportTransform) {
      return;
    }

    const viewportTransform = this._canvas.viewportTransform.slice();
    viewportTransform[4] -= event.e.deltaX;
    viewportTransform[5] -= event.e.deltaY;

    this._shade.left = (this._shade.left || 0) + event.e.deltaX;
    this._shade.top = (this._shade.top || 0) - event.e.deltaY;

    this._canvas.setViewportTransform(viewportTransform);
  }

  public disable() {
    this._canvas.off();

    for (const [, entity] of this._entityIdToEntity) {
      if (entity instanceof PointEntity) {
        entity.getElement().clearSolution();
      }
    }

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
