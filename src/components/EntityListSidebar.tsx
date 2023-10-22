import { Box } from "@mui/material";
import EntityList from "./EntityList";
import CollapsibleButton from "./CollapsibleButton";
import { useState, useEffect } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ModeIcon from "@mui/icons-material/Mode";
import { CanvasEntity } from "../models/canvas_entities/CanvasEntity";
import { CanvasModes } from "../utils/Constants";

type Props = {
  buildLinkage: () => void;
  entityList: CanvasEntity[];
  handleSelection: (entity: number) => void;
  togglePanningMode: (isActive: boolean) => void;
  canvasMode: CanvasModes;
};

function EntityListSidebar(props: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    setIsClicked(props.canvasMode === CanvasModes.PAN);
  }, [props.canvasMode]);

  const invertExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? (
        <Box
          sx={{
            backgroundColor: "white",
            position: "fixed",
            left: "0rem",
            top: "2rem",
            bottom: "0rem",
            borderRight: "3px black solid",
            flexDirection: "column",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxHeight: "50%" }}>
            <div style={{ padding: "0.5rem", backgroundColor: "lightgray" }}>
              <CollapsibleButton
                callback={props.buildLinkage}
                isExpanded={isExpanded}
                expandedIcon={<ModeIcon />}
                text="Add linkage"
              />
            </div>

            <div
              style={{
                padding: "0rem 0.5rem 0.5rem 0.5rem",
                backgroundColor: "lightgray",
              }}
            >
              <CollapsibleButton
                callback={() => props.togglePanningMode(!isClicked)}
                isExpanded={isExpanded}
                expandedIcon={<OpenWithIcon />}
                text="Pan canvas"
                isToggle={true}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
              />
            </div>
            <div>
              <EntityList
                entityList={props.entityList}
                onClick={props.handleSelection}
                buildLinkage={props.buildLinkage}
              />
            </div>
          </div>

          <div style={{ padding: "0.5rem" }}>
            <CollapsibleButton
              callback={invertExpanded}
              isExpanded={isExpanded}
              expandedIcon={<KeyboardDoubleArrowLeftIcon />}
              collapsedIcon={<KeyboardDoubleArrowRightIcon />}
              text="Collapse"
            />
          </div>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: "fixed",
              left: "0rem",
              top: "2rem",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <div style={{ padding: "0.5rem" }}>
              <CollapsibleButton
                callback={props.buildLinkage}
                isExpanded={isExpanded}
                expandedIcon={<ModeIcon />}
                text="Add linkage"
                tooltipPlacement="right"
              />
            </div>

            <div style={{ padding: "0rem 0.5rem" }}>
              <CollapsibleButton
                callback={() => props.togglePanningMode(!isClicked)}
                isExpanded={isExpanded}
                expandedIcon={<OpenWithIcon />}
                text="Pan canvas"
                tooltipPlacement="right"
                isToggle={true}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
              />
            </div>
          </Box>
          <Box
            sx={{
              position: "fixed",
              left: "0rem",
              height: "5rem",
              bottom: "0rem",
              flexDirection: "column-reverse",
              display: "flex",
            }}
          >
            <div style={{ padding: "0.5rem" }}>
              <CollapsibleButton
                callback={invertExpanded}
                isExpanded={isExpanded}
                expandedIcon={<KeyboardDoubleArrowLeftIcon />}
                collapsedIcon={<KeyboardDoubleArrowRightIcon />}
                text="Collapse"
                tooltipPlacement="right"
              />
            </div>
          </Box>
        </>
      )}
    </>
  );
}

export default EntityListSidebar;
