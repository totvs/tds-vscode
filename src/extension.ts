/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';
import * as vscode from 'vscode';
import * as ls from 'vscode-languageserver-types';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, debug, extensions, workspace, ExtensionContext, Uri } from 'vscode';
import { ProgressLocation, StatusBarAlignment } from 'vscode';
import { jumpToUriAtPosition } from './vscodeUtils';
import { ServersExplorer, updateStatusBarItem } from './serversView';
import { compileKeyPage, updatePermissionBarItem } from './compileKey/compileKey';
import { getLanguageClient } from './TotvsLanguageClient';
import { patchGenerate, patchGenerateFromFolder } from './patch/patchGenerate';
import { patchApply } from './patch/patchApply';
import Utils from './utils';
import { LanguageClient } from 'vscode-languageclient';
import { commandBuildFile, commandBuildFolder, commandBuildWorkspace } from './tdsBuild';
import { deleteFileFromRPO } from './server/deleteFileFromRPO';
import { defragRpo } from './server/defragRPO';
import { serverAuthentication } from './inputConnectionParameters';
import * as nls from 'vscode-nls';
import { inspectObject } from './inspect/inspectObject';
import { inspectFunctions } from './inspect/inspectFunction';
import { showWelcomePage } from './welcome/welcomePage';
import showInclude from './include/include';
import showWSPage from './WebService/generateWS';
import launcherConfig from './launcher/launcherConfiguration';
import { onCaptureLoggers, offCaptureLoggers } from './loggerCapture/logger';
import { TotvsConfigurationWebProvider } from './debug/TotvsConfigurationWebProvider';
import { TotvsConfigurationProvider } from './debug/TotvsConfigurationProvider';
import { getDAP, getProgramName } from './debug/debugConfigs';

export let languageClient: LanguageClient;
// metodo de tradução
export let localize = nls.loadMessageBundle();
// barra de status
export let totvsStatusBarItem: vscode.StatusBarItem;
// barra de permissoes
export let permissionStatusBarItem: vscode.StatusBarItem;

export function parseUri(u): Uri {
	return Uri.parse(u);
}

export function activate(context: ExtensionContext) {

	console.log(localize('tds.console.congratulations', 'Congratulations, your extension "totvs-developer-studio" is now active!'));
	context.subscriptions.push(commands.registerCommand('tds.getDAP', () => getDAP()));

	if (extensions.getExtension("TOTVS.tds-vscode")) {
		//Load Language Client and start Language Server
		languageClient = getLanguageClient(context);
		context.subscriptions.push(languageClient.start());

		let p2c = languageClient.protocol2CodeConverter;

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

		});

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

	// Ação para pegar o nome da função quer quer iniciar o debug
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.getProgramName', () => getProgramName()));
	//Ação para desfragmentar o RPO do servidor corrente.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.defragRPO', () => defragRpo()));
	//Ação para deletar um fonte selecionado do RPO.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.delete.file.fromRPO', (context) => deleteFileFromRPO(context)));
	//Ação par abrir a tela de inspetor de objetos.
	context.subscriptions.push(commands.registerCommand("totvs-developer-studio.inspectorObjects", () => inspectObject(context)));
	//Ação par abrir a tela de inspetor de funções.
	context.subscriptions.push(commands.registerCommand("totvs-developer-studio.inspectorFunctions", () => inspectFunctions(context)));

	//Compila um fonte/recurso selecionado
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.file', (context) => commandBuildFile(context)));
	//Compila todos os arquivos dentro de uma pasta.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.folder', (context) => commandBuildFolder(context)));
	//Compila todos os arquivos dentro de um workspace.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.build.workspace', () => commandBuildWorkspace()));
	//Recompila todos os arquivos dentro de um workspace. Mesmo metodo pra 2 comandos diferentes
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.rebuild.workspace', () => commandBuildWorkspace()));

	//View
	let viewServer = new ServersExplorer(context);
	if (!viewServer) {
		console.error(localize('tds.vscode.server_vision_not_load', 'Visão "Servidores" não incializada.'));
	}

	// Registra uma configuração de debug
	const provider = new TotvsConfigurationProvider();
	context.subscriptions.push(debug.registerDebugConfigurationProvider(TotvsConfigurationProvider.type, provider));
	context.subscriptions.push(provider);

	// Registra uma configuração de debug web
	const webProvider = new TotvsConfigurationWebProvider();
	context.subscriptions.push(debug.registerDebugConfigurationProvider(TotvsConfigurationWebProvider.type, webProvider));
	context.subscriptions.push(webProvider);

	//Abre a tela de geração de patch com seleção de arquivos do RPO.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchGenerate.fromRPO', () => patchGenerate(context)));
	//Abre a tela de aplicação de patch
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchApply', () => patchApply(context, false)));
	//Aplica um patch de acordo com o arquivo selecionado.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchApply.fromFile', (context) => patchApply(context, true)));
	//Gera um patch de acordo com os arquivos contidos em uma pasta
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.patchGenerate.fromFolder', (context) => patchGenerateFromFolder(context)));

	//Adiciona página de Includes
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.include', () => showInclude(context)));

	//Adicona página de geração de WSDL
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.ws.show', () => showWSPage(context)));

	//Mostra a pagina de Welcome.
	showWelcomePage(context, false);

	//Abre uma caixa de informações para login no servidor protheus.
	context.subscriptions.push(commands.registerCommand('totvs-developer-studio.serverAuthentication', (...args) => serverAuthentication(args, context)));

	//Compile key
	commands.registerCommand("totvs-developer-studio.compile.key", () => compileKeyPage(context));

	// Abre a tela de configuração de launchers
	commands.registerCommand("totvs-developer-studio.configure.launcher", () => launcherConfig.show(context));

	//inicialliza item de barra de status de servidor conectado ou não.
	totvsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	totvsStatusBarItem.command = 'totvs-developer-studio.serverAuthentication';
	context.subscriptions.push(totvsStatusBarItem);
	context.subscriptions.push(Utils.onDidSelectedServer(updateStatusBarItem));

	//inicializa item de barra para permissões para exibir infomações da chave de compilação.
	permissionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 200);
	permissionStatusBarItem.command = 'totvs-developer-studio.compile.key';
	context.subscriptions.push(permissionStatusBarItem);
	context.subscriptions.push(Utils.onDidSelectedKey(updatePermissionBarItem));

	updateStatusBarItem(undefined);
	updatePermissionBarItem(Utils.getPermissionsInfos());

	//Commandos do capturador de logs.
	commands.registerCommand("totvs-developer-studio.logger.on", () => onCaptureLoggers(context));
	commands.registerCommand("totvs-developer-studio.logger.off", () => offCaptureLoggers());
}

// this method is called when your extension is deactivated
export function deactivate() {
	Utils.deleteSelectServer();
}
