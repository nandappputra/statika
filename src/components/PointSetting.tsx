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
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import React, { useEffect, useState } from "react";
import { PointEntity } from "../models/canvas_entities/PointEntity";
import { ExternalForce } from "../models/ExternalForce";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";
import { LinkageElement } from "../models/diagram_elements/LinkageElement";
import { Coordinate } from "../models/Coordinate";

type Props = {
  pointName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removePointFromLinkage: (pointName: string, selectedLinkage: string) => void;
  removeExternalForceFromPoint: (
    externalForce: string,
    pointName: string
  ) => void;
  getLinkageFromPoint: (pointName: string) => LinkageEntity | undefined;
  addExternalForceToPoint: (pointName: string) => void;
  updatePointPosition: (pointName: string, coordinate: Coordinate) => void;
  buildConnection: (pointName: string) => void;
};

function PointSetting(props: Props) {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [forces, setForces] = useState<ExternalForce[] | undefined>(undefined);
  const [linkage, setLinkage] = useState<LinkageElement | undefined>(undefined);

  useEffect(() => {
    updatePoint();
  }, [props.pointName]);

  const updatePoint = () => {
    const entity = props.getEntity(props.pointName);
    if (!(entity instanceof PointEntity)) {
      return;
    }

    const parentLinkage = props.getLinkageFromPoint(props.pointName);
    if (!parentLinkage) {
      return;
    }

    setForces(entity.getElement().externalForces);
    setLinkage(parentLinkage.getElement());
    setX(entity.getElement().x);
    setY(entity.getElement().y);
  };

  const removePoint = (pointName: string) => {
    if (linkage) {
      props.removePointFromLinkage(pointName, linkage.name);
    }
  };

  const addExternalForceToPoint = (pointName: string) => {
    props.addExternalForceToPoint(pointName);
    updatePoint();
  };

  const handlePositionChangeX = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const xValue = event.target.valueAsNumber;
    if (Number.isNaN(xValue)) {
      setX(0);
      props.updatePointPosition(props.pointName, { x: 0, y });
    } else {
      setX(xValue);
      props.updatePointPosition(props.pointName, { x: xValue, y });
    }
  };

  const handlePositionChangeY = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const yValue = event.target.valueAsNumber;
    if (Number.isNaN(yValue)) {
      setY(0);
      props.updatePointPosition(props.pointName, { x, y: 0 });
    } else {
      setY(yValue);
      props.updatePointPosition(props.pointName, { x, y: yValue });
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
          label="X"
          variant="outlined"
          value={x}
          type="number"
          sx={{
            maxWidth: "25%",
            margin: "0 0.5em",
          }}
          onChange={handlePositionChangeX}
        />
        <TextField
          id={`${props.pointName}-Y`}
          label="Y"
          variant="outlined"
          value={y}
          type="number"
          sx={{
            maxWidth: "25%",
          }}
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
            <ListItem key={`${props.pointName}-${force}`}>
              <ListItemText>{force.name}</ListItemText>
              <IconButton
                onClick={() => {
                  props.removeExternalForceFromPoint(
                    force.name,
                    props.pointName
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
            onClick={() => addExternalForceToPoint(props.pointName)}
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
            onClick={() => removePoint(props.pointName)}
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
            onClick={() => props.buildConnection(props.pointName)}
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
      <Container
        disableGutters
        sx={{
          padding: "0.5em 0.5em",
          display: "flex",
          justifyContent: "center",
          gap: "0.5em",
        }}
      ></Container>
    </div>
  );
}

export default PointSetting;
