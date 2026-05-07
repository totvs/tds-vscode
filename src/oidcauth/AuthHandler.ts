//import { data } from 'cheerio/lib/api/attributes';
import * as vscode from 'vscode';
import { languageClient } from "../extension";
import { ServerItem } from "../serverItem";

type LoggerType = vscode.OutputChannel & vscode.LogOutputChannel;

let extensionContext: vscode.ExtensionContext;

interface IOidcValidationResponse {
    sucess: boolean;
    connectionToken?: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) { return null; }
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = Buffer.from(base64, 'base64').toString('utf-8');
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isJwtExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') { return true; }
    return Date.now() >= payload.exp * 1000;
}

function extractUsernameFromJwt(token: string): string {
    const payload = decodeJwtPayload(token);
    if (!payload) { return ''; }
    return (
        (payload.preferred_username as string) ||
        (payload.email as string) ||
        (payload.sub as string) ||
        ''
    );
}

async function storeTokenForUser(username: string, token: string): Promise<void> {
    await extensionContext.secrets.store(`oidc_token_${username}`, token);
}

export async function getStoredOidcTokenForUser(username: string): Promise<string | undefined> {
    if (!extensionContext) { return undefined; }
    return extensionContext.secrets.get(`oidc_token_${username}`);
}

export async function tryOidcAutoLogin(
    serverItem: ServerItem,
    environment: string,
    username: string
): Promise<{ success: boolean; connectionToken: string }> {
    const token = await getStoredOidcTokenForUser(username);
    if (!token) { return { success: false, connectionToken: '' }; }
    if (isJwtExpired(token)) { return { success: false, connectionToken: '' }; }

    try {
        const response = await languageClient.sendRequest('$totvsserver/validOidcToken', {
            tokenInfo: {
                token,
                connectionToken: serverItem.token
            }
        }) as IOidcValidationResponse;

        const connectionToken = response?.connectionToken || serverItem.token;
        return { success: true, connectionToken };
    } catch {
        return { success: false, connectionToken: '' };
    }
}

export class AuthUriHandler implements vscode.UriHandler {
    private _onDidAuthenticate = new vscode.EventEmitter<string>();
    public readonly onDidAuthenticate = this._onDidAuthenticate.event;
    private logger: vscode.OutputChannel;


    constructor(logger: vscode.OutputChannel) {
        this.logger = logger;
    }

    handleUri(uri: vscode.Uri): void {
        //vscode.window.showErrorMessage(`HANDLE URI ACIONADO: ${uri.path}`);
        this.logger.append(`HANDLE URI do callback acionado: ${uri.toString()}`);
        this.logger.appendLine(`URI Path: ${uri.path}`);

        if (uri.path.includes('callback')) {
            const queryParams = new URLSearchParams(uri.query);
            let code = queryParams.get('code');

            if (code) {
                //vscode.window.showInformationMessage(`Código: ${code}`);
                this.logger.appendLine(`Código recebido: ${code}`);
                this._onDidAuthenticate.fire(code);
            } else {
                //vscode.window.showWarningMessage("Parâmetro ?code= não encontrado na URI!");
                this.logger.appendLine(`Parâmetro ?code= não encontrado na URI!`);
            }
        }
    }
}

export async function OIDCLogin(context: vscode.ExtensionContext, uriHandler: AuthUriHandler, logger: vscode.OutputChannel, url: string) {
    const scheme = vscode.env.uriScheme;
    const extensionId = context.extension.id;

    const redirectUri = `${scheme}://${extensionId}/callback`;
    //const redirectUri = `${extensionId}://callback`;

    logger.appendLine(`redirect URI: ${redirectUri}`);

    //const authUrl = `http://172.16.1.21:3000/auth?redirect_uri=${encodeURIComponent(redirectUri)}`;
    // A url abaixo, estou mandando sem o ? inicial pois deu problema quando o App do Frame recebeu esse char, 
    //entao combinamos que eles vai adicionar isso
    const authUrl = url + `redirect_uri=${encodeURIComponent(redirectUri)}`;

    const codePromise = new Promise<string>((resolve) => {
        const disposable = uriHandler.onDidAuthenticate((code) => {
            disposable.dispose();
            resolve(code);
        });
    });

    logger.appendLine(`Abrindo navegador para URL de autenticação: ${authUrl}`);

    await vscode.env.openExternal(vscode.Uri.parse(authUrl));
    //startWebviewLoginFlow(context, authUrl, redirectUri, logger);

    const authCode = await codePromise;

    logger.appendLine(`Código de autenticação recebido: ${authCode}`);
     if (authCode) {
        
        await storeToken(context, authCode);
        vscode.window.showInformationMessage("Token recebido e armazenado com sucesso! \n : ${authCode}");
        const response = await languageClient.sendRequest("$totvsserver/validOidcToken", {
            tokenInfo: {
                token: authCode
            }
        }) as IOidcValidationResponse;

        if (response && response.sucess !== false) {
            const username = extractUsernameFromJwt(authCode);
            if (username) {
                await storeTokenForUser(username, authCode);
                logger.appendLine(`Token OIDC armazenado para o usuário: ${username}`);
            }
            vscode.window.showInformationMessage(`Autenticação OIDC concluída com sucesso.`);
        } else {
            logger.appendLine(`Validação do token OIDC falhou no servidor.`);
            vscode.window.showWarningMessage('Falha na validação do token OIDC pelo servidor.');
        }
    }

    //await exchangeCodeForToken(authCode, redirectUri, context, logger);
}

// async function exchangeCodeForToken(code: string, redirectUri: string, context: vscode.ExtensionContext, logger: vscode.OutputChannel) {
//     logger.appendLine(`Iniciando troca de código por token...`);
//      const response = await fetch('http://172.16.1.21:3000/token', {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//          body: new URLSearchParams({
//              grant_type: 'authorization_code',
//              client_id: 'daniel.yampolschi',
//              code: code,
//              redirect_uri: redirectUri
//          })
//      });

//      const data = await response.json();
//      logger.appendLine(`Resposta do servidor de token: ${JSON.stringify(data)}`);
//      if (data.access_token) {
//          await storeToken(context, data.access_token);
//          vscode.window.showInformationMessage("logado");
//     }
// }

async function storeToken(context: vscode.ExtensionContext, token: string) {
    await context.secrets.store('oidc_token', token);
}

export async function OIDCgetToken(context: vscode.ExtensionContext) {
     return await context.secrets.get('oidc_token');
}

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    const logger = vscode.window.createOutputChannel("OIDC AUTH LOGGER", { log: true });
    const uriHandler = new AuthUriHandler(logger);

    context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

    const loginCommand = vscode.commands.registerCommand('totvs-developer-studio.poc-login-oidc', async (oidcUrl?: string) => {
        try {

            let url: string | undefined = oidcUrl;

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

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Autenticação TOTVS Identity",
                    cancellable: false
                },
                async (progress) => {
                    progress.report({ message: "Aguarde, o processo de autenticação pode demorar um pouco..." });
                    await OIDCLogin(context, uriHandler, logger, url!);
                }
            );
        } catch (error) {
            //logger.error(`Falha crítica: ${error}`);
            logger.appendLine(`Falha crítica: ${error}`);
            vscode.window.showErrorMessage("Falha ao tentar fazer login.");
        }
    });

    context.subscriptions.push(loginCommand);
}

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
