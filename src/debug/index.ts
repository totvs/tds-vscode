import * as vscode from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import { TotvsConfigurationWebProvider } from "./TotvsConfigurationWebProvider";
import { TotvsDebugAdapterDescriptorFactory } from "./TotvsDebugAdapterDescriptorFactory";
import { TotvsConfigurationTdsReplayProvider } from "./TotvsConfigurationTdsReplayProvider";
import { processDebugCustomEvent } from "./debugEvents";

export let _debugEvent = undefined;

export const registerDebug = (context: vscode.ExtensionContext) => {
  const provider = new TotvsConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationProvider.type,
      provider
    )
  );
  context.subscriptions.push(provider);

  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      TotvsConfigurationProvider.type,
      new TotvsDebugAdapterDescriptorFactory(context)
    )
  );

  const tdsReplayProvider = new TotvsConfigurationTdsReplayProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationTdsReplayProvider.type,
      tdsReplayProvider
    )
  );
  context.subscriptions.push(tdsReplayProvider);

  // Registra uma configuração de debug web
  const webProvider = new TotvsConfigurationWebProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      TotvsConfigurationWebProvider.type,
      webProvider
    )
  );
  context.subscriptions.push(webProvider);

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
