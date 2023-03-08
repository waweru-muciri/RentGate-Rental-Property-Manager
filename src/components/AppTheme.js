import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

function AppTheme(props) {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#0d47a1",
      },
      success: {
        main: "#4caf50",
      },
      info: {
        main: "#2196f3",
      },
      warning: {
        main: "#ff9800",
      },
    },
  });
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default AppTheme;
