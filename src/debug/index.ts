import * as vscode from 'vscode';
import { TotvsConfigurationProvider } from './TotvsConfigurationProvider';
import { TotvsConfigurationWebProvider } from './TotvsConfigurationWebProvider';
import { TotvsDebugAdapterDescriptorFactory } from './TotvsDebugAdapterDescriptorFactory';
import { TotvsConfigurationTdsReplayProvider } from './TotvsConfigurationTdsReplayProvider';
import {
  processDebugCustomEvent,
  procesStartDebugSessionEvent,
} from './debugEvents';
import { canDebug } from '../extension';

export let _debugEvent = undefined;

export const registerDebug = (context: vscode.ExtensionContext) => {
  const factory = new TotvsDebugAdapterDescriptorFactory(context);

  /****** Configurações de execução do debugger regular **/

  const debugProvider = new TotvsConfigurationProvider();
  registerDebugAdapter(
    context,
    TotvsConfigurationProvider.type,
    debugProvider,
    factory
  );
  context.subscriptions.push(debugProvider);

  /**** Configurações de execução do debug com TDS Replay *******/

  const tdsReplayProvider = new TotvsConfigurationTdsReplayProvider();
  registerDebugAdapter(
    context,
    TotvsConfigurationTdsReplayProvider.type,
    tdsReplayProvider,
    factory
  );
  context.subscriptions.push(tdsReplayProvider);

  /***** Configuração de debug web *****/

  const webProvider = new TotvsConfigurationWebProvider();
  registerDebugAdapter(
    context,
    TotvsConfigurationWebProvider.type,
    webProvider,
    factory
  );
  context.subscriptions.push(webProvider);

  /** Configurações gerais de debug  */

  context.subscriptions.push(
    vscode.debug.onDidStartDebugSession((event: any) => {
      procesStartDebugSessionEvent(event);
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
  factory: vscode.DebugAdapterDescriptorFactory
) {
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(type, provider)
  );

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(type, factory)
  );
}
