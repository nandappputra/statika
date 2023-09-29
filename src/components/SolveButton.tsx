import { Button } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

type Props = {
  solveStructure: () => void;
};

export function SolveButton(props: Props) {
  return (
    <Button
      startIcon={<LightbulbIcon />}
      onClick={props.solveStructure}
      sx={{
        position: "fixed",
        width: "300px",
        right: "0.5rem",
        bottom: "0.5rem",
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
      }}
    >
      {"Solve Structure"}
    </Button>
  );
}
