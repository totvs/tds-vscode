import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import * as React from "react";

interface IPatchViewPanel {
  vscode: any;
}

let listener = undefined;

export function PatchView(props: IPatchViewPanel) {
  const [patchFileInfo, setPatchFileInfo] = React.useState({
    file: "",
    size: 0,
  });

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const { type, body, requestId } = event.data;
      switch (type) {
        case "init": {
          setPatchFileInfo({ file: body.file, size: body.size });
          break;
        }
        case "getFileData": {
          // // Get the image data for the canvas and post it back to the extension.
          // editor.getImageData().then(data => {
          // 	vscode.postMessage({ type: 'response', requestId, body: Array.from(data) });
          // });
          return;
        }
      }
    };

    window.addEventListener("message", listener);
    props.vscode.postMessage({ type: "ready" });
  }

  return (
    <Paper variant="outlined">
      <Grid
        xs={11}
        container
        item
        direction="row"
        spacing={3}
        alignItems="flex-start"
      >
        <Grid item xs={9}>
          <TextField
            disabled
            margin="dense"
            size="small"
            fullWidth
            label="Full Path"
            value={patchFileInfo.file}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            disabled
            margin="dense"
            size="small"
            fullWidth
            label="Size"
            value={patchFileInfo.size}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
