import * as vscode from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import { TotvsConfigurationWebProvider } from "./TotvsConfigurationWebProvider";
import { TotvsDebugAdapterDescriptorFactory } from "./TotvsDebugAdapterDescriptorFactory";
import { TotvsConfigurationTdsReplayProvider } from "./TotvsConfigurationTdsReplayProvider";
import {
  DebugEvent,
  procesChangeBreakpointsEvent,
  processDebugCustomEvent,
} from "./debugEvents";
import { LanguageClient } from "vscode-languageclient/node";
import { TotvsDebugTrackerDescriptorFactory } from "./TotvsDebugTrackerDescriptorFactory";

export let _debugEvent = undefined;

export const registerDebug = (context: vscode.ExtensionContext, languageClient: LanguageClient) => {
  new DebugEvent(context); //força inicialização e registra contexto
  const factory = new TotvsDebugAdapterDescriptorFactory();
  const tracker = new TotvsDebugTrackerDescriptorFactory()

  /****** Configurações de execução do debugger regular **/
  const debugProvider = new TotvsConfigurationProvider();
  context.subscriptions.push(debugProvider);

  registerDebugAdapter(
    context,
    TotvsConfigurationProvider._TYPE,
    debugProvider,
    factory,
    tracker
  );

  /**** Configurações de execução do debug com TDS Replay *******/

  const tdsReplayProvider = new TotvsConfigurationTdsReplayProvider();
  context.subscriptions.push(tdsReplayProvider);

  registerDebugAdapter(
    context,
    TotvsConfigurationTdsReplayProvider._TYPE,
    tdsReplayProvider,
    factory,
    tracker
  );

  /***** Configuração de debug web *****/

  const webProvider = new TotvsConfigurationWebProvider();
  context.subscriptions.push(webProvider);

  registerDebugAdapter(
    context,
    TotvsConfigurationWebProvider._TYPE,
    webProvider,
    factory,
    tracker)

  /** Configurações gerais de debug  */
  context.subscriptions.push(
    vscode.debug.onDidChangeBreakpoints((event: vscode.BreakpointsChangeEvent) => {
      procesChangeBreakpointsEvent(languageClient, event);
    })
  );

  context.subscriptions.push(
    vscode.debug.onDidReceiveDebugSessionCustomEvent(
      (debugEvent: vscode.DebugSessionCustomEvent) => {
        _debugEvent = debugEvent;
        processDebugCustomEvent(debugEvent);
      }
    )
  );

  context.subscriptions.push(
    vscode.debug.onDidTerminateDebugSession(() => {
      _debugEvent = undefined;
    })
  );
};

function registerDebugAdapter(
  context: vscode.ExtensionContext,
  type: string,
  provider: vscode.DebugConfigurationProvider,
  factory: vscode.DebugAdapterDescriptorFactory,
  tracker?: vscode.DebugAdapterTrackerFactory
) {
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(type, provider)
  );

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(type, factory)
  );

  if (tracker) {
    context.subscriptions.push(
      vscode.debug.registerDebugAdapterTrackerFactory(type, tracker)
    );
  }
}
