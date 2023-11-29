import { debug, commands, Disposable, window, WebviewPanel, ExtensionContext, DebugSessionCustomEvent, ViewColumn, Uri } from 'vscode';
import * as path from "path";
import { ICommand, CommandToDA, CommandToPage } from "./Command";
import Utils, { LaunchConfig, MESSAGETYPE } from "../../utils";
import { DebugEvent } from '../debugEvents';

let timeLineWebView: CreateTDSReplayTimeLineWebView;

export class CreateTDSReplayTimeLineWebView {
  protected _panel: WebviewPanel | undefined;
  private _context: ExtensionContext;
  private readonly _extensionPath: string;
  private _disposables: Disposable[] = [];
  private _debugEvent: DebugSessionCustomEvent;
  private _isDisposed = false;
  private _isIgnoreSourcesNotFound = true;

  constructor(context: ExtensionContext, debugEvent: DebugSessionCustomEvent, isIgnoreSourcesNotFound: boolean) {
    this._extensionPath = context.extensionPath;
    this._debugEvent = debugEvent;
    this._context = context;
    this._isIgnoreSourcesNotFound = isIgnoreSourcesNotFound;

    this.initializePanel();

    window.onDidChangeActiveTextEditor(editor => {
      if (editor !== undefined) {
        //console.debug(editor);
        //if(editor.viewColumn !== 1) {
        //editor.viewColumn = 1;
        //}
      }
    });

    //window.onDidChangeTextEditorViewColumn

    debug.onDidTerminateDebugSession(event => {
      this._panel.dispose();
    });

    debug.onDidStartDebugSession(event => {
      if (!this._panel.visible) {
        //this._panel.reveal();
        this.reveal();
      }
    });

    timeLineWebView = this;

  }

  private initializePanel(): void {
    this._panel = window.createWebviewPanel(
      "CreateTDSReplayTimeLineWebView",
      "TDS Replay TimeLineView",
      ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          Uri.file(
            path.join(this._extensionPath, "out", "webpack")
          )
        ]
      }
    );

    this._panel.webview.html = this.getWebviewContent();

    this._panel.onDidDispose((event) => {
      this._isDisposed = true;
    });

    this._panel.webview.onDidReceiveMessage((command: ICommand) => { handleRequestFromPage(command); }, undefined, this._disposables);
    this._isDisposed = false;
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    //Essa instrução deve apontar para o arquivo compactado, gerado pelo webpack, definido no webpack.config.js
    const reactAppPathOnDisk = Uri.file(
      path.join(
        this._extensionPath,
        "out",
        "webpack",
        "timeLineView.js"
      )
    );

    const reactAppUri = this._panel?.webview.asWebviewUri(reactAppPathOnDisk);


    this._debugEvent.body["ignoreSourcesNotFound"] = this._isIgnoreSourcesNotFound;
    const configJson = JSON.stringify(this._debugEvent);
    const sources = "";

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Config View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src https: 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${configJson};

        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }


  public reveal() {
    if (!this._isDisposed) {
      this._panel.reveal();
    } else {
      this.initializePanel();
    }
  }

  //-------------------- Envio de mensagens PARA a pagina

  public selectTimeLine(timeLineId: string) {
    //Envio de mensagem para a página
    this._panel.webview.postMessage({
      command: CommandToPage.SelectTimeLine,
      data: timeLineId
    });
  }

  public showLoadingPageDialog(showLoadingPageDialog: boolean) {
    this._panel.webview.postMessage({
      command: CommandToPage.ShowLoadingPageDialog,
      data: showLoadingPageDialog
    });
  }

  public showMessageDialog(msgType: string, message: string) {
    this._panel.webview.postMessage({
      command: CommandToPage.ShowMessageDialog,
      data: {
        msgType: msgType,
        message: message
      }
    });
  }

  public postAddTimeLineEvent(debugEvent: DebugSessionCustomEvent, isIgnoreSourceNotFound: boolean) {
    //Envio de mensagem para página
    this._isIgnoreSourcesNotFound = isIgnoreSourceNotFound;
    this._debugEvent = debugEvent;
    debugEvent.body["ignoreSourcesNotFound"] = this._isIgnoreSourcesNotFound;
    this._panel.webview.postMessage({
      command: CommandToPage.AddTimeLines,
      data: debugEvent
    });
  }

  public openSourcesDialog(jsonResponse: any) {
    //this._debugEvent.body["sources"] = jsonResponse.sources;
    this._panel.webview.postMessage({
      command: CommandToPage.OpenSourcesDialog,
      data: jsonResponse.sources
    });
  }

  public postSetUpdatedState() {
    this._panel.webview.postMessage({
      command: CommandToPage.SetUpdatedState,
      data: this._debugEvent
    });
  }


  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getDebugEvent(): DebugSessionCustomEvent {
    return this._debugEvent;
  }

}

export function getTimeLineWebView() {
  return timeLineWebView;
}


// Mensagens recebidas da página timeLineTable.tsx
function handleRequestFromPage(command: ICommand) {
  //Mensagens recebidas da pagina
  switch (command.action) {
    case CommandToDA.SetTimeLine:
      handleSetTimeLineCommand(command);
      break;
    case CommandToDA.ChangePage:
      handleChangePageCommand(command);
      break;
    case CommandToDA.ChangeItemsPerPage:
      handleChangeItemsPerPageCommand(command);
      break;
    case CommandToDA.SetIgnoreSourcesNotFound:
      handleSetIgnoreSourcesNotFound(command);
      break;
    case CommandToDA.ShowSources:
      handleShowSourcesCommand(command);
      break;
    case CommandToDA.GetCurrentState:
      getTimeLineWebView().postSetUpdatedState();
      break;
  }
}

//-------------------- Handles para tratar as mensagens recebidas da pagina.

function handleSetTimeLineCommand(command: ICommand) {
  if (debug.activeDebugSession) {
    //Envia para o debug adapter uma solicitação para setar o timeline
    let timeLine = { "id": parseInt(command.content.timeLineSelected) };
    debug.activeDebugSession.customRequest("TDA/setTimeLine", timeLine);
  }
}


function handleChangePageCommand(command: ICommand) {
  if (debug.activeDebugSession) {
    //Envia para o debug adapter uma solicitação para mudar de pagina.
    //O proprio debug adapter ira enviar uma mensagem para adicionar as timelines da nova pagina
    let newPage = { "newPage": parseInt(command.content.newPage) };
    //console.debug("Enviando requisição para troca de pagina: " + newPage);
    debug.activeDebugSession.customRequest("TDA/changeTimeLinePage", newPage);
  }
}



function handleChangeItemsPerPageCommand(command: ICommand) {
  if (debug.activeDebugSession) {
    //Envia para o debug adapter uma solicitação para alterar a quantidade de items por pagina.
    //O proprio dap ja calcula a nova quantidade de paginas e enviar uma solicitação para adicionar
    //as novas timelines na pagina corrente, mantendo a seleção corrente ou selecionando a primeira
    //timeLine da pagina caso nao seja possivel manter a selecao.
    let requestJson = {
      "itemsPerPage": parseInt(command.content.itemsPerPage),
      "currentSelectedTimeLineId": parseInt(command.content.currentSelectedTimeLineId)
    };

    debug.activeDebugSession.customRequest("TDA/changeItemsPerPage", requestJson);
  }
}

function handleSetIgnoreSourcesNotFound(command: ICommand) {
  let debugSession = debug.activeDebugSession;
  if (debugSession) {
    LaunchConfig.saveIgnoreSourcesNotFound(debugSession, command.content.isIgnoreSourceNotFound);

    let requestJson = {
      "isIgnoreSourceNotFound": command.content.isIgnoreSourceNotFound
    };
    debugSession.customRequest("TDA/setIgnoreSourcesNotFound", requestJson);
  }
}

function handleShowSourcesCommand(command: ICommand) {
  if (debug.activeDebugSession) {
    let requestJson = {
      "sourceName": command.content.data
    };
    //console.debug("Enviando requisição para trocar a quantidade de items por pagina");
    debug.activeDebugSession.customRequest("TDA/getSourceInfo", requestJson)
      .then((jsonResponse) => {
        //console.debug(jsonResponse);
        if (timeLineWebView) {
          timeLineWebView.openSourcesDialog(jsonResponse);
        }
      });
  }
}
