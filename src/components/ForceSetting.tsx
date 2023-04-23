import { Button, Container, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import { ExternalForceEntity } from "../models/canvas_entities/ExternalForceEntity";
import { Point } from "../models/Point";

type Props = {
  forceName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removeExternalForceFromPoint: (
    externalForce: string,
    pointName: string
  ) => void;
  setForceComponents: (forceName: string, F_x: number, F_y: number) => void;
};

function ForceSetting(props: Props) {
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [fX, setFX] = useState<number>(0);
  const [fY, setFY] = useState<number>(0);

  useEffect(() => {
    updateForce();
  }, [props.forceName]);

  const updateForce = () => {
    const entity = props.getEntity(props.forceName);
    if (entity instanceof ExternalForceEntity) {
      setFX(parseFloat(entity.getElement().symbolF_x));
      setFY(parseFloat(entity.getElement().symbolF_y));
      setPoint(entity.point);
    }
  };

  const setForceComponents = () => {
    let F_x = (
      document.getElementById(`${props.forceName}-X`) as HTMLInputElement
    )?.valueAsNumber;
    let F_y = (
      document.getElementById(`${props.forceName}-Y`) as HTMLInputElement
    )?.valueAsNumber;

    if (Number.isNaN(F_x)) {
      F_x = 0;
    }

    if (Number.isNaN(F_y)) {
      F_y = 0;
    }

    props.setForceComponents(props.forceName, F_x, F_y);
    setFX(F_x);
    setFY(F_y);
  };

  return (
    <div>
      <Typography
        noWrap
        sx={{
          display: "flex",
          textDecoration: "none",
          justifyContent: "center",
          width: "100%",
        }}
      >
        Force at {point?.name}
      </Typography>
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
          value={fX}
          sx={{
            maxWidth: "30%",
            margin: "0 0.5em",
          }}
          type="number"
          onChange={setForceComponents}
        />
        <TextField
          id={`${props.forceName}-Y`}
          label="Fy"
          variant="outlined"
          value={fY}
          sx={{
            maxWidth: "30%",
          }}
          type="number"
          onChange={setForceComponents}
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
