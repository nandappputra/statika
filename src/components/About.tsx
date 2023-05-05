import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";

interface Props {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function About(props: Props) {
  return (
    <div>
      <Dialog open={props.open} onClose={() => props.setOpen(false)} sx={{}}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="icon.svg"
            style={{
              maxWidth: "10rem",
              padding: "0 1rem",
            }}
          />
          <Typography
            variant="h3"
            noWrap
            sx={{
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "black",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Statika
          </Typography>
          <Typography sx={{ padding: "1rem", textAlign: "center" }}>
            Statika is an open-source educational tool to calculate structural
            loadings with easy-to-use user interface
          </Typography>
          <IconButton
            href="https://github.com/nandappputra/statika"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </div>
  );
}
