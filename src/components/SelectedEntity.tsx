import { Container, Typography } from "@mui/material";
import LinkageSetting from "./LinkageSetting";
import ConnectionSetting from "./ConnectionSetting";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import PointSetting from "./PointSetting";
import ForceSetting from "./ForceSetting";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";
import { Coordinate } from "../models/Coordinate";
import { ConnectionKind, EntityKind } from "../utils/Constants";
import { ConnectionEntity } from "../models/canvas_entities/ConnectionEntity";
import { PointEntity } from "../models/canvas_entities/PointEntity";
import { ExternalForceEntity } from "../models/canvas_entities/ExternalForceEntity";

type Props = {
  name: string;
  selectedX: number;
  selectedY: number;
  entity: CanvasEntity | undefined;
  getEntity: (entityId: number) => CanvasEntity | undefined;
  removeEntity: (entityId: number) => void;
  addPointToLinkage: (selectedLinkageId: number) => void;
  removePointFromLinkage: (pointId: number, selectedLinkageId: number) => void;
  removePointFromConnection: (
    pointId: number,
    selectedConnectionId: number
  ) => void;
  removeExternalForceFromPoint: (
    externalForceId: number,
    pointId: number
  ) => void;
  getLinkageFromPoint: (pointId: number) => LinkageEntity | undefined;
  addExternalForce: (locationId: number) => void;
  updatePointPosition: (pointId: number, coordinate: Coordinate) => void;
  setForceComponents: (forceId: number, F_x: number, F_y: number) => void;
  changeConnectionType: (
    connectionId: number,
    connectionType: ConnectionKind
  ) => void;
  buildConnection: (pointId: number) => void;
};

function SelectedEntity(props: Props) {
  return (
    <>
      {!props.name || !props.entity ? (
        <></>
      ) : (
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            backgroundColor: "white",
            boxShadow: "none",
            borderRadius: "0.5em",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "black",
            maxWidth: "300px",
            maxHeight: "500px",
            position: "fixed",
            right: "0.5rem",
            top: "2.5rem",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: "flex",
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "black",
              textDecoration: "none",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {props.name}
          </Typography>
          <Typography
            noWrap
            sx={{
              display: "flex",
              color: "grey",
              textDecoration: "none",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {props.entity.kind}
          </Typography>
          {props.entity.kind === EntityKind.LINKAGE ? (
            <LinkageSetting
              linkageName={props.name}
              linkageEntity={props.entity as LinkageEntity}
              removeEntity={props.removeEntity}
              addPointToLinkage={props.addPointToLinkage}
              removePointFromLinkage={props.removePointFromLinkage}
              updatePointPosition={props.updatePointPosition}
            />
          ) : props.entity.kind === EntityKind.CONNECTION ? (
            <ConnectionSetting
              selectedX={props.selectedX}
              selectedY={props.selectedY}
              connectionName={props.name}
              connectionEntity={props.entity as ConnectionEntity}
              removeEntity={props.removeEntity}
              removePointFromConnection={props.removePointFromConnection}
              updatePointPosition={props.updatePointPosition}
              changeConnectionType={props.changeConnectionType}
              addExternalForce={props.addExternalForce}
            />
          ) : props.entity.kind === EntityKind.POINT ? (
            <PointSetting
              selectedX={props.selectedX}
              selectedY={props.selectedY}
              pointName={props.name}
              pointEntity={props.entity as PointEntity}
              addExternalForce={props.addExternalForce}
              removeExternalForceFromPoint={props.removeExternalForceFromPoint}
              getLinkageFromPoint={props.getLinkageFromPoint}
              removePointFromLinkage={props.removePointFromLinkage}
              updatePointPosition={props.updatePointPosition}
              buildConnection={props.buildConnection}
            />
          ) : props.entity.kind === EntityKind.FORCE ? (
            <ForceSetting
              forceName={props.name}
              forceEntity={props.entity as ExternalForceEntity}
              removeExternalForce={props.removeExternalForceFromPoint}
              setForceComponents={props.setForceComponents}
            />
          ) : (
            <></>
          )}
        </Container>
      )}
    </>
  );
}

export default SelectedEntity;
