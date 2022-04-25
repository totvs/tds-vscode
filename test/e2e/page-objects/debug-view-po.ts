import fse = require("fs-extra");
import {
  DebugView,
  InputBox,
  Key,
  TreeItem,
  ViewItem,
  ViewSection,
} from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";
import { TextEditorPageObject } from "./text-editor-po";
import path = require("path");
import { PROJECT_FOLDER } from "../scenario";
import { delay, DELAY_LONG, DEFAULT_DELAY } from "../helper";
import { expect } from "chai";
import { Children } from "react";

const TYPE_TITLE = {
  totvs_language_debug: "TOTVS Language Debug",
  totvs_tdsreplay_debug: "TDS Replay",
  totvs_language_web_debug: "TOTVS Language Debug with arguments",
};

export class DebugPageObject extends ViewPageObject<DebugView> {
  //private _debugBar: DebugToolbar;

  constructor() {
    super("Run");
  }

  async selectLaunchConfiguration(name: string): Promise<void> {
    await delay();
    return await this.view.selectLaunchConfiguration(name);
  }

  async getLaunchConfiguration(): Promise<string> {
    await delay();
    return await this.view.getLaunchConfiguration();
  }

  async addLauncher(
    type: string,
    name: string,
    smartClientBin: string
  ): Promise<boolean> {
    if (await this.isAlreadyExistsLauncher(name)) {
      return false;
    }

    await this.view.selectLaunchConfiguration("Add Configuration...");
    const editor = new TextEditorPageObject("launch.json");

    await editor.contentAssist.open();
    await editor.contentAssist.fireItemAssist(TYPE_TITLE[type]);

    await editor.contentAssist.close();
    await editor.sendKeys(name, Key.TAB);
    await editor.sendKeys(smartClientBin, Key.TAB);

    await editor.save();
    await editor.close();
  }

  async registerLauncher(
    type: string,
    name: string,
    smartClientBin: string,
    program?: string,
    ...args: string[]
  ): Promise<boolean> {
    const launchJsonFile: string = path.join(
      PROJECT_FOLDER,
      ".vscode",
      "launch.json"
    );

    if (!fse.existsSync(launchJsonFile)) {
      await this.addLauncher(type, name, smartClientBin);
      await delay();
    }

    const laucher: any = fse.readJSONSync(launchJsonFile);

    laucher.configurations = [
      {
        type: type,
        request: "launch",
        name: name,
        program: program
          ? `${program} ${args ? args.join(", ") : ""}`
          : "${command:AskForProgramName}",
        smartclientBin: smartClientBin,
        cwb: "${workspaceFolder}",
        isMultiSession: true,
        enableTableSync: true,
        //waitForAttach: 8000, //os testes aguardam 10 segundos, senão dá erro
      },
    ];

    fse.writeJSONSync(launchJsonFile, laucher);
    await delay();

    return true;
  }

  async clearAllBreakpoints(): Promise<void> {
    const content = this.view.getContent();
    const section = await content.getSection("Breakpoints");
  }

  async isAlreadyExistsLauncher(name: string): Promise<boolean> {
    const configs: string[] = await this.view.getLaunchConfigurations();

    return configs.indexOf(name) > -1;
  }

  async getEditorSource(source: string): Promise<TextEditorPageObject> {
    const editor: TextEditorPageObject = new TextEditorPageObject(source);
    await delay();

    return editor;
  }

  async fillProgramName(program: string, ...args: string[]): Promise<void> {
    const pickBox = new InputBox();
    await delay();

    let title = await pickBox.getTitle();
    expect(title).is.equal("Please enter the name of an AdvPL/4GL function");

    await pickBox.setText(`${program} ${args ? args.join(",") : ""}`);
    await delay();

    await pickBox.confirm();
    await delay();
  }

  private async getSection(name: string): Promise<ViewSection> {
    const content = this.view.getContent();

    return await content.getSection(name);
  }

  async getWatch(): Promise<ViewSection> {
    return await this.getSection("Watch");
  }

  async getCallStack(): Promise<ViewSection> {
    return await this.getSection("Call Stack");
  }

  async getBreakpoints(): Promise<ViewSection> {
    return await this.getSection("Breakpoints");
  }

  private async getVariables(
    targetScope:
      | "Local"
      | "Private"
      | "Static"
      | "Public"
      | "Modular"
      | "Global",
    targetName: string[],
    getChildrenElements: boolean = false
  ): Promise<VariablePO[]> {
    const section: ViewSection = await this.getSection("Variables");
    const result: VariablePO[] = [];
    let viewItem: TreeItem;

    for await (const scope of await section.getVisibleItems()) {
      const label: string = await scope.getText();

      if (targetName.length == 0 || label == targetScope) {
        viewItem = scope as TreeItem;
        break;
      }
    }

    if (viewItem) {
      await delay();
      const children = await viewItem.getChildren();
      await delay();

      for await (const variable of children) {
        const text: string = await variable.getText();
        const parts: string[] = text.split(":");

        if (targetName.length == 0 || targetName.includes(parts[0])) {
          if (getChildrenElements) {
            if (await variable.isExpandable()) {
              await variable.expand();
              await delay();
              for await (const element of await variable.getChildren()) {
                result.push(await VariablePO.createVariablePO(element));
              }
            }
          } else {
            result.push(await VariablePO.createVariablePO(variable));
          }
        }
      }

      await delay(DELAY_LONG);
    }

    return result;
  }

  //ATENÇÃO: A visão "variables", não esta sendo processada corretamente
  //         pela ferramenta de testes, por isso é necessário indicar quais
  //         se deseja. Em caso de variaveis de mesmo nome em escopos diferentes
  //         esta será apresentada mais de uma vez.
  async getLocalVariables(targetName: string[]): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Local", targetName);

    return result;
  }

  async getLocalVariableValue(targetName: string): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Local", [targetName], true);

    return result;
  }

  async getPrivateVariables(targetName: string[]): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Private", targetName);

    return result;
  }

  async getPrivateVariableValue(targetName: string): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Private", [targetName], true);

    return result;
  }

  async getPublicVariables(targetName: string[]): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Public", targetName);

    return result;
  }

  async getPublicVariableValue(targetName: string): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Public", [targetName], true);

    return result;
  }


  async getGlobalVariables(targetName: string[]): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Global", targetName);

    return result;
  }

  async getGlobalVariableValue(targetName: string): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Global", [targetName], true);

    return result;
  }

  async getModularVariables(targetName: string[]): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Modular", targetName);

    return result;
  }

  async getModularVariableValue(targetName: string): Promise<VariablePO[]> {
    const result: VariablePO[] = await this.getVariables("Modular", [targetName], true);

    return result;
  }

  async start(): Promise<void> {
    await this.view.start();
    //await delay();
    //return Promise.resolve(true);
  }

  // async waitForBreakPoint(): Promise<void> {
  //   await this._debugBar.waitForBreakPoint();
  //   await delay();
  // }

  // async stepOver(): Promise<void> {
  //   await this._debugBar.stepOver();
  //   await delay();
  // }

  // async continue(): Promise<void> {
  //   await this._debugBar.continue();
  //   await delay();
  // }
}

export class VariablePO {
  static async createVariablePO(item: TreeItem): Promise<VariablePO> {
    const text: string[] = (await item.getText()).split(":");
    const type: string = await item.getTooltip();

    if (text.length < 2) {
      text.push("\n<empty>");
    }

    return new VariablePO(text[0], text[1].substring(1), type); //.getText() inclui um \n inexistente no valor original
  }

  constructor(
    readonly name: string,
    readonly value: string,
    readonly type: string
  ) { }
}