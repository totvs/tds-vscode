import { languageClient } from '../extension';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import Utils from '../utils';

export function toggleAutocompleteBehavior() {
  let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(
    'totvsLanguageServer'
  );
  let behavior = config.get('editor.toggle.autocomplete');

  if (behavior === 'Basic') {
    behavior = 'LS';
  } else {
    behavior = 'Basic';
  }
  config.update('editor.toggle.autocomplete', behavior);
}

export function syncSettings() {
  let config = vscode.workspace.getConfiguration('totvsLanguageServer');

  const servers = Utils.getServersConfig();
  let includesList = servers.includes as Array<string>;
  let includes = '';
  includesList.forEach((includeItem) => {
    includes += includeItem + ';';
  });
  changeSettings({
    changeSettingInfo: { scope: 'advpls', key: 'includes', value: includes },
  });

  let behavior = config.get('editor.toggle.autocomplete');
  changeSettings({
    changeSettingInfo: {
      scope: 'advpls',
      key: 'autocomplete',
      value: behavior,
    },
  });

  let notificationlevel = config.get('editor.show.notification');
  changeSettings({
    changeSettingInfo: {
      scope: 'advpls',
      key: 'notificationlevel',
      value: notificationlevel,
    },
  });
}

export function changeSettings(jsonData: any) {
  languageClient.sendRequest('$totvsserver/changeSetting', jsonData);
}
