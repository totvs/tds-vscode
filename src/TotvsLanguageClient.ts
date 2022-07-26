import {
  CodeLens,
  commands,
  DecorationOptions,
  DecorationRangeBehavior,
  DecorationRenderOptions,
  ExtensionContext,
  Position,
  ProviderResult,
  Range,
  TextDocument,
  ThemeColor,
  window,
  workspace,
  TextEditorDecorationType,
  FormattingOptions,
  TextEdit,
} from "vscode";
import {
  CancellationToken,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  ProvideOnTypeFormattingEditsSignature,
  ProvideDocumentFormattingEditsSignature,
  ProvideDocumentRangeFormattingEditsSignature,
} from "vscode-languageclient/lib/main";
import * as vscode from "vscode";
import { statSync, chmodSync } from "fs";
import { reconnectLastServer } from "./serversView";

import * as nls from "vscode-nls";
import { syncSettings } from "./server/languageServerSettings";
import { TotvsLanguageClientA } from "./TotvsLanguageClientA";
import Utils from "./utils";;

let localize = nls.loadMessageBundle();

export let sessionKey: string;

export let isLSInitialized = false;

export function getLanguageClient(
  context: ExtensionContext
): TotvsLanguageClientA {
  let clientConfig = getClientConfig(context);
  //if (!clientConfig)
  //	return undefined;

  // Notify the user that if they change a cquery setting they need to restart
  // vscode.
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(() => {
      for (let key in clientConfig) {
        if (!clientConfig.hasOwnProperty(key)) {
          continue;
        }

        if (
          !clientConfig ||
          JSON.stringify(clientConfig[key]) !==
            JSON.stringify(clientConfig[key])
        ) {
          const kReload = localize(
            "tds.webview.totvsLanguegeClient.reload",
            "Reload"
          );
          const message = localize(
            "tds.webview.totvsLanguegeClient.pleaseReload",
            "Please reload to apply the 'TOTVS.{0}' configuration change.",
            key
          );

          window.showInformationMessage(message, kReload).then((selected) => {
            if (selected === kReload) {
              commands.executeCommand("workbench.action.reloadWindow");
            }
          });
          break;
        }

        syncSettings();
      }
    })
  );

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

  args = args.concat("--wait-for-attach=20000");

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
  let advpls;
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
  let decorationOpts: DecorationRenderOptions = {
    after: {
      fontStyle: "italic",
      color: new ThemeColor("editorCodeLens.foreground"),
    },
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  };

  // let codeLensDecoration = window.createTextEditorDecorationType(
  //  decorationOpts
  //);

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: "advpl" }, { language: "4gl" }],
    // synchronize: {
    // 	configurationSection: 'cquery',
    // 	fileEvents: workspace.createFileSystemWatcher('**/.cc')
    // },
    diagnosticCollectionName: "AdvPL",
    outputChannelName: "TOTVS LS",
    revealOutputChannelOn: RevealOutputChannelOn.Error,
    initializationOptions: clientConfig,
    middleware: {
      // provideCodeLenses: provideCodeLens,
      provideOnTypeFormattingEdits: provideOnTypeFormatting,
      provideDocumentFormattingEdits: provideDocumentFormattingEdits,
      provideDocumentRangeFormattingEdits: provideDocumentRangeFormattingEdits,
    },
    // initializationFailedHandler: (e) => {
    // 	console.log(e);
    // 	return false;
    // },
    //errorHandler: new CqueryErrorHandler(workspace.getConfiguration('cquery'))
  };

  let languageClient = new TotvsLanguageClientA(serverOptions, clientOptions);

  languageClient
    .onReady()
    .then(async () => {
      isLSInitialized = true;
      languageClient.ready = true;

      const configADVPL = vscode.workspace.getConfiguration(
        "totvsLanguageServer"
      ); //transformar em configuracao de workspace

      let isReconnectLastServer = configADVPL.get("reconnectLastServer");
      if (isReconnectLastServer) {
        reconnectLastServer();
      }
    })
    .catch((e) => {
      window.showErrorMessage(e);
    });

  return languageClient;
}

//Internal Functions

function getClientConfig(context: ExtensionContext) {
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
  let config = workspace.getConfiguration("totvsLanguageServer");

  for (let prop of configMapping) {
    let value = config.get(prop[1]);

    if (value !== undefined && value !== null) {
      //if(prop[1] === 'launch.command') {
      //	if (process.platform ==== "win32"){
      //		value = dir + "/node_modules/@totvs/tds-ls/bin/windows/" + value + ".exe";
      //	}
      //	else if (process.platform ==== "linux"){
      //		value = dir + "/node_modules/@totvs/tds-ls/bin/linux/" + value;
      //		chmodSync(value.toString(),'755');
      //	}
      //}
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

  // Provide a default cache directory if it is not present. Insert next to
  // the project since if the user has an SSD they most likely have their
  // source files on the SSD as well.
  //let cacheDir = '${workspaceFolder}/.vscode/cquery_cached_index/';

  //Processo de cache desabilitado até que seja corretamente implementado pelo LS
  //let cacheDir = '${workspaceFolder}/.vscode/totvs_cached_index/';
  //clientConfig["cacheDirectory"] = resolveVariables(cacheDir);

  return clientConfig;
}

function displayCodeLens(
  document: TextDocument,
  allCodeLens: CodeLens[],
  codeLensDecoration: TextEditorDecorationType
) {
  for (let editor of window.visibleTextEditors) {
    if (editor.document !== document) {
      continue;
    }

    let opts: DecorationOptions[] = [];

    for (let codeLens of allCodeLens) {
      // FIXME: show a real warning or disable on-the-side code lens.
      if (!codeLens.isResolved) {
        console.error(
          localize(
            "tds.webview.totvsLanguegeClient.codeLensNotResolved",
            "Code lens is not resolved"
          )
        );
      }

      // Default to after the content.
      let position = codeLens.range.end;

      // If multiline push to the end of the first line - works better for
      // functions.
      if (codeLens.range.start.line !== codeLens.range.end.line) {
        position = new Position(codeLens.range.start.line, 1000000);
      }

      let range = new Range(position, position);
      let title = codeLens.command === undefined ? "" : codeLens.command.title;
      let opt: DecorationOptions = {
        range: range,
        renderOptions: { after: { contentText: " " + title + " " } },
      };

      opts.push(opt);
    }

    editor.setDecorations(codeLensDecoration, opts);
  }
}

function provideDocumentRangeFormattingEdits(
  this: void,
  document: TextDocument,
  range: Range,
  options: FormattingOptions,
  token: CancellationToken,
  next: ProvideDocumentRangeFormattingEditsSignature
): ProviderResult<TextEdit[]> {
  return next(document, range, options, token);
}

function provideDocumentFormattingEdits(
  this: void,
  document: TextDocument,
  options: FormattingOptions,
  token: CancellationToken,
  next: ProvideDocumentFormattingEditsSignature
): ProviderResult<TextEdit[]> {
  return next(document, options, token);
}

function provideOnTypeFormatting(
  document: TextDocument,
  position: Position,
  ch: string,
  options: FormattingOptions,
  token: CancellationToken,
  next: ProvideOnTypeFormattingEditsSignature
): ProviderResult<TextEdit[]> {
  //const result: vscode.TextEdit[] = [];

  return next(document, position, ch, options, token);
}
