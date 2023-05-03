import { Variable } from "../models/Variable";
import { Container, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface Props {
  solution: Variable[];
}

export function SolutionTable(props: Props) {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderRadius: "0.5rem",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: "black",
        maxWidth: "300px",
        position: "fixed",
        right: "0.5rem",
        top: "4.5rem",
        display: "flex",
        flexDirection: "column",
        bottom: "10rem",
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
        Solution
      </Typography>
      <TableContainer
        sx={{
          maxWidth: "100%",
          maxHeight: "90%",
          marginTop: "1rem",
          borderTop: "3px black solid",
        }}
      >
        <Table aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Variable</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.solution.map((variable) => (
              <TableRow key={variable.symbol}>
                <TableCell>{variable.symbol}</TableCell>
                <TableCell>{variable.value.toFixed(2)} N</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
