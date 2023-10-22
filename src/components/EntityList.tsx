import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";

type Props = {
  entityList: CanvasEntity[];
  onClick: (id: number) => void;
  buildLinkage: () => void;
};

function EntityList(props: Props) {
  return (
    <Container
      disableGutters
      sx={{
        boxShadow: "none",
        borderTop: "3px black solid",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          display: "flex",
          fontFamily: "sans-serif",
          fontWeight: 700,
          color: "black",
          textDecoration: "none",
          justifyContent: "center",
          width: "100%",
        }}
      >
        Elements
      </Typography>
      <List
        sx={{
          borderTop: "3px black solid",
          margin: "5px 0",
          padding: 0,
          overflow: "auto",
          scrollbarWidth: "none",
          maxHeight: "400px",
        }}
      >
        {[...props.entityList]
          .reverse()
          .filter((entity) => entity.name.charAt(0) !== "P")
          .map((entity) => {
            return (
              <ListItem
                key={entity.id}
                disablePadding
                sx={{
                  borderBottom: "1px lightgrey solid",
                }}
              >
                <ListItemButton onClick={() => props.onClick(entity.id)}>
                  <ListItemText primary={entity.name} secondary={entity.kind} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Container>
  );
}

export default EntityList;
