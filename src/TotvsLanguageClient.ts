import * as vscode from "vscode";
import {
  LanguageClientOptions,
  RevealOutputChannelOn
} from "vscode-languageclient";

import {
  ServerOptions
} from "vscode-languageclient/node";

import { chmodSync, statSync } from "fs";
import { reconnectLastServer } from "./serversView";
import * as nls from "vscode-nls";
import { TotvsLanguageClientA } from "./TotvsLanguageClientA";
import { IUsageStatusInfo } from './protocolMessages';
import Utils from "./utils";
import { updateUsageBarItem } from "./statusBar";
import { getLanguageServerSettings } from './server/languageServerSettings';

let localize = nls.loadMessageBundle();

export function getLanguageClient(
  context: vscode.ExtensionContext
): TotvsLanguageClientA {
  let clientConfig = getClientConfig(context);
  let args = ["language-server"]; //, "--enable-auto-complete=Basic" default;
  let config = vscode.workspace.getConfiguration("totvsLanguageServer");

  let notificationlevel = "--notification-level=";
  let notificationlevelConfig = config.get("editor.show.notification");
  if (notificationlevelConfig) {
    notificationlevel += '"' + notificationlevelConfig + '"';
    args = args.concat(notificationlevel);
  }

  args = args.concat(clientConfig["launchArgs"]);

  let env: any = {};
  let kToForward = ["ProgramData", "PATH", "LD_LIBRARY_PATH", "HOME", "USER"];
  for (let e of kToForward) {
    env[e] = process.env[e];
  }

  const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
  const dir = ext.extensionPath;
  let advpls: string;

  if (process.platform === "win32") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/windows/advpls.exe";
  } else if (process.platform === "linux") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/linux/advpls";
    if (statSync(advpls).mode !== 33261) {
      chmodSync(advpls, "755");
    }
  } else if (process.platform === "darwin") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/mac/advpls";
    if (statSync(advpls).mode !== 33261) {
      chmodSync(advpls, "755");
    }
  }

  let serverOptions: ServerOptions = {
    command: advpls,
    args: args,
    options: { env: env, detached: true },
  };

  // Inline code lens.
  let decorationOpts: vscode.DecorationRenderOptions = {
    after: {
      fontStyle: "italic",
      color: new vscode.ThemeColor("editorCodeLens.foreground"),
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  };

  // let codeLensDecoration = window.createTextEditorDecorationType(
  //  decorationOpts
  //);

  let outputTrace = undefined;
  let trace = config.get("trace.server");
  if (trace !== "off") {
    outputTrace = vscode.window.createOutputChannel(`TOTVS LS (trace)`);
  }

  let languageClient: TotvsLanguageClientA;

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: "advpl" }, { language: "4gl" }],
    diagnosticCollectionName: "AdvPL",
    outputChannelName: "TOTVS LS",
    traceOutputChannel: outputTrace,
    revealOutputChannelOn: RevealOutputChannelOn.Error,
    //stdioEncoding?: string;
    initializationOptions: clientConfig,
    progressOnInitialization: false,
    markdown: {
      isTrusted: true,
      supportHtml: false
    },
    diagnosticPullOptions: {
      onChange: true,
      onSave: true,
      //filter
      onTabs: false,
      //match:
    },
    ///notebookDocumentOptions: false
  };

  languageClient = new TotvsLanguageClientA(serverOptions, clientOptions);
  languageClient.registerProposedFeatures();

  languageClient.onNotification("$totvsserver/usageStatus", (params: IUsageStatusInfo) => {
    updateUsageBarItem(params);
  });

  languageClient.start()
    .then(async (disposable: any) => {
      context.subscriptions.push(disposable);
      languageClient.ready = true;

      const configADVPL = vscode.workspace.getConfiguration(
        "totvsLanguageServer"
      ); //transformar em configuracao de workspace

      const serverInfo: any = languageClient.initializeResult.serverInfo;
      if (serverInfo) {
        languageClient.outputChannel.appendLine(`                     Version: ${serverInfo.name} ${serverInfo.version}`);
      }

      //languageClient.outputChannel.appendLine("**** initializeResult");
      //languageClient.outputChannel.appendLine(JSON.stringify(languageClient.initializeResult, undefined, "  "));

      let isReconnectLastServer = configADVPL.get("reconnectLastServer");
      if (isReconnectLastServer) {
        reconnectLastServer();
      }
    })
    .catch((e: any) => {
      console.error(e);
      vscode.window.showErrorMessage(e);
    });

  return languageClient;
}

//Internal Functions

function getClientConfig(context: vscode.ExtensionContext) {
  function resolveVariablesInString(value: string) {
    let rootPath: string = vscode.workspace.rootPath || process.cwd();
    return value.replace("${workspaceFolder}", rootPath);
  }

  function resolveVariablesInArray(value: any[]) {
    return value.map((v) => resolveVariables(v));
  }

  function resolveVariables(value: any) {
    if (typeof value === "string") {
      return resolveVariablesInString(value);
    }
    if (Array.isArray(value)) {
      return resolveVariablesInArray(value);
    }
    return value;
  }

  let configMapping = [["launchArgs", "launch.args"]];
  let clientConfig = {};
  let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("totvsLanguageServer");

  for (let prop of configMapping) {
    let value = config.get(prop[1]);

    if (value !== undefined && value !== null) {
      let subprops = prop[0].split(".");
      let subconfig = clientConfig;
      for (let subprop of subprops.slice(0, subprops.length - 1)) {
        if (!subconfig.hasOwnProperty(subprop)) {
          subconfig[subprop] = {};
        }
        subconfig = subconfig[subprop];
      }
      subconfig[subprops[subprops.length - 1]] = resolveVariables(value);
    }
  }

  clientConfig["setting"] = getLanguageServerSettings();

  return clientConfig;
}

// function displayCodeLens(
//   document: vscode.TextDocument,
//   allCodeLens: vscode.CodeLens[],
//   codeLensDecoration: TextEditorDecorationType
// ) {
//   for (let editor of window.visibleTextEditors) {
//     if (editor.document !== document) {
//       continue;
//     }

//     let opts: DecorationOptions[] = [];

    // for (let codeLens of allCodeLens) {
    //   // FIXME: show a real warning or disable on-the-side code lens.
    //   if (!codeLens.isResolved) {
    //     console.error(
    //       localize(
    //         "tds.webview.totvsLanguegeClient.codeLensNotResolved",
    //         "Code lens is not resolved"
    //       )
    //     );
    //   }

//       // Default to after the content.
//       let position = codeLens.range.end;

//       // If multiline push to the end of the first line - works better for
//       // functions.
//       if (codeLens.range.start.line !== codeLens.range.end.line) {
//         position = new Position(codeLens.range.start.line, 1000000);
//       }

//       let range = new Range(position, position);
//       let title = codeLens.command === undefined ? "" : codeLens.command.title;
//       let opt: DecorationOptions = {
//         range: range,
//         renderOptions: { after: { contentText: " " + title + " " } },
//       };

//       opts.push(opt);
//     }

//     editor.setDecorations(codeLensDecoration, opts);
//   }
// }

// function provideDocumentRangeFormattingEdits(
//   this: void,
//   document: TextDocument,
//   range: Range,
//   options: FormattingOptions,
//   token: CancellationToken,
//   next: ProvideDocumentRangeFormattingEditsSignature
// ): ProviderResult<TextEdit[]> {
//   return next(document, range, options, token);
// }

// function provideDocumentFormattingEdits(
//   this: void,
//   document: TextDocument,
//   options: FormattingOptions,
//   token: CancellationToken,
//   next: ProvideDocumentFormattingEditsSignature
// ): ProviderResult<TextEdit[]> {
//   return next(document, options, token);
// }

// function provideOnTypeFormatting(
//   document: TextDocument,
//   position: Position,
//   ch: string,
//   options: FormattingOptions,
//   token: CancellationToken,
//   next: ProvideOnTypeFormattingEditsSignature
// ): ProviderResult<TextEdit[]> {
//   //const result: vscode.TextEdit[] = [];

//   return next(document, position, ch, options, token);
// }
