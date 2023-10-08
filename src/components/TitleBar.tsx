import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

interface Props {
  setLoadOpen: (aboutLoad: boolean) => void;
  setAboutOpen: (aboutOpen: boolean) => void;
  setTutorialOpen: (tutorialOpen: boolean) => void;
  save: () => void;
}
function TitleBar(props: Props): JSX.Element {
  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "3px black solid",
      }}
    >
      <Toolbar disableGutters variant={"string" as "dense"}>
        <img src="icon.svg" style={{ height: "1.5rem", padding: "0 1rem" }} />
        <Typography
          noWrap
          sx={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: "black",
            textDecoration: "none",
          }}
        >
          Statika
        </Typography>
        <List sx={{ display: "flex", padding: "0 1rem" }}>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => props.save()}>
              <Typography
                noWrap
                sx={{
                  fontFamily: "sans-serif",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Save
              </Typography>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => props.setLoadOpen(true)}>
              <Typography
                noWrap
                sx={{
                  fontFamily: "sans-serif",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Load
              </Typography>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => props.setTutorialOpen(true)}>
              <Typography
                noWrap
                sx={{
                  fontFamily: "sans-serif",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Tutorial
              </Typography>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => props.setAboutOpen(true)}>
              <Typography
                noWrap
                sx={{
                  fontFamily: "sans-serif",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                About
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
