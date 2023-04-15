import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function TitleBar(): JSX.Element {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      <Container maxWidth="xl">
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
          Statika
        </Typography>
      </Container>
    </AppBar>
  );
}

export default TitleBar;
