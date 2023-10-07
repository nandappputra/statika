import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Point } from "../models/diagram_elements/Point";
import { useEffect, useState } from "react";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";
import { Coordinate } from "../models/Coordinate";

type Props = {
  linkageName: string;
  linkageEntity: LinkageEntity;
  removeEntity: (entityId: number) => void;
  addPointToLinkage: (selectedLinkageId: number) => void;
  removePointFromLinkage: (pointId: number, selectedLinkageId: number) => void;
  updatePointPosition: (pointId: number, coordinate: Coordinate) => void;
};

function LinkageSetting(props: Props) {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    updatePoints();
  }, [props.linkageName]);

  const updatePoints = () => {
    setPoints(props.linkageEntity.getAllPoints());
  };

  const movePoint = (pointName: string, pointId: number, index: number) => {
    const valueX = (
      document.getElementById(`${pointName}-X`) as HTMLInputElement
    )?.valueAsNumber;
    const valueY = (
      document.getElementById(`${pointName}-Y`) as HTMLInputElement
    )?.valueAsNumber;

    if (Number.isNaN(valueX) || Number.isNaN(valueY)) {
      return;
    }

    const newState = [...points];
    newState[index].x = valueX;
    newState[index].y = valueY;
    props.updatePointPosition(pointId, { x: valueX, y: valueY });
    setPoints(newState);
  };

  return (
    <div>
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
        {points.map((point, index) => (
          <ListItem key={point.id}>
            <ListItemText sx={{ padding: "0.2rem" }}>{point.name}</ListItemText>
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
                id={`${point.name}-X`}
                label="X"
                variant="outlined"
                value={point.x}
                type="number"
                onChange={() => movePoint(point.name, point.id, index)}
              />
              <TextField
                id={`${point.name}-Y`}
                label="Y"
                variant="outlined"
                value={point.y}
                type="number"
                onChange={() => movePoint(point.name, point.id, index)}
              />
              <IconButton
                onClick={() => {
                  props.removePointFromLinkage(
                    point.id,
                    props.linkageEntity.id
                  );
                  updatePoints();
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </Container>
          </ListItem>
        ))}
      </List>
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
          onClick={() => props.addPointToLinkage(props.linkageEntity.id)}
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
          Add point
        </Button>
        <Button
          onClick={() => props.removeEntity(props.linkageEntity.id)}
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

export default LinkageSetting;
