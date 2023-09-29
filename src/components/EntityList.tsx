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
          .filter((entity) => entity.charAt(0) !== "P")
          .map((entity) => {
            return (
              <ListItem
                key={entity}
                disablePadding
                sx={{
                  borderBottom: "1px lightgrey solid",
                }}
              >
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
