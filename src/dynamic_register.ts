import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { registerAdvplFormatting, register4glFormatting } from "./formatter";

/**
 * Controle do registro dinâmico de capacidades LSP no lado da extensão.
 *
 * Espelha o modelo do Language Server (register/unregisterCapability): a
 * extensão só registra provedores locais quando o modo for `extension`; no modo
 * `ls` ela os desregistra, deixando o LS anunciar/retirar a capability
 * dinamicamente. O valor dos settings é propagado ao LS via
 * `didChangeConfiguration` (ver getModifiedLanguageServerSettings).
 */

let extensionFormatters: vscode.Disposable | undefined;

/**
 * Aplica o modo de formatação configurado em
 * `totvsLanguageServer.formatter.provider` (ls | extension).
 *
 * Garante exclusividade: os providers de formatação da extensão só são
 * registrados no modo `extension`. No modo `ls` eles são
 * desregistrados (o LS decide dinamicamente se anuncia a capability de
 * formatação via register/unregisterCapability).
 */
export function applyFormattingMode(context: ExtensionContext) {
  const mode = vscode.workspace
    .getConfiguration("totvsLanguageServer")
    .get<string>("formatter.provider", "ls");

  extensionFormatters?.dispose();
  extensionFormatters = undefined;

  if (mode === "extension") {
    extensionFormatters = vscode.Disposable.from(
      registerAdvplFormatting(),
      register4glFormatting()
    );
    context.subscriptions.push(extensionFormatters);
  }
}
