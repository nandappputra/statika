import { Box } from "@mui/material";
import EntityList from "./EntityList";
import CollapsibleButton from "./CollapseButton";
import { useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ModeIcon from "@mui/icons-material/Mode";

type Props = {
  buildLinkage: () => void;
  entityList: string[];
  handleSelection: (entity: string) => void;
};

function EntityListSidebar(props: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
              flexDirection: "column-reverse",
              display: "flex",
            }}
          >
            <div style={{ padding: "0.5rem" }}>
              <CollapsibleButton
                callback={props.buildLinkage}
                isExpanded={isExpanded}
                expandedIcon={<ModeIcon />}
                text="Add linkage"
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
              />
            </div>
          </Box>
        </>
      )}
    </>
  );
}

export default EntityListSidebar;
