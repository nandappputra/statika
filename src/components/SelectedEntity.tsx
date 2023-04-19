import { Container, Typography } from "@mui/material";
import { ElementType } from "../utils/Constants";

type Props = {
  name: string;
  type: ElementType | null;
};

function SelectedEntity(props: Props) {
  return (
    <Container
      disableGutters
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5em",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        maxWidth: "200px",
        maxHeight: "300px",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "sans-serif",
          fontWeight: 700,
          color: "black",
          textDecoration: "none",
        }}
      >
        {props.name} - {props.type}
      </Typography>
    </Container>
  );
}

export default SelectedEntity;
