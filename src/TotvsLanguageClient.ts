import * as vscode from "vscode";
import {
  CancellationToken,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ProvideOnTypeFormattingEditsSignature,
  ProvideDocumentFormattingEditsSignature,
  ProvideDocumentRangeFormattingEditsSignature,
  Trace,
  WorkspaceFolder,
  DidChangeConfigurationNotification,
} from "vscode-languageclient";

import {
  SettingMonitor,
  ServerOptions
} from "vscode-languageclient/node";

import { statSync, chmodSync } from "fs";
import { reconnectLastServer } from "./serversView";

import * as nls from "vscode-nls";
import { getLanguageServerSettings } from "./server/languageServerSettings";
import { TotvsLanguageClientA } from "./TotvsLanguageClientA";
import Utils from "./utils";
import { updateUsageBarItem } from './statusBar';
import { IUsageStatusData, IUsageStatusInfo } from './protocolMessages';

let localize = nls.loadMessageBundle();

export function getLanguageClient(
  context: vscode.ExtensionContext
): TotvsLanguageClientA {
  let clientConfig = getClientConfig(context);
  let args = ["language-server"];

  let config = vscode.workspace.getConfiguration("totvsLanguageServer");

  let behavior = "--enable-auto-complete=";
  let behaviorConfig = config.get("editor.toggle.autocomplete");
  if (behaviorConfig) {
    behavior += behaviorConfig;
    args = args.concat(behavior);
  }

  let notificationlevel = "--notification-level=";
  let notificationlevelConfig = config.get("editor.show.notification");
  if (notificationlevelConfig) {
    notificationlevel += '"' + notificationlevelConfig + '"';
    args = args.concat(notificationlevel);
  }

  let fsencoding = "--fs-encoding=";
  let fsencodingConfig = config.get("filesystem.encoding");
  if (fsencodingConfig) {
    fsencoding += fsencodingConfig;
    args = args.concat(fsencoding);
  }

  const servers = Utils.getServersConfig();
  if (servers.includes) {
    let includesList = servers.includes as Array<string>;
    let includes = "--includes=" + includesList.join(";");
    args = args.concat(includes);
  }

  let linter = "--linter=";
  let linterConfig = config.get("editor.linter");
  if (linter) {
    linter += linterConfig ? "enabled" : "disabled";
    args = args.concat(linter);
  }

  args = args.concat(clientConfig["launchArgs"]);

  let env: any = {};
  let kToForward = ["ProgramData", "PATH", "LD_LIBRARY_PATH", "HOME", "USER"];
  for (let e of kToForward) {
    env[e] = process.env[e];
  }

  let dir = "";
  let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
  if (ext !== undefined) {
    dir = ext.extensionPath;
  }
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
    options: { env: env },
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

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: "advpl" }, { language: "4gl" }],
    diagnosticCollectionName: "AdvPL",
    //outputChannel?: OutputChannel;
    outputChannelName: "TOTVS LS",
    //traceOutputChannel?: OutputChannel;
    revealOutputChannelOn: RevealOutputChannelOn.Error,
    //stdioEncoding?: string;
    initializationOptions: clientConfig,
    // initializationFailedHandler: (e) => {
    // 	console.log(e);
    // 	return false;
    // },
    //progressOnInitialization?: boolean;
    //errorHandler: new CqueryErrorHandler(workspace.getConfiguration('cquery'))
    // middleware: {
    //   workspace: {
    //     didChangeConfiguration: () => {
    //       return languageClient.sendNotification(DidChangeConfigurationNotification.type, { settings: [] });
    //     }
    //   },
    // },
    // middleware: {
    //   // provideCodeLenses: provideCodeLens,
    //   //provideOnTypeFormattingEdits: provideOnTypeFormatting,
    //   //provideDocumentFormattingEdits: provideDocumentFormattingEdits,
    //   //provideDocumentRangeFormattingEdits: provideDocumentRangeFormattingEdits,
    // },
    // uriConverters?: {
    //   code2Protocol: c2p.URIConverter;
    //   protocol2Code: p2c.URIConverter;
    // };
    markdown: {
      isTrusted: true,
      supportHtml: false
    },
    //$ConfigurationOptions = {
    //synchronize?: SynchronizeOptions;
    //workspaceFolder?: VWorkspaceFolder;
    diagnosticPullOptions: {
      onChange: true,
      onSave: true,
      //filter
      onTabs: false,
      //match:
    },
    //notebookDocumentOptions
  };

  let languageClient = new TotvsLanguageClientA(serverOptions, clientOptions);

  languageClient.registerProposedFeatures();

  languageClient.start()
    .then(async (disposable: any) => {
      context.subscriptions.push(disposable);
      languageClient.onNotification("$totvsserver/usageStatus", (params: IUsageStatusInfo) => {
        updateUsageBarItem(params);
      });
      languageClient.ready = true;

      const configADVPL = vscode.workspace.getConfiguration(
        "totvsLanguageServer"
      ); //transformar em configuracao de workspace

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

//     for (let codeLens of allCodeLens) {
//       // FIXME: show a real warning or disable on-the-side code lens.
//       if (!codeLens.isResolved) {
//         console.error(
//           localize(
//             "tds.webview.totvsLanguegeClient.codeLensNotResolved",
//             "Code lens is not resolved"
//           )
//         );
//       }

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
