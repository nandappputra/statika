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
import { ConnectionEntity } from "../models/canvas_entities/ConnectionEntity";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type Props = {
  connection: ConnectionEntity;
};

function ConnectionSetting(props: Props) {
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
          id={`${props.connection.name}-X`}
          label="X"
          variant="outlined"
          value={props.connection.x}
          sx={{
            maxWidth: "25%",
            margin: "0 0.5em",
          }}
        />
        <TextField
          id={`${props.connection.name}-Y`}
          label="Y"
          variant="outlined"
          value={props.connection.x}
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
        {props.connection.getAllPoints().map((point) => (
          <ListItem key={`${props.connection.name}-${point.name}`}>
            <ListItemText>{point.name}</ListItemText>
            <IconButton>
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
