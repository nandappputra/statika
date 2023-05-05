import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

interface Props {
  setAboutOpen: (aboutOpen: boolean) => void;
}
function TitleBar(props: Props): JSX.Element {
  return (
    <AppBar
      sx={{
        position: "static",
        backgroundColor: "white",
        boxShadow: "none",
        border: "3px black solid",
        borderRadius: "0.5rem",
      }}
    >
      <Toolbar disableGutters variant="dense" sx={{ height: "1rem" }}>
        <img src="icon.svg" style={{ height: "1.5rem", padding: "0 1rem" }} />
        <Typography
          variant="h6"
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
        <List>
          <ListItem>
            <ListItemButton onClick={() => props.setAboutOpen(true)}>
              <Typography
                noWrap
                sx={{
                  fontFamily: "sans-serif",
                  fontWeight: 700,
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
