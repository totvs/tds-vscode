/*---------------------------------------------------------
 * Copyright (C) TOTVS S.A. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.config({
  locale: vscode.env.language,
  bundleFormat: nls.BundleFormat.standalone,
})();

import * as ls from 'vscode-languageserver-types';
import {
  window,
  commands,
  extensions,
  workspace,
  ExtensionContext,
  Uri,
  ProgressLocation,
  StatusBarAlignment,
} from 'vscode';
import { jumpToUriAtPosition } from './vscodeUtils';
import { ServersExplorer } from './serversView';
import { compileKeyPage } from './compileKey/compileKey';
import { getLanguageClient } from './TotvsLanguageClient';
import { patchGenerate, patchGenerateFromFolder } from './patch/patchGenerate';
import Utils from './utils';
import { LanguageClient } from 'vscode-languageclient';
import {
  commandBuildFile,
  commandBuildWorkspace,
  commandBuildOpenEditors,
  generatePpo,
} from './compile/tdsBuild';
import { deleteFileFromRPO } from './server/deleteFileFromRPO';
import { defragRpo } from './server/defragRPO';
import { rpoCheckIntegrity } from './server/rpoCheckIntegrity';
import { serverSelection } from './inputConnectionParameters';
import { inspectObject } from './inspect/inspectObject';
import { inspectFunctions } from './inspect/inspectFunction';
import { showWelcomePage } from './welcome/welcomePage';
import showInclude from './include/include';
import showWSPage from './WebService/generateWS';
import launcherConfig from './launcher/launcherConfiguration';
import { onCaptureLoggers, offCaptureLoggers } from './loggerCapture/logger';
import tdsReplayLauncherConfig from './launcher/tdsReplay/tdsReplayLauncherConfig';
import {
  getDAP,
  getProgramName,
  getProgramArguments,
  toggleTableSync,
} from './debug/debugConfigs';
import { toggleAutocompleteBehavior } from './server/languageServerSettings';
import { createTimeLineWebView } from './debug/debugEvents';
import { patchValidates } from './patch/patchValidate';
import {
  documentFormatting,
  register4glFormatting,
  registerAdvplFormatting,
} from './formatter';
import { registerAdvplOutline, register4glOutline } from './outline';
import { registerDebug, _debugEvent } from './debug';
import { openMonitorView } from './monitor/monitorLoader';
import { openRpoInfoView } from './rpoInfo/rpoInfoLoader';
import { openApplyPatchView } from './patch/apply/applyPatchLoader';
import { initStatusBarItems, updateStatusBarItems } from './statusBar';
import { PatchEditorProvider } from './patch/inspect/patchEditor';
import { openTemplateApplyView } from './template/apply/formApplyTemplate';
import { rpoTokenSelection } from './rpoToken';

export let languageClient: LanguageClient;
export function parseUri(u): Uri {
  return Uri.parse(u);
}

const LANG_ADVPL_ID = 'advpl';

export function activate(context: ExtensionContext) {
  //new DebugEvent(context); //Cria a instancia para ja informar o debug context

  console.log(
    localize(
      'tds.console.congratulations',
      'Congratulations, your extension "totvs-developer-studio" is now active!'
    )
  );

  Utils.createServerConfig();
  Utils.createLaunchConfig();

  context.subscriptions.push(
    commands.registerCommand('tds.getDAP', () => getDAP())
  );

  if (extensions.getExtension('TOTVS.tds-vscode')) {
    //Load Language Client and start Language Server
    languageClient = getLanguageClient(context);
    context.subscriptions.push(languageClient.start());

    let p2c = languageClient.protocol2CodeConverter;

    //createTimeLineDataProvider();

    //General commands.
    (() => {
      commands.registerCommand('advpl.freshenIndex', () => {
        languageClient.sendNotification('$advpl/freshenIndex');
      });
      function makeRefHandler(methodName, autoGotoIfSingle = false) {
        return () => {
          let position;
          let uri;
          if (window.activeTextEditor !== undefined) {
            position = window.activeTextEditor.selection.active;
            uri = window.activeTextEditor.document.uri;
          }
          languageClient
            .sendRequest(methodName, {
              textDocument: {
                uri: uri.toString(),
              },
              position: position,
            })
            .then((locations: Array<ls.Location>) => {
              if (autoGotoIfSingle && locations.length === 1) {
                let location = p2c.asLocation(locations[0]);
                commands.executeCommand(
                  'advpl.goto',
                  location.uri,
                  location.range.start,
                  []
                );
              } else {
                commands.executeCommand(
                  'editor.action.showReferences',
                  uri,
                  position,
                  locations.map(p2c.asLocation)
                );
              }
            });
        };
      }
      commands.registerCommand('advpl.vars', makeRefHandler('$advpl/vars'));
      commands.registerCommand(
        'advpl.callers',
        makeRefHandler('$advpl/callers')
      );
      commands.registerCommand(
        'advpl.base',
        makeRefHandler('$advpl/base', true)
      );
    })();

    // The language client does not correctly deserialize arguments, so we have a
    // wrapper command that does it for us.
    (() => {
      commands.registerCommand(
        'advpl.showReferences',
        (uri: string, position: ls.Position, locations: ls.Location[]) => {
          commands.executeCommand(
            'editor.action.showReferences',
            p2c.asUri(uri),
            p2c.asPosition(position),
            locations.map(p2c.asLocation)
          );
        }
      );

      commands.registerCommand(
        'advpl.goto',
        (uri: string, position: ls.Position, locations: ls.Location[]) => {
          jumpToUriAtPosition(
            p2c.asUri(uri),
            p2c.asPosition(position),
            false /*preserveFocus*/
          );
        }
      );
    })();

    // Commands for configuring LS behavior and other components
    (() => {
      commands.registerCommand(
        'totvs-developer-studio.toggle.autocomplete.behavior',
        () => {
          toggleAutocompleteBehavior();
        }
      );
    })();

    // Progress
    (() => {
      let config = workspace.getConfiguration(LANG_ADVPL_ID);
      let statusStyle = config.get('misc.status');
      if (statusStyle === 'short' || statusStyle === 'detailed') {
        let statusIcon = window.createStatusBarItem(StatusBarAlignment.Right);
        statusIcon.text = localize(
          'tds.vscode.statusIcon.text1',
          'advpl: loading'
        );
        statusIcon.tooltip = localize(
          'tds.vscode.statusIcon.tooltip1',
          'advpl is loading project metadata (ie, compile_commands.json)'
        );
        statusIcon.show();
        languageClient.onReady().then(() => {
          languageClient.onNotification('$totvsserver/progress', (args) => {
            let indexRequestCount = args.indexRequestCount || 0;
            let doIdMapCount = args.doIdMapCount || 0;
            let loadPreviousIndexCount = args.loadPreviousIndexCount || 0;
            let onIdMappedCount = args.onIdMappedCount || 0;
            let onIndexedCount = args.onIndexedCount || 0;
            let activeThreads = args.activeThreads || 0;
            let total =
              indexRequestCount +
              doIdMapCount +
              loadPreviousIndexCount +
              onIdMappedCount +
              onIndexedCount +
              activeThreads;

            let detailedJobString =
              `indexRequest: ${indexRequestCount}, ` +
              `doIdMap: ${doIdMapCount}, ` +
              `loadPreviousIndex: ${loadPreviousIndexCount}, ` +
              `onIdMapped: ${onIdMappedCount}, ` +
              `onIndexed: ${onIndexedCount}, ` +
              `activeThreads: ${activeThreads}`;

            if (total === 0 && statusStyle === 'short') {
              statusIcon.text = localize(
                'tds.vscode.statusIcon.text2',
                'advpl: idle'
              );
            } else {
              statusIcon.text = `advpl: ${indexRequestCount}|${total} ${localize(
                'tds.vscode.statusIcon.text3',
                'jobs'
              )}`;
              if (statusStyle === 'detailed') {
                statusIcon.text += ` (${detailedJobString})`;
              }
            }
            statusIcon.tooltip =
              localize('tds.vscode.statusIcon.tooltip2', 'advpl jobs: ') +
              detailedJobString;
          });
        });
      }
    })();

    // QueryDb busy
    (() => {
      // Notifications have a minimum time to live. If the status changes multiple
      // times within that interface, we will show multiple notifications. Try to
      // avoid that.
      const kGracePeriodMs = 250;

      let timeout: any;
      let resolvePromise: any;
      languageClient.onReady().then(() => {
        languageClient.onNotification('$totvsserver/queryDbStatus', (args) => {
          let isActive: boolean = args.isActive;
          if (isActive) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = undefined;
            } else {
              window.withProgress(
                {
                  location: ProgressLocation.Notification,
                  title: 'querydb is busy',
                },
                (p) => {
                  p.report({ increment: 100 });
                  return new Promise((resolve, reject) => {
                    resolvePromise = resolve;
                  });
                }
              );
            }
          } else if (resolvePromise) {
            timeout = setTimeout(() => {
              resolvePromise();
              resolvePromise = undefined;
              timeout = undefined;
            }, kGracePeriodMs);
          }
        });
      });
    })();

    // Send $advpl/textDocumentDidView. Always send a notification - this will
    // result in some extra work, but it shouldn't be a problem in practice.
    // TODO: O LS não faz nada. Desativado por enquanto.
    // (() => {
    //   window.onDidChangeVisibleTextEditors((visible) => {
    //     for (let editor of visible) {
    //       languageClient.sendNotification("$advpl/textDocumentDidView", {
    //         textDocumentUri: editor.document.uri.toString(),
    //       });
    //     }
    //   });
    // })();
  }

  // Ação para pegar o nome da função e argumentos para  iniciar o debug
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.getProgramName', () =>
      getProgramName()
    )
  );
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.getProgramArguments', () =>
      getProgramArguments()
    )
  );
  //Ação para desfragmentar o RPO do servidor corrente.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.defragRPO', () =>
      defragRpo()
    )
  );
  //Ação para checar a integridade do RPO do servidor corrente.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.rpoCheckIntegrity', () =>
      rpoCheckIntegrity()
    )
  );
  //Ação para deletar um fonte selecionado do RPO.
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.delete.file.fromRPO',
      (context, files) => deleteFileFromRPO(context, files)
    )
  );
  //Ação par abrir a tela de inspetor de objetos.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.inspectorObjects', () =>
      inspectObject(context)
    )
  );
  //Ação par abrir a tela de inspetor de funções.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.inspectorFunctions', () =>
      inspectFunctions(context)
    )
  );

  //Compila os fontes/recursos selecionados
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.build.file',
      (args, files) => commandBuildFile(args, false, files)
    )
  );
  //Recompila os fontes/recursos selecionados
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.rebuild.file',
      (args, files) => commandBuildFile(args, true, files)
    )
  );

  //Compila todos os arquivos dentro de um workspace.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.build.workspace', () =>
      commandBuildWorkspace(false, context)
    )
  );
  //Recompila todos os arquivos dentro de um workspace.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.rebuild.workspace', () =>
      commandBuildWorkspace(true, context)
    )
  );

  //Compila todos os fontes abertos
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.build.openEditors', () =>
      commandBuildOpenEditors(false, context)
    )
  );
  //Recompila todos os fontes abertos
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.rebuild.openEditors', () =>
      commandBuildOpenEditors(true, context)
    )
  );

  //View
  let viewServer = new ServersExplorer(context);
  if (!viewServer) {
    console.error('Servers view not initialized.');
  }

  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.tdsreplay.webview.timeLine',
      () => {
        if (_debugEvent !== undefined) {
          if (createTimeLineWebView !== null) {
            createTimeLineWebView.reveal();
          }
        } else {
          vscode.window.showErrorMessage('TDS Replay não iniciado.');
        }
      }
    )
  );

  //Abre a tela de geração de patch com seleção de arquivos do RPO.
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.patchGenerate.fromRPO',
      () => patchGenerate(context)
    )
  );

  //Aplica um pacote de atualização (patch).
  context.subscriptions.push(
    vscode.commands.registerCommand('totvs-developer-studio.patchApply', () => {
      vscode.window.setStatusBarMessage(
        'Aguarde. Iniciando aplicação de pacotes...',
        5000
      );
      openApplyPatchView(context, undefined);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'totvs-developer-studio.patchApply.fromFile',
      (args: any) => {
        vscode.window.setStatusBarMessage(
          'Aguarde. Iniciando aplicação de pacotes...',
          5000
        );
        openApplyPatchView(context, args);
      }
    )
  );

  //Gera um patch de acordo com os arquivos contidos em uma pasta
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.patchGenerate.fromFolder',
      (context) => patchGenerateFromFolder(context)
    )
  );
  //Valida o conteudo de um patch pelo menu de contexto em arquivos de patch
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.patchValidate.fromFile',
      (args) => patchValidates(context, args)
    )
  );

  //Adiciona página de Includes
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.include', () =>
      showInclude(context)
    )
  );

  //Adicona página de geração de WSDL
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.ws.show', () =>
      showWSPage(context)
    )
  );

  //Aplica um template.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'totvs-developer-studio.templateApply',
      () => {
        openTemplateApplyView(context, undefined);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'totvs-developer-studio.templateApply.fromFile',
      (args: any) => {
        vscode.window.setStatusBarMessage(
          'Aguarde. Iniciando aplicação de template...',
          5000
        );
        openTemplateApplyView(context, args);
      }
    )
  );

  //monitor
  context.subscriptions.push(
    vscode.commands.registerCommand('tds-monitor.open-monitor-view', () => {
      vscode.window.setStatusBarMessage(
        'Aguarde. Iniciando monitoramento...',
        5000
      );
      openMonitorView(context);
    })
  );

  //rpo log
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'totvs-developer-studio.open-loadrpoinfo-view',
      () => {
        vscode.window.setStatusBarMessage(
          'Aguarde. Iniciando visualização...',
          5000
        );
        openRpoInfoView(context);
      }
    )
  );

  //Mostra a pagina de Welcome.
  showWelcomePage(context, false);

  //Abre uma caixa de informações para login no servidor protheus selecionado.
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.serverSelection',
      (...args) => serverSelection(args, context)
    )
  );

  //Seleção do arquivo com RPO Token.
  context.subscriptions.push(
    commands.registerCommand('totvs-developer-studio.rpoToken', () => {
      rpoTokenSelection();
    })
  );

  //Troca rápida do local de salva do servers.json.
  context.subscriptions.push(
    commands.registerCommand(
      'totvs-developer-studio.toggleSaveLocation',
      () => {
        Utils.toggleWorkspaceServerConfig();
      }
    )
  );

  //Compile key
  commands.registerCommand('totvs-developer-studio.compile.key', () =>
    compileKeyPage(context)
  );

  // Abre a tela de configuração de launchers
  commands.registerCommand('totvs-developer-studio.configure.launcher', () =>
    launcherConfig.show(context)
  );

  // Abre a tela de configuração de launchers
  commands.registerCommand(
    'totvs-developer-studio.tdsreplay.configure.launcher',
    () => tdsReplayLauncherConfig.show(context)
  );

  //inicialliza items da barra de status.
  initStatusBarItems(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'totvs-developer-studio.run.formatter',
      (args: any[]) => {
        //console.log("formatador ativado");
        if (args === undefined) {
          let aeditor = vscode.window.activeTextEditor;
          if (aeditor !== undefined) {
            args = [aeditor.document.uri];
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

  context.subscriptions.push(
    workspace.onDidChangeConfiguration(() => {
      updateStatusBarItems();
    })
  );

  //Capturador de logs.
  registerLog(context);

  //debug
  registerDebug(context);

  // Inicialização Adv/PL
  context.subscriptions.push(registerAdvplFormatting());
  context.subscriptions.push(registerAdvplOutline());

  // Inicialização 4GL
  context.subscriptions.push(register4glFormatting());
  context.subscriptions.push(register4glOutline());

  //Verifica questões de encoding
  //Não é mais necessários. Ver "package.json", sessão "configurationDefaults".
  //verifyEncoding();

  // Register custom editor for patch files
  context.subscriptions.push(PatchEditorProvider.register(context));

  showBanner();

  let exportedApi = {
    generatePPO(filePath: string, options?: any): Promise<string> {
      return generatePpo(filePath, options);
    },
  };
  // 'export' public api-surface
  return exportedApi;
}

function instanceOfUri(object: any): object is Uri {
  return object !== undefined && 'scheme' in object;
}

function instanceOfUriArray(object: any): object is Uri[] {
  return object !== undefined && Array.isArray(object);
}

// this method is called when your extension is deactivated
export function deactivate() {
  Utils.deleteSelectServer();
}

function registerLog(context: vscode.ExtensionContext) {
  commands.registerCommand('totvs-developer-studio.logger.on', () =>
    onCaptureLoggers(context)
  );
  commands.registerCommand('totvs-developer-studio.logger.off', () =>
    offCaptureLoggers()
  );

  commands.registerCommand('totvs-developer-studio.toggleTableSync', () =>
    toggleTableSync()
  );
}

/*
function verifyEncoding() {
	// check if there is an open folder
	if (vscode.workspace.workspaceFolders === undefined) {
		vscode.window.showErrorMessage("No folder opened.");
		return;
	}

	const textNoAsk = localize('tds.vscode.noAskAgain', "Don't ask again");
	const textNo = localize('tds.vscode.no', 'No');
	const textYes = localize('tds.vscode.yes', 'Yes');
	const textQuestion = localize('tds.vscode.question.change.encoding', 'Do you want to change the encoding to default TOTVS (Windows-1252)?'); // Deseja alterar o encoding para o padrão TOTVS (CP1252)?

	let questionAgain = true;

	const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');
	const questionEncodingConfig = configADVPL.get("askEncodingChange");
	const defaultConfig = vscode.workspace.getConfiguration();
	const defaultEncoding = defaultConfig.get("files.encoding");
	if (defaultEncoding !== "windows1252" && questionEncodingConfig !== false) {
		window.showWarningMessage(textQuestion, textYes, textNo, textNoAsk).then(clicked => {
			if (clicked === textYes) {
				const jsonEncoding = {
					"files.encoding": "windows1252"
				};
				defaultConfig.update("[advpl]", jsonEncoding);
				defaultConfig.update("[4gl]", jsonEncoding);
				questionAgain = false;
			} else if (clicked === textNo) {
				questionAgain = true;
			} else if (clicked === textNoAsk) {
				questionAgain = false;
			}
			configADVPL.update("askEncodingChange", questionAgain);
		});
	}
}
*/

let firstTime = true;

function showBanner(force: boolean = false) {
  if (firstTime) {
    firstTime = false;
    const config = workspace.getConfiguration('totvsLanguageServer');
    const showBanner = config.get('showBanner', true);

    if (showBanner || force) {
      let ext = vscode.extensions.getExtension('TOTVS.tds-vscode');
      /* prettier-ignore-start */
      languageClient.outputChannel.appendLine(
        '---------------------------v---------------------------------------------------'
      );
      languageClient.outputChannel.appendLine(
        '   //////  ////    //////  |  TOTVS Developer Studio for VS-Code'
      );
      languageClient.outputChannel.appendLine(
        '    //    //  //  //       |  Version ' + ext.packageJSON['version']
      );
      languageClient.outputChannel.appendLine(
        '   //    //  //  //////    |  TOTVS Technology'
      );
      languageClient.outputChannel.appendLine('  //    //  //      //     |');
      languageClient.outputChannel.appendLine(
        ' //    ////    //////      |  https://github.com/totvs/tds-vscode'
      );
      languageClient.outputChannel.appendLine(
        ' --------------------------^---------------------------------------------------'
      );
      /* prettier-ignore-end */
    }
  }
}
