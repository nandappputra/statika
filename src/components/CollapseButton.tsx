import { Button, IconButton } from "@mui/material";

type Props = {
  callback: () => void;
  isExpanded: boolean;
  expandedIcon: React.ReactNode;
  collapsedIcon?: React.ReactNode;
  text: string;
};

function CollapsibleButton(props: Props) {
  return (
    <>
      {props.isExpanded ? (
        <Button
          startIcon={props.expandedIcon}
          onClick={props.callback}
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
          {props.text}
        </Button>
      ) : (
        <IconButton
          onClick={props.callback}
          sx={{
            backgroundColor: "white",
            boxShadow: "none",
            borderRadius: "0.5em",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "black",
            color: "black",
          }}
        >
          {props.collapsedIcon ? props.collapsedIcon : props.expandedIcon}
        </IconButton>
      )}
    </>
  );
}

export default CollapsibleButton;
