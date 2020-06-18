import * as vscode from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import { TotvsConfigurationWebProvider } from "./TotvsConfigurationWebProvider";
import { TotvsDebugAdapterDescriptorFactory } from "./TotvsDebugAdapterDescriptorFactory";
import { TotvsConfigurationTdsReplayProvider } from "./TotvsConfigurationTdsReplayProvider";
import { processDebugCustomEvent } from "./debugEvents";

export let _debugEvent = undefined;

export const registerDebug = (context: vscode.ExtensionContext) => {

  /****** Configurações de execução do debugger regular **/

  const debugProvider = new TotvsConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationProvider.type,
      debugProvider
    )
  );
  context.subscriptions.push(debugProvider);

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      TotvsConfigurationProvider.type,
      new TotvsDebugAdapterDescriptorFactory(context)
    )
  );


  /**** Configurações de execução do debug com TDS Replay *******/

  const tdsReplayProvider = new TotvsConfigurationTdsReplayProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationTdsReplayProvider.type,
      tdsReplayProvider
    )
  );
  context.subscriptions.push(tdsReplayProvider);

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      TotvsConfigurationTdsReplayProvider.type,
      new TotvsDebugAdapterDescriptorFactory(context)
    )
  );


  /***** Configuração de debug web *****/

  const webProvider = new TotvsConfigurationWebProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationWebProvider.type,
      webProvider
    )
  );
  context.subscriptions.push(webProvider);

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      TotvsConfigurationWebProvider.type,
      new TotvsDebugAdapterDescriptorFactory(context)
    )
  );


  /** Configurações gerais de debug  */

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
