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
};

function EntityList(props: Props) {
  return (
    <Container
      disableGutters
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        maxWidth: "200px",
        maxHeight: "300px",
        p: 0,
        scrollbarWidth: "thin",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "sans-serif",
          fontWeight: 700,
          color: "black",
          textDecoration: "none",
        }}
      >
        Elements
      </Typography>
      <List
        sx={{
          maxHeight: 150,
          padding: 0,
          margin: "0px",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        {props.entityList.map((entity) => {
          return (
            <ListItem key={entity} disablePadding>
              <ListItemButton>
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
