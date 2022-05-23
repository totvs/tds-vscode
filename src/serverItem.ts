import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { changeSettings } from "./server/languageServerSettings";
import serverProvider from "./serverItemProvider";

const RESOURCE_FOLDER = path.join(__filename, "..", "..", "resources");
const RESOURCE_DARK = path.join(RESOURCE_FOLDER, "dark");
const RESOURCE_LIGHT = path.join(RESOURCE_FOLDER, "light");

export type ServerType =
  | "totvs_server_protheus"
  | "totvs_server_logix"
  | "totvs_server_totvstec";

export interface IServerInformations {
  errorMessage: string;
  serverDetectedType: string;
  environmentDetectedType: ServerType;
  permissions: string[];
}

export class ServerItem extends vscode.TreeItem {
  public environment: string = "";
  public username: string = "";
  public smartclientBin: string = "";
  public informations: IServerInformations;

  constructor(
    public name: string,
    public readonly type: ServerType,
    public readonly address: string,
    public readonly port: number,
    public secure: number,
    public collapsibleState: vscode.TreeItemCollapsibleState,
    public id: string,
    public buildVersion: string,
    public token: string,
    public environments?: Array<EnvSection>,
    public includes?: string[],
    public readonly command?: vscode.Command
  ) {
    super(name, collapsibleState);
  }

  public get isConnected(): boolean {
    return serverProvider.isConnected(this);
  }

  public get isServerP20OrGreater(): boolean {
    //return Utils.isServerP20OrGreater(this); //<< não usar. causa "referencia circular". acandido

    if (this.buildVersion) {
      return this.buildVersion.localeCompare("7.00.191205P") > 0;
    }

    return false;
  }

  description = `${this.address}:${this.port}`;
  tooltip = `${serverTypeString(this.type)} ${this.buildVersion}`;
  iconPath = {
    light: path.join(RESOURCE_LIGHT, serverTypeImage(this)),
    dark: path.join(RESOURCE_DARK, serverTypeImage(this)),
  };

  contextValue = this.isConnected ? "serverItem" : "serverItemNotConnected";
}

export class EnvSection extends vscode.TreeItem {
  constructor(
    public label: string,
    public readonly serverItemParent: ServerItem,
    public collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public environments?: string[]
  ) {
    super(label, collapsibleState);
  }

  public get isCurrent(): boolean {
    return serverProvider.isCurrentEnvironment(this);
  }

  iconPath = {
    light: path.join(RESOURCE_LIGHT, environmentTypeImage(this)),
    dark: path.join(RESOURCE_DARK, environmentTypeImage(this)),
  };

  tooltip = environmentTypeString(this);

  contextValue = this.isCurrent ? "envSection" : "envSectionNotCurrent";
}

function serverTypeString(type: ServerType): string {
  const label: string = type.substring(type.lastIndexOf("_") + 1);

  return label.charAt(0).toUpperCase() + label.substring(1);
}

function serverTypeImage(server: ServerItem): string {
  const type: ServerType = server.type;
  const connected: boolean = server.isConnected;

  const sufix: string = type.substring(type.lastIndexOf("_") + 1);

  return connected ? `server_${sufix}_connected.svg` : `server_${sufix}.svg`;
}

function environmentTypeString(environment: EnvSection): string {
  return `${environment.label} @ ${environment.serverItemParent.label} -> ${environment.serverItemParent.informations?.environmentDetectedType}`;
}

function environmentTypeImage(environment: EnvSection): string {
  let sufix: string = "";
  const server: ServerItem = environment.serverItemParent;

  //esta chegando somente os dados!!! acandido
  //if (server.isServerP20OrGreater) {
  if (server.buildVersion) {
    if ((server.buildVersion.localeCompare("7.00.191205P") > 0) && (environment.isCurrent)) {
      const type: ServerType = server.type;
      if (
        type == "totvs_server_totvstec" &&
        server.informations?.environmentDetectedType
      ) {
        const type: string = server.informations.environmentDetectedType;
        sufix = "_" + type.substring(type.lastIndexOf("_") + 1);
      }
    }

    const current: boolean = environment.isCurrent;
    if (current) {
      sufix += "_connected";
    }
  }

  return `environment${sufix}.svg`;
}
