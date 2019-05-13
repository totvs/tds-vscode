import * as vscode from 'vscode';

import { inputIdentityParameters } from "../inputConnectionParameters";
import { languageClient, permissionStatusBarItem } from '../extension';
import Utils from '../utils';

export function authenticateIdentity(username: string, password: string) {

	languageClient.sendRequest('$totvsserver/authorization', {
		"authorizationInfo": {
			"email": username,
			"password": password,
		}
	}).then((response: any) => {
		Utils.savePermissionsInfos(response);
		if (response.buildType == 1) {
			vscode.window.showInformationMessage("Allow only compile users functions.");
		}
	}, (err) => {
		validErrorIdentity(err);
	});
};

export function identityLogin() {
	inputIdentityParameters();
}

export function identityLogout() {
	const config = Utils.getServersConfig();

	if (config.permissions.authorizationToken) {
		const infos = {
			"authorizationToken": "",
			"email": config.permissions.email
		}
		Utils.savePermissionsInfos(infos);
	}

	const msg = "User successfully logged out from Identity.";
	vscode.window.showInformationMessage(msg);
}

export function identitySelectAction() {
	vscode.window.showQuickPick([
		{ label: "Compile Key", target: "totvs-developer-studio.compile.key" },
		{ label: "Login", target: "totvs-developer-studio.identity.login" },
		{ label: "Logout", target: "totvs-developer-studio.identity.logout" }
	], {
			placeHolder: 'Select the action for Identity.'
		}).then((result) => {
			if (result) {
				vscode.commands.executeCommand(result.target);
			}
		});
}

function validErrorIdentity(object) {
	console.log(object);
}



export function updatePermissionBarItem(infos: any | undefined): void {
	if (infos.authorizationToken) {
		const expiryDate: Date = new Date(infos.expiry);

		if (expiryDate.getTime() >= new Date().getTime()) {
			const newLine = "\n";
			permissionStatusBarItem.text = 'Permissions: Logged in';
			if (infos.machineId) {
				permissionStatusBarItem.tooltip = infos.machineId + newLine;
			}else if(infos.userId){
				permissionStatusBarItem.tooltip = infos.userId + newLine;

			}
			permissionStatusBarItem.tooltip += "Expires in " + expiryDate.toLocaleString() + newLine;

			if (infos.buildType == 0) {
				permissionStatusBarItem.tooltip += "Allow compile functions and overwrite default TOTVS";
			} else if (infos.buildType == 1) {
				permissionStatusBarItem.tooltip += "Allow only compile users functions";
			} else if (infos.buildType == 2) {
				permissionStatusBarItem.tooltip += "Allow compile functions";
			}
		} else {
			permissionStatusBarItem.text = 'Permissions: Expired in ' + expiryDate.toLocaleString();
			permissionStatusBarItem.tooltip = "";
		}
	} else {
		permissionStatusBarItem.text = 'Permissions: NOT logged in';
		permissionStatusBarItem.tooltip = "";
	}
	permissionStatusBarItem.show();
}