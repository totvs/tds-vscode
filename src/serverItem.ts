import * as vscode from "vscode";
import * as path from "path";
import serverProvider from "./serverItemProvider";
import { TServerType } from "@tds-shared/index";

const RESOURCE_FOLDER = path.join(__filename, "..", "..", "resources");
const RESOURCE_DARK = path.join(RESOURCE_FOLDER, "dark");
const RESOURCE_LIGHT = path.join(RESOURCE_FOLDER, "light");

export interface IServerInformation {
  errorMessage: string;
  serverDetectedType: string;
  environmentDetectedType: TServerType;
  permissions: string[];
}

export class ServerItem extends vscode.TreeItem {
  public environment: string = "";
  public username: string = "";
  public smartclientBin: string = "";
  public informations: IServerInformation;

  constructor(
    public name: string,
    public readonly type: TServerType,
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
  ) {
    super(label);
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

function serverTypeString(type: TServerType): string {
  const label: string = type.substring(type.lastIndexOf("_") + 1);

  return label.charAt(0).toUpperCase() + label.substring(1);
}

function serverTypeImage(server: ServerItem): string {
  const type: TServerType = server.type;
  const connected: boolean = server.isConnected;

  const suffix: string = type.substring(type.lastIndexOf("_") + 1);

  return connected ? `server_${suffix}_connected.svg` : `server_${suffix}.svg`;
}

function environmentTypeString(environment: EnvSection): string {
  return `${environment.label} @ ${environment.serverItemParent.label} -> ${environment.serverItemParent.informations?.environmentDetectedType}`;
}

function environmentTypeImage(environment: EnvSection): string {
  let suffix: string = "";
  const server: ServerItem = environment.serverItemParent;

  //esta chegando somente os dados!!! acandido
  //if (server.isServerP20OrGreater) {
  if (server.buildVersion) {
    if ((server.buildVersion.localeCompare("7.00.191205P") > 0) && (environment.isCurrent)) {
      const type: TServerType = server.type;
      if (
        type == "totvs_server_totvstec" &&
        server.informations?.environmentDetectedType
      ) {
        const type: string = server.informations.environmentDetectedType;
        suffix = "_" + type.substring(type.lastIndexOf("_") + 1);
      }
    }

    const current: boolean = environment.isCurrent;
    if (current) {
      suffix += "_connected";
    }
  }

  return `environment${suffix}.svg`;
}
