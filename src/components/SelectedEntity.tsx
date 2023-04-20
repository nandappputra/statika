import { Container, Typography } from "@mui/material";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";
import LinkageSettings from "./LinkageSettings";

type Props = {
  name: string;
  entity: CanvasEntity | null;
};

function SelectedEntity(props: Props) {
  return (
    <>
      {!props.entity ? (
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
            top: "10vh",
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
            {props.entity.constructor.name}
          </Typography>
          {props.entity instanceof LinkageEntity ? (
            <LinkageSettings linkage={props.entity} />
          ) : (
            <></>
          )}
        </Container>
      )}
    </>
  );
}

export default SelectedEntity;
