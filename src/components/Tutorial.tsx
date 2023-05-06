import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Typography, Container } from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function Tutorial(props: Props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          props.handleClose();
        }}
        maxWidth="lg"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <DialogTitle>
          <Typography
            noWrap
            sx={{
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "black",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Tutorial
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ overflowY: "scroll", padding: "1rem" }}
          >
            <Grid item xs={6}>
              <Container>
                <Typography>
                  1. Click <strong>Add Linkage</strong> to add your first
                  element. Move around with your trackpad
                </Typography>
                <img src="step1.gif" style={{ maxWidth: "100%" }} />
              </Container>
            </Grid>
            <Grid item xs={6}>
              <Container>
                <Typography>
                  2. Position two points close to each other to form a{" "}
                  <strong>Connection</strong>
                </Typography>
                <img src="step2.gif" style={{ maxWidth: "100%" }} />
              </Container>
            </Grid>
            <Grid item xs={6}>
              <Container>
                <Typography>
                  3. Apply the boundary condition by changing the connection
                  type
                </Typography>
                <img src="step3.gif" style={{ maxWidth: "100%" }} />
              </Container>
            </Grid>
            <Grid item xs={6}>
              <Container>
                <Typography>
                  4. Click on a connection or point to add a{" "}
                  <strong>Force</strong>
                </Typography>
                <img src="step4.gif" style={{ maxWidth: "100%" }} />
              </Container>
            </Grid>
            <Grid item xs={6}>
              <Container>
                <Typography>
                  5. Click on <strong>Solve Structure</strong> to calculate the
                  internal forces and ground reaction for the structure
                </Typography>
                <img src="step5.gif" style={{ maxWidth: "100%" }} />
              </Container>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
