import { Button } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";

export function SolveButton() {
  return (
    <Button
      startIcon={<ModeIcon />}
      sx={{
        position: "fixed",
        width: "300px",
        right: "0.2em",
        bottom: "0.2em",
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        textTransform: "none",
        fontFamily: "sans-serif",
        fontWeight: 700,
        color: "black",
        margin: "1em",
      }}
    >
      {"Solve Structure"}
    </Button>
  );
}
