import { makeStyles } from "@mui/styles";

const style = makeStyles({
  tableHead: {
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f9f9f9",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#e0e0e0",
    },
  },
});

export default style;
