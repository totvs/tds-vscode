import * as vscode from 'vscode'
import { languageClient } from './extension'

const LAST_VERSION_KEY = 'tds-vscode.lastVersion'

/**
 * Checks whether the extension was updated since the last activation.
 * If a new version is detected, displays a notification with a link
 * to the CHANGELOG.
 *
 * @param context - The VS Code extension context, used to access
 *   globalState for persisting the last known version.
 */
export function checkWhatsNew(context: vscode.ExtensionContext): void {
  const currentVersion: string = context.extension.packageJSON.version ?? '0.0.0'
  const lastVersion = context.globalState.get<string>(LAST_VERSION_KEY)

  if (lastVersion === currentVersion) {
    vscode.window.showInformationMessage('"TDS-VSCode" is ready.');
    return
  }

  // Update stored version
  context.globalState.update(LAST_VERSION_KEY, currentVersion)

  // Don't show on first install (no previous version stored)
  if (!lastVersion) {
    languageClient?.info(`First install detected (v${currentVersion}). Skipping What's New.`)
    vscode.window.showInformationMessage('"TDS-VSCode" is ready.');
    return
  }

  languageClient?.info(`Extension updated: v${lastVersion} → v${currentVersion}`)

  const message = vscode.l10n.t(
    'TDS VSCode updated to v{0}. Check out what\'s new!',
    currentVersion,
  )

  vscode.window.showInformationMessage(message, vscode.l10n.t('What\'s New'))
    .then((selection) => {
      if (selection === vscode.l10n.t('What\'s New')) {
        const changelogUri = vscode.Uri.joinPath(context.extensionUri, 'CHANGELOG.md')
        vscode.commands.executeCommand('markdown.showPreview', changelogUri)
      }
    })
}
