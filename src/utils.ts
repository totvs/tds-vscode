import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as cheerio from "cheerio";
import * as ini from "ini";
import { languageClient } from "./extension";
import { Authorization, CompileKey } from "./compileKey/compileKey";
import { IRpoToken, getEnabledRpoTokenInfos } from "./rpoToken";
import stripJsonComments from "strip-json-comments";
import {
  IGetServerInformationsResult,
  IGetServerPermissionsResult,
  sendGetServerInformationsInfo,
  sendGetServerPermissionsInfo,
} from "./protocolMessages";
import { EnvSection, ServerItem } from "./serverItem";

const homedir = require("os").homedir();

export enum MESSAGETYPE {
  /**
   * Type for informative and resumed messages
   * i.e.: Inform only the begining and the end of a compilation process.
   */
  Info = "Info",

  /**
   * Type for error messages
   */
  Error = "Error",

  /**
   * Type for warning messages
   */
  Warning = "Warning",

  /**
   * Type for detailed messages
   * i.e.: During a compilation process, inform the status of each file and it's result.
   */
  Log = "Log",
}

export default class Utils {

  /**
   * Subscrição para evento de chave de compilação.
   */
  static get onDidSelectedKey(): vscode.Event<CompileKey> {
    return Utils._onDidSelectedKey.event;
  }

  /**
   * Subscrição para evento de token de RPO.
   */
  static get onDidRpoTokenSelected(): vscode.Event<void> {
    return Utils._onDidRpoTokenSelected.event;
  }

  /**
   * Emite a notificação de seleção de chave de compilação
   */
  private static _onDidSelectedKey = new vscode.EventEmitter<CompileKey>();

  /**
   * Emite a notificação de token de RPO
   */
  private static _onDidRpoTokenSelected = new vscode.EventEmitter<void>();

  /**
   * Gera um id de servidor
   */
  public static generateRandomID() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Troca o local da salva de servers.json
   */
  static toggleWorkspaceServerConfig() {
    const config = vscode.workspace.getConfiguration("totvsLanguageServer");
    config.update("workspaceServerConfig", !this.isWorkspaceServerConfig());
  }

  /**
   * Troca da indicação da atividade.
   */
  static toggleUsageInfoConfig() {
    const config = vscode.workspace.getConfiguration("totvsLanguageServer");
    config.update("usageInfoConfig", !this.isUsageInfoConfig());
  }

  /**
   * Pegar o arquivo servers.json da .vscode (workspace)?
   */
  static isWorkspaceServerConfig(): boolean {
    let config = vscode.workspace.getConfiguration("totvsLanguageServer");
    return config.get("workspaceServerConfig");
  }

  /**
 * Indica o status de informações de
 */
  static isUsageInfoConfig(): boolean {
    let config = vscode.workspace.getConfiguration("totvsLanguageServer");
    return config.get("usageInfoConfig");
  }

  static isServerP20OrGreater(server: /*ServerItem*/any): boolean {
    if (server && server.buildVersion) {
      return server.buildVersion.localeCompare("7.00.191205P") > 0;
    }
    return false;
  }

  /**
   * Retorna o path da pasta .vscode dentro do workspace
   */
  static getVSCodePath() {
    let rootPath: string = vscode.workspace.rootPath || process.cwd();

    return path.join(rootPath, ".vscode");
  }

  static addCssToHtml(htmlFilePath: vscode.Uri, cssFilePath: vscode.Uri) {
    const htmlContent = fs.readFileSync(
      htmlFilePath.with({ scheme: "vscode-resource" }).fsPath
    );
    const cssContent = fs.readFileSync(
      cssFilePath.with({ scheme: "vscode-resource" }).fsPath
    );

    const $ = cheerio.load(htmlContent.toString());

    let style = $("style").html();

    if (style === undefined || style === null || style === "") {
      $("html").append("<style>" + cssContent + "</style>");
    } else {
      $("style").append(cssContent.toString());
    }

    return $.html();
  }

  /**
   * Logs the informed messaged in the console and/or shows a dialog
   * Please note that the dialog opening respects the dialog settings defined by the user in editor.show.notification
   * @param message - The message to be shown
   * @param messageType - The message type
   * @param showDialog - If it must show a dialog.
   */
  static logMessage(
    message: string,
    messageType: MESSAGETYPE,
    showDialog: boolean
  ) {
    let config = vscode.workspace.getConfiguration("totvsLanguageServer");
    let notificationLevel = config.get("editor.show.notification");
    switch (messageType) {
      case MESSAGETYPE.Error:
        console.log(message);
        languageClient?.error(message);
        if (showDialog && notificationLevel !== "none") {
          vscode.window.showErrorMessage(message);
        }
        break;
      case MESSAGETYPE.Info:
        console.log(message);
        languageClient?.info(message);
        if (
          (showDialog && notificationLevel === "all") ||
          notificationLevel === "errors warnings and infos"
        ) {
          vscode.window.showInformationMessage(message);
        }
        break;
      case MESSAGETYPE.Warning:
        console.log(message);
        languageClient?.warn(message);
        if (
          showDialog &&
          (notificationLevel === "all" ||
            notificationLevel === "errors warnings and infos" ||
            notificationLevel === "errors and warnings")
        ) {
          vscode.window.showWarningMessage(message);
        }
        break;
      case MESSAGETYPE.Log:
        let time = Utils.timeAsHHMMSS(new Date());
        console.log(message);
        languageClient?.outputChannel.appendLine(
          "[Log   + " + time + "] " + message
        );
        if (showDialog && notificationLevel === "all") {
          vscode.window.showInformationMessage(message);
        }
        break;
    }
  }

  static timeAsHHMMSS(date): string {
    return (
      Utils.leftpad(date.getHours(), 2) +
      ":" +
      Utils.leftpad(date.getMinutes(), 2) +
      ":" +
      Utils.leftpad(date.getSeconds(), 2)
    );
  }

  static leftpad(val, resultLength = 2, leftpadChar = "0"): string {
    return (String(leftpadChar).repeat(resultLength) + String(val)).slice(
      String(val).length
    );
  }

  static getAllFilesRecursive(folders: Array<string>): string[] {
    const files: string[] = [];

    folders.forEach((folder) => {
      if (fs.lstatSync(folder).isDirectory()) {
        fs.readdirSync(folder).forEach((file) => {
          if (!Utils.ignoreResource(file)) {
            const fn = path.join(folder, file);
            const ss = fs.statSync(fn);
            if (ss.isDirectory()) {
              files.push(...Utils.getAllFilesRecursive([fn]));
            } else {
              files.push(fn);
            }
          } else {
            vscode.window.showWarningMessage(
              "File/folder '" + file + "' was ignored."
            );
          }
        });
      } else {
        files.push(folder);
      }
    });

    return files;
  }

  static ignoreResource(fileName: string): boolean {
    return processIgnoreList(ignoreListExpressions, path.basename(fileName));
  }

  static checkDir(selectedDir: string): string {
    if (fs.existsSync(selectedDir)) {
      if (!fs.lstatSync(selectedDir).isDirectory()) {
        selectedDir = path.dirname(selectedDir);
      }
      if (fs.lstatSync(selectedDir).isDirectory()) {
        return selectedDir;
      }
    }
    vscode.window.showErrorMessage(
      selectedDir + " does not exist or it is not a directory."
    );
    return "";
  }

  static deepCopy(obj: any): any {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = Utils.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = Utils.deepCopy(obj[attr]);
        }
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  //TODO: melhorar lendo de "package.json"
  // retorna null ao ler configuração advpl/4gl
  // let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('languages');
  // const advpl = config.get("advpl")["extensions"];
  // const logix = config.get("4gl")["extensions"];

  private static advpl: string[] = [
    ".th",
    ".ch",
    ".prw",
    ".prg",
    ".prx",
    ".ppx",
    ".ppp",
    ".tlpp",
    ".aph",
    ".ahu",
    ".apl",
    ".apw",
  ];

  private static logix: string[] = [".4gl", ".per"];

  static isAdvPlSource(fileName: string): boolean {
    const ext = path.extname(fileName);
    return this.advpl.indexOf(ext.toLocaleLowerCase()) > -1;
  }

  static is4glSource(fileName: string): boolean {
    const ext = path.extname(fileName);
    return this.logix.indexOf(ext.toLocaleLowerCase()) > -1;
  }

  static isResource(fileName: string): boolean {
    return !this.isAdvPlSource(fileName) && !this.is4glSource(fileName);
  }

}

export class ServersConfig {

  /**
   * Subscrição para evento de seleção de servidor/ambiente.
   */
  static get onDidSelectedServer(): vscode.Event</*ServerItem*/any> {
    return ServersConfig._onDidSelectedServer.event;
  }

  /**
   * Emite a notificação de seleção de servidor/ambiente
   */
  private static _onDidSelectedServer = new vscode.EventEmitter</*ServerItem*/any>();

  /**
   * Retorna o path completo do servers.json
   */
  static getServerConfigFile() {
    return path.join(this.getServerConfigPath(), "servers.json"); // XXX teste para ver onde eh usado
  }

  /**
   * Retorna o path de onde deve ficar o servers.json
   */
  static getServerConfigPath() {
    return Utils.isWorkspaceServerConfig()
      ? Utils.getVSCodePath()
      : path.join(homedir, "/.totvsls");
  }

  static getServers() {
    const servers = getServersConfig();
    return servers.configurations;
  }

  static lastConnectedServer(): ServerItem {
    let server: ServerItem;
    const servers = getServersConfig();
    if (servers && servers.lastConnectedServer) {
      server = this.getServerById(servers.lastConnectedServer);
    }
    return server;
  }

  static updateSavedToken(id: string, environment: string, token: string) {
    const servers = getServersConfig();

    const data = { id: id, environment: environment };
    servers.savedTokens[id + ":" + environment] = data;

    // persistir a configuracao
    persistServersInfo(servers);
  }

  static getSavedTokens(id: string, environment: string): undefined | string {
    const servers = getServersConfig();
    let token = undefined;

    if (servers.savedTokens) {
      token = servers.savedTokens
        .filter((element) => {
          return element[0] === id + ":" + environment;
        })
        .map((element) => {
          return element[1]["token"];
        });
      if (token) {
        token = token[0];
      }
    }

    return token;
  }

  /**
   * Salva o servidor logado por ultimo.
   * @param id Id do servidor logado
   * @param token Token que o LS gerou em cima das informacoes de login
   * @param name Nome do servidor logado
   * @param environment Ambiente utilizado no login
   */
  static saveSelectServer(
    id: string,
    token: string,
    environment: string,
    username: string
  ) {
    const servers = getServersConfig();

    servers.configurations.forEach(async (element) => {
      if (element.id === id) {
        if (element.environments === undefined) {
          element.environments = [environment];
        } else if (element.environments.indexOf(environment) === -1) {
          element.environments.push(environment);
        }

        element.username = username;
        element.environment = environment;
        element.token = token;

        servers.connectedServer = element;
        servers.lastConnectedServer = element.id;
      }
    });

    doUpdateInformations(servers.connectedServer).then((value: /*IServerInformations*/any) => {
      servers.connectedServer.informations = value;

      persistServersInfo(servers);
      this._onDidSelectedServer.fire(servers.connectedServer);
    });
  }

  /**
   * Salva informação de environment e username de um servidor.
   * @param id Id do servidor
   * @param environment Ambiente
   * @param username Usuario
   */
  static saveServerEnvironmentUsername(
    id: string,
    environment: string,
    username: string
  ) {
    const servers = getServersConfig();
    let serverUpdated: boolean = false;

    servers.configurations.forEach(async (element) => {
      if (element.id === id) {
        if (element.environments === undefined) {
          element.environments = [environment];
        } else if (element.environments.indexOf(environment) === -1) {
          element.environments.push(environment);
        }
        element.environment = environment;
        element.username = username;
        serverUpdated = true;
      }
    });

    if (serverUpdated) {
      persistServersInfo(servers);
    } else {
      vscode.window.showWarningMessage("No server was found with provided id.");
    }
  }

  /**
   * Salva o servidor logado por ultimo.
   * @param id Id do servidor logado
   * @param token Token que o LS gerou em cima das informacoes de login
   * @param environment Ambiente utilizado no login
   */
  static saveConnectionToken(id: string, token: string, environment: string) {
    const servers = getServersConfig();

    if (!servers.savedTokens) {
      let emptySavedTokens: Array<[string, object]> = [];
      servers.savedTokens = emptySavedTokens;
    } else {
      let found: boolean = false;
      let key = id + ":" + environment;
      if (servers.savedTokens) {
        servers.savedTokens.forEach((element) => {
          if (element[0] === key) {
            found = true; // update token
            element[1] = { id: id, token: token };
          }
        });
      }
      if (!found) {
        servers.savedTokens.push([key, { id: id, token: token }]);
      } else {
        servers.savedTokens[key] = { id: id, token: token };
      }

      persistServersInfo(servers);
    }
  }

  /**
   * Remove o token salvo do servidor/environment.
   * @param id Id do servidor logado
   * @param environment Ambiente utilizado no login
   */
  static removeSavedConnectionToken(id: string, environment: string) {
    const servers = getServersConfig();
    if (servers.savedTokens) {
      let key = id + ":" + environment;
      servers.savedTokens.forEach((element) => {
        if (element[0] === key) {
          const index = servers.savedTokens.indexOf(element, 0);
          servers.savedTokens.splice(index, 1);
          persistServersInfo(servers);
          return;
        }
      });
    }
  }

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteSelectServer() {
    const servers = getServersConfig();
    if (servers.connectedServer.id) {
      let server = {};
      servers.connectedServer = server;
      const configADVPL = vscode.workspace.getConfiguration(
        "totvsLanguageServer"
      ); //transformar em configuracao de workspace
      let isReconnectLastServer = configADVPL.get("reconnectLastServer");
      if (!isReconnectLastServer) {
        servers.lastConnectedServer = "";
      }
      persistServersInfo(servers);
    }
  }

  static clearConnectedServerConfig() {
    const allConfigs = getServersConfig();

    allConfigs.connectedServer = {};
    allConfigs.lastConnectedServer = "";
    persistServersInfo(allConfigs);
    this._onDidSelectedServer.fire(undefined);
  }

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteServer(id: string) {
    const confirmationMessage = "Are you sure want to delete this server?";
    const optionYes = "Yes";
    const optionNo = "No";
    vscode.window
      .showWarningMessage(confirmationMessage, { modal: true }, optionYes, optionNo)
      .then((clicked) => {
        if (clicked === optionYes) {
          const allConfigs = getServersConfig();

          if (allConfigs.configurations) {
            const configs = allConfigs.configurations;

            configs.forEach((element) => {
              if (element.id === id) {
                const index = configs.indexOf(element, 0);
                configs.splice(index, 1);
                persistServersInfo(allConfigs);
                return;
              }
            });
          }
        }
      });
  }

  /**
   * Cria uma nova configuracao de servidor no servers.json
   */
  static createNewServer(
    typeServer,
    serverName,
    port,
    address,
    buildVersion,
    secure,
    includes
  ): string | undefined {
    this.createServerConfig();
    let serverConfig = getServersConfig();

    if (!serverConfig || !serverConfig.configurations) {
      let serversJson = this.getServerConfigFile();
      this.initializeServerConfigFile(serversJson);
      serverConfig = getServersConfig();
    }

    if (serverConfig.configurations) {
      const servers = serverConfig.configurations;

      if (
        servers.find((element) => {
          return element.name === serverName;
        })
      ) {
        vscode.window.showErrorMessage(
          vscode.l10n.t("Server name already exists")
        );
        return undefined;
      } else {
        let validate_includes: string[] = [];
        includes.forEach((element) => {
          if (element !== undefined && element.length > 0) {
            validate_includes.push(element);
          }
        });
        const serverId: string = Utils.generateRandomID();
        servers.push({
          id: serverId,
          type: typeServer,
          name: serverName,
          port: parseInt(port),
          address: address,
          buildVersion: buildVersion,
          secure: secure,
          includes: validate_includes,
        });

        persistServersInfo(serverConfig);
        return serverId;
      }
    }
    return undefined;
  }

  /**
   * Recupera o ultimo servidor logado
   */
  static getCurrentServer() {
    const servers = getServersConfig();

    if (servers.connectedServer.id) {
      // busca sempre pelo ID pois pode ter ocorrido alguma alteração nas configurações do servidor conectado
      return this.getServerById(servers.connectedServer.id);
    } else {
      return "";
    }
  }

  static getAuthorizationToken(server: /*ServerItem*/any): string {
    let authorizationToken: string = "";
    let isSafeRPOServer: boolean = Utils.isServerP20OrGreater(server);
    const permissionsInfos: IRpoToken | CompileKey = isSafeRPOServer
      ? this.getRpoTokenInfos()
      : this.getPermissionsInfos();
    if (permissionsInfos) {
      if (isSafeRPOServer) {
        // necessita dois IFs separados, pois senão cairia no ELSE e não é o esperado
        if (getEnabledRpoTokenInfos()) {
          // somente seta o authorizationToken se estiver habilitado
          authorizationToken = (<IRpoToken>permissionsInfos).token;
        }
      } else {
        authorizationToken = (<CompileKey>permissionsInfos).authorizationToken;
      }
    }
    return authorizationToken;
  }

  static getRpoTokenInfos(): IRpoToken {
    const servers = getServersConfig();

    return servers ? servers.rpoToken : undefined;
  }

  static saveRpoTokenInfos(infos: IRpoToken) {
    const config = getServersConfig();

    config.rpoToken = infos;

    persistServersInfo(config);
    //Utils._onDidSelectedKey.fire(infos);
  }

  static getPermissionsInfos(): CompileKey {
    const servers = getServersConfig();

    return servers ? servers.permissions : undefined;
  }

  static savePermissionsInfos(infos: CompileKey) {
    const config = getServersConfig();

    config.permissions = infos;

    persistServersInfo(config);
    //Utils._onDidSelectedKey.fire(infos);   // XXX rever
  }

  static deletePermissionsInfos() {
    const config = getServersConfig();

    config.permissions = undefined;

    persistServersInfo(config);
    //Utils._onDidSelectedKey.fire(undefined);   // XXX rever
  }

  static removeExpiredAuthorization() {
    vscode.window.showWarningMessage(
      vscode.l10n.t("Expired authorization token deleted")
    );
    this.deletePermissionsInfos(); // remove expired authorization key
  }

  /**
   * Recupera a lista de includes do arquivod servers.json
   */
  static getGlobalIncludes(): Array<string> {
    let includes: Array<string>;
    const servers = getServersConfig();
    if (servers && servers.includes) {
      includes = servers.includes as Array<string>;
    }
    return includes;
  }

  /**
   * Recupera a lista de includes do arquivod servers.json
   */
  static getIncludes(
    absolutePath: boolean = false,
    server: any = undefined
  ): Array<string> {
    let includes: Array<string>;
    // se houver includes de servidor utiliza, caso contrario utiliza o global
    if (server && server.includes && server.includes.length > 0) {
      includes = server.includes as Array<string>;
    } else {
      const servers = getServersConfig();
      includes = servers.includes as Array<string>;
    }

    if (includes.length > 0) {
      if (absolutePath) {
        // resolve caminhos relativos ao workspace
        let ws: string = vscode.workspace.rootPath;;

        if (vscode.window.activeTextEditor) {
          const workspaceFolder: vscode.WorkspaceFolder =
            vscode.workspace.getWorkspaceFolder(
              vscode.window.activeTextEditor.document.uri
            );
          if (workspaceFolder) {
            ws = workspaceFolder.uri.fsPath;
          }
        }

        includes.forEach((value, index, elements) => {
          if (value.startsWith(".")) {
            value = path.resolve(ws, value);
          } else {
            value = path.resolve(value.replace("${workspaceFolder}", ws));
          }
          elements[index] = value;
        });
        // filtra diretorios invalidos e nao encontrados
        includes = includes.filter(function (value) {
          try {
            const fi: fs.Stats = fs.lstatSync(value);
            if (!fi.isDirectory()) {
              const msg: string = vscode.l10n.t("Review the folder list in order to search for settings (.ch). Not recognized as folder: {0}", value);
              vscode.window.showWarningMessage(msg);
              return false;
            }
          } catch (error) {
            const msg: string = vscode.l10n.t("Review the folder list in order to search for settings (.ch). Invalid folder: {0}", value);
            vscode.window.showWarningMessage(msg);
            return false;
          }
          return true;
        });
      }
    } else {
      vscode.window.showWarningMessage(
        vscode.l10n.t("List of folders to search for definitions not configured.")
      );
    }
    return includes;
  }

  /**
   * Cria o arquivo servers.json caso ele nao exista.
   */
  static createServerConfig() {
    if (!fs.existsSync(this.getServerConfigPath())) {
      fs.mkdirSync(this.getServerConfigPath());
    }
    let serversJson = this.getServerConfigFile();
    if (!fs.existsSync(serversJson)) {
      this.initializeServerConfigFile(serversJson);
    }
  }

  static initializeServerConfigFile(serversJson) {
    try {
      fs.writeFileSync(serversJson, JSON.stringify(sampleServer(), null, "\t"));
    } catch (err) {
      console.error(err);
    }
  }

  // Duplicado: Usar o getServerById
  // /**
  //  *Recupera um servidor pelo ID informado.
  //  * @param ID ID do servidor que sera selecionado.
  //  */
  // static  getServerForID(ID: string) {
  //   let server;
  //   const allConfigs = getServersConfig();

  //   if (allConfigs.configurations) {
  //     const configs = allConfigs.configurations;

  //     configs.forEach((element) => {
  //       if (element.id === ID) {
  //         server = element;
  //         if (server.environments === undefined) {
  //           server.environments = [];
  //         }
  //       }
  //     });
  //   }
  //   return server;
  // }

  /**
   *Recupera um servidor pelo id informado.
   * @param id id do servidor alvo.
   * @param serversConfig opcional, se omitido utiliza o padrao
   */
  static getServerById(id: string) {
    let server;
    const serversConfig: any = getServersConfig();
    if (serversConfig.configurations) {
      const configs = serversConfig.configurations;
      configs.forEach((element) => {
        if (element.id === id) {
          server = element;
          if (server.environments === undefined) {
            server.environments = [];
          }
        }
      });
    }
    return server;
  }

  /**
   *Recupera um servidor pelo nome informado.
   * @param name nome do servidor alvo.
   */
  static getServerForNameWithConfig(name: string, serversConfig: any) {
    let server;

    if (serversConfig.configurations) {
      const configs = serversConfig.configurations;

      configs.forEach((element) => {
        if (element.name === name) {
          server = element;
          if (server.environments === undefined) {
            server.environments = [];
          }
        }
      });
    }
    return server;
  }

  /**
   *Salva uma nova configuracao de include.
   */
  static saveIncludePath(includePath: string[]) {
    const servers = getServersConfig();

    servers.includes = includePath;

    persistServersInfo(servers);
  }

  /**
   * Atualiza includes do linter.
   */
  static updateLinterIncludes() {
    const servers = getServersConfig();
    const includes: string = servers.includes.join(";");
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("totvsLanguageServer");

    const includeLinter = config.get("editor.linter.includes", "");
    if ((includes.length > 0) && (includes != includeLinter)) {
      config.update("editor.linter.includes", includes); //dispara onDidChangeConfiguration
    }
  }

  /**
   *Atualiza no server.json a build de um servidor
   * @param id ID do server que sera atualizado
   * @param buildVersion Nova build do servidor
   */
  static updateBuildVersion(id: string, buildVersion: string, secure: boolean) {
    let result = false;
    if (!id || !buildVersion) {
      return result;
    }
    const serverConfig = getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.buildVersion = buildVersion;
        element.secure = secure;
        persistServersInfo(serverConfig);
        result = true;
      }
    });

    return result;
  }

  /**
   *Atualiza no server.json o nome de um servidor
   * @param id ID do server que sera atualizado
   * @param newName Novo nome do servidor
   */
  static updateServerName(id: string, newName: string) {
    let result = false;
    if (!id || !newName) {
      return result;
    }
    const serverConfig = getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.name = newName;
        persistServersInfo(serverConfig);
        result = true;
      }
    });

    return result;
  }

  static updatePatchGenerateDir(id: string, patchGenerateDir: string) {
    let result = false;
    if (
      !id ||
      id.length == 0 ||
      !patchGenerateDir ||
      patchGenerateDir.length == 0
    ) {
      return result;
    }
    const serverConfig = getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.patchGenerateDir = patchGenerateDir;
        persistServersInfo(serverConfig);
        result = true;
      }
    });
    return result;
  }

  static readCompileKeyFile(path): Authorization {
    if (fs.existsSync(path)) {
      const parseIni = ini.parse(fs.readFileSync(path, "utf-8").toLowerCase()); // XXX toLowerCase??
      return parseIni.authorization;
    }
    return undefined;
  }

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteEnvironmentServer(environment: EnvSection) {
    const allConfigs = getServersConfig();

    if (allConfigs.configurations) {
      const configs = allConfigs.configurations;
      const id = environment.serverItemParent.id;

      configs.forEach((element) => {
        if (element.id === id) {
          const index = element.environments.indexOf(environment.label, 0);

          if (index > -1) {
            element.environments.splice(index, 1);
            persistServersInfo(allConfigs);
          }

          return;
        }
      });
    }
  }

  static getEnvironmentsConfig(serverName: string) {
    const servers = getServersConfig();
    const target: string = serverName.replace("_monitor", "")
    const serverConfig = servers.configurations.find((element) => element.name == target);

    return serverConfig?.environmentsConfig || [];
  }

  static setEnvironmentsConfig(serverName: string, environmentsConfig: any[]) {
    const servers = getServersConfig();
    const target: string = serverName.replace("_monitor", "")

    servers.configurations.forEach((element: any, index: number) => {
      if (element.name == target) {
        servers.configurations[index].environmentsConfig = environmentsConfig;
        persistServersInfo(servers);
      }
    });
  }

  static getServersConfigString() {
    let configString = "";
    const config = getServersConfig();
    if (config) {
      configString = JSON.stringify(config);
    }
    return configString;
  }

}

function sampleServer(): any {
  return {
    version: "0.2.2",
    includes: [""],
    permissions: {
      authorizationtoken: "",
    },
    connectedServer: {},
    configurations: [],
    savedTokens: [],
    lastConnectedServer: "",
  };
}

/**
 * Retorna todo o conteudo do servers.json
 */
function getServersConfig() {
  let config: any = {};
  let serversJson = ServersConfig.getServerConfigFile();
  if (!fs.existsSync(serversJson)) {
    ServersConfig.initializeServerConfigFile(serversJson);
  }
  let json = fs.readFileSync(serversJson).toString();

  if (json) {
    try {
      config = JSON.parse(stripJsonComments(json));
    } catch (e) {
      config = sampleServer();
    }
  }

  //garante a existencia da sessão
  if (!config.savedTokens) {
    config.savedTokens = [];
  }

  //compatibilização com arquivos gravados com versão da extensão
  //anterior a 26/06/20
  if (
    config.hasOwnProperty("lastConnectedServer") &&
    typeof config.lastConnectedServer !== "string"
  ) {
    if (config.lastConnectedServer.hasOwnProperty("id")) {
      config.lastConnectedServer = config.lastConnectedServer.id;
    }
  }

  //compatibilização de versões anteriores a 0.2.2
  if (config.version < "0.2.2") {
    config.version = "0.2.2";
  }

  return config;
}

/**
 * Grava no arquivo servers.json uma nova configuracao de servers
 * @param JSONServerInfo
 */
function persistServersInfo(JSONServerInfo) {
  let fs = require("fs");
  fs.writeFileSync(
    ServersConfig.getServerConfigFile(),
    JSON.stringify(JSONServerInfo, null, "\t"),
    (err) => {
      if (err) {
        vscode.window.showErrorMessage(err);
        console.error(err);
      }
    }
  );
}

export class LaunchConfig {

  static getLaunchers() {
    let launchers;
    const launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.configurations) {
      launchers = launchConfig.configurations;
    }
    return launchers;
  }

  static updateConfiguration(launcherName, launcher) {
    let launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.configurations) {
      for (let key = 0; key < launchConfig.configurations.length; key++) {
        if (launchConfig.configurations[key].name === launcherName) {
          launchConfig.configurations[key] = launcher;
        }
      }
      persistLaunchInfo(launchConfig);
    }
  }

  static saveNewConfiguration(launcher) {
    let launchConfig = getLaunchConfig();
    if (launchConfig) {
      if (launchConfig.configurations === undefined) {
        launchConfig.configurations = [];
      }
      launchConfig.configurations.push(launcher);
      persistLaunchInfo(launchConfig);
    }
  }

  static isTableSyncEnabled(debugSession) {
    let isTableSyncEnabled: boolean = false;
    const launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.configurations && debugSession && debugSession.name) {
      launchConfig.configurations.forEach(launchElement => {
        if (launchElement.name === debugSession.name && launchElement.enableTableSync !== undefined) {
          isTableSyncEnabled = launchElement.enableTableSync;
        }
      });
    }
    return isTableSyncEnabled;
  }

  static saveIsTableSyncEnabled(debugSession, isTableSyncEnabled: boolean) {
    let launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.configurations) {
      launchConfig.configurations = launchConfig.configurations.forEach(launchElement => {
        launchElement.enableTableSync = isTableSyncEnabled;
      });
      persistLaunchInfo(launchConfig);
    }
  }

  static lastPrograms() {
    let lastPrograms = [];
    const launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.lastPrograms) {
      lastPrograms = launchConfig.lastPrograms;
    }
    return lastPrograms;
  }

  static lastProgramsAdd(newProgram) {
    let launchConfig = getLaunchConfig();
    if (launchConfig) {
      if (launchConfig.lastPrograms === undefined) {
        launchConfig.lastPrograms = [];
      }
      launchConfig.lastPrograms.push(newProgram);
      persistLaunchInfo(launchConfig);
    }
  }

  static lastProgramExecuted() {
    let lastProgramExecuted;
    const launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.lastProgramExecuted) {
      lastProgramExecuted = launchConfig.lastProgramExecuted;
    }
    return lastProgramExecuted;
  }

  static lastProgramArguments() {
    let lastProgramArguments: Array<string>;
    const launchConfig = getLaunchConfig();
    if (launchConfig && launchConfig.lastProgramArguments) {
      lastProgramArguments = launchConfig.lastProgramArguments;
    }
    return lastProgramArguments;
  }

  static saveLastProgram(lastProgramExecuted, lastProgramArguments) {
    let launchConfig = getLaunchConfig();
    if (launchConfig) {
      if (lastProgramExecuted) {
        launchConfig.lastProgramExecuted = lastProgramExecuted;
      }
      if (lastProgramArguments) {
        launchConfig.lastProgramArguments = lastProgramArguments;
      }
      persistLaunchInfo(launchConfig);
    }
  }

  /**
   * Retorna o path completo do launch.json
   */
  static getLaunchConfigFile() {
    return path.join(Utils.getVSCodePath(), "launch.json");
  }

  // Atualiza a informacao de smartclientBin em configurations
  static saveSmartClientBin(smartClient: string) {
    try {
      let launchConfig = getLaunchConfig();
      if (launchConfig && launchConfig.configurations) {
        launchConfig.configurations = launchConfig.configurations.forEach(launchElement => {
          launchElement.smartclientBin = smartClient;
        });
        persistLaunchInfo(launchConfig);
      }
    } catch (e) {
      console.error(e);
    }
  }

  static getIgnoreSourceNotFoundValue(debugSession): boolean {
    let isIgnoreSourceNotFound: boolean = true;

    try {
      const launchConfig = getLaunchConfig();

      for (let key = 0; key < launchConfig.configurations.length; key++) {
        let launchElement = launchConfig.configurations[key];
        if (
          debugSession !== undefined &&
          launchElement.name === debugSession.name
        ) {
          if (launchElement.ignoreSourcesNotFound !== undefined) {
            isIgnoreSourceNotFound = launchElement.ignoreSourcesNotFound;
            break;
          }
        }
      }
    } catch (e) {
      LaunchConfig.logInvalidLaunchJsonFile(e);
    }

    return isIgnoreSourceNotFound;
  }

  static saveIgnoreSourcesNotFound(debugSession, isIgnoreSourceNotFound) { // XXX
    try {
      let launchConfig = getLaunchConfig();
      if (launchConfig) {
        for (let key = 0; key < launchConfig.configurations.length; key++) {
          let launchElement = launchConfig.configurations[key];
          if (debugSession !== undefined && launchElement.name === debugSession.name) {
            launchElement.ignoreSourcesNotFound = isIgnoreSourceNotFound;
            break;
          }
        }
        persistLaunchInfo(launchConfig);
      }
    } catch (e) {
      this.logInvalidLaunchJsonFile(e);
    }
  }

  /**
   * Cria o arquivo launch.json caso ele nao exista.
   */
  static createLaunchConfig(launchInfo: any) {
    if (launchInfo === undefined) {
      launchInfo = {
        type: "totvs_language_debug",
        request: "launch",
        cwb: "${workspaceRoot}",
        name: "TOTVS Language Debug",
      };
    }

    try {
      const launchConfig = getLaunchConfig();
      if (!launchConfig) {
        let fs = require("fs");
        let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
        if (ext) {
          let sampleLaunch = {
            version: "0.2.0",
            configurations: [],
          };

          let pkg = ext.packageJSON;
          let contributes = pkg["contributes"];
          //const regexp: RegExp = /totvs_language_.*debug/i;
          let debug = (contributes["debuggers"] as any[]).filter(
            (element: any) => {
              //return regexp.exec(element.type) ? false : true;
              //return element.type === "totvs_language_debug";
              return element.type === launchInfo.type;
            }
          );

          if (debug.length === 1) {
            let initCfg = (debug[0]["initialConfigurations"] as any[]).filter(
              (element: any) => {
                return element.request === "launch";
              }
            );

            if (initCfg.length === 1) {
              sampleLaunch = {
                version: "0.2.0",
                configurations: [initCfg[0] as never],
              };
            }
          }

          if (!fs.existsSync(Utils.getVSCodePath())) {
            fs.mkdirSync(Utils.getVSCodePath());
          }

          let launchJson = this.getLaunchConfigFile();

          fs.writeFileSync(
            launchJson,
            JSON.stringify(sampleLaunch, null, "\t"),
            (err) => {
              if (err) {
                console.error(err);
              }
            }
          );
        }
      }
    } catch (e) {
      this.logInvalidLaunchJsonFile(e);
    }
  }

  static logInvalidLaunchJsonFile(e) {
    Utils.logMessage(
      `There was a problem reading the launch.json file. (The file may still be functional, but check it to avoid unwanted behavior): ${e}`,
      MESSAGETYPE.Warning,
      true
    );
  }

  static getLaunchConfigString() {
    let configString = "";
    const launchConfig = getLaunchConfig();
    if (launchConfig) {
      configString = JSON.stringify(launchConfig);
    }
    return configString;
  }

}

/**
 * Retorna todo o conteudo do launch.json
 */
function getLaunchConfig() {
  let config: any;
  let exist = fs.existsSync(LaunchConfig.getLaunchConfigFile());
  if (exist) {
    let json = fs.readFileSync(LaunchConfig.getLaunchConfigFile()).toString();
    if (json) {
      try {
        config = JSON.parse(stripJsonComments(json));
      } catch (e) {
        console.error(e);
        throw e;
        //return {};
      }
    }
  }
  return config;
}

/**
 * Grava no arquivo launch.json uma nova configuracao de launchs
 * @param JSONServerInfo
 */
function persistLaunchInfo(JSONLaunchInfo) {
  let fs = require("fs");
  fs.writeFileSync(
    LaunchConfig.getLaunchConfigFile(),
    JSON.stringify(JSONLaunchInfo, null, "\t"),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

export function groupBy<T, K>(list: T[], getKey: (item: T) => K) {
  const map = new Map<K, T[]>();

  list.forEach((item) => {
    const key = getKey(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
}

//TODO: pegar a lista de arquivos a ignorar da configuração
const ignoreListExpressions: Array<RegExp> = [];
ignoreListExpressions.push(/(.*)?(\.vscode)$/gi); //.vscode
//ignoreListExpressions.push(/(\.)$/ig); // sem extensão (não é possivel determinar se é fonte ou recurso)
ignoreListExpressions.push(/(.+)(\.erx_)$/gi); // arquivos de definição e trabalho
ignoreListExpressions.push(/(.+)(\.ppx_)$/gi); // arquivos de definição e trabalho
ignoreListExpressions.push(/(.+)(\.err)$/gi); // arquivos de definição e trabalho

//lista de arquivos/pastas normalmente ignorados
ignoreListExpressions.push(/(.*)?(#.*#)$/gi);
ignoreListExpressions.push(/(.*)?(\.#*)$/gi);
ignoreListExpressions.push(/(.*)?(%.*%)$/gi);
ignoreListExpressions.push(/(.*)?(\._.*)$/gi);
ignoreListExpressions.push(/(.*)?(CVS)$/gi);
ignoreListExpressions.push(/(.*)?.*(CVS)$/gi);
ignoreListExpressions.push(/(.*)?(\.cvsignore)$/gi);
ignoreListExpressions.push(/(.*)?(SCCS)$/gi);
ignoreListExpressions.push(/(.*)?.*\/SCCS\/.*$/gi);
ignoreListExpressions.push(/(.*)?(vssver\.scc)$/gi);
ignoreListExpressions.push(/(.*)?(\.svn)$/gi);
ignoreListExpressions.push(/(.*)?(\.DS_Store)$/gi);
ignoreListExpressions.push(/(.*)?(\.git)$/gi);
ignoreListExpressions.push(/(.*)?(\.gitattributes)$/gi);
ignoreListExpressions.push(/(.*)?(\.gitignore)$/gi);
ignoreListExpressions.push(/(.*)?(\.gitmodules)$/gi);
ignoreListExpressions.push(/(.*)?(\.hg)$/gi);
ignoreListExpressions.push(/(.*)?(\.hgignore)$/gi);
ignoreListExpressions.push(/(.*)?(\.hgsub)$/gi);
ignoreListExpressions.push(/(.*)?(\.hgsubstate)$/gi);
ignoreListExpressions.push(/(.*)?(\.hgtags)$/gi);
ignoreListExpressions.push(/(.*)?(\.bzr)$/gi);
ignoreListExpressions.push(/(.*)?(\.bzrignore)$/gi);

function processIgnoreList(
  ignoreList: Array<RegExp>,
  testName: string
): boolean {
  let result: boolean = false;

  for (let index = 0; index < ignoreList.length; index++) {
    const regexp = ignoreList[index];
    if (regexp.test(testName)) {
      result = true;
      break;
    }
  }

  return result;
}

async function doUpdateInformations(element: any): Promise</*IServerInformations*/any> {
  const serverInformations: /*IServerInformations*/any = {
    permissions: [],
    errorMessage: "",
    environmentDetectedType: element.type,
    serverDetectedType: element.type
  };

  if (Utils.isServerP20OrGreater(element)) {
    await sendGetServerInformationsInfo(element).then(
      (informations: IGetServerInformationsResult) => {
        if (informations.message == "OK") {
          const info = informations.serverInformations;

          serverInformations.permissions = buildPermissionsList(
            info.permissions
          );
          serverInformations.environmentDetectedType = numberToServerType(
            info.server.environmentDetectedType
          );
          serverInformations.serverDetectedType = numberToServerType(
            info.server.serverDetectedType
          );
        } else {
          serverInformations.errorMessage = informations.message;
        }
      },
      (error) => {
        serverInformations.errorMessage = error.message;
        console.log(error);
      }
    );
  } else {
    await sendGetServerPermissionsInfo(element).then(
      (permissions: IGetServerPermissionsResult) => {
        if (permissions.message == "OK") {
          serverInformations.permissions = buildPermissionsList(permissions.serverPermissions);
        } else {
          serverInformations.errorMessage = permissions.message;
        }
      },
      (error) => {
        serverInformations.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  return serverInformations;
}

function buildPermissionsList(serverPermissions) {
  const result = [];
  const group = (target: string): string[] => {
    const text: string[] = serverPermissions.text;
    const list: string[] = text
      .filter((value: string) => value.startsWith(target))
      .map((value: string) => value.substring(2));

    return list.sort((a: string, b: string) => a.localeCompare(b));
  };

  result["S"] = group("S");
  result["M"] = group("M");

  return result;
}

function numberToServerType(type: number): /*ServerType*/string {
  switch (type) {
    case 1:
      return "totvs_server_protheus";

    case 2:
      return "totvs_server_logix";

    default:
      break;
  }

  return "totvs_server_totvstec";
}