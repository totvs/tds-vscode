import * as vscode from 'vscode';

type LoggerType = vscode.OutputChannel & vscode.LogOutputChannel;

export class AuthUriHandler implements vscode.UriHandler {
    private _onDidAuthenticate = new vscode.EventEmitter<string>();
    public readonly onDidAuthenticate = this._onDidAuthenticate.event;
    private logger: vscode.OutputChannel;


    constructor(logger: vscode.OutputChannel) {
        this.logger = logger;
    }

    handleUri(uri: vscode.Uri): void {
        vscode.window.showErrorMessage(`HANDLE URI ACIONADO: ${uri.path}`);
        //this.logger.info(`URI: ${uri.toString()}`);
        this.logger.appendLine(`URI Path: ${uri.path}`);

        if (uri.path.includes('callback')) {
            const queryParams = new URLSearchParams(uri.query);
            const code = queryParams.get('code');

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

export async function OIDCLogin(context: vscode.ExtensionContext, uriHandler: AuthUriHandler, logger: vscode.OutputChannel) {
    const scheme = vscode.env.uriScheme;
    const extensionId = context.extension.id;

    //const redirectUri = `${scheme}://${extensionId}/callback`;
    const redirectUri = `${extensionId}://callback`;
    logger.appendLine(`redirect URI: ${redirectUri}`);

    const authUrl = `http://172.16.1.21:3000/auth?redirect_uri=${encodeURIComponent(redirectUri)}`;

    const codePromise = new Promise<string>((resolve) => {
        const disposable = uriHandler.onDidAuthenticate((code) => {
            disposable.dispose();
            resolve(code);
        });
    });

    logger.appendLine(`Abrindo navegador para URL de autenticação: ${authUrl}`);

    //await vscode.env.openExternal(vscode.Uri.parse(authUrl));
    startWebviewLoginFlow(context, authUrl, redirectUri, logger);

    const authCode = await codePromise;
    await exchangeCodeForToken(authCode, redirectUri, context, logger);
}

async function exchangeCodeForToken(code: string, redirectUri: string, context: vscode.ExtensionContext, logger: vscode.OutputChannel) {
    logger.appendLine(`Iniciando troca de código por token...`);
     const response = await fetch('http://172.16.1.21:3000/token', {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: new URLSearchParams({
             grant_type: 'authorization_code',
             client_id: 'daniel.yampolschi',
             code: code,
             redirect_uri: redirectUri
         })
     });

     const data = await response.json();
     logger.appendLine(`Resposta do servidor de token: ${JSON.stringify(data)}`);
     if (data.access_token) {
         await storeToken(context, data.access_token);
         vscode.window.showInformationMessage("logado");
    }
}

async function storeToken(context: vscode.ExtensionContext, token: string) {
    await context.secrets.store('oidc_token', token);
}

export async function OIDCgetToken(context: vscode.ExtensionContext) {
//     return await context.secrets.get('oidc_token');
}

export function activate(context: vscode.ExtensionContext) {
    const logger = vscode.window.createOutputChannel("OIDC AUTH LOGGER", { log: true });
    const uriHandler = new AuthUriHandler(logger);

    context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

    const loginCommand = vscode.commands.registerCommand('totvs-developer-studio.poc-login-oidc', async () => {
        try {
            await OIDCLogin(context, uriHandler, logger);
        } catch (error) {
            //logger.error(`Falha crítica: ${error}`);
            logger.appendLine(`Falha crítica: ${error}`);
            vscode.window.showErrorMessage("Falha ao tentar fazer login.");
        }
    });

    context.subscriptions.push(loginCommand);
}

async function startWebviewLoginFlow(context: vscode.ExtensionContext, url: string, redirectUri: string, logger: vscode.OutputChannel) {
   // const redirectUri = "meu-plugin://callback"; // Usar mensageria interna, não o "vscode://"
    //const authUrl = `http://172.16.1.19:3000/auth?client_id=MOCK&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const panel = vscode.window.createWebviewPanel(
        'loginWebview',
        'Autenticação Meu Plugin',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: white; }
                iframe { width: 100%; height: 100%; border: none; }
            </style>
        </head>
        <body>
            <iframe src="${url}"></iframe>

            <script>
                const vscode = acquireVsCodeApi();

                // Escuta mensagens vindas do Iframe (do seu servidor Mock)
                window.addEventListener('message', event => {
                    // O servidor mock precisa dar um window.parent.postMessage(...)
                    if (event.data && event.data.type === 'AUTH_SUCCESS') {
                        vscode.postMessage({
                            command: 'login-success',
                            code: event.data.code
                        });
                    }
                });
            </script>
        </body>
        </html>
    `;

    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case 'login-success':
                    logger.appendLine(`Código recebido via Webview: ${message.code}`);
                    panel.dispose();

                    await exchangeCodeForToken(message.code, redirectUri, context, logger);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}
