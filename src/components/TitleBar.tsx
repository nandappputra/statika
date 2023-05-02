import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function TitleBar(): JSX.Element {
  return (
    <div>
      <AppBar
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          borderBottom: "3px black solid",
        }}
      >
        <Container>
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: "flex",
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "black",
              textDecoration: "none",
            }}
          >
            Statika
          </Typography>
        </Container>
      </AppBar>
    </div>
  );
}

export default TitleBar;
