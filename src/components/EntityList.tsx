import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

type Props = {
  entityList: string[];
  onClick: (name: string) => void;
  buildLinkage: () => void;
};

function EntityList(props: Props) {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        maxWidth: "200px",
        position: "fixed",
        left: "1vw",
        top: "7vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={props.buildLinkage}
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
          margin: "1em",
        }}
      >
        Add linkage
      </Button>
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
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
          maxHeight: "70vh",
          margin: "5px 0",
          padding: 0,
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        {[...props.entityList].reverse().map((entity) => {
          return (
            <ListItem key={entity} disablePadding>
              <ListItemButton onClick={() => props.onClick(entity)}>
                <ListItemText primary={entity} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

export default EntityList;
