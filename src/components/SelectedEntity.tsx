import { Container, Typography } from "@mui/material";
import LinkageSetting from "./LinkageSetting";
import ConnectionSetting from "./ConnectionSetting";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import PointSetting from "./PointSetting";
import ForceSetting from "./ForceSetting";

type Props = {
  name: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removeEntity: (entityName: string) => void;
  addPointToLinkage: (selectedLinkage: string) => void;
  removePointFromLinkage: (pointName: string, selectedLinkage: string) => void;
  removePointFromConnection: (
    pointName: string,
    selectedConnection: string
  ) => void;
  removeExternalForceFromPoint: (externalForce: string, pointName: string) => void;
};

function SelectedEntity(props: Props) {
  const [entityType, setEntityType] = useState<string | undefined>(undefined);

  useEffect(() => {
    setEntityType(props.getEntity(props.name)?.constructor.name);
  }, [props.name]);

  return (
    <>
      {!props.name ? (
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
            right: "1vw",
            top: "7vh",
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
            {entityType}
          </Typography>
          {entityType === "LinkageEntity" ? (
            <LinkageSetting
              linkageName={props.name}
              removeEntity={props.removeEntity}
              addPointToLinkage={props.addPointToLinkage}
              removePointFromLinkage={props.removePointFromLinkage}
              getEntity={props.getEntity}
            />
          ) : entityType === "ConnectionEntity" ? (
            <ConnectionSetting
              connectionName={props.name}
              removeEntity={props.removeEntity}
              removePointFromConnection={props.removePointFromConnection}
              getEntity={props.getEntity}
            />
          ) : entityType === "PointEntity" ? (
            <PointSetting
              pointName={props.name}
              getEntity={props.getEntity}
              removePointFromLinkage={props.removePointFromLinkage}
            />
          ) : entityType === "ExternalForceEntity" ? (
            <ForceSetting
              forceName={props.name}
              getEntity={props.getEntity}
              removeExternalForceFromPoint={props.removeExternalForceFromPoint}
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
