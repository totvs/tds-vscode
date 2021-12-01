import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { CompileKey } from "./compileKey/compileKey";
import {
  IGetServerPermissionsResult,
  sendGetServerPermissionsInfo,
} from "./protocolMessages";
import { IRpoToken } from "./rpoToken";
import { ServerItem } from "./serverItemProvider";
import Utils from "./utils";

const localize = nls.config({
  locale: vscode.env.language,
  bundleFormat: nls.BundleFormat.standalone,
})();

let serverStatusBarItem: vscode.StatusBarItem;
let saveLocationBarItem: vscode.StatusBarItem;
let permissionStatusBarItem: vscode.StatusBarItem;
let settingsStatusBarItem: vscode.StatusBarItem;
let rpoTokenStatusBarItem: vscode.StatusBarItem;
let clearRpoTokenStatusBarItem: vscode.StatusBarItem;

const priorityTotvsStatusBarItem: number = 103;
const priorityRpoTokenStatusBarItem: number = 102;
const priorityPermissionStatusBarItem: number = 101;
const prioritySettingsStatusBarItem: number = 100;
const prioritySaveLocationBarItem: number = 100;

export function initStatusBarItems(context: vscode.ExtensionContext) {
  initStatusBarItem(context);
  initSaveLocationBarItem(context);
  initPermissionStatusBarItem(context);
  initRpoTokenStatusBarItem(context);
  initSettingsBarItem(context);
}

export function updateStatusBarItems() {
  updateStatusBarItem(undefined);
  updateSaveLocationBarItem();
  updatePermissionStatusBarItem();
  updateRpoTokenStatusBarItem();
  updateSettingsBarItem();
}

function initStatusBarItem(context: vscode.ExtensionContext) {
  serverStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityTotvsStatusBarItem
  );
  serverStatusBarItem.command = "totvs-developer-studio.serverSelection";
  serverStatusBarItem.text = `$(~spin) ${localize(
    "tds.vscode.initializing",
    "(initializing)"
  )}`;

  context.subscriptions.push(
    serverStatusBarItem,
    Utils.onDidSelectedServer((newServer: ServerItem) => {
      updateStatusBarItem(newServer);
    })
  );

  updateStatusBarItem(undefined);
}

function updateStatusBarItem(selectServer: ServerItem | undefined): void {
  serverStatusBarItem.text = `$(server-environment) `;

  if (selectServer) {
    serverStatusBarItem.text += `${selectServer.name} / ${selectServer.environment}`;
    buildServerTooltip(selectServer);
  } else {
    serverStatusBarItem.text += localize(
      "tds.vscode.select_server_environment",
      "Select server/environment"
    );
    serverStatusBarItem.tooltip = localize(
      "tds.vscode.select_server_environment.tooltip",
      "Select a server and environment in the server view"
    );
  }

  serverStatusBarItem.show();
}

function initSaveLocationBarItem(context: vscode.ExtensionContext) {
  saveLocationBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    prioritySaveLocationBarItem
  );
  saveLocationBarItem.command = "totvs-developer-studio.toggleSaveLocation";

  context.subscriptions.push(saveLocationBarItem);

  updateSaveLocationBarItem();
}

function updateSaveLocationBarItem() {
  const workspace: boolean = Utils.isWorkspaceServerConfig();
  const location: string = Utils.getServerConfigFile();

  if (workspace) {
    saveLocationBarItem.text = "$(home)";
  } else {
    saveLocationBarItem.text = "$(globe)";
  }
  saveLocationBarItem.tooltip = location;

  saveLocationBarItem.show();
}

function initPermissionStatusBarItem(context: vscode.ExtensionContext) {
  permissionStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityPermissionStatusBarItem
  );
  permissionStatusBarItem.command = "totvs-developer-studio.compile.key";
  context.subscriptions.push(permissionStatusBarItem);
  context.subscriptions.push(
    Utils.onDidSelectedKey(updatePermissionStatusBarItem)
  );

  updatePermissionStatusBarItem();
}

function updatePermissionStatusBarItem(): void {
  const infos: CompileKey = Utils.getPermissionsInfos();
  const toolTips: string[] = [];

  if (infos && infos.authorizationToken && infos.buildType && infos.expire) {
    const [dd, mm, yyyy] = infos.expire.split("/");
    const expiryDate: Date = new Date(`${yyyy}-${mm}-${dd} 23:59:59`);
    if (expiryDate.getTime() >= new Date().getTime()) {
      permissionStatusBarItem.text = localize(
        "tds.vscode.have_key",
        "HAVE key"
      );
      if (infos.machineId) {
        toolTips.push(
          localize("tds.vscode.machine_id", `Machine ID: ${infos.machineId}`)
        );
      } else if (infos.userId) {
        toolTips.push(
          localize("tds.vscode.user_id", `User ID: ${infos.userId}`)
        );
      }
      toolTips.push(
        localize(
          "tds.vscode.expires_in",
          `Expires in ${expiryDate.toLocaleString()}`
        )
      );

      if (infos.buildType === "0") {
        toolTips.push(
          localize(
            "tds.vscode.compile_override",
            "Allow compile functions and overwrite default TOTVS"
          )
        );
      } else if (infos.buildType === "1") {
        toolTips.push(
          localize(
            "tds.vscode.compile_users",
            "Allow only compile users functions"
          )
        );
      } else if (infos.buildType === "2") {
        toolTips.push(
          localize("tds.vscode.copile_functions", "Allow compile functions")
        );
      }
    } else {
      permissionStatusBarItem.text = localize(
        "tds.vscode.expired_in",
        `Expired in ${expiryDate.toLocaleString()}`
      );
    }
  } else {
    permissionStatusBarItem.text = localize("tds.vscode.not_key", "NOT key");
  }

  permissionStatusBarItem.text = `$(key) ${permissionStatusBarItem.text}`;
  permissionStatusBarItem.tooltip = toolTips.join("\n");

  permissionStatusBarItem.show();
}

function initRpoTokenStatusBarItem(context: vscode.ExtensionContext) {
  rpoTokenStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityRpoTokenStatusBarItem
  );
  rpoTokenStatusBarItem.command = "totvs-developer-studio.rpoToken";
  rpoTokenStatusBarItem.text = "RPO";
  rpoTokenStatusBarItem.tooltip = localize(
    "tds.vscode.rpoToken.initial.tooltip",
    "Input RPO token"
  );

  context.subscriptions.push(
    rpoTokenStatusBarItem,
    Utils.onDidSelectedServer(updateRpoTokenStatusBarItem),
    Utils.onDidRpoTokenSelected(updateRpoTokenStatusBarItem)
  );

  clearRpoTokenStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityRpoTokenStatusBarItem
  );
  clearRpoTokenStatusBarItem.command = "totvs-developer-studio.clearRpoToken";
  clearRpoTokenStatusBarItem.text = "$(notifications-clear)";
  clearRpoTokenStatusBarItem.tooltip = localize(
    "tds.vscode.rpoToken.clear.tooltip",
    "Clear RPO token"
  );

  rpoTokenStatusBarItem.show();
  clearRpoTokenStatusBarItem.show();
}

function updateRpoTokenStatusBarItem(): void {
  let text: string = "RPO ";
  let tooltip: string = "";

  const rpoToken: IRpoToken = Utils.getRpoTokenInfos();
  if (rpoToken) {
    const error: string = rpoToken.error; // || rpoAux.error;
    const warning: string = rpoToken.warning; // || rpoAux.warning;

    text = buildTextRpoToken(error ? 2 : warning ? 1 : 0, text);
    tooltip = buildTooltipRpoToken(error || warning, tooltip, rpoToken);
  }

  rpoTokenStatusBarItem.text = text;
  rpoTokenStatusBarItem.tooltip = tooltip;

  rpoTokenStatusBarItem.show();
  clearRpoTokenStatusBarItem.show();
}

function initSettingsBarItem(context: vscode.ExtensionContext): void {
  settingsStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    prioritySettingsStatusBarItem
  );
  context.subscriptions.push(settingsStatusBarItem);
}

function updateSettingsBarItem(): void {
  let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(
    "totvsLanguageServer"
  );
  let behavior = config.get("editor.toggle.autocomplete");

  settingsStatusBarItem.text = `${behavior}`;
  settingsStatusBarItem.tooltip =
    localize("tds.vscode.lssettings.auto.complete", "Auto complete type") +
    "  ";

  settingsStatusBarItem.show();
}

function buildTextRpoToken(level: number, text: string): string {
  return (
    text + (level == 2 ? "$(error)" : level == 1 ? "$(alert)" : "$(check)")
  );
}

function buildServerTooltip(server: ServerItem) {
  sendGetServerPermissionsInfo(server).then(
    (permissions: IGetServerPermissionsResult) => {
      if (permissions.message == "OK") {
        const group = (title: string, target: string): string => {
          const text: string[] = permissions.serverPermissions.text;
          const list: string[] = text
            .filter((value: string) => value.startsWith(target))
            .map((value: string) => "- ".concat(value.substr(2)));

          return list.length == 0 ? "" : `\n**${title}**\n${list.join("\n")}`;
        };
        serverStatusBarItem.tooltip = new vscode.MarkdownString(
          `**Address: _${server.address}:${server.port}_**\n` +
            group("Actions", "S") +
            group("Monitor", "M")
        );
      } else {
        serverStatusBarItem.tooltip = permissions.message;
      }
    },
    (error) => {
      console.log(error);
    }
  );
}

function buildTooltipRpoToken(
  message: string,
  tooltip: string,
  rpoToken: IRpoToken
): string {
  let result: string = tooltip;

  result += message ? `${message}\n` : "";
  if (rpoToken.body) {
    result += `Name: ${rpoToken.body.name}\n`;
    result += `Subject: ${rpoToken.body.sub}\n`;
    result += `Auth: ${rpoToken.body.auth}\n`;
    result += `Validate: ${rpoToken.body.exp} at ${rpoToken.body.iat}\n`;
    result += `Emitter: ${rpoToken.body.iss}`;
  }

  return result;
}
