import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

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

import { languageClient } from './extension';
import { ResponseError } from 'vscode-languageclient';
import { ServerItem } from './serverItemProvider';
import { CompileResult } from './compile/CompileResult';
import { _debugEvent } from './debug';
import { IRpoInfoData as RpoInfoResult } from './rpoInfo/rpoPath';
import { IRpoToken } from './rpoToken';
import Utils from './utils';

export enum ConnTypeIds {
  CONNT_DEBUGGER = 3,
  CONNT_MONITOR = 13,
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

export function sendDisconnectRequest(
  connectedServerItem: ServerItem
): Thenable<ITokenInfo> {
  return languageClient
    .sendRequest('$totvsserver/disconnect', {
      disconnectInfo: {
        connectionToken: connectedServerItem.token,
        serverName: connectedServerItem.label,
      },
    })
    .then(
      (disconnectInfo: DisconnectReturnInfo) => {
        if (disconnectInfo !== undefined && disconnectInfo.code === undefined) {
          return {
            sucess: false,
            token: '',
            needAuthentication: connectedServerItem.secure === 1,
          };
        } else {
          return {
            sucess: true,
            token: connectedServerItem.token,
            needAuthentication: connectedServerItem.secure === 1,
          };
        }
      },
      (err: ResponseError<object>) => {
        return {
          sucess: false,
          token: '',
          needAuthentication: connectedServerItem.secure === 1,
        };
      }
    );
}

export function sendConnectRequest(
  serverItem: ServerItem,
  environment: string,
  connType: ConnTypeIds
): Thenable<ITokenInfo> {
  let thisServerType = 0;

  if (serverItem.type === 'totvs_server_protheus') {
    thisServerType = 1;
  } else if (serverItem.type === 'totvs_server_logix') {
    thisServerType = 2;
  }

  return languageClient
    .sendRequest('$totvsserver/connect', {
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
        autoReconnect: true,
      },
    })
    .then(
      (connectionNode: ConnectionNode) => {
        let token: string = connectionNode.connectionToken;
        if (token) {
          return {
            sucess: true,
            token: token,
            needAuthentication: connectionNode.needAuthentication,
          };
        } else {
          return { sucess: false, token: '', needAuthentication: false };
        }
      },
      (err: ResponseError<object>) => {
        return { sucess: false, token: '', needAuthentication: false };
      }
    );
}

export const ENABLE_CODE_PAGE = {
  CP1252: 'CP1252', //demais idiomas
  CP1251: 'CP1251', //cirílico
};

export function sendAuthenticateRequest(
  serverItem: ServerItem,
  environment: string,
  user: string,
  password: string,
  encoding: string
): Thenable<IAuthenticationInfo> {
  return languageClient
    .sendRequest('$totvsserver/authentication', {
      authenticationInfo: {
        connectionToken: serverItem.token,
        environment: environment,
        user: user,
        password: password,
        encoding: encoding,
      },
    })
    .then(
      (authenticationNode: AuthenticationNode) => {
        let token: string = authenticationNode.connectionToken;
        if (token) {
          return { sucess: true, token: token };
        } else {
          return { sucess: false, token: token };
        }
      },
      (err: ResponseError<object>) => {
        return { sucess: false, token: '' };
      }
    );
}

export function sendReconnectRequest(
  serverItem: ServerItem,
  connectionToken: string,
  _connType: ConnTypeIds
): Thenable<IReconnectInfo> {
  return languageClient
    .sendRequest('$totvsserver/reconnect', {
      reconnectInfo: {
        connectionToken: connectionToken,
        serverName: serverItem.name,
        connType: _connType,
      },
    })
    .then(
      (reconnectNode: ReconnectNode) => {
        let token: string = reconnectNode.connectionToken;
        if (token) {
          return {
            sucess: true,
            environment: reconnectNode.environment,
            user: reconnectNode.user,
            token: token,
          };
        } else {
          return { sucess: false, environment: '', user: '', token: '' };
        }
      },
      (error: any) => {
        return { sucess: false, environment: '', user: '', token: '' };
      }
    );
}

export function sendValidationRequest(
  addres: string,
  port: number
): Thenable<IValidationInfo> {
  if (typeof port !== 'number') {
    port = parseInt(port);
  }

  return languageClient
    .sendRequest('$totvsserver/validation', {
      validationInfo: {
        server: addres,
        port: port,
      },
    })
    .then(
      (validInfoNode: NodeInfo) => {
        return {
          build: validInfoNode.buildVersion,
          secure: validInfoNode.secure ? true : false,
        };
      },
      (err: ResponseError<object>) => {
        return {
          build: '',
          secure: false,
        };
      }
    );
}

export function sendGetUsersRequest(server: ServerItem): Thenable<any> {
  return languageClient
    .sendRequest('$totvsmonitor/getUsers', {
      getUsersInfo: {
        connectionToken: server.token,
      },
    })
    .then(
      (response: any) => {
        return response.mntUsers;
      },
      (err: Error) => {
        languageClient.error(err.message, err);
      }
    );
}

export function sendLockServer(
  server: ServerItem,
  lock: boolean
): Thenable<boolean> {
  return languageClient
    .sendRequest('$totvsmonitor/setConnectionStatus', {
      setConnectionStatusInfo: {
        connectionToken: server.token,
        status: !lock, //false: conexões bloqueadas
      },
    })
    .then((response: any) => {
      return response.message === 'OK';
    });
}

export function sendIsLockServer(server: ServerItem): Thenable<boolean> {
  return languageClient
    .sendRequest('$totvsmonitor/getConnectionStatus', {
      getConnectionStatusInfo: {
        connectionToken: server.token,
      },
    })
    .then((response: any) => {
      return !response.status; //false: conexões bloqueadas
    });
}

export function sendKillConnection(
  server: ServerItem,
  target: any
): Thenable<string> {
  return languageClient
    .sendRequest('$totvsmonitor/killUser', {
      killUserInfo: {
        connectionToken: server.token,
        userName: target.username,
        computerName: target.computerName,
        threadId: target.threadId,
        serverName: target.server,
      },
    })
    .then(
      (response: any) => {
        return response.message;
      },
      (error: Error) => {
        return error.message;
      }
    );
}

export function sendStopServer(server: ServerItem): Thenable<string> {
  return languageClient
    .sendRequest('$totvsserver/stopServer', {
      stopServerInfo: {
        connectionToken: server.token,
      },
    })
    .then(
      (response: any) => {
        return response.message;
      },
      (error: Error) => {
        return error;
      }
    );
}

export function sendUserMessage(
  server: ServerItem,
  target: any,
  message: string
): Thenable<string> {
  return languageClient
    .sendRequest('$totvsmonitor/sendUserMessage', {
      sendUserMessageInfo: {
        connectionToken: server.token,
        userName: target.username,
        computerName: target.computerName,
        threadId: target.threadId,
        server: target.server,
        environment: target.environment,
        message: message,
      },
    })
    .then(
      (response: any) => {
        return response.message;
      },
      (error: Error) => {
        return error.message;
      }
    );
}

export function sendAppKillConnection(
  server: ServerItem,
  target: any
): Thenable<string> {
  return languageClient
    .sendRequest('$totvsmonitor/appKillUser', {
      appKillUserInfo: {
        connectionToken: server.token,
        userName: target.username,
        computerName: target.computerName,
        threadId: target.threadId,
        serverName: target.server,
      },
    })
    .then(
      (response: any) => {
        return response.message;
      },
      (error: Error) => {
        return error.message;
      }
    );
}

export function sendCompilation(
  server: ServerItem,
  includesUris: string[],
  filesUris: string[],
  compileOptions,
  extensionsAllowed: string[],
  hasAdvplsource: boolean
): Thenable<CompileResult> {
  if (_debugEvent) {
    return Promise.reject(
      new Error('This operation is not allowed during a debug.')
    );
  }

  return languageClient.sendRequest('$totvsserver/compilation', {
    compilationInfo: {
      connectionToken: server.token,
      authorizationToken: Utils.getAuthorizationToken(server),
      environment: server.environment,
      includeUris: includesUris,
      fileUris: filesUris,
      compileOptions: compileOptions,
      extensionsAllowed: extensionsAllowed,
      includeUrisRequired: hasAdvplsource,
    },
  });
}

export function sendRpoInfo(server: ServerItem): Thenable<RpoInfoResult> {
  if (_debugEvent) {
    return Promise.reject(
      new Error('This operation is not allowed during a debug.')
    );
  }

  return languageClient
    .sendRequest('$totvsserver/rpoInfo', {
      rpoInfo: {
        connectionToken: server.token,
        environment: server.environment,
      },
    })
    .then((response: RpoInfoResult) => {
      return response;
    });
}

export function sendPatchInfo(
  server: ServerItem,
  patchUri: string
): Thenable<any> {
  if (_debugEvent) {
    return Promise.reject(
      new Error('This operation is not allowed during a debug.')
    );
  }

  return languageClient
    .sendRequest('$totvsserver/patchInfo', {
      patchInfoInfo: {
        connectionToken: server.token,
        authorizationToken: Utils.getAuthorizationToken(server),
        environment: server.environment,
        patchUri: patchUri,
        isLocal: true,
      },
    })
    .then(
      (response: any) => {
        return response.patchInfos;
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
      }
    );
}

export interface IApplyTemplateResult {
  error: boolean;
  message: string;
  errorCode: number;
}

export function sendApplyTemplateRequest(
  server: ServerItem,
  includesUris: Array<string>,
  templateUri: vscode.Uri
): Thenable<IApplyTemplateResult> {
  return languageClient
    .sendRequest('$totvsserver/templateApply', {
      templateApplyInfo: {
        connectionToken: server.token,
        authorizationToken: '',
        environment: server.environment,
        includeUris: includesUris,
        templateUri: templateUri.toString(),
        isLocal: true,
      },
    })
    .then(
      (response: IApplyTemplateResult) => {
        if (response.error) {
          return Promise.reject(response);
        }
        return Promise.resolve(response);
      },
      (err: ResponseError<object>) => {
        const error: IApplyTemplateResult = {
          error: true,
          message: err.message,
          errorCode: err.code,
        };
        return Promise.reject(error);
      }
    );
}

interface IRpoTokenResult {
  sucess: boolean;
  message: string;
}

export function sendRpoToken(
  server: ServerItem,
  rpoToken: IRpoToken
): Thenable<IRpoTokenResult> {
  if (rpoToken.token === '') {
    return Promise.resolve({ sucess: false, message: '' });
  }

  return languageClient
    .sendRequest('$totvsserver/rpoToken', {
      rpoToken: {
        connectionToken: server.token,
        environment: server.environment,
        file: '<internal string>', //rpoToken.file,
        content: rpoToken.token,
      },
    })
    .then(
      (response: IRpoTokenResult) => {
        return response;
      },
      (err: ResponseError<object>) => {
        return { sucess: false, message: err.message };
      }
    );
}

export interface IGetPatchDirResult {
  directory: string[];
}

export function sendGetPatchDir(
  server: ServerItem,
  folder: string,
  includeDir: boolean
): Promise<IGetPatchDirResult> {
  return languageClient
    .sendRequest('$totvsserver/getPatchDir', {
      pathDirListInfo: {
        connectionToken: server.token,
        environment: server.environment,
        folder: folder,
        includeDir: includeDir,
      },
    })
    .then((response: IGetPatchDirResult) => {
      return response;
    });
}
function showWarningMessage(arg0: any) {
  throw new Error('Function not implemented.');
}
