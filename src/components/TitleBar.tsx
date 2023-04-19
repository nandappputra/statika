import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function TitleBar(): JSX.Element {
  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        position: "fixed",
        left: "1vw",
        maxWidth: "96.5vw",
        top: "1vh",
      }}
    >
      <Container>
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
          }}
        >
          Statika
        </Typography>
      </Container>
    </AppBar>
  );
}

export default TitleBar;
