import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { CompileKey } from "./compileKey/compileKey";
import { IUsageStatusInfo, IUsageStatusData } from "./protocolMessages";
import { IRpoToken } from "./rpoToken";
import { ServerItem } from "./serverItem";
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
  initPermissionStatusBarItem(context);
  initRpoTokenStatusBarItem(context);
  initSettingsBarItem(context);
  initUsageBarItem(context);
}

export function updateStatusBarItems() {
  updateStatusBarItem(undefined); 
  updateSaveLocationBarItem();
  updatePermissionStatusBarItem();
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
    Utils.onDidSelectedServer((newServer: ServerItem) => {
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
          localize("tds.vscode.machine_id", "Machine ID: {0}", infos.machineId)
        );
      } else if (infos.userId) {
        toolTips.push(
          localize("tds.vscode.user_id", "User ID: {0}", infos.userId)
        );
      }
      toolTips.push(
        localize(
          "tds.vscode.expires_in",
          "Expires in {0}",
          expiryDate.toLocaleString()
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
        "Expired in {0}",
        expiryDate.toLocaleString()
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
  rpoTokenStatusBarItem.text = "RPO$(gear)";
  rpoTokenStatusBarItem.tooltip = localize(
    "tds.vscode.rpoToken.initial.tooltip",
    "Input RPO token"
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

  context.subscriptions.push(
    rpoTokenStatusBarItem,
    clearRpoTokenStatusBarItem,
    Utils.onDidSelectedServer(updateRpoTokenStatusBarItem),
    Utils.onDidRpoTokenSelected(updateRpoTokenStatusBarItem)
  );

  rpoTokenStatusBarItem.show();
  clearRpoTokenStatusBarItem.show();
}

function updateRpoTokenStatusBarItem(): void {
  let text: string = "";
  let tooltip: string = "";

  const rpoToken: IRpoToken = Utils.getRpoTokenInfos();
  if (rpoToken) {
    const error: string = rpoToken.error; // || rpoAux.error;
    const warning: string = rpoToken.warning; // || rpoAux.warning;

    if (rpoToken.token.length == 0) {
      text = "$(gear) RPO";
      tooltip = localize(
        "tds.vscode.rpoToken.initial.tooltip",
        "Input RPO token"
      )
    } else {
      text = buildTextRpoToken(error ? 2 : warning ? 1 : 0, text) + " RPO";
      tooltip = buildTooltipRpoToken(error || warning, tooltip, rpoToken);
    }
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
function buildTextRpoToken(level: number, text: string): string {
  return (
    text + (level == 2 ? "$(error)" : level == 1 ? "$(alert)" : "$(check)")
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
    result += `Name: ${rpoToken.body.name}\n`;
    result += `Subject: ${rpoToken.body.sub}\n`;
    result += `Auth: ${rpoToken.body.auth}\n`;
    result += `Validate: ${rpoToken.body.exp} at ${rpoToken.body.iat}\n`;
    result += `Emitter: ${rpoToken.body.iss}`;
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

