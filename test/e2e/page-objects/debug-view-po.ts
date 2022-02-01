import fse = require("fs-extra");
import {
  By,
  DebugView,
  InputBox,
  Key,
  TreeItem,
  ViewItem,
  ViewSection,
  WelcomeContentButton,
} from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";
import { TextEditorPageObject } from "./text-editor-po";
import path = require("path");
import { PROJECT_FOLDER } from "../scenario";
import { delay, fillDebugConfig } from "../helper";
import { expect } from "chai";

const TYPE_TITLE = {
  totvs_language_debug: "TOTVS Language Debug",
  totvs_tdsreplay_debug: "TDS Replay",
  totvs_language_web_debug: "TOTVS Language Debug with arguments",
};

export class DebugPageObject extends ViewPageObject<DebugView> {
  constructor() {
    super("Run");
  }

  async start(): Promise<void> {
    await this.view.start();
    await delay(2000);
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
      await delay(2000);
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
      },
    ];

    fse.writeJSONSync(launchJsonFile, laucher);
    await delay(2000);

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

  private async getVariables(scope: string): Promise<TreeItem> {
    const section: ViewSection = await this.getSection("Variables");
    let result: TreeItem;

    for await (const variable of await section.getVisibleItems()) {
      const label: string = await variable.getText();

      if (label == scope) {
        result = variable as TreeItem;
        break;
      }
    }

    return result;
  }

  async getLocalVariables(targetName?: string): Promise<VariablePO[]> {
    const result: VariablePO[] = [];
    const viewItem: TreeItem = await this.getVariables("Local");

    if (viewItem) {
      await delay();

      for await (const variable of await viewItem.getChildren()) {
        const name: string = await variable.getLabel();

        if (!targetName || name == targetName) {
          result.push(await VariablePO.createVariablePO(variable));
        }
      }
    }

    return result;
  }
}

export class VariablePO {
  static async createVariablePO(item: TreeItem): Promise<VariablePO> {
    const text: string[] = (await item.getText()).split(":");

    return new VariablePO(text[0], text[1]);
  }
  constructor(readonly name: string, readonly value: string) {}
}