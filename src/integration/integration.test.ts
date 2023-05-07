import { ElementFactory } from "../factories/ElementFactory";
import { describe, expect, test } from "@jest/globals";
import { fabric } from "fabric";
import { PointSnapFeature } from "../models/painters/features/PointSnapFeature";
import { Painter } from "../models/painters/Painter";
import { ConnectionKind } from "../utils/Constants";
import { MatrixSolverService } from "../services/solvers/MatrixSolverService";
import { SolverService } from "../services/solvers/SolverService";
import { Variable } from "../models/Variable";
import { ConnectionElement } from "../models/diagram_elements/ConnectionElement";
import { Point } from "../models/Point";

describe("Statika", () => {
  let elementFactory: ElementFactory;
  let canvas: fabric.Canvas;
  let pointSnapFeature: PointSnapFeature;
  let painter: Painter;
  let solver: SolverService;

  beforeEach(() => {
    elementFactory = ElementFactory.getInstance();
    elementFactory.reset();

    canvas = new fabric.Canvas(null);
    pointSnapFeature = new PointSnapFeature(elementFactory);
    painter = new Painter(canvas, [], [pointSnapFeature], {
      linkageConfig: {},
      connectionConfig: {},
    });
    solver = new MatrixSolverService();
  });

  test("Should be capable of solving structure with 1 linkage", () => {
    const p1 = elementFactory.buildPoint({ x: 0, y: 0 });
    const p2 = elementFactory.buildPoint({ x: 100, y: 0 });
    const linkage1 = elementFactory.buildLinkage(p1, p2);
    painter.addElement(linkage1);

    const p3 = elementFactory.buildPoint({ x: 50, y: 0 });
    painter.addPointToLinkage(p3, linkage1);

    const f1 = elementFactory.buildExternalForce(10, 5);
    painter.addExternalLoad(p3, f1);

    const connection1 = elementFactory.buildConnection(
      [p1],
      ConnectionKind.PIN
    );
    const connection2 = elementFactory.buildConnection(
      [p2],
      ConnectionKind.HORIZONTAL_ROLLER
    );
    painter.addElement(connection1);
    painter.addElement(connection2);

    const structure = painter.buildStructure();

    const actualSolution = solver.solve(structure);
    const expectedSolution = [
      new Variable("F_P1x", -10),
      new Variable("F_P2x", 0),
      new Variable("F_P1y", -2.5),
      new Variable("F_P2y", -2.5),
      new Variable("F_C1x_ground", -10),
      new Variable("F_C1y_ground", -2.5),
      new Variable("F_C2y_ground", -2.5),
    ];

    expect(actualSolution).toStrictEqual(expectedSolution);
  });

  test("Should be capable of solving structure with moment reactions", () => {
    const p1 = elementFactory.buildPoint({ x: 0, y: 0 });
    const p2 = elementFactory.buildPoint({ x: 100, y: 0 });
    const linkage1 = elementFactory.buildLinkage(p1, p2);
    painter.addElement(linkage1);

    const f1 = elementFactory.buildExternalForce(0, 100);
    painter.addExternalLoad(p2, f1);

    const connection1 = elementFactory.buildConnection(
      [p1],
      ConnectionKind.FIXED
    );
    painter.addElement(connection1);

    const structure = painter.buildStructure();

    const actualSolution = solver.solve(structure);
    const expectedSolution = [
      new Variable("F_P1x", 0),
      new Variable("F_P1y", -100),
      new Variable("M_P1z", -10000),
      new Variable("F_C1x_ground", 0),
      new Variable("F_C1y_ground", -100),
      new Variable("M_C1z_ground", -10000),
    ];

    expect(actualSolution).toStrictEqual(expectedSolution);
  });

  test("Should be capable of building and solving multilinkage structure", () => {
    const p1 = elementFactory.buildPoint({ x: 0, y: 0 });
    const p2 = elementFactory.buildPoint({ x: 100, y: 0 });
    const linkage1 = elementFactory.buildLinkage(p1, p2);
    painter.addElement(linkage1);

    const connection1 = elementFactory.buildConnection(
      [p1],
      ConnectionKind.PIN
    );
    const connection2 = elementFactory.buildConnection(
      [p2],
      ConnectionKind.HORIZONTAL_ROLLER
    );
    painter.addElement(connection1);
    painter.addElement(connection2);

    const p3 = elementFactory.buildPoint({ x: 0, y: 0 });
    const p4 = elementFactory.buildPoint({ x: 100, y: 0 });
    const linkage2 = elementFactory.buildLinkage(p3, p4);
    painter.addElement(linkage2);

    const f1 = elementFactory.buildExternalForce(10, 20);
    painter.addExternalLoad(p4, f1);

    const p5 = elementFactory.buildPoint({ x: 200, y: 200 });
    const p6 = elementFactory.buildPoint({ x: 300, y: 300 });
    const linkage3 = elementFactory.buildLinkage(p5, p6);
    painter.addElement(linkage3);

    drag(p3, 0, 0);
    drag(p4, 0, 100);
    drag(p5, 100, 0);
    drag(p6, 0, 100);

    const structure = painter.buildStructure();

    const actualSolution = solver.solve(structure);
    const expectedSolution = [
      new Variable("F_P1x", -10),
      new Variable("F_P2x", 10),
      new Variable("F_P1y", 0),
      new Variable("F_P2y", 0),
      new Variable("F_P3x", 0),
      new Variable("F_P4x", 0),
      new Variable("F_P3y", -30),
      new Variable("F_P4y", 30),
      new Variable("F_P5x", -10),
      new Variable("F_P6x", 10),
      new Variable("F_P5y", 10),
      new Variable("F_P6y", -10),
      new Variable("F_C1x_ground", -10),
      new Variable("F_C1y_ground", -30),
      new Variable("F_C2y_ground", 10),
    ];

    expect(actualSolution).toStrictEqual(expectedSolution);
  });

  const drag = (draggable: Point | ConnectionElement, x: number, y: number) => {
    const entity = painter.getEntityByName(draggable.name);
    const canvasObject = entity?.getObjectsToDraw();
    if (!canvasObject) {
      return;
    }
    canvasObject.left = x;
    canvasObject.top = y;
    canvas.setActiveObject(canvasObject);

    canvas.fire("object:moving", { target: canvasObject });
    canvas.fire("mouse:up", { target: canvasObject });
  };
});
