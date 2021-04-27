import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold",
    },
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  },
  palette: {
    primary: { main: "#3A8DFF", face: "#FFFFFF" },
    secondary: { main: "#B0B0B0" },
  },
});
