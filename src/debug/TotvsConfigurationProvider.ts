import {
  WorkspaceFolder,
  DebugConfigurationProvider,
  DebugConfiguration,
  CancellationToken,
  window,
} from "vscode";
import * as vscode from "vscode";
import * as Net from "net";
import { setDapArgs, ProgramArgs, extractProgramArgs } from "./debugConfigs";
import serverProvider from "../serverItemProvider";
import { canDebug } from "../extension";
import { ServerItem } from "../serverItem";

export class TotvsConfigurationProvider implements DebugConfigurationProvider {
  static _TYPE: string = "totvs_language_debug";
  static _NAME: string = "TOTVS Language Debug (SmartClient)";
  static _SC_BIN: string = "";

  protected _server?: Net.Server;
  private _connectedServerItem: ServerItem;

  constructor() {}

  /**
   * Massage a debug configuration just before a debug session is being launched,
   * e.g. add all missing attributes to the debug configuration.
   */
  async resolveDebugConfiguration(
    folder: WorkspaceFolder | undefined,
    config: DebugConfiguration,
    token?: CancellationToken
  ): Promise<DebugConfiguration> {
    if (!canDebug()) {
      return undefined;
    }

     this._connectedServerItem = serverProvider.connectedServerItem;

    if (this._connectedServerItem !== undefined) {
      if (!config.type && !config.request && !config.name) {
        const editor = window.activeTextEditor;
        if (editor && editor.document.languageId === "totvs-developer-studio") {
          this.initialize(config);
          config.request = "launch";
          config.program = "${command:AskForProgramName}";
        }
      }

      config.environment = this._connectedServerItem.environment;
      config.environmentType = this._connectedServerItem.informations.environmentDetectedType;
      config.token = this._connectedServerItem.token;

      // se no server conectado houver a informacao de smartclientBin utiliza a informacao
      if (this._connectedServerItem.smartclientBin) {
        config.smartclientBin = this._connectedServerItem.smartclientBin;
      }

      if (folder) {
        config.workspaceFolders = folder;
      } else {
        let workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
          let wsPaths = new Array(workspaceFolders.length);
          let i = 0;
          for (const workspaceFolder of workspaceFolders) {
            const workspaceFolderPath = workspaceFolder.uri.fsPath;
            wsPaths[i] = workspaceFolderPath;
            i++;
          }
          config.workspaceFolders = wsPaths;
        }
      }

      if (!config.cwb || config.cwb === "") {
        config.cwb = folder.uri.fsPath;
        window.showInformationMessage(
          vscode.l10n.t("Parameter CWB not informed. Setting to {0}", config.cwb)
        );
      }

      let setDapArgsArr: string[] = [];
      if (config.logFile) {
        const ws: string = vscode.workspace.rootPath || "";
        setDapArgsArr.push(
          "--log-file=" + config.logFile.replace("${workspaceFolder}", ws)
        );
      }
      if (config.waitForAttach) {
        setDapArgsArr.push("--wait-for-attach=" + config.waitForAttach);
      }

      if(config.forceUtf8) {
        setDapArgsArr.push("--forceUtf8");
      }

      if(config.language) {
        if(config.language === "1") config.language = "por";
        else if(config.language === "2") config.language = "spa";
        else if(config.language === "3") config.language = "eng";
        else if(config.language === "4") config.language = "rus";
        setDapArgsArr.push("--language=" + config.language);
      }

      setDapArgs(setDapArgsArr);

      return Promise.resolve(config);
    } else {
      window.showErrorMessage(
        vscode.l10n.t("No servers connected")
      );
      return undefined;
    }
  }

  protected initialize(config: DebugConfiguration) {
    config.type = TotvsConfigurationProvider._TYPE;
    config.name = TotvsConfigurationProvider._NAME;
    config.smartclientBin = TotvsConfigurationProvider._SC_BIN;
  }

  protected finalize(config: DebugConfiguration) {
    return config;
  }

  resolveDebugConfigurationWithSubstitutedVariables(
    folder: WorkspaceFolder | undefined,
    debugConfiguration: DebugConfiguration,
    token?: CancellationToken
  ): vscode.ProviderResult<DebugConfiguration> {
    if (token.isCancellationRequested) {
      return undefined;
    }

    const programArgs: ProgramArgs = extractProgramArgs(
      debugConfiguration.program
    );
    if (debugConfiguration.programArguments) {
      if (typeof debugConfiguration.programArguments === 'string') {
        debugConfiguration.programArguments = JSON.parse(debugConfiguration.programArguments);
      }
      if (debugConfiguration.programArguments.length > 0) {
        programArgs.args = debugConfiguration.programArguments;
      }
    }

    if (
      programArgs.program == "<cancel>" ||
      programArgs.args?.includes("<cancel>")
    ) {
      window.showInformationMessage(
        vscode.l10n.t("Canceled by user.")
      );
      return undefined; // abort launch
    }

    if (!debugConfiguration.program) {
      window.showInformationMessage(
        vscode.l10n.t("Cannot find a program to debug")
      );
      return undefined; // abort launch
    }

    debugConfiguration.program = programArgs.program;
    debugConfiguration.programArguments = programArgs.args;

    return this.finalize(debugConfiguration);
  }

  dispose() {
    if (this._server) {
      this._server.close();
    }
  }
}
