import {
  Button,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddLinkIcon from "@mui/icons-material/AddLink";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useState } from "react";
import { PointEntity } from "../models/canvas_entities/PointEntity";
import { ExternalForce } from "../models/diagram_elements/ExternalForce";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";
import { LinkageElement } from "../models/diagram_elements/LinkageElement";
import { Coordinate } from "../models/Coordinate";

type Props = {
  selectedX: number;
  selectedY: number;
  pointName: string;
  pointEntity: PointEntity;
  removePointFromLinkage: (pointId: number, selectedLinkageId: number) => void;
  removeExternalForceFromPoint: (
    externalForceId: number,
    pointId: number
  ) => void;
  getLinkageFromPoint: (pointId: number) => LinkageEntity | undefined;
  addExternalForce: (pointId: number) => void;
  updatePointPosition: (pointId: number, coordinate: Coordinate) => void;
  buildConnection: (pointId: number) => void;
};

function PointSetting(props: Props) {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [forces, setForces] = useState<ExternalForce[] | undefined>(undefined);
  const [linkage, setLinkage] = useState<LinkageElement | undefined>(undefined);

  useEffect(() => {
    updatePoint();
  }, [props.pointName, props.selectedX, props.selectedY]);

  const updatePoint = () => {
    const parentLinkage = props.getLinkageFromPoint(props.pointEntity.id);
    if (!parentLinkage) {
      return;
    }

    setForces(props.pointEntity.getElement().externalForces);
    setLinkage(parentLinkage.getElement());
    setX(props.pointEntity.getElement().x);
    setY(props.pointEntity.getElement().y);
  };

  const removePoint = (pointId: number) => {
    if (linkage) {
      props.removePointFromLinkage(pointId, linkage.id);
    }
  };

  const addExternalForceToPoint = (pointId: number) => {
    props.addExternalForce(pointId);
    updatePoint();
  };

  const handlePositionChangeX = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const xValue = event.target.valueAsNumber;
    if (Number.isNaN(xValue)) {
      setX(0);
      props.updatePointPosition(props.pointEntity.id, { x: 0, y });
    } else {
      setX(xValue);
      props.updatePointPosition(props.pointEntity.id, { x: xValue, y });
    }
  };

  const handlePositionChangeY = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const yValue = event.target.valueAsNumber;
    if (Number.isNaN(yValue)) {
      setY(0);
      props.updatePointPosition(props.pointEntity.id, { x, y: 0 });
    } else {
      setY(yValue);
      props.updatePointPosition(props.pointEntity.id, { x, y: yValue });
    }
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
        Point in {linkage?.name}
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
          id={`${props.pointName}-X`}
          label="X (Meter)"
          variant="outlined"
          value={x}
          type="number"
          onChange={handlePositionChangeX}
        />
        <TextField
          id={`${props.pointName}-Y`}
          label="Y (Meter)"
          variant="outlined"
          value={y}
          type="number"
          onChange={handlePositionChangeY}
        />
      </Container>
      {forces && forces.length > 0 ? (
        <List
          sx={{
            borderTop: "3px black solid",
            borderBottom: "3px black solid",
            maxHeight: 150,
            padding: 0,
            overflow: "auto",
            scrollbarWidth: "none",
          }}
        >
          {forces?.map((force) => (
            <ListItem key={`${props.pointEntity.id}-${force}`}>
              <ListItemText>{force.id}</ListItemText>
              <IconButton
                onClick={() => {
                  props.removeExternalForceFromPoint(
                    force.id,
                    props.pointEntity.id
                  );
                  updatePoint();
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <></>
      )}
      <Grid container columnSpacing={1} rowSpacing={1} padding={1}>
        <Grid item xs={6}>
          <Button
            onClick={() => addExternalForceToPoint(props.pointEntity.id)}
            startIcon={<AddCircleOutlineIcon />}
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
            Add force
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => removePoint(props.pointEntity.id)}
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
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => props.buildConnection(props.pointEntity.id)}
            startIcon={<AddLinkIcon />}
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
            Add connection
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default PointSetting;
