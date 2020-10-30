import { FormControl, Grid, Input, InputLabel, Paper, TextField } from "@material-ui/core";
import * as React from "react";
import { IPatchFileInfo } from "../applyPathData";
import { renderStatus, soluctionOptions } from "./applyPathPanelMemento";

interface IApplyDetailPanel {
	vscode: any;
	patchFileInfo: IPatchFileInfo;
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
							<TextField disabled margin="dense" size="small" fullWidth label="Message" value={rowData.message} error={rowData.status === 'error'} />
						</Grid>
						<Grid item xs={12} container alignContent="flex-end">{soluctionOptions(rowData)}</Grid>
					</>
				}
			</Grid>
		</Paper>
	)
}