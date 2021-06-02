/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as React from "react";
import { createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

interface IApplyPatchThemeProps {
  children: any;
}

export default function ApplyPatchTheme(props: IApplyPatchThemeProps) {
  const darkMode = false; //useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
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

export const inputTextStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      width: '20ch',
    },
  }),
);
