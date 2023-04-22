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
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { useEffect, useState } from "react";
import { ConnectionEntity } from "../models/canvas_entities/ConnectionEntity";
import { Point } from "../models/Point";

type Props = {
  connectionName: string;
  getEntity: (entityName: string) => CanvasEntity | undefined;
  removeEntity: (entityName: string) => void;
  removePointFromConnection: (
    pointName: string,
    selectedConnection: string
  ) => void;
};

function ConnectionSetting(props: Props) {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    updatePoints();
  }, []);

  const updatePoints = () => {
    const entity = props.getEntity(props.connectionName);

    if (entity instanceof ConnectionEntity) {
      setPoints(entity.getAllPoints());
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
          id={`${props.connectionName}-X`}
          label="X"
          variant="outlined"
          value={points[0] ? points[0].x : "0"}
          sx={{
            maxWidth: "25%",
            margin: "0 0.5em",
          }}
        />
        <TextField
          id={`${props.connectionName}-Y`}
          label="Y"
          variant="outlined"
          value={points[0] ? points[0].y : "0"}
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
        <Select
          id="demo-simple-select"
          value={10}
          label="Type"
          sx={{
            width: "80%",
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value={10}>Test1</MenuItem>
          <MenuItem value={10}>Test2</MenuItem>
          <MenuItem value={10}>Test3</MenuItem>
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
          }}
        >
          Remove connection
        </Button>
      </Container>
    </div>
  );
}

export default ConnectionSetting;
