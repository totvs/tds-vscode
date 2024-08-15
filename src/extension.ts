/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";
import * as vscode from "vscode";
import * as fse from "fs-extra";
import {
  window,
  commands,
  workspace,
  ExtensionContext,
  Uri,
  StatusBarAlignment,
} from "vscode";
import Utils, { LaunchConfig, ServersConfig } from "./utils";
import { createNewProtheusServer, ServersExplorer } from "./serversView";
import { getLanguageClient } from "./TotvsLanguageClient";
import {
  commandBuildFile,
  commandBuildWorkspace,
  commandBuildOpenEditors,
  generatePpo,
} from "./compile/tdsBuild";
import { deleteFileFromRPO } from "./server/deleteFileFromRPO";
import { defragRpo } from "./server/defragRPO";
import { rpoCheckIntegrity } from "./server/rpoCheckIntegrity";
import { revalidateRpo } from "./server/revalidateRPO";
import { serverSelection } from "./inputConnectionParameters";
import { onCaptureLoggers, offCaptureLoggers } from "./loggerCapture/logger";
import {
  getDAP,
  getProgramName,
  getProgramArguments,
  toggleTableSync,
  getReplayFile,
  prepareReplayFile,
  launcherReplayFile,
} from "./debug/debugConfigs";
import { createTimeLineWebView } from "./debug/debugEvents";
import {
  documentFormatting,
  register4glFormatting,
  registerAdvplFormatting,
} from "./formatter";
import { register4glOutline } from "./outline";
import { registerDebug } from "./debug";
// @@ import { openMonitorView } from "./monitor/monitorLoader";
import { initStatusBarItems } from "./statusBar";
import { rpoTokenQuickPick, rpoTokenInputBox, saveRpoTokenString, setEnabledRpoToken } from "./rpoToken";
import { TotvsLanguageClientA } from "./TotvsLanguageClientA";
import { ServerItem } from "./serverItem";
import serverProvider from "./serverItemProvider";
import { registerWorkspace } from "./workspace";
import { sendTelemetry } from "./protocolMessages";
import { registerXRef } from "./xreferences";
import { ImportSourcesOnlyResultPanel } from "./panels/importSourcesOnlyResultPanel";
import { GlobalIncludePanel } from "./panels/globalIncludePanel";
import { GenerateWebServicePanel } from "./panels/generateWSPanel";
import { PatchGenerateFromRpoPanel } from "./panels/patchGeneratePanel";
import { CompileKeyPanel } from "./panels/compileKeyPanel";
import { ApplyPatchPanel, OperationApplyPatchEnum } from "./panels/patchApplyPanel";
import { InspectorObjectPanel } from "./panels/objectInspectorPanel";
import { PatchGenerateByDifferencePanel } from "./panels/patchGenerateByDifferencePanel";
import { PatchEditorProvider } from "./panels/patchEditorPanel";
import { RepositoryLogPanel } from "./panels/repositoryLogPanel";
import { BuildResultPanel } from "./panels/buildResultPanel";
import { CompileResult } from "./compile/CompileResult";
import { LauncherConfigurationPanel } from "./panels/launcherConfigurationPanel";
import { ReplayConfigurationPanel } from "./panels/replayConfigurationPanel";
import { tlppTools } from "./tlpp-tools/tlppTools";
import { openWebMonitorView } from "./web-monitor";
import { AuthSettings } from "./authSettings";

export let languageClient: TotvsLanguageClientA;

export function parseUri(u): Uri {
  return Uri.parse(u);
}

const LANG_ADVPL_ID = "advpl";

export function activate(context: ExtensionContext) {
  console.log(
    vscode.l10n.t('Congratulations, your extension "totvs-developer-studio" is now active!')
  );

  AuthSettings.init(context);
  ServersConfig.createServerConfig();
  LaunchConfig.createLaunchConfig(undefined);

  context.subscriptions.push(
    commands.registerCommand("tds.getDAP", () => getDAP())
  );

  //Load Language Client and start Language Server
  languageClient = getLanguageClient(context);

  // Progress
  (() => {
    const config = workspace.getConfiguration(LANG_ADVPL_ID);
    const statusStyle = config.get("misc.status");
    if (statusStyle === "short" || statusStyle === "detailed") {
      const statusIcon = window.createStatusBarItem(StatusBarAlignment.Right);
      statusIcon.text = vscode.l10n.t("Advpl: loading");
      statusIcon.tooltip = vscode.l10n.t("Advpl is loading project metadata (ie, compile_commands.json)");
      statusIcon.show();
    }
  })();


  // Ação para pegar o nome da função e argumentos para  iniciar o debug
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.getProgramName",
      (config: vscode.DebugConfiguration) => {
        return getProgramName(config);
      }
    )
  );

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.getProgramArguments",
      (config: vscode.DebugConfiguration) => {
        return getProgramArguments(config);
      }
    )
  );

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.selectReplayFile",
      (config: vscode.DebugConfiguration) => {
        return getReplayFile(config);
      }
    )
  );

  //Ação para desfragmentar o RPO do servidor corrente.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.defragRPO", () => {
      if (checkServer() && !checkDebug()) {
        defragRpo();
      }
    })
  );

  //Ação para checar a integridade do RPO do servidor corrente.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.rpoCheckIntegrity", () => {
      if (checkServer() && !checkDebug()) {
        rpoCheckIntegrity()
      }
    })
  );

  //Ação para revalidar o RPO do servidor corrente.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.revalidateRPO", () => {
      if (checkServer() && !checkDebug()) {
        revalidateRpo()
      }
    })
  );

  //Ação para deletar um fonte selecionado do RPO.
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.delete.file.fromRPO",
      (context, files) => {
        if (checkServer() && !checkDebug()) {
          deleteFileFromRPO(context, files)
        }
      })
  );

  //Ação par abrir a tela de inspetor de objetos.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.inspectorObjects", () => {
      if (checkServer() && !checkDebug()) {
        InspectorObjectPanel.render(context, {
          inspector: "objects",
          includeOutScope: false //TRES para objetos e "fontes sem função publica" para funções
        });
      }
    }));

  //Ação par abrir a tela de inspetor de funções.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.inspectorFunctions", () => {
      if (checkServer() && !checkDebug()) {
        InspectorObjectPanel.render(context, {
          inspector: "functions",
          includeOutScope: false //TRES para objetos e "fontes sem função publica" para funções
        });

      }
    }));

  //Compila os fontes/recursos selecionados
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.build.file",
      (args, files) => commandBuildFile(args, false, files)
    )
  );
  //Recompila os fontes/recursos selecionados
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.rebuild.file",
      (args, files) => commandBuildFile(args, true, files)
    )
  );

  //Compila todos os arquivos dentro de um workspace.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.build.workspace", () =>
      commandBuildWorkspace(false)
    )
  );
  //Recompila todos os arquivos dentro de um workspace.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.rebuild.workspace", () =>
      commandBuildWorkspace(true)
    )
  );

  //Compila todos os fontes abertos
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.build.openEditors", () =>
      commandBuildOpenEditors(false)
    )
  );
  //Recompila todos os fontes abertos
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.rebuild.openEditors", () =>
      commandBuildOpenEditors(true)
    )
  );
  //Apresenta tabela de resultados da compilação
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.show.result.build",
      (compileResult: CompileResult) => {
        if (checkServer()) {
          BuildResultPanel.render(context, compileResult)
        }
      })
  );

  //View
  const viewServer = new ServersExplorer(context);
  if (!viewServer) {
    console.error("Servers view not initialized.");
  }

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.tdsreplay.webview.timeLine",
      () => {
        if (checkDebug(false)) {
          if (createTimeLineWebView !== null) {
            createTimeLineWebView.reveal();
          }
        } else {
          vscode.window.showErrorMessage("TDS Replay não iniciado.");
        }
      }
    )
  );

  context.subscriptions.push(
    commands.registerCommand(
      "tdsreplay.importSourcesOnlyResult",
      (sourceList: any) => {
        ImportSourcesOnlyResultPanel.render(context, sourceList.sourceList);
      }
    )
  );

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.configure.showSourcesInReplay",
      (args: any) => {
        if (args) {
          prepareReplayFile(args.fsPath);
        } else {
          getReplayFile(undefined).then((file: string) => {
            if (file) {
              prepareReplayFile(file);
            }
          }
          );
        }
      })
  );

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.configure.automaticLauncher",
      (args: any) => {
        if (args) {
          launcherReplayFile(args.fsPath);
        } else {
          getReplayFile(undefined).then((file: string) => {
            launcherReplayFile(file);
          }
          );
        }
      })
  );

  //Abre a tela de geração de patch com seleção de arquivos do RPO.
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.patchGenerate.fromRPO",
      () => {
        if (checkServer() && !checkDebug()) {
          PatchGenerateFromRpoPanel.render(context, undefined)
        }
      })
  );

  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.patchGenerate.byDifference",
      () => {
        if (checkServer() && !checkDebug()) {
          PatchGenerateByDifferencePanel.render(context);
        }
      }
    )
  );

  //Aplica um pacote de atualização (patch).
  context.subscriptions.push(
    vscode.commands.registerCommand("totvs-developer-studio.patchApply",
      (args) => {
        if (checkServer() && !checkDebug()) {
          if (instanceOfUriArray(args)) {
            ApplyPatchPanel.render(context, args, OperationApplyPatchEnum.APPLY);
          } else if (instanceOfUri(args)) {
            ApplyPatchPanel.render(context, [args], OperationApplyPatchEnum.APPLY);
          } else {
            ApplyPatchPanel.render(context, [], OperationApplyPatchEnum.APPLY);
          }
        }
      }
    )
  );

  //Valida o conteúdo de um patch pelo menu de contexto em arquivos de patch
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.patchValidate",
      (args) => {
        if (checkServer() && !checkDebug()) {
          if (instanceOfUriArray(args)) {
            ApplyPatchPanel.render(context, args, OperationApplyPatchEnum.VALIDATE);
          } else if (instanceOfUri(args)) {
            ApplyPatchPanel.render(context, [args], OperationApplyPatchEnum.VALIDATE);
          } else {
            ApplyPatchPanel.render(context, [], OperationApplyPatchEnum.VALIDATE);
          }
        }
      }
    )
  );

  //Apresenta o conteúdo de um patch pelo menu de contexto em arquivos de patch
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.patchInfos",
      (args) => {
        const uri: vscode.Uri = vscode.Uri.file(args["fsPath"]);
        vscode.commands.executeCommand("vscode.openWith", uri, PatchEditorProvider.viewType);
      }
    )
  );

  //Gera um patch de acordo com os arquivos contidos em uma pasta
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.patchGenerate.fromFolder",
      (args) => {
        if (checkServer() && !checkDebug()) {
          PatchGenerateFromRpoPanel.render(context, args)
        }
      })
  );

  //Apresenta página de Includes
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.include", () =>
      GlobalIncludePanel.render(context)
    )
  );

  //Apresenta página de geração de WSDL
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.ws.show", () => {
      if (checkServer() && !checkDebug()) {
        GenerateWebServicePanel.render(context)
      }
    }
    )
  );

  //monitor
  context.subscriptions.push(
    vscode.commands.registerCommand("tds-monitor.open-monitor-view", () => {
      vscode.window.setStatusBarMessage(
        `$(gear~spin) ${vscode.l10n.t("Starting monitor...")}`,
        // @@ Promise.resolve(openMonitorView(context))
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tds-monitor.open-web-monitor", () => {
      if (checkServer() && !checkDebug()) {
        openWebMonitorView(context);
      }
    })
  );

  //rpo log
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "totvs-developer-studio.open-repositoryLog",
      () => {
        if (checkServer() && !checkDebug()) {
          RepositoryLogPanel.render(context)
        }
      }
    )
  );

  ServersConfig.onDidSelectedServer((newServer: ServerItem) => {
    serverProvider.connectedServerItem = newServer;
  })
  serverProvider.checkServersConfigListener(true);

  //Abre uma caixa de informações para login no servidor protheus selecionado.
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.serverSelection",
      (...args) => serverSelection(args, context)
    )
  );

  //Seleção/remoção do arquivo com RPO Token.
  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.selectRpoToken", () => {
      rpoTokenQuickPick();
    })
  );

  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.selectRpoToken.enable", () => {
      setEnabledRpoToken(true);
    })
  );

  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.selectRpoToken.disable", () => {
      setEnabledRpoToken(false);
    })
  );

  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.inputRpoToken", () => {
      rpoTokenInputBox();
    })
  );

  context.subscriptions.push(
    commands.registerCommand("totvs-developer-studio.clearRpoToken", () => {
      saveRpoTokenString(undefined).then(
        () => {
          vscode.window.showInformationMessage("RPO token clean");
        },
        (error) => {
          vscode.window.showErrorMessage(error.message);
        }
      );
    })
  );

  //Troca rápida do local de salva do servers.json.
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.toggleSaveLocation",
      () => {
        Utils.toggleWorkspaceServerConfig();
      }
    )
  );

  //Troca da indicação da atividade.
  context.subscriptions.push(
    commands.registerCommand(
      "totvs-developer-studio.toggleUsageInfo",
      () => {
        Utils.toggleUsageInfoConfig();
      }
    )
  );

  //Compile key
  commands.registerCommand("totvs-developer-studio.compile.key",
    () => {
      CompileKeyPanel.render(context);
    });

  // Abre a tela de configuração de launchers (debug SC ou WEB)
  commands.registerCommand("totvs-developer-studio.configure.launcher",
    () =>
      LauncherConfigurationPanel.render(context)
  );

  // Abre a tela de configuração de launchers (TDS Replay)
  commands.registerCommand("totvs-developer-studio.configure.replay",
    () =>
      ReplayConfigurationPanel.render(context)
  );

  //inicializa items da barra de status.
  initStatusBarItems(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "totvs-developer-studio.run.formatter",
      (args: any[]) => {
        if (args === undefined) {
          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor !== undefined) {
            args = [activeEditor.document.uri];
          }
        }
        if (instanceOfUri(args)) {
          documentFormatting([args.fsPath]);
        } else if (instanceOfUriArray(args)) {
          const map: string[] = args.map<string>((uri: Uri) => {
            return uri.fsPath;
          });
          documentFormatting(map);
        }
      }
    )
  );

  //Tratamento de XReference e similares
  registerXRef(context);

  //Eventos e outros associados a vscode.workspace
  registerWorkspace(context);

  //Capturador de logs.
  registerLog(context);

  //debug
  registerDebug(context, languageClient);

  // Inicialização Adv/PL
  context.subscriptions.push(registerAdvplFormatting());

  // Inicialização 4GL
  context.subscriptions.push(register4glFormatting());
  context.subscriptions.push(register4glOutline());

  // Register custom editor for patch files
  context.subscriptions.push(PatchEditorProvider.register(context));

  blockBuildCommands(false);
  showBanner();

  // 'export' public api-surface
  const exportedApi = {
    generatePPO(filePath: string, options?: any): Promise<string> {
      return generatePpo(filePath, options);
    },
    saveRPOToken(rpoTokenString: string): Promise<boolean> {
      return saveRpoTokenString(rpoTokenString);
    },
    clearRPOToken(): Promise<boolean> {
      return saveRpoTokenString(undefined);
    },
    createProtheusServer(
      serverName: string,
      port: number,
      address: string,
      secure: boolean,
      buildVersion: string,
      environment: string,
      username: string,
    ): Promise<boolean> {
      return createNewProtheusServer(serverName, port, address, secure, buildVersion, environment, username);
    },
    apiTlppTools(message: string): Promise<string> {
      return tlppTools(message);
    }
  };

  vscode.commands.registerCommand(
    "totvs-developer-studio.selectSmartClient",
    () => {
      const isWindows: boolean = process.platform === 'win32';
      const filters: { [name: string]: string[] } = {};

      if (isWindows) {
        filters["Executables"] = ["exe"];
      }

      filters["All files"] = ["*"];

      const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: true,
        canSelectFolders: false,
        defaultUri: undefined,
        title: vscode.l10n.t("Select SmartClient Executable"),
        openLabel: vscode.l10n.t("Select"),
        filters: filters
      };

      vscode.window.showOpenDialog(options)
        .then((fileUri) => {
          if (fileUri === undefined) {
            return;
          }

          const fileUriString = fileUri[0].toString();
          vscode.window.showErrorMessage(fileUriString)

          return fileUri;
        });

    })

  window.showInformationMessage('"TDS-VSCode" is ready.');

  // Register context variables for use in when clause
  vscode.commands.executeCommand('setContext', 'tdsWorkspaceOpenState', vscode.workspace.workspaceFolders.length > 0);
  vscode.commands.executeCommand('setContext', 'tdsHaveServersState', ServersConfig.getServers().length > 0);

  return exportedApi;
}

function instanceOfUri(object: any): object is Uri {
  return object !== undefined && "scheme" in object;
}

function instanceOfUriArray(object: any): object is Uri[] {
  return object !== undefined && Array.isArray(object);
}

// this method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
  ServersConfig.deleteSelectServer();
  return languageClient.stop(5000);
}

function registerLog(context: vscode.ExtensionContext) {
  commands.registerCommand("totvs-developer-studio.logger.on", () =>
    onCaptureLoggers(context)
  );
  commands.registerCommand("totvs-developer-studio.logger.off", () =>
    offCaptureLoggers()
  );

  commands.registerCommand("totvs-developer-studio.toggleTableSync", () =>
    toggleTableSync()
  );

  commands.registerCommand("totvs-developer-studio.detailUsageInfo", () => {
    sendTelemetry().then((value: any) => {
      const rootPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const file: string = `${rootPath}/telemetry.txt`;
      const hf: number = fse.openSync(file, "w");

      Object.keys(value).forEach((key: string) => {
        fse.writeSync(hf, `${key}\n`);
        fse.writeSync(hf, `===================================`);

        Object.keys(value[key]).forEach((key2: string) => {
          fse.writeSync(hf, `\n| ${key2}`);
          const values: any = value[key][key2];
          values.forEach((element: {}) => {
            fse.writeSync(hf, `     | ${element["key"]} | ${element["value"]}\n`);
          });
          //fse.writeSync(hf, `\n\n`);
        });
      });

      fse.closeSync(hf);
      vscode.window.showTextDocument(vscode.Uri.file(file));
    })
  }
  );
}

let firstTime = true;

function showBanner(force: boolean = false) {
  if (firstTime) {
    firstTime = false;
    const config = workspace.getConfiguration("totvsLanguageServer");
    const showBanner = config.get("showBanner", true);
    const appLine = languageClient.outputChannel.appendLine;

    if (showBanner || force) {
      const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
      // prettier-ignore
      {
        appLine("---------------------------v---------------------------------------------------");
        appLine("   //////  ////    //////  |  TOTVS Developer Studio for VS-Code");
        appLine("    //    //  //  //       |  Version " + ext.packageJSON["version"]);
        appLine("   //    //  //  //////    |  TOTVS Technology");
        appLine("  //    //  //      //     |");
        appLine(" //    ////    //////      |  https://github.com/totvs/tds-vscode");
        appLine("---------------------------^---------------------------------------------------");
        appLine("");
      }
    }
    // prettier-ignore
    {
      appLine("-------------------------------------------------------------------------------");
      appLine("SOBRE O USO DE CHAVES E TOKENS DE COMPILAÇÃO                                   ");
      appLine("");
      appLine("As chaves de compilação ou tokens de compilação empregados na construção do    ");
      appLine("Protheus e suas funcionalidades, são de uso restrito dos desenvolvedores de    ");
      appLine("cada módulo.                                                                   ");
      appLine("");
      appLine("Em caso de mau uso destas chaves ou tokens, por qualquer outra parte, que não  ");
      appLine("a referida acima, a mesma irá se responsabilizar, direta ou regressivamente,   ");
      appLine("única e exclusivamente, por todos os prejuízos, perdas, danos, indenizações,   ");
      appLine("multas, condenações judiciais, arbitrais e administrativas e quaisquer outras  ");
      appLine("despesas relacionadas ao mau uso, causados tanto à TOTVS quanto a terceiros,   ");
      appLine("eximindo a TOTVS de toda e qualquer responsabilidade.                          ");
      appLine("-------------------------------------------------------------------------------");
    }
  }
}

let canBuild: boolean = true;

export function blockBuildCommands(block: boolean): boolean {
  if (!canBuild && block) {
    window.showInformationMessage(
      `Request cancelled. Build process already in progress.`
    );
    return false;
  }

  canBuild = !block;

  vscode.commands.executeCommand("setContext", "tds-vscode.canBuild", canBuild);

  return true;
}

export function canDebug(): boolean {
  const result: boolean = canBuild;

  if (!result) {
    vscode.window.showWarningMessage(
      "Request cancelled. Build process in progress."
    );
  }

  return result;
}

function checkServer(silent: boolean = false): boolean {
  let server = ServersConfig.getCurrentServer();

  if ((server == "") && !silent) {
    vscode.window.showErrorMessage(
      vscode.l10n.t("There is no server connected.")
    );
    server = undefined;
  }

  return server != undefined;
}

export function checkDebug(silent: boolean = false): boolean {
  if (vscode.debug.activeDebugSession && !silent) {
    vscode.window.showWarningMessage(vscode.l10n.t("This operation is not allowed during a debug."))
  }

  return vscode.debug.activeDebugSession != undefined;
}