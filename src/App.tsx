import { Container } from "@mui/material";
import TitleBar from "./components/TitleBar";
import ApplicationCanvas from "./components/ApplicationCanvas";

function App() {
  return (
    <>
      <TitleBar />
      <Container maxWidth="xl">
        <ApplicationCanvas />
      </Container>
    </>
  );
}

export default App;
