import { LinkageElement } from "../diagram_elements/LinkageElement";
import { LinkageEntity } from "../canvas_entities/LinkageEntity";
import { MovePointEvent } from "../Event";
import { ConnectionElement } from "../diagram_elements/ConnectionElement";
import { ConnectionEntity } from "../canvas_entities/ConnectionEntity";
import { IEvent } from "fabric/fabric-impl";
import { ConnectionKind, EntityPrefix, USER_ID } from "../../utils/Constants";
import { DiagramElement } from "../diagram_elements/DiagramElement";
import { CanvasEntity } from "../canvas_entities/CanvasEntity";
import { EventMediator } from "./EventMediator";
import { Point } from "../diagram_elements/Point";
import { IPolylineOptions } from "fabric/fabric-impl";
import { ICircleOptions } from "fabric/fabric-impl";
import { ExternalForce } from "../diagram_elements/ExternalForce";
import { ExternalForceEntity } from "../canvas_entities/ExternalForceEntity";
import { PointEntity } from "../canvas_entities/PointEntity";
import { Structure } from "../Structure";
import { CanvasBinder } from "./CanvasBinder";
import { CanvasEventSubscriber } from "./canvas_event_subscribers/CanvasEventSubscriber";
import { CanvasPanController } from "./CanvasPanController";
import { fabric } from "fabric";
import { CanvasFocusController } from "./CanvasFocusController";

interface ValidCanvasEntity {
  name: string;
  id: number;
  type: string;
  pointId?: number;
}

export interface EntityConfig {
  linkageConfig: IPolylineOptions;
  connectionConfig: ICircleOptions;
}

export class Painter implements EventMediator, CanvasBinder {
  private _canvas: fabric.Canvas;
  private _eventSubscribers: CanvasEventSubscriber[];
  private _entityIdToEntity: Map<number, CanvasEntity>;
  private _pointIdToPoint: Map<number, Point>;
  private _entityConfig: EntityConfig;

  private _pointIdToLinkageEntity: Map<number, LinkageEntity>;
  private _pointIdToConnectionEntity: Map<number, ConnectionEntity>;
  private _locationIdToExternalForceEntity: Map<
    number,
    Set<ExternalForceEntity>
  >;
  private _pointIdToPointEntity: Map<number, PointEntity>;

  private _canvasPanController: CanvasPanController;
  private _canvasFocusController: CanvasFocusController;

  private _isDragging = false;

  constructor(
    canvas: fabric.Canvas,
    eventSubscriber: CanvasEventSubscriber[],
    entityConfig: EntityConfig
  ) {
    this._canvas = canvas;
    this._eventSubscribers = eventSubscriber;
    this._entityIdToEntity = new Map<number, CanvasEntity>();
    this._pointIdToPoint = new Map<number, Point>();
    this._entityConfig = entityConfig;

    this._pointIdToLinkageEntity = new Map<number, LinkageEntity>();
    this._pointIdToConnectionEntity = new Map<number, ConnectionEntity>();
    this._locationIdToExternalForceEntity = new Map<
      number,
      Set<ExternalForceEntity>
    >();
    this._pointIdToPointEntity = new Map<number, PointEntity>();
    this._setupEventHandler();
    this._canvasPanController = new CanvasPanController(canvas, () =>
      this._setupEventHandler()
    );
    this._canvasFocusController = new CanvasFocusController(
      canvas,
      () => this._setupEventHandler(),
      this._entityIdToEntity
    );
  }

  private _isValidCanvasEntity(
    canvasObjectData: unknown
  ): canvasObjectData is ValidCanvasEntity {
    if (!canvasObjectData || typeof canvasObjectData !== "object") {
      return false;
    }

    if (
      !("name" in canvasObjectData) ||
      !("id" in canvasObjectData) ||
      !("type" in canvasObjectData)
    ) {
      return false;
    }

    if (
      !(typeof canvasObjectData.name === "string") ||
      !(typeof canvasObjectData.id === "number") ||
      !(typeof canvasObjectData.type === "string") ||
      !Object.values<string>(EntityPrefix).includes(canvasObjectData.type)
    ) {
      return false;
    }

    return true;
  }

  private _setupEventHandler() {
    this._canvas.off();
    this._canvas.on("object:moving", (event) =>
      this._handleObjectMotionEvent(event)
    );
    this._canvas.on("mouse:up", (event) => this._handleMouseUpEvent(event));
    this._canvas.on("selection:updated", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:created", (event) =>
      this._handleObjectSelectionEvent(event)
    );
    this._canvas.on("selection:cleared", () =>
      this._handleObjectSelectionClearEvent()
    );
    this._canvas.on("mouse:wheel", (event) => this._handleMouseScroll(event));
  }

  private _handleMouseUpEvent(_event: IEvent<MouseEvent>) {
    if (!this._isDragging) {
      return;
    }

    const activeObjectData = this._canvas.getActiveObject()?.data as unknown;
    if (!this._isValidCanvasEntity(activeObjectData)) {
      return;
    }

    const id = activeObjectData.id;
    const canvasEntity = this._entityIdToEntity.get(id);
    if (!canvasEntity) {
      return;
    }

    this._eventSubscribers.forEach((feature) =>
      feature.handleObjectDrop(this, {
        id,
        entity: canvasEntity,
      })
    );
    this._isDragging = false;
  }

  private _handleObjectSelectionEvent(_event: IEvent<MouseEvent>) {
    const activeObjectData = this._canvas.getActiveObject()?.data as unknown;
    if (!this._isValidCanvasEntity(activeObjectData)) {
      return;
    }

    const id = activeObjectData.id;
    const canvasEntity = this._entityIdToEntity.get(id);
    if (!canvasEntity) {
      return;
    }

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleObjectSelectionEvent({
        id,
        entity: canvasEntity,
      });
    });
  }

  private _handleObjectSelectionClearEvent() {
    this._isDragging = false;
    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleObjectSelectionClearEvent();
    });
  }

  private _handleMouseScroll(event: IEvent<WheelEvent>) {
    if (!this._canvas.viewportTransform) {
      return;
    }

    const viewportTransform = this._canvas.viewportTransform.slice();
    viewportTransform[4] -= event.e.deltaX;
    viewportTransform[5] -= event.e.deltaY;

    this._canvas.setViewportTransform(viewportTransform);
  }

  public getAllEntityName() {
    return [...this._entityIdToEntity.values()].map((entity) => entity.name);
  }

  public getAllEntities() {
    return [...this._entityIdToEntity.values()];
  }

  public getEntityById(id: number) {
    return this._entityIdToEntity.get(id);
  }

  public setFocus(id: number) {
    const entity = this._entityIdToEntity.get(id);
    if (!entity) {
      throw new Error("failed to set focus: object not found");
    }

    this._canvas.setActiveObject(entity.getObjectsToDraw());
    this._canvas.renderAll();
  }

  private _handleObjectMotionEvent(event: IEvent<MouseEvent>) {
    this._isDragging = true;
    const metadata: unknown = event.target?.data;
    const coordinate = event.target?.getCenterPoint();

    if (typeof coordinate === "undefined") {
      return;
    }

    if (!this._isValidCanvasEntity(metadata)) {
      return;
    }

    this.updatePointPosition({
      id: metadata.pointId || metadata.id,
      source: USER_ID,
      coordinate: {
        x: coordinate.x,
        y: coordinate.y,
      },
    });
  }

  private _addCanvasEntityToMap(key: number, canvasEntity: CanvasEntity) {
    if (canvasEntity instanceof LinkageEntity) {
      this._pointIdToLinkageEntity.set(key, canvasEntity);
    } else if (canvasEntity instanceof ConnectionEntity) {
      this._pointIdToConnectionEntity.set(key, canvasEntity);
    }
  }

  public updatePointPosition(movePointEvent: MovePointEvent) {
    this._updateCanvasEntity(movePointEvent);

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handlePointUpdate(this, movePointEvent);
    });

    this._canvas.renderAll();
  }

  private _updateCanvasEntity(movePointEvent: MovePointEvent) {
    const linkageEntity = this._pointIdToLinkageEntity.get(movePointEvent.id);
    if (linkageEntity && movePointEvent.source != linkageEntity.id) {
      linkageEntity.updatePosition(movePointEvent);
    }

    const pointEntity = this._pointIdToPointEntity.get(movePointEvent.id);
    if (pointEntity && movePointEvent.source != pointEntity.id) {
      pointEntity.updatePosition(movePointEvent);
    }

    const forceEntitySet = this._locationIdToExternalForceEntity.get(
      movePointEvent.id
    );
    if (forceEntitySet) {
      forceEntitySet.forEach((force) => {
        force.updatePosition(movePointEvent);
      });
    }

    const connection = this._pointIdToConnectionEntity.get(movePointEvent.id);
    if (connection && movePointEvent.source != connection.id) {
      connection.updatePosition(movePointEvent);
    }
  }

  public addExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ) {
    let externalForce = this._entityIdToEntity.get(
      externalLoad.id
    ) as ExternalForceEntity;
    if (externalForce === undefined) {
      externalForce = new ExternalForceEntity(
        externalLoad,
        location,
        this,
        this._canvas
      );
      this._canvas.add(externalForce.getObjectsToDraw());
    }

    this._entityIdToEntity.set(externalForce.id, externalForce);

    externalForce.location = location;
    const affectedForces = this._locationIdToExternalForceEntity.get(
      location.id
    );
    if (!affectedForces || affectedForces.size == 0) {
      const forceSet = new Set<ExternalForceEntity>();
      forceSet.add(externalForce);
      this._locationIdToExternalForceEntity.set(location.id, forceSet);
    } else {
      affectedForces.add(externalForce);
    }

    location.addExternalForce(externalLoad);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handleForceAddition(this, location, externalLoad)
    );
  }

  public removeExternalLoad(
    location: Point | ConnectionElement,
    externalLoad: ExternalForce
  ) {
    const entity = this._entityIdToEntity.get(externalLoad.id);
    const affectedForce = this._locationIdToExternalForceEntity.get(
      location.id
    );
    if (!affectedForce || !entity) {
      throw new Error("failed to remove force: unrecognized force or location");
    }

    this._entityIdToEntity.delete(externalLoad.id);
    this._locationIdToExternalForceEntity
      .get(location.id)
      ?.delete(entity as ExternalForceEntity);
    this._canvas.remove(entity.getObjectsToDraw());
    location.removeExternalForce(externalLoad);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handleForceRemoval(this, location, externalLoad)
    );

    this._canvas.renderAll();
  }

  public addElement(diagramElement: DiagramElement) {
    let entity: CanvasEntity;

    if (diagramElement instanceof LinkageElement) {
      entity = new LinkageEntity(
        diagramElement,
        this,
        this._entityConfig.linkageConfig,
        this._canvas
      );
    } else if (diagramElement instanceof ConnectionElement) {
      entity = new ConnectionEntity(diagramElement, this, this._canvas);
    } else {
      throw new Error("unknown type of element");
    }

    this._entityIdToEntity.set(diagramElement.id, entity);
    this._canvas.add(entity.getObjectsToDraw());

    diagramElement.points.forEach((point) => {
      this._addCanvasEntityToMap(point.id, entity);
      this._pointIdToPoint.set(point.id, point);

      if (!this._pointIdToPointEntity.get(point.id)) {
        const newPoint = new PointEntity(point, this, this._canvas);
        this._pointIdToPointEntity.set(point.id, newPoint);
        this._entityIdToEntity.set(point.id, newPoint);

        this._canvas.add(newPoint.getObjectsToDraw());
      }

      if (diagramElement instanceof ConnectionElement) {
        this._pointIdToPointEntity.get(point.id)?.setVisible(false);
      }
    });

    if (diagramElement instanceof ConnectionElement) {
      const forces = [...diagramElement.externalForces];
      forces.forEach((force) => {
        diagramElement.removeExternalForce(force);
        this.addExternalLoad(diagramElement, force);
      });
    }

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleElementAddition(this, diagramElement);
    });

    return entity;
  }

  public removeElement(diagramElement: DiagramElement) {
    const entity = this._entityIdToEntity.get(diagramElement.id);
    if (!entity) {
      throw new Error("no such entity");
    }

    if (entity instanceof ConnectionEntity) {
      const forces = [...entity.getElement().externalForces];
      forces.forEach((force) => {
        this.removeExternalLoad(entity.getElement(), force);
      });
    }

    const points = [...diagramElement.points];

    points.forEach((point) => {
      const pointEntity = this._pointIdToPointEntity.get(point.id);
      if (!pointEntity) {
        return;
      }

      if (entity instanceof LinkageEntity) {
        const affectedConnection = this._pointIdToConnectionEntity.get(
          point.id
        );
        if (affectedConnection) {
          this.removePointFromConnection(
            point,
            affectedConnection.getElement()
          );
        }
        const affectedForce = this._locationIdToExternalForceEntity.get(
          point.id
        );
        affectedForce?.forEach((force) =>
          this.removeExternalLoad(point, force.getElement())
        );

        this._pointIdToLinkageEntity.delete(point.id);

        this._canvas.remove(pointEntity.getObjectsToDraw());

        this._pointIdToLinkageEntity.delete(point.id);
        this._entityIdToEntity.delete(point.id);
        this._pointIdToPointEntity.delete(point.id);
      } else if (entity instanceof ConnectionEntity) {
        this._pointIdToConnectionEntity.delete(point.id);
        this.removePointFromConnection(point, entity.getElement());
      }
    });

    this._entityIdToEntity.delete(diagramElement.id);
    this._canvas.remove(entity.getObjectsToDraw());

    this._eventSubscribers.forEach((subscriber) => {
      subscriber.handleElementRemoval(this, diagramElement);
    });

    this._canvas.renderAll();
  }

  public getCanvasEntity(diagramElement: DiagramElement) {
    return this._entityIdToEntity.get(diagramElement.id);
  }

  public getPoint(pointId: number) {
    return this._pointIdToPoint.get(pointId);
  }

  public addPointToLinkage(point: Point, linkage: LinkageElement) {
    const entity = this._entityIdToEntity.get(linkage.id);
    if (!entity || !(entity instanceof LinkageEntity)) {
      throw new Error(
        "failed to add point to linkage: missing or invalid entity found"
      );
    }

    this._pointIdToPoint.set(point.id, point);
    this._pointIdToLinkageEntity.set(point.id, entity);
    entity.addPoint(point);

    const pointEntity = new PointEntity(point, this, this._canvas);
    this._canvas.add(pointEntity.getObjectsToDraw());
    this._pointIdToPointEntity.set(point.id, pointEntity);
    this._entityIdToEntity.set(point.id, pointEntity);

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointAddition(this, linkage, point)
    );
  }

  public removePointFromLinkage(point: Point, linkage: LinkageElement) {
    const affectedPoint = this._pointIdToPointEntity.get(point.id);
    if (!affectedPoint) {
      throw new Error(
        "failed to remove point from linkage: unrecognized point"
      );
    }

    const affectedConnection = this._pointIdToConnectionEntity.get(point.id);
    if (affectedConnection) {
      this.removePointFromConnection(point, affectedConnection.getElement());
    }

    this._entityIdToEntity.delete(point.id);
    this._pointIdToPointEntity.delete(point.id);
    this._canvas.remove(affectedPoint.getObjectsToDraw());

    this._pointIdToPoint.delete(point.id);

    const targetLinkage = this._pointIdToLinkageEntity.get(point.id);
    targetLinkage?.deletePoint(point);

    const affectedForce = this._locationIdToExternalForceEntity.get(point.id);
    affectedForce?.forEach((force) =>
      this.removeExternalLoad(point, force.getElement())
    );

    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointRemoval(this, linkage, point)
    );

    if (targetLinkage && targetLinkage?.getAllPoints().length == 1) {
      this.removeElement(targetLinkage.getElement());
    }
  }

  public addPointToConnection(point: Point, connection: ConnectionElement) {
    const affectedPoint = this.getEntityById(point.id);
    const affectedConnection = this.getCanvasEntity(connection);
    if (
      !(affectedConnection instanceof ConnectionEntity) ||
      !(affectedPoint instanceof PointEntity)
    ) {
      throw new Error(
        "failed to add point to connection: missing or invalid entity"
      );
    }

    affectedPoint.setVisible(false);
    this._pointIdToConnectionEntity.set(point.id, affectedConnection);
    affectedConnection.addPoint(point);

    const forces = affectedPoint.getElement().externalForces;
    forces.forEach((force) => {
      this.removeExternalLoad(affectedPoint.getElement(), force);
      this.addExternalLoad(affectedConnection.getElement(), force);
    });

    this._canvas.renderAll();
  }

  public removePointFromConnection(
    point: Point,
    connection: ConnectionElement
  ) {
    const affectedPoint = this.getEntityById(point.id);
    const affectedConnection = this.getCanvasEntity(connection);
    if (
      !(affectedConnection instanceof ConnectionEntity) ||
      !(affectedPoint instanceof PointEntity)
    ) {
      throw new Error(
        "failed to remove point to connection: missing or invalid entity"
      );
    }

    affectedPoint.setVisible(true);

    this._pointIdToConnectionEntity.delete(point.id);
    affectedConnection.deletePoint(point);
    if (affectedConnection.getAllPoints().length === 0) {
      this.removeElement(connection);
    }
    this._eventSubscribers.forEach((subscriber) =>
      subscriber.handlePointDisconnection(this, connection, point)
    );
  }

  public getLinkageFromPoint(point: Point) {
    return this._pointIdToLinkageEntity.get(point.id);
  }

  public getCanvasCenter() {
    return this._canvas.getVpCenter();
  }

  public updateForce(externalForce: ExternalForce, F_x: number, F_y: number) {
    const externalForceEntity = this._entityIdToEntity.get(externalForce.id);
    if (!(externalForceEntity instanceof ExternalForceEntity)) {
      throw new Error("failed to update force: missing or invalid force");
    }

    externalForceEntity.setForceComponents(F_x, F_y);
    this._canvas.renderAll();
  }

  public changeConnectionType(
    connection: ConnectionElement,
    connectionType: ConnectionKind
  ) {
    const connectionEntity = this._entityIdToEntity.get(connection.id);
    if (!connectionEntity || !(connectionEntity instanceof ConnectionEntity)) {
      throw new Error(
        "failed to add change connection type: missing or invalid entity found"
      );
    }

    this._canvas.remove(connectionEntity.getObjectsToDraw());

    connectionEntity.changeConnectionType(connectionType);

    this._canvas.add(connectionEntity.getObjectsToDraw());

    this._canvas.renderAll();
  }

  public buildStructure() {
    const linkages: LinkageElement[] = [];
    const connections: ConnectionElement[] = [];

    this._entityIdToEntity.forEach((entity) => {
      if (entity instanceof LinkageEntity) {
        linkages.push(entity.getElement());
      } else if (entity instanceof ConnectionEntity) {
        connections.push(entity.getElement());
      }
    });

    return new Structure(linkages, connections);
  }

  public reset() {
    this._canvas.clear();
    this._entityIdToEntity = new Map<number, CanvasEntity>();
    this._pointIdToPoint = new Map<number, Point>();

    this._pointIdToLinkageEntity = new Map<number, LinkageEntity>();
    this._pointIdToConnectionEntity = new Map<number, ConnectionEntity>();
    this._locationIdToExternalForceEntity = new Map<
      number,
      Set<ExternalForceEntity>
    >();
    this._pointIdToPointEntity = new Map<number, PointEntity>();
    this._setupEventHandler();
    this._canvasPanController = new CanvasPanController(this._canvas, () =>
      this._setupEventHandler()
    );
  }

  public loadStructure(structure: Structure) {
    this.reset();

    const linkages = structure.linkages;
    linkages.forEach((linkage) => this.addElement(linkage));

    const connections = structure.connections;
    connections.forEach((linkage) => this.addElement(linkage));
  }

  public clearFocus() {
    this._canvas.discardActiveObject();
  }

  public setPanningMode(isActive: boolean) {
    this._canvasPanController.togglePanMode(isActive);
  }

  public toggleFocusMode(isActive: boolean) {
    this._canvasFocusController.toggle(isActive);
  }

  public async toDataURI() {
    const dataUrl = this._canvas.toDataURL({
      format: "png",
      multiplier: 0.5,
      withoutTransform: true,
    });

    return await this._flipY(dataUrl);
  }

  private _flipY(dataUrl: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();

    const promise = new Promise<string>((resolve) => {
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.scale(1, -1);
        ctx.drawImage(image, 0, -image.height);
        resolve(canvas.toDataURL());
      };
    });

    image.src = dataUrl;

    return promise;
  }
}
