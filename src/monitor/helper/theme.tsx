import * as React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

interface IMonitorThemeProps {
  children: any;
}

export default function MonitorTheme(props: IMonitorThemeProps) {
  const darkMode = false; //useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: darkMode ? "dark" : "light",
        },
        overrides: {
          MuiPaper: {
            root: {
              backgroundColor: "#FDFDFD",
              padding: 6,
            },
            outlined: {
              borderLeftStyle: "solid",
              borderLeftWidth: 5,
              borderLeftColor: "#EA9B3E",
            },
          },
          MuiDialog: {
            paper: {
              backgroundColor: "#FDFDFD",
            },
          },
          MuiCard: {},
          MuiCardHeader: {
            root: {},
            title: {
              color: "silver",
              fontSize: "medium",
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
