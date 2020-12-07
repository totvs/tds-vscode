import { FormControl, Grid, Input, InputLabel, Paper, TextField, Typography } from "@material-ui/core";
import * as React from "react";
import { IPatchFileInfo, PATCH_ERROR_CODE } from "../applyPatchData";
import { renderStatus } from "./applyPatchPanelMemento";

interface IApplyDetailPanel {
	vscode: any;
	patchFileInfo: IPatchFileInfo;
}

function solutionProposal(rowData: any) {
	let message: string = "";

	if (rowData.data) {
		switch (rowData.data.error_number) {
			case PATCH_ERROR_CODE.OK:
				break;
			case PATCH_ERROR_CODE.OLD_RESOURCES:
				message = "Enable Apply old resource or remove file.";
				break;
			case PATCH_ERROR_CODE.APPLY_DENIED:
				message = "Remove file and select another.";
				break;
			default:
			message = "See log appServer for details."
				break;
		}
		return (
			<Typography color="secondary">
				{message}
			</Typography>
		)
	}

	return <></>
}

export function ApplyDetailPanel(props: IApplyDetailPanel) {
	const rowData: IPatchFileInfo = props.patchFileInfo;

	return (
		<Paper variant="outlined">
			<Grid xs={11}
				container item
				direction="row"
				spacing={3}
				alignItems="flex-start"
			>
				<Grid item xs={10}><TextField disabled margin="dense" size="small" fullWidth label="Full Path" value={rowData.fullpath} /></Grid>
				<Grid item xs={2}><TextField disabled margin="dense" size="small" fullWidth label="Size" value={rowData.size} /></Grid>
				{rowData.message &&
					<>
						<Grid item xs={1}>{renderStatus(rowData)}</Grid>
						<Grid item xs={11}>
							<TextField disabled margin="dense" size="small" fullWidth
								multiline={true}
								label="Message" value={rowData.message} error={rowData.status === 'error'}
								helperText={solutionProposal(rowData)} />
						</Grid>
					</>
				}
			</Grid>
		</Paper>
	)
}