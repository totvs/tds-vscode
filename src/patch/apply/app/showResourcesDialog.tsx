import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Paper,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { i18n } from "../helper";
import { cellDefaultStyle } from "./applyPatchInterface";
import { applyPatchIcons } from "../helper/applyPatchIcons";

export interface ShowResourcesDialogProps {
  open: boolean;
  resources: any[];
  onClose: () => void;
}

function headCells(): any[] {
  return [
    {
      field: "file",
      title: i18n.localize("RESOURCE", "Resource"),
      ...cellDefaultStyle,
    },
    {
      field: "datePatch",
      title: i18n.localize("PACK", "Patch"),
      ...cellDefaultStyle,
    },
    {
      field: "dateRpo",
      title: i18n.localize("RPO", "RPO"),
      ...cellDefaultStyle,
    },
  ];
}

export default function ShowResourcesDialog(props: ShowResourcesDialogProps) {
  const { onClose, resources, open } = props;

  const handleClose = (event: {}, reason: string) => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        {i18n.localize("DLG_TITLE_SHOW_RESOURCES", "Resources")}
      </DialogTitle>
      <DialogContent dividers={true}>
            <MaterialTable
          localization={i18n.materialTableLocalization}
          icons={applyPatchIcons.table}
              columns={headCells()}
              data={resources}
              options={{
                filtering: true,
                toolbar: false,
                showTitle: false,
              }}
            />
        <DialogActions>
          <Button
            onClick={(event) => {
              handleClose(event, "");
            }}
          >
            {i18n.localize("CLOSE", "Close")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
