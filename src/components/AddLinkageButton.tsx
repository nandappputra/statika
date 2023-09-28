import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

type Props = {
  buildLinkage: () => void;
};

function AddLinkageButton(props: Props) {
  return (
    <Button
      startIcon={<AddCircleOutlineIcon />}
      onClick={props.buildLinkage}
      sx={{
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
        width: "100%",
      }}
    >
      Add linkage
    </Button>
  );
}

export default AddLinkageButton;
