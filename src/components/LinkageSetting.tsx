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

import { LinkageEntity } from "../models/canvas_entities/LinkageEntity";

type Props = {
  linkage: LinkageEntity;
  removeEntity: () => void;
  addPointToLinkage: () => void;
  removePointFromLinkage: (name: string) => void;
};

function LinkageSetting(props: Props) {
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
        {props.linkage.getAllPoints().map((point) => (
          <ListItem key={point.name}>
            <ListItemText>{point.name}</ListItemText>

            <TextField
              id={`${point.name}-X`}
              label="X"
              variant="outlined"
              value={point.x}
              sx={{
                maxWidth: "25%",
                margin: "0 0.5em",
              }}
            />
            <TextField
              id={`${point.name}-Y`}
              label="Y"
              variant="outlined"
              value={point.y}
              sx={{
                maxWidth: "25%",
              }}
            />
            <IconButton
              onClick={() => props.removePointFromLinkage(point.name)}
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
          onClick={props.addPointToLinkage}
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
          Add point
        </Button>
        <Button
          onClick={props.removeEntity}
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

export default LinkageSetting;
