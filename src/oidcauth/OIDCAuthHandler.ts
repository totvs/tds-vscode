//import { data } from 'cheerio/lib/api/attributes';
import * as vscode from 'vscode';
import { languageClient } from "../extension";
import { ServerItem } from "../serverItem";
import { doFinishConnectProcess } from '../serversView';
import { sendLogMsg } from "../protocolMessages";
import {
  ENABLE_CODE_PAGE,
} from "../protocolMessages";

let extensionContext: vscode.ExtensionContext;
let authContext: { serverItem: ServerItem; environment: string, userName: string} | undefined;

interface IOidcValidationResponse {
    sucess: boolean;
    authToken?: string;
}

// function decodeJwtPayload(jwtToken: string): Record<string, unknown> | null {
//     try {
//         const parts = jwtToken.split('.');
//         if (parts.length !== 3) { return null; }
//         const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
//         const json = Buffer.from(base64, 'base64').toString('utf-8');
//         return JSON.parse(json);
//     } catch {
//         return null;
//     }
// }

// function isJwtExpired(jwtToken: string): boolean {
//     const payload = decodeJwtPayload(jwtToken);
//     if (!payload || typeof payload.exp !== 'number') { return true; }
//     return Date.now() >= payload.exp * 1000;
// }

// function extractUsernameFromJwt(jwtToken: string): string {
//     const payload = decodeJwtPayload(jwtToken);
//     if (!payload) { return ''; }
//     return (
//         (payload.preferred_username as string) ||
//         (payload.email as string) ||
//         (payload.sub as string) ||
//         ''
//     );
// }

async function storeTokenForUser(serverAddress: string, environment: string, userName: string, token: string): Promise<void> {
    await extensionContext.secrets.store(`oidc_token_${serverAddress}_${environment}_${userName}`, token);
}

export async function getStoredOidcTokenForUser(serverAddress: string, environment: string, userName: string): Promise<string | undefined> {
    if (!extensionContext) { return undefined; }
    return extensionContext.secrets.get(`oidc_token_${serverAddress}_${environment}_${userName}`);
}

export async function clearOIDCToken(serverItem: ServerItem, serverAddress: string, environment: string, userName: string): Promise<boolean> {
    if (!extensionContext) { return false; }
    const existing = await getStoredOidcTokenForUser(serverAddress, environment, userName);
    if (!existing) { return false; }
    await extensionContext.secrets.delete(`oidc_token_${serverAddress}_${environment}_${userName}`);
    serverItem.hasOIDCToken = false;
    return true;
}

export function setOidcAuthContext(serverItem: ServerItem, environment: string, userName: string): void {
    authContext = { serverItem: serverItem, environment: environment, userName:  userName };
}

export async function tryOidcAutoLogin( serverItem: ServerItem,  environment: string, userName: string, authHash: string): Promise<{ success: boolean; connectionToken: string }> {
    if (!authHash) { return { success: false, connectionToken: '' }; }

    // if (isJwtExpired(oidcToken)) {
    //     // Token expired: return failure so the language server can re-send the OIDC URL notification
    //     return { success: false, connectionToken: '' };
    // }

    // Token still valid: send to language server for validation
    try {
        const response = await sendOidcValidateTokenMsg(serverItem, environment, userName, authHash);
        return { success: response.sucess, connectionToken: serverItem.token };
    } catch {
        return { success: false, connectionToken: ''};
    }
}

export class OIDCAuthUriHandler implements vscode.UriHandler {
    private _onDidAuthenticate = new vscode.EventEmitter<string>();
    public readonly onDidAuthenticate = this._onDidAuthenticate.event;
    private logger: vscode.OutputChannel;


    constructor(logger: vscode.OutputChannel) {
        this.logger = logger;
    }

    handleUri(uri: vscode.Uri): void {
        //this.logger.append(`HANDLE URI do callback acionado: ${uri.toString()}`);
        //this.logger.appendLine(`URI Path: ${uri.path}`);
        sendLogMsg(`HANDLE URI do callback acionado: ${uri.toString()}`);
        sendLogMsg(`URI Path: ${uri.path}`);

        //let decodedUri = decodeURI(uri.toString());

        if (uri.path.includes('callback')) {
            const queryParams = new URLSearchParams(uri.query);
            //const queryParams = new URLSearchParams(decodedUri);
            let code = queryParams.get('code');

            if (code) {
                //this.logger.appendLine(`Código recebido: ${code}`);
                sendLogMsg(`Código recebido: ${code}`);
                this._onDidAuthenticate.fire(code);
            } else {
                //this.logger.appendLine(`Parâmetro ?code= não encontrado na URI!`);
                sendLogMsg(`Parâmetro ?code= não encontrado na URI!`);
            }
        }
    }
}

async function sendOidcValidateTokenMsg(serverItem: ServerItem, environment: string, userName: string, authHash: string): Promise<IOidcValidationResponse | undefined> {
    const enconding: string =
        vscode.env.language === "ru"
          ? ENABLE_CODE_PAGE.CP1251
          : ENABLE_CODE_PAGE.CP1252;

    const response = await languageClient.sendRequest("$totvsserver/validOidcToken", {
        //PS: Quando o nome do parametro é o mesmo da variavel, nao precisa fazer como authHash: authHash, pode ser só o nome mesmo
       oidcTokenInfo: {
            environment,
            userName,
            connectionToken: serverItem.token,
            authHash,
            enconding
        }
    }) as IOidcValidationResponse;
    return response;
}

export async function OIDCLogin(
    context: vscode.ExtensionContext,
    uriHandler: OIDCAuthUriHandler,
    logger: vscode.OutputChannel,
    url: string,
    serverItem: ServerItem,
    environment: string,
    userName: string
): Promise<IOidcValidationResponse | undefined> {
    const scheme = vscode.env.uriScheme;
    const extensionId = context.extension.id;

    sendLogMsg(`OIDCLogin chamado.`);

    const redirectUri = `${scheme}://${extensionId}/callback`;

    //logger.appendLine(`redirect URI: ${redirectUri}`);
    
    //const authUrlManual = `http://172.16.1.21:3000/auth?redirect_uri=${encodeURIComponent(redirectUri)}`;
    // A url abaixo, estou mandando sem o ? inicial pois deu problema quando o App do Frame recebeu esse char, 
    //entao combinamos que eles vai adicionar isso
    const authUrl = url + `redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    sendLogMsg(`AuthUrl: ${authUrl}`);
    //logger.appendLine(`Url Manual: ${authUrlManual}`);
    //logger.appendLine(`Url Server: ${authUrl}`);

    const OIDC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
    let timeoutHandle: ReturnType<typeof setTimeout>;
    let eventDisposable: vscode.Disposable;

    const codePromise = new Promise<string | null>((resolve) => {
        eventDisposable = uriHandler.onDidAuthenticate((code) => {
            clearTimeout(timeoutHandle);
            resolve(code);
        });

        timeoutHandle = setTimeout(() => {
            eventDisposable.dispose();
            resolve(null);
        }, OIDC_TIMEOUT_MS);
    });

    //logger.appendLine(`Abrindo navegador para URL de autenticação: ${authUrl}`);

    const browserOpened = await vscode.env.openExternal(vscode.Uri.parse(authUrl));
    //const browserOpened = await vscode.env.openExternal(vscode.Uri.parse(authUrlManual));
    //startWebviewLoginFlow(context, authUrl, redirectUri, logger);

    if (!browserOpened) {
        clearTimeout(timeoutHandle!);
        eventDisposable!.dispose();
        //logger.appendLine('Usuário cancelou a abertura do navegador externo.');
        vscode.window.showWarningMessage('Autenticação cancelada: o navegador externo não foi aberto.');
        return undefined;
    }

    const authHash = decodeURIComponent(await codePromise);

    sendLogMsg(`authHash depois de decodeURI: ${authHash}`);

    if (!authHash) {
        logger.appendLine('Timeout: a autenticação OIDC não foi concluída no tempo esperado.');
        vscode.window.showWarningMessage('Timeout: autenticação OIDC não concluída no tempo esperado.');
        return undefined;
    }

    //logger.appendLine(`Token recebido: ${jwtToken}`);
     if (authHash) {
        
        //await storeToken(context, authCode);
        //vscode.window.showInformationMessage(`Token recebido e armazenado com sucesso! \n : ${authCode}`);
        sendLogMsg(`Enviando mensagem para LS para validar o token OIDC recebido.`);
        const response = await sendOidcValidateTokenMsg(authContext.serverItem, environment, userName, authHash);

        if (response && response.sucess !== false) {
            //const username = extractUsernameFromJwt(jwtToken);
            sendLogMsg(`Retorno da msg para o LS: serverItem: ${serverItem} | userName: ${userName} | environment: ${environment} | authHash: ${authHash}`);
            if (serverItem !== undefined && userName && serverItem.address && environment) {
                await storeTokenForUser(serverItem.address, environment, userName, authHash);
                authContext.serverItem.token = response.authToken;

                await doFinishConnectProcess(authContext.serverItem, authContext.serverItem.token, environment);

                //logger.appendLine(`Token OIDC armazenado para o usuário: ${username}`);
            }
            vscode.window.showInformationMessage(`Autenticação OIDC concluída com sucesso.`);
        } else {
            logger.appendLine(`Validação do token OIDC falhou no servidor.`);
            vscode.window.showWarningMessage('Falha na validação do token OIDC pelo servidor.');
        }
        return response;
    }
    return undefined;
}

// async function storeToken(context: vscode.ExtensionContext, token: string) {
//     await context.secrets.store('oidc_token', token);
// }

// export async function OIDCgetToken(context: vscode.ExtensionContext) {
//      return await context.secrets.get('oidc_token');
// }

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    sendLogMsg(`OIDCAuthHandler ativado.`);

    const logger = languageClient.outputChannel;
    const uriHandler = new OIDCAuthUriHandler(logger);

    context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

    const loginCommand = vscode.commands.registerCommand('totvs-developer-studio.poc-login-oidc', async (oidcUrl?: string) => {
        try {

            let url: string | undefined = oidcUrl;

            sendLogMsg(`Comando de login por OIDC chamado. URL: ${url}`);

            if (!url || url.trim().length === 0) {
                vscode.window.showWarningMessage('O servidor informou que deve realizar autenicação com Totvs Identity mas retornou uma url vazia.');
                return
                //url = await vscode.window.showInputBox({
                //        prompt: 'Informe a URL do servidor de autenticação', // O texto que explica o que você quer
                //        placeHolder: 'http://<IP>:<PORTA>',             // O texto "fantasma" de dica
                //        ignoreFocusOut: true                               // Se true, a caixa não fecha se o usuário clicar fora dela
                        // 2. (Opcional) Validação em tempo real
                    // validateInput: (texto) => {
                    //     if (texto.trim().length === 0) {
                    //         return 'A informação não pode ficar em branco!'; // Retorna o erro em vermelho
                    //     }
                    //     if (texto.length < 3) {
                    //         return 'O texto deve ter pelo menos 3 caracteres.';
                    //     }
                    //     return null; // Retornar null indica que o texto é válido
                    // }
                //});

                // 3. Tratamento de Cancelamento
                // Se a variável for 'undefined', significa que o usuário apertou 'ESC' e cancelou a ação.
                // if (url === undefined) {
                //     vscode.window.showWarningMessage('Ação cancelada pelo usuário.');
                //     return;
                // }
            }

            //await vscode.window.withProgress(
            //    {
            //        location: vscode.ProgressLocation.Notification,
            //        title: "Autenticação TOTVS Identity",
            //        cancellable: false
           //     },
           //     async (progress) => {
            //        progress.report({ message: "Aguarde, o processo de autenticação pode demorar um pouco..." });
                    await OIDCLogin(context, uriHandler, logger, url!, authContext?.serverItem, authContext?.environment!, authContext?.userName!);
            //    }
            //);
        } catch (error) {
            //logger.error(`Falha crítica: ${error}`);
            logger.appendLine(`Falha crítica: ${error}`);
            vscode.window.showErrorMessage("Falha ao tentar fazer login.");
        }
    });

    context.subscriptions.push(loginCommand);
}

// O Codigo abaixo é um exemplo para abrir a URL de autenticação em uma Webview interna ao invés de usar o navegador externo.

// async function startWebviewLoginFlow(context: vscode.ExtensionContext, url: string, redirectUri: string, logger: vscode.OutputChannel) {
//    // const redirectUri = "meu-plugin://callback"; // Usar mensageria interna, não o "vscode://"
//     //const authUrl = `http://172.16.1.19:3000/auth?client_id=MOCK&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

//     const panel = vscode.window.createWebviewPanel(
//         'loginWebview',
//         'Autenticação Meu Plugin',
//         vscode.ViewColumn.One,
//         {
//             enableScripts: true,
//             retainContextWhenHidden: true
//         }
//     );

//     panel.webview.html = `
//         <!DOCTYPE html>
//         <html lang="pt-BR">
//         <head>
//             <meta charset="UTF-8">
//             <style>
//                 body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: white; }
//                 iframe { width: 100%; height: 100%; border: none; }
//             </style>
//         </head>
//         <body>
//             <iframe src="${url}"></iframe>

//             <script>
//                 const vscode = acquireVsCodeApi();

//                 // Escuta mensagens vindas do Iframe (do seu servidor Mock)
//                 window.addEventListener('message', event => {
//                     // O servidor mock precisa dar um window.parent.postMessage(...)
//                     if (event.data && event.data.type === 'AUTH_SUCCESS') {
//                         vscode.postMessage({
//                             command: 'login-success',
//                             code: event.data.code
//                         });
//                     }
//                 });
//             </script>
//         </body>
//         </html>
//     `;

    // panel.webview.onDidReceiveMessage(
    //     async message => {
    //         switch (message.command) {
    //             case 'login-success':
    //                 logger.appendLine(`Código recebido via Webview: ${message.code}`);
    //                 panel.dispose();

    //                 await exchangeCodeForToken(message.code, redirectUri, context, logger);
    //                 break;
    //         }
    //     },
    //     undefined,
    //     context.subscriptions
    // );
//}
