import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";

interface Props {
  open: boolean;
  handleClose: () => void;
  load: (dataURI: string) => void;
}

export default function Load(props: Props) {
  const handleChange = (file: Blob) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      props.load(fileReader.result as string);
      props.handleClose();
    };
    fileReader.readAsDataURL(file);
  };

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
            Load
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
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["PNG"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
