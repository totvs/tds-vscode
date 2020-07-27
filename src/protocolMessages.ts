import * as vscode from "vscode";

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

import { languageClient } from "./extension";
import { ResponseError } from "vscode-languageclient";
import { ServerItem } from "./serverItemProvider";
import { CompileResult } from "./compile/compileResult";

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

// Tira acento proveniente do UTF-8, não compativel com o ANSI
function toAscii(text: String): string {
  return text.split("").map(function(c) {
    let n = c.charCodeAt(0);

    // console.log(n)
    switch (n) {
      case 192: return 'A';
      case 193: return 'A';
      case 194: return 'A';
      case 195: return 'A';
      case 196: return 'A';
      case 197: return 'A';
      case 199: return 'C';
      case 200: return 'E';
      case 201: return 'E';
      case 202: return 'E';
      case 203: return 'E';
      case 204: return 'I';
      case 205: return 'I';
      case 206: return 'I';
      case 207: return 'I';
      case 208: return 'D';
      case 209: return 'N';
      case 210: return 'O';
      case 211: return 'O';
      case 212: return 'O';
      case 213: return 'O';
      case 214: return 'O';
      case 216: return 'O';
      case 217: return 'U';
      case 218: return 'U';
      case 219: return 'U';
      case 220: return 'U';
      case 224: return 'a';
      case 225: return 'a';
      case 226: return 'a';
      case 227: return 'a';
      case 228: return 'a';
      case 229: return 'a';
      case 231: return 'c';
      case 232: return 'e';
      case 233: return 'e';
      case 234: return 'e';
      case 235: return 'e';
      case 236: return 'i';
      case 237: return 'i';
      case 238: return 'i';
      case 239: return 'i';
      case 240: return 'e';
      case 241: return 'n';
      case 242: return 'o';
      case 243: return 'o';
      case 244: return 'o';
      case 245: return 'o';
      case 246: return 'o';
      case 248: return 'o';
      case 249: return 'u';
      case 250: return 'u';
      case 251: return 'u';
      case 252: return 'u';
      case 253: return 'y';
      case 255: return 'y';
      case 296: return 'I';
      case 297: return 'i';
      case 352: return 'S';
      case 353: return 's';
      case 360: return 'U';
      case 361: return 'u';
      case 376: return 'Y';
      case 381: return 'Z';
      case 382: return 'z';
      case 7868: return 'E';
      case 7869: return 'e';

      // Caracteres Fn
      case 170: return 'a'; // ª
      case 185: return '1'; // ¹
      case 178: return '2'; // ²
      case 179: return '3'; // ³
      case 163: return 'L'; // £
      case 162: return 'c'; // ¢
      case 172: return ''; // ¬
      case 167: return ''; // §

      default: return c;
    }
  }).join("");
}

export function sendDisconnectRequest(
  connectedServerItem: ServerItem
): Thenable<ITokenInfo> {
  return languageClient
    .sendRequest("$totvsserver/disconnect", {
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
            token: "",
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
          token: "",
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

  if (serverItem.type === "totvs_server_protheus") {
    thisServerType = 1;
  } else if (serverItem.type === "totvs_server_logix") {
    thisServerType = 2;
  }

  return languageClient
    .sendRequest("$totvsserver/connect", {
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
          return { sucess: false, token: "", needAuthentication: false };
        }
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
        return { sucess: false, token: "", needAuthentication: false };
      }
    );
}

export function sendAuthenticateRequest(
  serverItem: ServerItem,
  environment: string,
  user: string,
  password: string
): Thenable<IAuthenticationInfo> {
  return languageClient
    .sendRequest("$totvsserver/authentication", {
      authenticationInfo: {
        connectionToken: serverItem.token,
        environment: environment,
        user: user,
        password: password,
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
        vscode.window.showErrorMessage(err.message);
        return { sucess: false, token: "" };
      }
    );
}

export function sendReconnectRequest(
  serverItem: ServerItem,
  connectionToken: string,
  _connType: ConnTypeIds
): Thenable<IReconnectInfo> {
  return languageClient
    .sendRequest("$totvsserver/reconnect", {
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
          return { sucess: false, environment: "", user: "", token: "" };
        }
      },
      (error: any) => {
        vscode.window.showErrorMessage(error.message);
        return { sucess: false, environment: "", user: "", token: "" };
      }
    );
}

export function sendValidationRequest(
  addres: string,
  port: number
): Thenable<IValidationInfo> {
  if (typeof port !== "number") {
    port = parseInt(port);
  }

  return languageClient
    .sendRequest("$totvsserver/validation", {
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
        vscode.window.showErrorMessage(err.message);
        return {
          build: "",
          secure: false,
        };
      }
    );
}

export function sendGetUsersRequest(server: ServerItem): Thenable<any> {
  return languageClient
    .sendRequest("$totvsmonitor/getUsers", {
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
    .sendRequest("$totvsmonitor/setConnectionStatus", {
      setConnectionStatusInfo: {
        connectionToken: server.token,
        status: !lock, //false: conexões bloqueadas
      },
    })
    .then((response: any) => {
      return response.message === "OK";
    });
}

export function sendIsLockServer(
  server: ServerItem
): Thenable<boolean> {
  return languageClient
    .sendRequest("$totvsmonitor/getConnectionStatus", {
      getConnectionStatusInfo: {
        connectionToken: server.token      },
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
    .sendRequest("$totvsmonitor/killUser", {
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
    .sendRequest("$totvsserver/stopServer", {
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
    .sendRequest("$totvsmonitor/sendUserMessage", {
      sendUserMessageInfo: {
        connectionToken: server.token,
        userName: target.username,
        computerName: target.computerName,
        threadId: target.threadId,
        server: target.server,
        message: toAscii(message), //todo: melhorar
      }
    }).then(
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
    .sendRequest("$totvsmonitor/appKillUser", {
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
  permissionsInfos,
  includesUris,
  filesUris,
  compileOptions,
  extensionsAllowed,
  hasAdvplsource
): Thenable<CompileResult> {
  return languageClient.sendRequest("$totvsserver/compilation", {
    compilationInfo: {
      connectionToken: server.token,
      authorizationToken: permissionsInfos.authorizationToken,
      environment: server.environment,
      includeUris: includesUris,
      fileUris: filesUris,
      compileOptions: compileOptions,
      extensionsAllowed: extensionsAllowed,
      includeUrisRequired: hasAdvplsource,
    },
  });
}
