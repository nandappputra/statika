import { Button, Container, TextField, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import { Point } from "../models/diagram_elements/Point";
import { ConnectionElement } from "../models/diagram_elements/ConnectionElement";
import { ExternalForceEntity } from "../models/canvas_entities/ExternalForceEntity";

type Props = {
  forceName: string;
  forceEntity: ExternalForceEntity;
  removeExternalForce: (externalForceId: number, locationId: number) => void;
  setForceComponents: (forceId: number, F_x: number, F_y: number) => void;
};

function ForceSetting(props: Props) {
  const [location, setLocation] = useState<
    Point | ConnectionElement | undefined
  >(undefined);
  const [fX, setFX] = useState<number>(0);
  const [fY, setFY] = useState<number>(0);

  useEffect(() => {
    updateForce();
  }, [props.forceName]);

  const updateForce = () => {
    setFX(parseFloat(props.forceEntity.getElement().symbolF_x));
    setFY(parseFloat(props.forceEntity.getElement().symbolF_y));
    setLocation(props.forceEntity.location);
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

    props.setForceComponents(props.forceEntity.id, F_x, F_y);
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
        Force at {location?.name}
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
          label="Fx (Newton)"
          variant="outlined"
          value={fX}
          type="number"
          onChange={setForceComponents}
        />
        <TextField
          id={`${props.forceName}-Y`}
          label="Fy (Newton)"
          variant="outlined"
          value={fY}
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
            if (location) {
              props.removeExternalForce(props.forceEntity.id, location.id);
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
            width: "100%",
          }}
        >
          Remove
        </Button>
      </Container>
    </div>
  );
}

export default ForceSetting;
