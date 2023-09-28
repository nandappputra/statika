import { Container } from "@mui/material";
import { fabric } from "fabric";
import TitleBar from "./components/TitleBar";
import ApplicationCanvas from "./components/ApplicationCanvas";
import { MovePointEvent, ObjectSelectionEvent } from "./models/Event";
import { EntityConfig, Painter } from "./models/painters/Painter";
import { useEffect, useState } from "react";
import { ElementFactory } from "./factories/ElementFactory";
import { CANVAS_ID, ConnectionKind, USER } from "./utils/Constants";
import EntityList from "./components/EntityList";
import SelectedEntity from "./components/SelectedEntity";
import { LinkageEntity } from "./models/canvas_entities/LinkageEntity";
import { ConnectionEntity } from "./models/canvas_entities/ConnectionEntity";
import { PointEntity } from "./models/canvas_entities/PointEntity";
import { ExternalForceEntity } from "./models/canvas_entities/ExternalForceEntity";
import { Coordinate } from "./models/Coordinate";
import { SolveButton } from "./components/SolveButton";
import { MatrixSolverService } from "./services/solvers/MatrixSolverService";
import { CoordinateReference } from "./components/CoordinateReference";
import { SolutionTable } from "./components/SolutionTable";
import { Variable } from "./models/Variable";
import { expressEquationsInMatrixMultiplication } from "./utils/SolverUtils";
import About from "./components/About";
import Tutorial from "./components/Tutorial";
import { PointSnapFeature } from "./models/painters/canvas_event_subscribers/PointSnapFeature";
import { GUISynchronizationFeature } from "./models/painters/canvas_event_subscribers/GUISynchronizationFeature";
import { DiagramElement } from "./models/diagram_elements/DiagramElement";
import { LinkageElement } from "./models/diagram_elements/LinkageElement";
import { Point } from "./models/diagram_elements/Point";
import { ConnectionElement } from "./models/diagram_elements/ConnectionElement";
import { ExternalForce } from "./models/diagram_elements/ExternalForce";

function App() {
  let canvasRendered = false;

  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [solutionOpen, setSolutionOpen] = useState<boolean>(false);

  const [entityList, setEntityList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedX, setSelectedX] = useState<number>(0);
  const [selectedY, setSelectedY] = useState<number>(0);

  const [solved, setSolved] = useState<boolean>(false);
  const [solution, setSolution] = useState<Variable[]>([]);

  const [painterState, setPainterState] = useState<Painter | undefined>();
  const [elementFactoryState] = useState<ElementFactory>(
    ElementFactory.getInstance()
  );

  useEffect(() => {
    if (!canvasRendered) {
      initCanvas();
      canvasRendered = true;
    }
  }, []);

  const initCanvas = () => {
    const canvas = new fabric.Canvas(CANVAS_ID, {
      backgroundColor: "tomato",
      width: window.innerWidth,
      height: window.innerHeight,
      viewportTransform: [
        1,
        0,
        0,
        -1,
        window.innerWidth / 2,
        window.innerHeight / 2,
      ],
    });

    window.addEventListener(
      "resize",
      function (_event) {
        canvas.setHeight(window.innerHeight);
        canvas.setWidth(window.innerWidth);
      },
      true
    );

    canvas.selection = false;
    canvas.skipOffscreen = false;

    const elementFactory = ElementFactory.getInstance();
    const entityConfig: EntityConfig = {
      linkageConfig: {
        stroke: "black",
        strokeWidth: 3,
        fill: "white",
        strokeLineCap: "round",
        hoverCursor: "pointer",
        perPixelTargetFind: true,
      },

      connectionConfig: {},
    };

    const movePointEventCallback = (movePointEvent: MovePointEvent) => {
      setSelectedX(movePointEvent.coordinate.x);
      setSelectedY(movePointEvent.coordinate.y);
    };

    const objectSelectionEventCallback = (
      objectSelectionEvent: ObjectSelectionEvent
    ) => {
      setSelectedName(objectSelectionEvent.name);
    };

    const objectSelectionClearCallback = () => {
      setSelectedName("");

      setSolved(false);
      setSolution([]);
      setSolutionOpen(false);
    };

    const elementAdditionCallback = (
      painter: Painter,
      _element: DiagramElement
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const elementRemovalCallback = (
      painter: Painter,
      _element: DiagramElement
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const pointAdditionCallback = (
      painter: Painter,
      _linkage: LinkageElement,
      _point: Point
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const pointRemovalCallback = (
      painter: Painter,
      _linkage: LinkageElement,
      _point: Point
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const forceAdditionCallback = (
      painter: Painter,
      _location: Point | ConnectionElement,
      _externalForce: ExternalForce
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const forceRemovalCallback = (
      painter: Painter,
      _location: Point | ConnectionElement,
      _externalForce: ExternalForce
    ) => {
      setEntityList(painter.getAllEntityName());
    };

    const pointSnapFeature = new PointSnapFeature(elementFactory);
    const guiSynchronizationFeature = new GUISynchronizationFeature(
      movePointEventCallback,
      objectSelectionEventCallback,
      objectSelectionClearCallback,
      elementAdditionCallback,
      elementRemovalCallback,
      pointAdditionCallback,
      pointRemovalCallback,
      forceAdditionCallback,
      forceRemovalCallback
    );

    const painter = new Painter(
      canvas,
      [pointSnapFeature, guiSynchronizationFeature],
      entityConfig
    );

    setPainterState(painter);
  };

  const handleSelection = (name: string): void => {
    setSolved(false);
    setSolution([]);
    setSolutionOpen(false);
    painterState?.setFocus(name);
  };

  const buildLinkage = (): void => {
    const centerCoordinate = painterState?.getCanvasCenter();
    if (!centerCoordinate || !elementFactoryState) {
      return;
    }

    const point1 = elementFactoryState.buildPoint({
      x: centerCoordinate.x - 100,
      y: centerCoordinate.y - 100,
    });

    const point2 = elementFactoryState.buildPoint({
      x: centerCoordinate.x + 100,
      y: centerCoordinate.y + 100,
    });

    const linkage = elementFactoryState.buildLinkage(point1, point2);
    painterState?.addElement(linkage);
    painterState?.setFocus(linkage.name);
  };

  const buildConnection = (pointName: string) => {
    const point = painterState?.getPoint(pointName);
    if (!point) {
      return;
    }

    const connectionElement = elementFactoryState.buildConnection(
      [point],
      ConnectionKind.PIN_JOINT
    );

    painterState?.addElement(connectionElement);
    painterState?.setFocus(connectionElement.name);
  };

  const getEntity = (entityName: string) => {
    return painterState?.getEntityByName(entityName);
  };

  const removeEntity = (entityName: string) => {
    const entity = painterState?.getEntityByName(entityName);
    if (entity instanceof LinkageEntity || entity instanceof ConnectionEntity) {
      painterState?.removeElement(entity.getElement());
    }
  };

  const addPointToLinkage = (selectedLinkage: string) => {
    const linkage = painterState?.getEntityByName(selectedLinkage);
    if (linkage instanceof LinkageEntity) {
      const center = linkage.getCenter();
      const point = elementFactoryState.buildPoint({
        x: center.x,
        y: center.y,
      });

      painterState?.addPointToLinkage(point, linkage.getElement());
    }
  };

  const removePointFromLinkage = (
    pointName: string,
    selectedLinkage: string
  ) => {
    const linkage = painterState?.getEntityByName(selectedLinkage);
    if (linkage instanceof LinkageEntity) {
      const point = painterState?.getPoint(pointName);
      if (!point) {
        return;
      }

      painterState?.removePointFromLinkage(point, linkage.getElement());
    }
  };

  const removePointFromConnection = (
    pointName: string,
    selectedConnection: string
  ) => {
    const connection = painterState?.getEntityByName(selectedConnection);
    if (connection instanceof ConnectionEntity) {
      const point = painterState?.getPoint(pointName);
      if (!point) {
        return;
      }

      painterState?.removePointFromConnection(point, connection.getElement());
    }
  };

  const removeExternalForceFromPoint = (
    externalForceName: string,
    pointName: string
  ) => {
    const location = painterState?.getEntityByName(pointName);
    const externalForce = painterState?.getEntityByName(externalForceName);

    if (
      (location instanceof PointEntity ||
        location instanceof ConnectionEntity) &&
      externalForce instanceof ExternalForceEntity
    ) {
      painterState?.removeExternalLoad(
        location.getElement(),
        externalForce.getElement()
      );
    }
  };

  const getLinkageFromPoint = (pointName: string) => {
    const point = painterState?.getPoint(pointName);
    if (point) {
      return painterState?.getLinkageFromPoint(point);
    }
  };

  const addExternalForce = (location: string) => {
    const entity = painterState?.getEntityByName(location);
    if (entity instanceof PointEntity || entity instanceof ConnectionEntity) {
      const force = elementFactoryState.buildExternalForce(100, 100);
      painterState?.addExternalLoad(entity.getElement(), force);
      painterState?.setFocus(force.name);
    }
  };

  const updatePointPosition = (pointName: string, coordinate: Coordinate) => {
    painterState?.updatePointPosition({
      name: pointName,
      source: USER,
      coordinate: coordinate,
    });
  };

  const setForceComponents = (forceName: string, F_x: number, F_y: number) => {
    const force = painterState?.getEntityByName(forceName);
    if (force instanceof ExternalForceEntity) {
      const forceElement = force.getElement();
      painterState?.updateForce(forceElement, F_x, F_y);
    }
  };

  const changeConnectionType = (
    connectionName: string,
    connectionType: ConnectionKind
  ) => {
    const connection = painterState?.getEntityByName(connectionName);
    if (connection instanceof ConnectionEntity) {
      const connectionElement = connection.getElement();
      painterState?.changeConnectionType(connectionElement, connectionType);
    }
  };

  const solveStructure = () => {
    setSolutionOpen(true);

    painterState?.clearFocus();
    const structure = painterState?.buildStructure();
    if (!structure) {
      return;
    }

    const solver = new MatrixSolverService();
    try {
      console.log(
        expressEquationsInMatrixMultiplication(
          structure.generateAllEquilibirum()
        )
      );
      const variableValues = solver.solve(structure);

      setSolved(true);
      setSolution(variableValues);
    } catch (error: unknown) {
      console.log("unable to solve");
      setSolved(false);
    }
  };

  const closeAllDialogs = () => {
    setAboutOpen(false);
    setTutorialOpen(false);
  };

  return (
    <div>
      <TitleBar setAboutOpen={setAboutOpen} setTutorialOpen={setTutorialOpen} />
      <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
        <About open={aboutOpen} handleClose={closeAllDialogs} />
        <Tutorial open={tutorialOpen} handleClose={closeAllDialogs} />
        <Container maxWidth="xl" sx={{ padding: "1em" }}>
          <EntityList
            entityList={entityList}
            onClick={handleSelection}
            buildLinkage={buildLinkage}
          />
          <SelectedEntity
            name={selectedName}
            selectedX={selectedX}
            selectedY={selectedY}
            getEntity={getEntity}
            removeEntity={removeEntity}
            addPointToLinkage={addPointToLinkage}
            removePointFromLinkage={removePointFromLinkage}
            removePointFromConnection={removePointFromConnection}
            addExternalForce={addExternalForce}
            removeExternalForceFromPoint={removeExternalForceFromPoint}
            getLinkageFromPoint={getLinkageFromPoint}
            updatePointPosition={updatePointPosition}
            setForceComponents={setForceComponents}
            changeConnectionType={changeConnectionType}
            buildConnection={buildConnection}
          />
          <ApplicationCanvas canvasId={CANVAS_ID} />
        </Container>
        {selectedName === "" && solutionOpen && (
          <SolutionTable solution={solution} solved={solved}></SolutionTable>
        )}
        <CoordinateReference />
        <SolveButton solveStructure={solveStructure} />
      </div>
    </div>
  );
}

export default App;
