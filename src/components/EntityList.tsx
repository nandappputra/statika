import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

type Props = {
  entityList: string[];
  onClick: (name: string) => void;
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
        maxHeight: "200px",
        position: "fixed",
        left: "1vw",
        top: "10vh",
      }}
    >
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
          maxHeight: 150,
          padding: 0,
          margin: "5px 0px",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        {props.entityList.map((entity) => {
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
