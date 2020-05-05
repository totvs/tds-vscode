import { ServerItem } from './serversView';
/*---------------------------------------------------------
 * Copyright (C) TOTVS S.A. All rights reserved.
 *--------------------------------------------------------*/

// tslint:disable-next-line: no-unused-expression
'use strict';
import * as vscode from 'vscode';
import * as ls from 'vscode-languageserver-types';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, debug, extensions, workspace, ExtensionContext, Uri, ProgressLocation, StatusBarAlignment } from 'vscode';
import { jumpToUriAtPosition } from './vscodeUtils';
import { ServersExplorer, updateStatusBarItem } from './serversView';
import { compileKeyPage, updatePermissionBarItem } from './compileKey/compileKey';
import { getLanguageClient } from './TotvsLanguageClient';
import { patchGenerate, patchGenerateFromFolder } from './patch/patchGenerate';
import { patchApply } from './patch/patchApply';
import Utils from './utils';
import { LanguageClient } from 'vscode-languageclient';
import { commandBuildFile, commandBuildWorkspace, commandBuildOpenEditors } from './compile/tdsBuild';
import { deleteFileFromRPO } from './server/deleteFileFromRPO';
import { defragRpo } from './server/defragRPO';
import { rpoCheckIntegrity }  from  './server/rpoCheckIntegrity';
import { serverSelection } from './inputConnectionParameters';
import * as nls from 'vscode-nls';
import { inspectObject } from './inspect/inspectObject';
import { inspectFunctions } from './inspect/inspectFunction';
import { patchInfos } from './patch/inspectPatch';
import { showWelcomePage } from './welcome/welcomePage';
import showInclude from './include/include';
import showWSPage from './WebService/generateWS';
import launcherConfig from './launcher/launcherConfiguration';
import { onCaptureLoggers, offCaptureLoggers } from './loggerCapture/logger';
import { TotvsConfigurationWebProvider } from './debug/TotvsConfigurationWebProvider';
import { TotvsConfigurationProvider } from './debug/TotvsConfigurationProvider';
import tdsReplayLauncherConfig from './launcher/tdsReplay/tdsReplayLauncherConfig';
import { TotvsConfigurationTdsReplayProvider } from './debug/TotvsConfigurationTdsReplayProvider';
import { TotvsDebugAdapterDescriptorFactory } from './debug/TotvsDebugAdapterDescriptorFactory'
import { getDAP, getProgramName, getProgramArguments, toggleTableSync } from './debug/debugConfigs';
import { toggleAutocompleteBehavior, updateSettingsBarItem } from './server/languageServerSettings';
import { advplDocumentFormattingEditProvider, advplDocumentRangeFormattingEditProvider, advplResourceFormatting } from './formatter/advplFormatting';
import { processDebugCustomEvent, DebugEvent, createTimeLineWebView } from './debug/debugEvents';

export let languageClient: LanguageClient;
// metodo de tradução
export let localize = nls.loadMessageBundle();
// barra de status
export let totvsStatusBarItem: vscode.StatusBarItem;
// barra de permissoes
export let permissionStatusBarItem: vscode.StatusBarItem;

// barra de configurações
export let settingsStatusBarItem: vscode.StatusBarItem;

let _debugEvent = undefined;

export function parseUri(u): Uri {
	return Uri.parse(u);
}

export function activate(context: ExtensionContext) {

	//new DebugEvent(context); //Cria a instancia para ja informar o debug context

	console.log(localize('tds.console.congratulations', 'Congratulations, your extension "totvs-developer-studio" is now active!'));
	context.subscriptions.push(commands.registerCommand('tds.getDAP', () => getDAP()));

	if (extensions.getExtension("TOTVS.tds-vscode")) {
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
							position: position
						})
						.then((locations: Array<ls.Location>) => {
							if (autoGotoIfSingle && locations.length === 1) {
								let location = p2c.asLocation(locations[0]);
								commands.executeCommand(
									'advpl.goto', location.uri, location.range.start, []);
							} else {
								commands.executeCommand(
									'editor.action.showReferences', uri, position,
									locations.map(p2c.asLocation));
							}
						});
				};
			}
			commands.registerCommand('advpl.vars', makeRefHandler('$advpl/vars'));
			commands.registerCommand('advpl.callers', makeRefHandler('$advpl/callers'));
			commands.registerCommand('advpl.base', makeRefHandler('$advpl/base', true));

		})();

		// The language client does not correctly deserialize arguments, so we have a
		// wrapper command that does it for us.
		(() => {
			commands.registerCommand('advpl.showReferences',
				(uri: string, position: ls.Position, locations: ls.Location[]) => {
					commands.executeCommand('editor.action.showReferences', p2c.asUri(uri),
						p2c.asPosition(position), locations.map(p2c.asLocation));
				});


			commands.registerCommand('advpl.goto',
				(uri: string, position: ls.Position, locations: ls.Location[]) => {
					jumpToUriAtPosition(p2c.asUri(uri), p2c.asPosition(position), false /*preserveFocus*/);
				});
		})();

		// Commands for configuring LS behavior and other components
		(() => {
			commands.registerCommand('totvs-developer-studio.toggle.autocomplete.behavior',
				() => {
					toggleAutocompleteBehavior();
				});
		})();

		// Progress
		(() => {
			let config = workspace.getConfiguration('advpl');
			let statusStyle = config.get('misc.status');
			if (statusStyle === 'short' || statusStyle === 'detailed') {
				let statusIcon = window.createStatusBarItem(StatusBarAlignment.Right);
				statusIcon.text = localize('tds.vscode.statusIcon.text1', 'advpl: loading');
				statusIcon.tooltip = localize('tds.vscode.statusIcon.tooltip1', 'advpl is loading project metadata (ie, compile_commands.json)');
				statusIcon.show();
				languageClient.onReady().then(() => {
					languageClient.onNotification('$totvsserver/progress', (args) => {
						let indexRequestCount = args.indexRequestCount || 0;
						let doIdMapCount = args.doIdMapCount || 0;
						let loadPreviousIndexCount = args.loadPreviousIndexCount || 0;
						let onIdMappedCount = args.onIdMappedCount || 0;
						let onIndexedCount = args.onIndexedCount || 0;
						let activeThreads = args.activeThreads || 0;
						let total = indexRequestCount + doIdMapCount +
							loadPreviousIndexCount + onIdMappedCount + onIndexedCount +
							activeThreads;

						let detailedJobString = `indexRequest: ${indexRequestCount}, ` +
							`doIdMap: ${doIdMapCount}, ` +
							`loadPreviousIndex: ${loadPreviousIndexCount}, ` +
							`onIdMapped: ${onIdMappedCount}, ` +
							`onIndexed: ${onIndexedCount}, ` +
							`activeThreads: ${activeThreads}`;

						if (total === 0 && statusStyle === 'short') {
							statusIcon.text = localize('tds.vscode.statusIcon.text2', 'advpl: idle');
						} else {
							statusIcon.text = `advpl: ${indexRequestCount}|${total} ${localize('tds.vscode.statusIcon.text3', 'jobs')}`;
							if (statusStyle === 'detailed') {
								statusIcon.text += ` (${detailedJobString})`;
							}
						}
						statusIcon.tooltip = localize('tds.vscode.statusIcon.tooltip2', 'advpl jobs: ') + detailedJobString;
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

			let timeout: NodeJS.Timer | undefined;
			let resolvePromise: any;
			languageClient.onReady().then(() => {
				languageClient.onNotification('$totvsserver/queryDbStatus', (args) => {
					let isActive: boolean = args.isActive;
					if (isActive) {
						if (timeout) {
							clearTimeout(timeout);
							timeout = undefined;
						}
						else {
							window.withProgress({ location: ProgressLocation.Notification, title: 'querydb is busy' }, (p) => {
								p.report({ increment: 100 });
								return new Promise((resolve, reject) => {
									resolvePromise = resolve;
								});
							});
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
		(() => {
			window.onDidChangeVisibleTextEditors(visible => {
				for (let editor of visible) {
					languageClient.sendNotification('$advpl/textDocumentDidView',
						{ textDocumentUri: editor.document.uri.toString() });
				}
			});
		})();
	}

	// Ação para pegar o nome da função e argumentos para  iniciar o debug
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.getProgramName', () => getProgramName()));
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.getProgramArguments', () => getProgramArguments()));
	//Ação para desfragmentar o RPO do servidor corrente.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.defragRPO', () => defragRpo()));
	//Ação para checar a integridade do RPO do servidor corrente.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.rpoCheckIntegrity', () => rpoCheckIntegrity()));
	//Ação para deletar um fonte selecionado do RPO.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.delete.file.fromRPO', (context, files) => deleteFileFromRPO(context, files)));
	//Ação par abrir a tela de inspetor de objetos.
	context.subscriptions.push(commands.registerCommand("totvs-developer-studio.inspectorObjects", () => inspectObject(context)));
	//Ação par abrir a tela de inspetor de funções.
	context.subscriptions.push(commands.registerCommand("totvs-developer-studio.inspectorFunctions", () => inspectFunctions(context)));

	//Compila os fontes/recursos selecionados
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.file', (args, files) => commandBuildFile(args, false, files)));
	//Recompila os fontes/recursos selecionados
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.rebuild.file', (args, files) => commandBuildFile(args, true, files)));

	//Compila todos os arquivos dentro de um workspace.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.workspace', () => commandBuildWorkspace(false, context)));
	//Recompila todos os arquivos dentro de um workspace.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.rebuild.workspace', () => commandBuildWorkspace(true, context)));

	//Compila todos os fontes abertos
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.openEditors', () => commandBuildOpenEditors(false, context)));
	//Recompila todos os fontes abertos
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.rebuild.openEditors', () => commandBuildOpenEditors(true, context)));

	//View
	let viewServer = new ServersExplorer(context);
	if (!viewServer) {
		console.error(localize('tds.vscode.server_vision_not_load', 'Visão "Servidores" não inicializada.'));
	}

	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.tdsreplay.webview.timeLine', () => {
		if (_debugEvent !== undefined) {
			if (createTimeLineWebView !== null) {
				createTimeLineWebView.reveal();
			}
		} else {
			vscode.window.showErrorMessage("TDS Replay não iniciado.");
		}
	}));

	// Registra uma configuração de debug
	const provider = new TotvsConfigurationProvider();
	context.subscriptions.push(debug.registerDebugConfigurationProvider(TotvsConfigurationProvider.type, provider));
	context.subscriptions.push(provider);

	context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory(TotvsConfigurationProvider.type, new TotvsDebugAdapterDescriptorFactory(context)));

	const tdsReplayProvider = new TotvsConfigurationTdsReplayProvider();
	context.subscriptions.push(debug.registerDebugConfigurationProvider(TotvsConfigurationTdsReplayProvider.type, tdsReplayProvider));
	context.subscriptions.push(tdsReplayProvider);

	context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory(TotvsConfigurationTdsReplayProvider.type, new TotvsDebugAdapterDescriptorFactory(context)));

	// Registra uma configuração de debug web
	const webProvider = new TotvsConfigurationWebProvider();
	context.subscriptions.push(debug.registerDebugConfigurationProvider(TotvsConfigurationWebProvider.type, webProvider));
	context.subscriptions.push(webProvider);

	context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory(TotvsConfigurationWebProvider.type, new TotvsDebugAdapterDescriptorFactory(context)));

	//Abre a tela de geração de patch com seleção de arquivos do RPO.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchGenerate.fromRPO', () => patchGenerate(context)));
	//Abre a tela de aplicação de patch
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchApply', () => patchApply(context, false)));
	//Aplica um patch de acordo com o arquivo selecionado.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchApply.fromFile', (context) => patchApply(context, true)));
	//Gera um patch de acordo com os arquivos contidos em uma pasta
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchGenerate.fromFolder', (context) => patchGenerateFromFolder(context)));
	//Verifica o conteudo de um patch
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchInfos', () => patchInfos(context, null)));
	//Verifica o conteudo de um patch pelo menu de contexto em arquivos de patch
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchInfos.fromFile', (args) => patchInfos(context, args)));

	//Adiciona página de Includes
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.include', () => showInclude(context)));

	//Adicona página de geração de WSDL
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.ws.show', () => showWSPage(context)));

	//Mostra a pagina de Welcome.
	showWelcomePage(context, false);

	//Abre uma caixa de informações para login no servidor protheus selecionado.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.serverSelection', (...args) => serverSelection(args, context)));

	//Compile key
	commands.registerCommand("totvs-developer-studio.compile.key", () => compileKeyPage(context));

	// Abre a tela de configuração de launchers
	commands.registerCommand("totvs-developer-studio.configure.launcher", () => launcherConfig.show(context));

	// Abre a tela de configuração de launchers
	commands.registerCommand("totvs-developer-studio.tdsreplay.configure.launcher", () => tdsReplayLauncherConfig.show(context));


	//inicialliza item de barra de status de servidor conectado ou não.
	totvsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	totvsStatusBarItem.command = 'totvs-developer-studio.serverSelection';
	context.subscriptions.push(totvsStatusBarItem);
	context.subscriptions.push(Utils.onDidSelectedServer(updateStatusBarItem));

	//inicializa item de barra para permissões para exibir infomações da chave de compilação.
	permissionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 200);
	permissionStatusBarItem.command = 'totvs-developer-studio.compile.key';
	context.subscriptions.push(permissionStatusBarItem);
	context.subscriptions.push(Utils.onDidSelectedKey(updatePermissionBarItem));

	//inicialliza item de barra de configurações
	settingsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	context.subscriptions.push(settingsStatusBarItem);
	context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
		updateSettingsBarItem();
	}));

	updateStatusBarItem(undefined);
	updatePermissionBarItem(Utils.getPermissionsInfos());
	updateSettingsBarItem();

	//Commandos do capturador de logs.
	commands.registerCommand("totvs-developer-studio.logger.on", () => onCaptureLoggers(context));
	commands.registerCommand("totvs-developer-studio.logger.off", () => offCaptureLoggers());

	commands.registerCommand("totvs-developer-studio.toggleTableSync", () => toggleTableSync());

	// Inicialização do formatador Adv/PL
	context.subscriptions.push(
		vscode.commands.registerCommand('totvs-developer-studio.run.formatter', (args: any[]) => {
			//console.log("formatador ativado");
			if (args === undefined) {
				let aeditor = vscode.window.activeTextEditor;
				if (aeditor !== undefined) {
					args = [aeditor.document.uri];
				}
			}
			if (instanceOfUri(args)) {
				advplResourceFormatting([args.fsPath]);
			} else if (instanceOfUriArray(args)) {
				const map: string[] = args.map<string>((uri: Uri) => {
					return uri.fsPath;
				});
				advplResourceFormatting(map);
			}
		})
	);


	//formatadores
	vscode.languages.registerDocumentFormattingEditProvider('advpl',
		advplDocumentFormattingEditProvider()
	);

	vscode.languages.registerDocumentRangeFormattingEditProvider('advpl',
		advplDocumentRangeFormattingEditProvider()
	);

	//debug
	vscode.debug.onDidReceiveDebugSessionCustomEvent((debugEvent: vscode.DebugSessionCustomEvent) => {
		_debugEvent = debugEvent;
		processDebugCustomEvent(debugEvent);
	});

	vscode.debug.onDidTerminateDebugSession(() => {
		_debugEvent = undefined;
	});

	//Verifica questões de encoding
	verifyEncoding();
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
