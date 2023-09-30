import { Button, IconButton, Tooltip } from "@mui/material";

type Props = {
  callback: () => void;
  isExpanded: boolean;
  expandedIcon: React.ReactNode;
  collapsedIcon?: React.ReactNode;
  text: string;
  tooltipPlacement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  isToggle?: boolean;
  isClicked?: boolean;
  setIsClicked?: (value: boolean) => void;
};

function CollapsibleButton(props: Props) {
  const BUTTON_EXPANDED_NONCLICKED = {
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
  };
  const BUTTON_EXPANDED_CLICKED = {
    ...BUTTON_EXPANDED_NONCLICKED,
    backgroundColor: "black",
    color: "white",
  };

  const BUTTON_COLLAPSED_NONCLICKED = {
    backgroundColor: "white",
    boxShadow: "none",
    borderRadius: "0.5em",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "black",
    color: "black",
  };
  const BUTTON_COLLAPSED_CLICKED = {
    ...BUTTON_COLLAPSED_NONCLICKED,
    backgroundColor: "black",
    color: "white",
  };

  const handleClick = () => {
    if (props.isToggle && props.setIsClicked) {
      props.setIsClicked(!props.isClicked || false);
    }

    props.callback();
  };

  return (
    <>
      {props.isExpanded ? (
        <Button
          startIcon={props.expandedIcon}
          onClick={handleClick}
          sx={props.isClicked ? BUTTON_EXPANDED_CLICKED : BUTTON_EXPANDED_NONCLICKED}
        >
          {props.text}
        </Button>
      ) : (
        <Tooltip
          title={props.text}
          placement={props.tooltipPlacement || "bottom"}
        >
          <IconButton
            onClick={handleClick}
            sx={
              props.isClicked ? BUTTON_COLLAPSED_CLICKED : BUTTON_COLLAPSED_NONCLICKED
            }
          >
            {props.collapsedIcon ? props.collapsedIcon : props.expandedIcon}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}

export default CollapsibleButton;
