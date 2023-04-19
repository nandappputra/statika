import { Container, Typography } from "@mui/material";
import { ElementType } from "../utils/Constants";

type Props = {
  name: string;
  type: ElementType;
};

function SelectedEntity(props: Props) {
  const longType = new Map<string, string>();
  longType.set(ElementType.CONNECTION, "Connection");
  longType.set(ElementType.FORCE, "Force");
  longType.set(ElementType.LINKAGE, "Linkage");
  longType.set(ElementType.POINT, "Point");

  return (
    <>
      {!props.name ? (
        <></>
      ) : (
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            backgroundColor: "white",
            boxShadow: "none",
            borderRadius: "0.5em",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "black",
            maxWidth: "200px",
            maxHeight: "500px",
            position: "fixed",
            right: "1vw",
            top: "10vh",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: "flex",
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "black",
              textDecoration: "none",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {props.name}
          </Typography>
          <Typography
            noWrap
            sx={{
              display: "flex",
              fontWeight: 700,
              color: "grey",
              textDecoration: "none",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {longType.get(props.type)}
          </Typography>
        </Container>
      )}
    </>
  );
}

export default SelectedEntity;
