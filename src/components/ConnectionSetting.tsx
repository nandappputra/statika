import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import { ConnectionEntity } from "../models/canvas_entities/ConnectionEntity";
import { Point } from "../models/Point";
import { Coordinate } from "../models/Coordinate";
import { ConnectionKind } from "../utils/Constants";

type Props = {
  selectedX: number;
  selectedY: number;
  connectionName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removeEntity: (entityName: string) => void;
  removePointFromConnection: (
    pointName: string,
    selectedConnection: string
  ) => void;
  updatePointPosition: (pointName: string, coordinate: Coordinate) => void;
  changeConnectionType: (
    connectionName: string,
    connectionType: ConnectionKind
  ) => void;
  addExternalForce: (location: string) => void;
};

function ConnectionSetting(props: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [connectionType, setConnectionType] = useState<ConnectionKind>(
    ConnectionKind.FIXED
  );

  useEffect(() => {
    updatePoints();
  }, [props.connectionName, props.selectedX, props.selectedY]);

  const updatePoints = () => {
    const entity = props.getEntity(props.connectionName);
    if (entity instanceof ConnectionEntity) {
      setConnectionType(entity.getConnectionType());
      setPoints(entity.getAllPoints());
    }
  };

  const moveConnection = () => {
    const valueX = (
      document.getElementById(`${props.connectionName}-X`) as HTMLInputElement
    )?.valueAsNumber;
    const valueY = (
      document.getElementById(`${props.connectionName}-Y`) as HTMLInputElement
    )?.valueAsNumber;

    if (Number.isNaN(valueX) || Number.isNaN(valueY)) {
      return;
    }

    const newState = [...points];
    newState[0].x = valueX;
    newState[0].y = valueY;
    props.updatePointPosition(points[0].name, { x: valueX, y: valueY });
    setPoints(newState);
  };

  const changeConnectionType = (event: SelectChangeEvent<ConnectionKind>) => {
    const selectedType = event.target.value as ConnectionKind;
    setConnectionType(selectedType);
    props.changeConnectionType(props.connectionName, selectedType);
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
          id={`${props.connectionName}-X`}
          label="X (Meter)"
          variant="outlined"
          value={points[0] ? points[0].x : "0"}
          onChange={moveConnection}
          type="number"
        />
        <TextField
          id={`${props.connectionName}-Y`}
          label="Y (Meter)"
          variant="outlined"
          value={points[0] ? points[0].y : "0"}
          onChange={moveConnection}
          type="number"
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
        <Select
          id="connection-type"
          value={connectionType}
          sx={{
            width: "100%",
          }}
          inputProps={{ "aria-label": "Without label" }}
          MenuProps={{
            disableScrollLock: true,
          }}
          onChange={changeConnectionType}
        >
          {Object.values(ConnectionKind).map((connection) => (
            <MenuItem value={connection} key={connection}>
              {connection}
            </MenuItem>
          ))}
        </Select>
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
        {points.map((point) => (
          <ListItem key={`${props.connectionName}-${point.name}`}>
            <ListItemText>{point.name}</ListItemText>
            <IconButton
              onClick={() => {
                props.removePointFromConnection(
                  point.name,
                  props.connectionName
                );
                updatePoints();
              }}
            >
              <LinkOffIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Container
        disableGutters
        sx={{
          padding: "0.5em 0.5em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.5em",
        }}
      >
        <Button
          onClick={() => props.removeEntity(props.connectionName)}
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
          Remove connection
        </Button>
        <Button
          onClick={() => props.addExternalForce(props.connectionName)}
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
          Add Force
        </Button>
      </Container>
    </div>
  );
}

export default ConnectionSetting;
