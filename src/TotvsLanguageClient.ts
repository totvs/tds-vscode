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
import { TotvsLanguageClientA } from "./TotvsLanguageClientA";
import { IServerNotificationInfo, IUsageStatusInfo } from './protocolMessages';
import { updateUsageBarItem } from "./statusBar";
import { getLanguageServerSettings } from './server/languageServerSettings';

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

  let tempDir = config.get("compilation.tempDir");
  if (process.platform === "win32") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/windows/advpls.exe";
    if (!tempDir) {
      tempDir = process.env["TEMP"] || process.env["TMP"];
    }
    if (tempDir) {
      env["TEMP"] = tempDir;
      env["TMP"] = tempDir;
    }
  } else if (process.platform === "linux") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/linux/advpls";
    if (!tempDir) {
      tempDir = process.env["TMPDIR"];
    }
    if (tempDir) {
      env["TMPDIR"] = tempDir;
    }
    if (statSync(advpls).mode !== 33261) {
      chmodSync(advpls, "755");
    }
  } else if (process.platform === "darwin") {
    advpls = dir + "/node_modules/@totvs/tds-ls/bin/mac/advpls";
    if (!tempDir) {
      tempDir = process.env["TMPDIR"];
    }
    if (tempDir) {
      env["TMPDIR"] = tempDir;
    }
    if (statSync(advpls).mode !== 33261) {
      chmodSync(advpls, "755");
    }
  }
  console.log("tempDir: "+tempDir);

  let serverOptions: ServerOptions = {
    command: advpls,
    args: args,
    options: { env: env, detached: false },
  };

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
      supportHtml: true
    },
    diagnosticPullOptions: {
      onChange: true,
      onSave: true,
      //filter
      onTabs: false,
      //match:
    },
    // middleware: {
    //   provideCodeLenses: (doc, next, token) => {
    //     console.log("xxxxxxxxxxx");

    //     return [];
    //   }
    // },

    ///notebookDocumentOptions: false
  };

  languageClient = new TotvsLanguageClientA(serverOptions, clientOptions);
  languageClient.registerProposedFeatures();

  languageClient
    .onNotification("$totvsserver/usageStatus", (params: IUsageStatusInfo) => {
      updateUsageBarItem(params);
    });
  languageClient
    .onNotification("$totvsserver/notification", (params: IServerNotificationInfo) => {
      //vscode.window.showInformationMessage(params.code + params.message);

      vscode.workspace.textDocuments.forEach((document: vscode.TextDocument) => {
        //TODO: forçar 'refresh' do editor corrente (references)
      });
    });

  languageClient.start()
    .then(async (disposable: any) => {
      context.subscriptions.push(disposable);
      languageClient.ready = true;

      const configADVPL = vscode.workspace.getConfiguration(
        "totvsLanguageServer"
      );

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

  clientConfig["settings"] = getLanguageServerSettings();

  return clientConfig;
}
