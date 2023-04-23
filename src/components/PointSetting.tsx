import {
  Button,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import { PointEntity } from "../models/canvas_entities/PointEntity";
import { Point } from "../models/Point";
import { ExternalForce } from "../models/ExternalForce";
import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";

type Props = {
  pointName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removePointFromLinkage: (pointName: string, selectedLinkage: string) => void;
  removeExternalForceFromPoint: (
    externalForce: string,
    pointName: string
  ) => void;
  getLinkageFromPoint: (pointName: string) => LinkageEntity | undefined;
};

function PointSetting(props: Props) {
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [forces, setForces] = useState<ExternalForce[] | undefined>(undefined);

  useEffect(() => {
    updatePoint();
  }, []);

  const updatePoint = () => {
    const entity = props.getEntity(props.pointName);

    if (entity instanceof PointEntity) {
      setPoint(entity.getElement());
      setForces(entity.getElement().externalForces);
    }
  };

  const removePoint = (pointName: string) => {
    const linkage = props.getLinkageFromPoint(pointName);
    if (linkage) {
      props.removePointFromLinkage(pointName, linkage.name);
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
          id={`${props.pointName}-X`}
          label="X"
          variant="outlined"
          value={point ? point.x : "0"}
          sx={{
            maxWidth: "25%",
            margin: "0 0.5em",
          }}
        />
        <TextField
          id={`${props.pointName}-Y`}
          label="Y"
          variant="outlined"
          value={point ? point.y : "0"}
          sx={{
            maxWidth: "25%",
          }}
        />
      </Container>

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
                props.removeExternalForceFromPoint(force.name, props.pointName);
                updatePoint();
              }}
            >
              <HighlightOffIcon />
            </IconButton>
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
          // onClick={() => props.addPointToLinkage(props.linkageName)}
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
          }}
        >
          Add force
        </Button>
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
          }}
        >
          Remove
        </Button>
      </Container>
    </div>
  );
}

export default PointSetting;
