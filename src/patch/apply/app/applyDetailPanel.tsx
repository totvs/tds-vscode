import { FormControl, Grid, Input, InputLabel, Paper, TextField, Typography } from "@material-ui/core";
import * as React from "react";
import { IPatchFileInfo } from "../applyPathData";
import { renderStatus } from "./applyPathPanelMemento";

interface IApplyDetailPanel {
	vscode: any;
	patchFileInfo: IPatchFileInfo;
}

function solutionProposal(rowData: any) {
	if ((rowData.data) && (rowData.data.error_number == 1)) //
	{
	//   const doClick = (event: React.SyntheticEvent, status: string) => {
	// 	event.preventDefault();
	// 	rowData.status = status;
	//   }
	  return (
		// <ButtonGroup size="small" color="secondary">
		//   <Button onClick={(event) => doClick(event, "applyOldResources")}>Apply old resource</Button>
		//   <Button onClick={(event) => doClick(event, "cancelApply")}>Cancel apply</Button>
		// </ButtonGroup>
		<Typography color="secondary">
		  Enable Apply old resource or remove file.
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
							label="Message" value={rowData.message} error={rowData.status === 'error'}
							helperText={solutionProposal(rowData)}/>
						</Grid>
					</>
				}
			</Grid>
		</Paper>
	)
}