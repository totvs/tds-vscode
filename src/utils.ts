import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as stripJsonComments from 'strip-json-comments';
import * as cheerio from 'cheerio';
import * as ini from 'ini';
import * as nls from 'vscode-nls';
import { languageClient } from './extension';
import { EnvSection, ServerItem } from './serverItemProvider';
import { Authorization, CompileKey } from './compileKey/compileKey';
import { changeSettings } from './server/languageServerSettings';
import { IRpoToken } from './rpoToken';
//import { sendRpoToken } from './protocolMessages';

const homedir = require('os').homedir();
const localize = nls.loadMessageBundle();

export enum MESSAGETYPE {
  /**
   * Type for informative and resumed messages
   * i.e.: Inform only the begining and the end of a compilation process.
   */
  Info = 'Info',

  /**
   * Type for error messages
   */
  Error = 'Error',

  /**
   * Type for warning messages
   */
  Warning = 'Warning',

  /**
   * Type for detailed messages
   * i.e.: During a compilation process, inform the status of each file and it's result.
   */
  Log = 'Log',
}

export default class Utils {
  /**
   * Subscrição para evento de seleção de servidor/ambiente.
   */
  static get onDidSelectedServer(): vscode.Event<ServerItem> {
    return Utils._onDidSelectedServer.event;
  }

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
   * Emite a notificação de seleção de servidor/ambiente
   */
  private static _onDidSelectedServer = new vscode.EventEmitter<ServerItem>();

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
  static generateRandomID() {
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
    const config = vscode.workspace.getConfiguration('totvsLanguageServer');
    config.update('workspaceServerConfig', !this.isWorkspaceServerConfig());
  }

  /**
   * Pegar o arquivo servers.json da .vscode (workspace)?
   */
  static isWorkspaceServerConfig(): boolean {
    let config = vscode.workspace.getConfiguration('totvsLanguageServer');
    return config.get('workspaceServerConfig');
  }

  /**
   * Retorna o path completo do servers.json
   */
  static getServerConfigFile() {
    return path.join(this.getServerConfigPath(), 'servers.json');
  }

  /**
   * Retorna o path de onde deve ficar o servers.json
   */
  static getServerConfigPath() {
    return this.isWorkspaceServerConfig()
      ? this.getVSCodePath()
      : path.join(homedir, '/.totvsls');
  }

  /**
   * Retorna o path completo do launch.json
   */
  static getLaunchConfigFile() {
    return path.join(this.getVSCodePath(), 'launch.json');
  }

  /**
   * Retorna o path da pasta .vscode dentro do workspace
   */
  static getVSCodePath() {
    let rootPath: string = vscode.workspace.rootPath || process.cwd();

    return path.join(rootPath, '.vscode');
  }

  /**
   * Retorna todo o conteudo do servers.json
   */
  static getServersConfig() {
    let config: any = {};
    let serversJson = Utils.getServerConfigFile();
    if (!fs.existsSync(serversJson)) {
      Utils.initializeServerConfigFile(serversJson);
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

    if (!config.savedRpoTokens) {
      config.savedRpoTokens = [];
    }

    //compatibilização com arquivos gravados com versão da extensão
    //anterior a 26/06/20
    if (
      config.hasOwnProperty('lastConnectedServer') &&
      typeof config.lastConnectedServer !== 'string'
    ) {
      if (config.lastConnectedServer.hasOwnProperty('id')) {
        config.lastConnectedServer = config.lastConnectedServer.id;
      }
    }

    return config;
  }

  /**
   * Retorna todo o conteudo do launch.json
   */
  static getLaunchConfig() {
    let config: any;
    let exist = fs.existsSync(Utils.getLaunchConfigFile());
    if (exist) {
      let json = fs.readFileSync(Utils.getLaunchConfigFile()).toString();
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

  static saveLaunchConfig(config: JSON) {
    let fs = require('fs');
    fs.writeFileSync(
      Utils.getLaunchConfigFile(),
      JSON.stringify(config, null, '\t'),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  static updateSavedToken(id: string, environment: string, token: string) {
    const servers = Utils.getServersConfig();

    const data = { id: id, environment: environment };
    servers.savedTokens[id + ':' + environment] = data;

    // persistir a configuracao
    Utils.persistServersInfo(servers);
  }

  static getSavedTokens(id: string, environment: string): undefined | string {
    const servers = Utils.getServersConfig();
    let token = undefined;

    if (servers.savedTokens) {
      token = servers.savedTokens
        .filter((element) => {
          return element[0] === id + ':' + environment;
        })
        .map((element) => {
          return element[1]['token'];
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
    name: string,
    environment: string,
    username: string
  ) {
    const servers = Utils.getServersConfig();

    servers.configurations.forEach((element) => {
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

    Utils.persistServersInfo(servers);
    Utils._onDidSelectedServer.fire(servers.connectedServer);
  }

  /**
   * Salva o servidor logado por ultimo.
   * @param id Id do servidor logado
   * @param token Token que o LS gerou em cima das informacoes de login
   * @param environment Ambiente utilizado no login
   */
  static saveConnectionToken(id: string, token: string, environment: string) {
    const servers = Utils.getServersConfig();

    if (!servers.savedTokens) {
      let emptySavedTokens: Array<[string, object]> = [];
      servers.savedTokens = emptySavedTokens;
    } else {
      let found: boolean = false;
      let key = id + ':' + environment;
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

      Utils.persistServersInfo(servers);
    }
  }

  /**
   * Remove o token salvo do servidor/environment.
   * @param id Id do servidor logado
   * @param environment Ambiente utilizado no login
   */
  static removeSavedConnectionToken(id: string, environment: string) {
    const servers = Utils.getServersConfig();
    if (servers.savedTokens) {
      let key = id + ':' + environment;
      servers.savedTokens.forEach((element) => {
        if (element[0] === key) {
          const index = servers.savedTokens.indexOf(element, 0);
          servers.savedTokens.splice(index, 1);
          Utils.persistServersInfo(servers);
          return;
        }
      });
    }
  }

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteSelectServer() {
    const servers = Utils.getServersConfig();
    if (servers.connectedServer.id) {
      let server = {};
      servers.connectedServer = server;
      const configADVPL = vscode.workspace.getConfiguration(
        'totvsLanguageServer'
      ); //transformar em configuracao de workspace
      let isReconnectLastServer = configADVPL.get('reconnectLastServer');
      if (!isReconnectLastServer) {
        servers.lastConnectedServer = '';
      }
      Utils.persistServersInfo(servers);
    }
  }

  static clearConnectedServerConfig() {
    const allConfigs = Utils.getServersConfig();

    allConfigs.connectedServer = {};
    allConfigs.lastConnectedServer = '';
    Utils.persistServersInfo(allConfigs);
    Utils._onDidSelectedServer.fire(undefined);
  }

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteServer(id: string) {
    const confirmationMessage = 'Tem certeza que deseja excluir este servidor?';
    const optionYes = 'Sim';
    const optionNo = 'Não';
    vscode.window
      .showWarningMessage(confirmationMessage, optionYes, optionNo)
      .then((clicked) => {
        if (clicked === optionYes) {
          const allConfigs = Utils.getServersConfig();

          if (allConfigs.configurations) {
            const configs = allConfigs.configurations;

            configs.forEach((element) => {
              if (element.id === id) {
                const index = configs.indexOf(element, 0);
                configs.splice(index, 1);
                Utils.persistServersInfo(allConfigs);
                return;
              }
            });
          }
        }
      });
  }

  /**
   * Grava no arquivo servers.json uma nova configuracao de servers
   * @param JSONServerInfo
   */
  static persistServersInfo(JSONServerInfo) {
    let fs = require('fs');
    fs.writeFileSync(
      Utils.getServerConfigFile(),
      JSON.stringify(JSONServerInfo, null, '\t'),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  /**
   * Grava no arquivo launch.json uma nova configuracao de launchs
   * @param JSONServerInfo
   */
  static persistLaunchsInfo(JSONLaunchInfo) {
    let fs = require('fs');
    fs.writeFileSync(
      Utils.getLaunchConfigFile(),
      JSON.stringify(JSONLaunchInfo, null, '\t'),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
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
    Utils.createServerConfig();
    let serverConfig = Utils.getServersConfig();

    if (!serverConfig || !serverConfig.configurations) {
      let serversJson = Utils.getServerConfigFile();
      Utils.initializeServerConfigFile(serversJson);
      serverConfig = Utils.getServersConfig();
    }

    if (serverConfig.configurations) {
      const servers = serverConfig.configurations;

      if (
        servers.find((element) => {
          return element.name === serverName;
        })
      ) {
        vscode.window.showErrorMessage(
          localize(
            'tds.webview.serversView.serverNameDuplicated',
            'Server name already exists'
          )
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

        Utils.persistServersInfo(serverConfig);
        return serverId;
      }
    }
    return undefined;
  }

  /**
   * Recupera o ultimo servidor logado
   */
  static getCurrentServer() {
    const servers = Utils.getServersConfig();

    if (servers.connectedServer.id) {
      // busca sempre pelo ID pois pode ter ocorrido alguma alteração nas configurações do servidor conectado
      return Utils.getServerById(servers.connectedServer.id);
    } else {
      return '';
    }
  }

  static getPermissionsInfos(): CompileKey {
    const servers = Utils.getServersConfig();

    return servers ? servers.permissions : undefined;
  }

  static savePermissionsInfos(infos: CompileKey) {
    const config = Utils.getServersConfig();

    config.permissions = infos;

    Utils.persistServersInfo(config);
    Utils._onDidSelectedKey.fire(infos);
  }

  static deletePermissionsInfos() {
    const config = Utils.getServersConfig();

    config.permissions = undefined;

    Utils.persistServersInfo(config);
    Utils._onDidSelectedKey.fire(undefined);
  }

  static removeExpiredAuthorization() {
    vscode.window.showWarningMessage(
      localize(
        'tds.webview.utils.removeExpiredAuthorization',
        'Expired authorization token deleted'
      )
    );
    Utils.deletePermissionsInfos(); // remove expired authorization key
  }

  /**
   * Recupera a lista de includes do arquivod servers.json
   */
  static getIncludes(
    absolutePath: boolean = false,
    server: any = undefined
  ): Array<string> {
    let includes: Array<string>;
    if (
      server !== undefined &&
      server.includes !== undefined &&
      server.includes.length > 0
    ) {
      includes = server.includes as Array<string>;
    } else {
      const servers = Utils.getServersConfig();
      includes = servers.includes as Array<string>;
    }

    if (includes.toString()) {
      if (absolutePath) {
        const ws: string = vscode.workspace.rootPath || '';
        includes.forEach((value, index, elements) => {
          if (value.startsWith('.')) {
            value = path.resolve(ws, value);
          } else {
            value = path.resolve(value.replace('${workspaceFolder}', ws));
          }

          try {
            const fi: fs.Stats = fs.lstatSync(value);
            if (!fi.isDirectory) {
              const msg: string = localize(
                'tds.webview.utils.reviewList',
                'Review the folder list in order to search for settings (.ch). Not recognized as folder: {0}',
                value
              );
              vscode.window.showWarningMessage(msg);
            } else {
              elements[index] = value;
            }
          } catch (error) {
            const msg: string = localize(
              'tds.webview.utils.reviewList2',
              'Review the folder list in order to search for settings (.ch). Invalid folder: {0}',
              value
            );
            console.log(error);
            vscode.window.showWarningMessage(msg);
            elements[index] = '';
          }
        });
      }
    } else {
      vscode.window.showWarningMessage(
        localize(
          'tds.webview.utils.listFolders',
          'List of folders to search for definitions not configured.'
        )
      );
    }
    return includes;
  }

  /**
   * Cria o arquivo servers.json caso ele nao exista.
   */
  static createServerConfig() {
    if (!fs.existsSync(Utils.getServerConfigPath())) {
      fs.mkdirSync(Utils.getServerConfigPath());
    }
    let serversJson = Utils.getServerConfigFile();
    if (!fs.existsSync(serversJson)) {
      Utils.initializeServerConfigFile(serversJson);
    }
  }

  static initializeServerConfigFile(serversJson) {
    try {
      fs.writeFileSync(serversJson, JSON.stringify(sampleServer(), null, '\t'));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Cria o arquivo launch.json caso ele nao exista.
   */
  static createLaunchConfig() {
    let launchConfig = undefined;
    try {
      launchConfig = Utils.getLaunchConfig();
      if (!launchConfig) {
        let fs = require('fs');
        let ext = vscode.extensions.getExtension('TOTVS.tds-vscode');
        if (ext) {
          let sampleLaunch = {
            version: '0.2.0',
            configurations: [],
          };

          let pkg = ext.packageJSON;
          let contributes = pkg['contributes'];
          let debug = (contributes['debuggers'] as any[]).filter(
            (element: any) => {
              return element.type === 'totvs_language_debug';
            }
          );

          if (debug.length === 1) {
            let initCfg = (debug[0]['initialConfigurations'] as any[]).filter(
              (element: any) => {
                return element.request === 'launch';
              }
            );

            if (initCfg.length === 1) {
              sampleLaunch = {
                version: '0.2.0',
                configurations: [initCfg[0] as never],
              };
            }
          }

          if (!fs.existsSync(Utils.getVSCodePath())) {
            fs.mkdirSync(Utils.getVSCodePath());
          }

          let launchJson = Utils.getLaunchConfigFile();

          fs.writeFileSync(
            launchJson,
            JSON.stringify(sampleLaunch, null, '\t'),
            (err) => {
              if (err) {
                console.error(err);
              }
            }
          );
        }
      }
    } catch (e) {
      Utils.logInvalidLaunchJsonFile(e);
    }
  }

  // Duplicado: Usar o getServerById
  // /**
  //  *Recupera um servidor pelo ID informado.
  //  * @param ID ID do servidor que sera selecionado.
  //  */
  // static getServerForID(ID: string) {
  //   let server;
  //   const allConfigs = Utils.getServersConfig();

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
  static getServerById(
    id: string,
    serversConfig: any = Utils.getServersConfig()
  ) {
    let server;
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

  static addCssToHtml(htmlFilePath: vscode.Uri, cssFilePath: vscode.Uri) {
    const htmlContent = fs.readFileSync(
      htmlFilePath.with({ scheme: 'vscode-resource' }).fsPath
    );
    const cssContent = fs.readFileSync(
      cssFilePath.with({ scheme: 'vscode-resource' }).fsPath
    );

    const $ = cheerio.load(htmlContent.toString());

    let style = $('style').html();

    if (style === undefined || style === null || style === '') {
      $('html').append('<style>' + cssContent + '</style>');
    } else {
      $('style').append(cssContent.toString());
    }

    return $.html();
  }
  /**
   *Salva uma nova configuracao de include.
   */
  static saveIncludePath(path) {
    const servers = Utils.getServersConfig();

    servers.includes = path;

    Utils.persistServersInfo(servers);

    let includes = '';
    path.forEach((includeItem) => {
      includes += includeItem + ';';
    });
    changeSettings({
      changeSettingInfo: { scope: 'advpls', key: 'includes', value: includes },
    });
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
    const serverConfig = Utils.getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.buildVersion = buildVersion;
        element.secure = secure;
        Utils.persistServersInfo(serverConfig);
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
    const serverConfig = Utils.getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.name = newName;
        Utils.persistServersInfo(serverConfig);
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
    const serverConfig = Utils.getServersConfig();
    serverConfig.configurations.forEach((element) => {
      if (element.id === id) {
        element.patchGenerateDir = patchGenerateDir;
        Utils.persistServersInfo(serverConfig);
        result = true;
      }
    });
    return result;
  }

  static readCompileKeyFile(path): Authorization {
    if (fs.existsSync(path)) {
      const parseIni = ini.parse(fs.readFileSync(path, 'utf-8').toLowerCase()); // XXX toLowerCase??
      return parseIni.authorization;
    }
    return undefined;
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
    let config = vscode.workspace.getConfiguration('totvsLanguageServer');
    let notificationLevel = config.get('editor.show.notification');
    switch (messageType) {
      case MESSAGETYPE.Error:
        languageClient !== undefined
          ? languageClient.error(message)
          : console.log(message);
        if (showDialog && notificationLevel !== 'none') {
          vscode.window.showErrorMessage(message);
        }
        break;
      case MESSAGETYPE.Info:
        languageClient !== undefined
          ? languageClient.info(message)
          : console.log(message);
        if (
          (showDialog && notificationLevel === 'all') ||
          notificationLevel === 'errors warnings and infos'
        ) {
          vscode.window.showInformationMessage(message);
        }
        break;
      case MESSAGETYPE.Warning:
        languageClient !== undefined
          ? languageClient.warn(message)
          : console.log(message);
        if (
          showDialog &&
          (notificationLevel === 'all' ||
            notificationLevel === 'errors warnings and infos' ||
            notificationLevel === 'errors and warnings')
        ) {
          vscode.window.showWarningMessage(message);
        }
        break;
      case MESSAGETYPE.Log:
        let time = Utils.timeAsHHMMSS(new Date());
        languageClient !== undefined
          ? languageClient.outputChannel.appendLine(
              '[Log   + ' + time + '] ' + message
            )
          : console.log(message);
        if (showDialog && notificationLevel === 'all') {
          vscode.window.showInformationMessage(message);
        }
        break;
    }
  }

  static logInvalidLaunchJsonFile(e) {
    Utils.logMessage(
      `Ocorreu um problema ao ler o arquivo launch.json
		(O arquivo ainda pode estar funcional, porém verifique-o para evitar comportamentos indesejados): ${e}`,
      MESSAGETYPE.Warning,
      true
    );
  }

  static timeAsHHMMSS(date): string {
    return (
      Utils.leftpad(date.getHours(), 2) +
      ':' +
      Utils.leftpad(date.getMinutes(), 2) +
      ':' +
      Utils.leftpad(date.getSeconds(), 2)
    );
  }

  static leftpad(val, resultLength = 2, leftpadChar = '0'): string {
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
      selectedDir + ' does not exist or it is not a directory.'
    );
    return '';
  }

  static deepCopy(obj: any): any {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) {
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
    '.ch',
    '.prw',
    '.prg',
    '.prx',
    '.ppx',
    '.ppp',
    '.tlpp',
    '.aph',
    '.ahu',
    '.apl',
    '.apw',
  ];

  private static logix: string[] = ['.4gl', '.per'];

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

  /**
   * Deleta o servidor logado por ultimo do servers.json
   */
  static deleteEnvironmentServer(envinronment: EnvSection) {
    const allConfigs = Utils.getServersConfig();

    if (allConfigs.configurations) {
      const configs = allConfigs.configurations;
      const id = envinronment.serverItemParent.id;

      configs.forEach((element) => {
        if (element.id === id) {
          const index = element.environments.indexOf(envinronment.label, 0);

          if (index > -1) {
            element.environments.splice(index, 1);
            Utils.persistServersInfo(allConfigs);
          }

          return;
        }
      });
    }
  }

  /**
   * Salva tokens de rpo.
   * @param server Servidor associado
   * @param rpoTokenFile Arquivo comtoken RPO
   */
  static saveRpoToken(id: string, rpoToken: IRpoToken) {
    const servers: any = Utils.getServersConfig();
    let found: boolean = false;

    servers.savedRpoTokens.forEach((element: any, index: number) => {
      if (element.id === id) {
        found = true;
        servers.savedRpoTokens[index] = {
          id: id,
          file: rpoToken.file,
          warning: rpoToken.warning,
          error: rpoToken.error,
        };
      }
    });

    if (!found) {
      servers.savedRpoTokens.push({
        id: id,
        file: rpoToken.file,
        warning: rpoToken.warning,
        error: rpoToken.error,
      });
    }

    Utils.persistServersInfo(servers);
    Utils._onDidRpoTokenSelected.fire();
  }

  static getRpoTokenFileInfo(id: string | undefined): any {
    const servers = Utils.getServersConfig();
    let result: any = undefined;

    servers.savedRpoTokens.forEach((element: any, index: number) => {
      if (element.id === id) {
        result = element;
      }
    });

    return result;
  }
}

function sampleServer(): any {
  return {
    version: '0.2.1',
    includes: [''],
    permissions: {
      authorizationtoken: '',
    },
    connectedServer: {},
    configurations: [],
    savedTokens: [],
    lastConnectedServer: '',
    savedRpoTokens: [],
  };
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
  return Array.from(map.values());
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
