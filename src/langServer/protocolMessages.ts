import * as vscode from 'vscode';
import * as fs from 'fs';
interface ConnectionNode {
	// These properties come directly from the language server.
	id: any;
	osType: number;
	connectionToken: string;
	needAuthentication: boolean;
}

interface AuthenticationNode {
	// These properties come directly from the language server.
	id: any;
	osType: number;
	connectionToken: string;
}

import * as path from 'path';
import * as nls from 'vscode-nls';
import { ServerItem } from '../serversView';
import { languageClient } from '../extension';
import { ResponseError } from 'vscode-languageclient';

export enum ConnTypeIds {
	CONNT_DEBUGGER = 3,
	CONNT_MONITOR = 13
}

export interface ITokenInfo {
	sucess: boolean;
	token: string;
	needAuthentication: boolean;
}

export interface IAuthenticationInfo {
	sucess: boolean;
	token: string;
}

export interface IReconnectInfo {
	sucess: boolean;
	token: string;
	environment: string;
	user: string;
}

export interface IValidationInfo {
	build: string;
	secure: boolean;
}

interface ReconnectNode {
	connectionToken: string;
	environment: string;
	user: string;
}

interface NodeInfo {
	id: any;
	buildVersion: string;
	secure: number;
}

class DisconnectReturnInfo {
	id: any;
	code: any;
	message: string;
}

export function sendDisconnectRequest(connectedServerItem: ServerItem, ): Thenable<ITokenInfo> {
	return languageClient.sendRequest('$totvsserver/disconnect', {
		disconnectInfo: {
			connectionToken: connectedServerItem.token,
			serverName: connectedServerItem.label
		}
	}).then((disconnectInfo: DisconnectReturnInfo) => {
		if (disconnectInfo !== undefined && disconnectInfo.code === undefined) {
			return { sucess: false, token: "", needAuthentication: false };
		} else {
			return { sucess: true, token: connectedServerItem.token, needAuthentication: true };
		}
	}, (err: ResponseError<object>) => {
	});
}

export function sendConnectRequest(serverItem: ServerItem, environment: string, connType: ConnTypeIds): Thenable<ITokenInfo> {
	let thisServerType = 0;

	if (serverItem.type === "totvs_server_protheus") {
		thisServerType = 1;
	}
	else if (serverItem.type === "totvs_server_logix") {
		thisServerType = 2;
	}

	return languageClient.sendRequest('$totvsserver/connect', {
		connectionInfo: {
			connType: connType,
			serverName: serverItem.name,
			identification: serverItem.id,
			serverType: thisServerType,
			server: serverItem.address,
			port: serverItem.port,
			buildVersion: serverItem.buildVersion,
			bSecure: serverItem.secure ? 1 : 0,
			environment: environment,
			autoReconnect: true
		}
	}).then((connectionNode: ConnectionNode) => {
		let token: string = connectionNode.connectionToken;
		if (token) {
			return { sucess: true, token: token, needAuthentication: connectionNode.needAuthentication };
		} else {
			return { sucess: false, token: "", needAuthentication: false };
		}
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

export function sendAuthenticateRequest(serverItem: ServerItem, environment: string, user: string, password: string): Thenable<IAuthenticationInfo> {
	return languageClient.sendRequest('$totvsserver/authentication', {
		authenticationInfo: {
			connectionToken: serverItem.token,
			environment: environment,
			user: user,
			password: password
		}
	}).then((authenticationNode: AuthenticationNode) => {
		let token: string = authenticationNode.connectionToken;
		if (token) {
			return { sucess: true, token: token };
		} else {
			return { sucess: false, token: token };
		}
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

export function sendReconnectRequest(serverItem: ServerItem, connectionToken: string, environment: string, _connType: ConnTypeIds): Thenable<IReconnectInfo> {
	return languageClient.sendRequest('$totvsserver/reconnect', {
		reconnectInfo: {
			connectionToken: connectionToken,
			serverName: serverItem.label,
			connType: _connType
		}
	}).then((reconnectNode: ReconnectNode) => {
		let token: string = reconnectNode.connectionToken;
		if (token) {
			return { sucess: true, environment: reconnectNode.environment, user: reconnectNode.user, token: token };
		} else {
			return { sucess: false, environment: "", user: "", token: "" };
		}
	}, (error: any) => {
		vscode.window.showErrorMessage(error.message);
	});

}

export function sendValidationRequest(addres: string, port: number): Thenable<IValidationInfo> {
	return languageClient.sendRequest('$totvsserver/validation', {
		validationInfo: {
			server: addres,
			port: port
		}
	}).then((validInfoNode: NodeInfo) => {
		return { build: validInfoNode.buildVersion, secure: validInfoNode.secure ? true : false };
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

export function sendGetUsersRequest(server: ServerItem): Thenable<any> {
	return languageClient.sendRequest('$totvsmonitor/getUsers', {
		getUsersInfo: {
			connectionToken: server.token
		}
	}).then((response: any) => {
		return response.mntUsers;
	},
		((err: Error) => {
			languageClient.error(err.message, err);
		})
	);
}
