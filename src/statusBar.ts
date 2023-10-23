import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { IUsageStatusInfo, IUsageStatusData } from "./protocolMessages";
import { IRpoToken, getEnabledRpoToken } from "./rpoToken";
import { ServerItem } from "./serverItem";
import Utils, { ServersConfig } from "./utils";

let localize = nls.loadMessageBundle();

let serverStatusBarItem: vscode.StatusBarItem;
let saveLocationBarItem: vscode.StatusBarItem;
let settingsStatusBarItem: vscode.StatusBarItem;
let rpoTokenStatusBarItem: vscode.StatusBarItem;
let usageBarItem: vscode.StatusBarItem;

const priorityusageBarItem: number = 104;
const priorityTotvsStatusBarItem: number = 103;
const priorityRpoTokenStatusBarItem: number = 102;
const priorityPermissionStatusBarItem: number = 101;
const prioritySettingsStatusBarItem: number = 100;
const prioritySaveLocationBarItem: number = 100;

export function initStatusBarItems(context: vscode.ExtensionContext) {
  initStatusBarItem(context);
  initSaveLocationBarItem(context);
  initRpoTokenStatusBarItem(context);
  initSettingsBarItem(context);
  initUsageBarItem(context);
}

export function updateStatusBarItems() {
  updateStatusBarItem(undefined);
  updateSaveLocationBarItem();
  updateRpoTokenStatusBarItem();
}

function initStatusBarItem(context: vscode.ExtensionContext) {
  serverStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityTotvsStatusBarItem
  );
  serverStatusBarItem.command = "totvs-developer-studio.serverSelection";
  serverStatusBarItem.text = `$(gear~spin) ${localize(
    "tds.vscode.initializing",
    "(initializing)"
  )}`;

  context.subscriptions.push(
    serverStatusBarItem,
    ServersConfig.onDidSelectedServer((newServer: ServerItem) => {
      updateStatusBarItem(newServer);
    })
  );

  updateStatusBarItem(undefined);
}

function updateStatusBarItem(selectServer: ServerItem | undefined): void {
  serverStatusBarItem.text = `$(server-environment) `;

  if (selectServer) {
    serverStatusBarItem.text += `${selectServer.name} / ${selectServer.environment}\n`;
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
  const location: string = ServersConfig.getServerConfigFile();

  if (workspace) {
    saveLocationBarItem.text = "$(home)";
  } else {
    saveLocationBarItem.text = "$(globe)";
  }
  saveLocationBarItem.tooltip = location;

  saveLocationBarItem.show();
}

function initRpoTokenStatusBarItem(context: vscode.ExtensionContext) {
  rpoTokenStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityRpoTokenStatusBarItem
  );
  rpoTokenStatusBarItem.command = "totvs-developer-studio.selectRpoToken";

  updateRpoTokenStatusBarItem();
}

function updateRpoTokenStatusBarItem(): void {
  let text: string = "";
  let tooltip: string = "";

  let rpoToken: IRpoToken = ServersConfig.getRpoTokenInfos();
  if (rpoToken === undefined) {
    rpoToken = { token: "", enabled: false };
  }

  const error: string = rpoToken.error;
  const warning: string = rpoToken.warning;

  if (rpoToken.token.length == 0) {
    text = "$(gear) RPO Token";
    tooltip = localize(
      "tds.package.inputRpoToken",
      "Input RPO token"
    )
  } else {
    let enabled = getEnabledRpoToken(rpoToken);
    text = buildTextRpoToken(error ? 2 : warning ? 1 : 0, enabled, text) + " RPO Token";
    tooltip = buildTooltipRpoToken(error || warning, tooltip, rpoToken);
  }

  rpoTokenStatusBarItem.text = text;
  rpoTokenStatusBarItem.tooltip = tooltip;

  rpoTokenStatusBarItem.show();
}

function initSettingsBarItem(context: vscode.ExtensionContext): void {
  settingsStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    prioritySettingsStatusBarItem
  );
  context.subscriptions.push(settingsStatusBarItem);
}
function buildTextRpoToken(level: number, enabled: boolean, text: string): string {
  return (
    text + (level == 2 ? "$(error)" : level == 1 ? "$(alert)" : (enabled ? "$(check)" : "$(circle-slash)"))
  );
}

function buildServerTooltip(server: ServerItem) {
  const error: string = server.informations?.errorMessage || "";
  const permissions: string[] = server.informations?.permissions || [];

  if (error.length == 0) {
    const group = (title: string, target: string): string => {
      const list: string[] = permissions[target];

      return list.length == 0
        ? ""
        : `**${title}**\n${list
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((value: string) => `- ${value}`)
          .join("\n")}`;
    };

    serverStatusBarItem.tooltip = new vscode.MarkdownString(
      `**Address: _${server.address}:${server.port}_** ` +
      `${server.buildVersion}\n ${group("Actions", "S")}\n ${group("Monitor", "M")}`
    );
  } else {
    serverStatusBarItem.tooltip = error;
  }
}

function buildTooltipRpoToken(
  message: string,
  tooltip: string,
  rpoToken: IRpoToken
): string {
  let result: string = tooltip;

  result += message ? `${message}\n` : "";
  if (rpoToken.body) {
    let enabled = getEnabledRpoToken(rpoToken);
    let status = enabled ? "ENABLED" : "DISABLED";
    result += `STATUS: ${status}`;
    if (enabled) {
      result += `\nSubject: ${rpoToken.body.sub}\n`;
      result += `Authorization: ${rpoToken.body.auth}\n`;
      result += `Issued: ${rpoToken.body.iat}\n`;
      result += `Emitter: ${rpoToken.body.iss}\n`;
      result += `Validity: ${rpoToken.body.exp}`;
    }
  }

  return result;
}

function initUsageBarItem(context: vscode.ExtensionContext): void {
  usageBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    priorityusageBarItem
  );
  usageBarItem.command = "totvs-developer-studio.toggleUsageInfo";

  context.subscriptions.push(usageBarItem);
  updateUsageBarItem();
}

export function updateUsageBarItem(args?: IUsageStatusInfo): void {
  let text: string = `$(lightbulb)`;
  let tooltip: string | vscode.MarkdownString = "Wait initilize...";

  if (args) {
    const usageStatus: any = args.usageStatus;

    text = args.activate ? `$(lightbulb-autofix) (${args["counter"]}x)` : `$(light-bulb)`;
    tooltip = buildTooltipBusyInfo(args);

    usageBarItem.text = text;
    usageBarItem.tooltip = tooltip;
  }

  usageBarItem.show();
}

function buildTooltipBusyInfo(args: IUsageStatusInfo): vscode.MarkdownString {
  let text: vscode.MarkdownString = new vscode.MarkdownString(
    `**Usage Indicator**\n` +
    `- Active: ${args.activate ? "Yes" : "No"} (${args.counter}x)`
  );

  if (args.activate) {
    const capital = (value: string): string => {
      const values: string[] = value.split("_");
      values.forEach((element: string, i) => {
        values[i] = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      });

      return values.join(" ");
    }

    args.usageStatus.forEach((value: IUsageStatusData) => {
      text.appendMarkdown(`\n- ${capital(value.key)}: ${value.value}`)
    });
  }

  // text.appendMarkdown("\n\nVer [detalhes telemetria](command:totvs-developer-studio.detailUsageInfo)");
  text.appendMarkdown("\n\n_Click_ no ícone abaixo para ativar/desativar");

  text.isTrusted = true;
  text.supportHtml = true;

  return text;
};

	    // QueryDb busy
    // (() => {
    //   // Notifications have a minimum time to live. If the status changes multiple
    //   // times within that interface, we will show multiple notifications. Try to
    //   // avoid that.
    //   const kGracePeriodMs = 250;

    //   let timeout: any;
    //   let resolvePromise: any;
    //   languageClient.onReady().then(() => {
    //     languageClient.onNotification("$totvsserver/queryDbStatus", (args) => {
    //       let isActive: boolean = args.isActive;
    //       if (isActive) {
    //         if (timeout) {
    //           clearTimeout(timeout);
    //           timeout = undefined;
    //         } else {
    //           window.withProgress(
    //             {
    //               location: ProgressLocation.Notification,
    //               title: "querydb is busy",
    //             },
    //             (p) => {
    //               p.report({ increment: 100 });
    //               return new Promise((resolve, reject) => {
    //                 resolvePromise = resolve;
    //               });
    //             }
    //           );
    //         }
    //       } else if (resolvePromise) {
    //         timeout = setTimeout(() => {
    //           resolvePromise();
    //           resolvePromise = undefined;
    //           timeout = undefined;
    //         }, kGracePeriodMs);
    //       }
    //     });
    //   });
    // })();

