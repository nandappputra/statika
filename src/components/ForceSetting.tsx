import { Button, Container, TextField } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import { ExternalForce } from "../models/ExternalForce";
import { ExternalForceEntity } from "../models/canvas_entities/ExternalForceEntity";
import { Point } from "../models/Point";

type Props = {
  forceName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removeExternalForceFromPoint: (
    externalForce: string,
    pointName: string
  ) => void;
};

function ForceSetting(props: Props) {
  const [force, setForce] = useState<ExternalForce | undefined>(undefined);
  const [point, setPoint] = useState<Point | undefined>(undefined);

  useEffect(() => {
    updateForce();
  }, []);

  const updateForce = () => {
    const entity = props.getEntity(props.forceName);

    if (entity instanceof ExternalForceEntity) {
      setForce(entity.getElement());
      setPoint(entity.point);
    }
  };

  return (
    <div>
      <Container
        disableGutters
        sx={{
          padding: "0.5em 0.5em",
          display: "flex",
          justifyContent: "center",
          gap: "0.5em",
        }}
      >
        <TextField
          id={`${props.forceName}-X`}
          label="Fx"
          variant="outlined"
          value={force ? force.symbolF_x : "0"}
          sx={{
            maxWidth: "25%",
            margin: "0 0.5em",
          }}
        />
        <TextField
          id={`${props.forceName}-Y`}
          label="Fy"
          variant="outlined"
          value={force ? force.symbolF_y : "0"}
          sx={{
            maxWidth: "25%",
          }}
        />
      </Container>
      <Container
        disableGutters
        sx={{
          padding: "0.5em 0.5em",
          display: "flex",
          justifyContent: "center",
          gap: "0.5em",
        }}
      >
        <Button
          onClick={() => {
            if (point) {
              props.removeExternalForceFromPoint(props.forceName, point.name);
            }
          }}
          startIcon={<RemoveCircleOutlineIcon />}
          sx={{
            backgroundColor: "white",
            boxShadow: "none",
            borderRadius: "0.5em",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "black",
            textTransform: "none",
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: "black",
          }}
        >
          Remove
        </Button>
      </Container>
    </div>
  );
}

export default ForceSetting;
