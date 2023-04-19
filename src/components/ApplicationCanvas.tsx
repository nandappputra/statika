import { Box } from "@mui/material";

type Props = {
  canvasId: string;
};

function ApplicationCanvas(props: Props): JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "blue",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: -1,
      }}
    >
      <canvas id={props.canvasId} style={{ width: "100%" }}></canvas>
    </Box>
  );
}

export default ApplicationCanvas;
