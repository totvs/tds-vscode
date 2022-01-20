import fse = require("fs-extra");
import { DebugView, Key } from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";
import { TextEditorPageObject } from "./text-editor-po";
import path = require("path");
import { PROJECT_FOLDER } from "../scenario";
import { delay } from "../helper";

const TYPE_TITLE = {
  totvs_language_debug: "TOTVS Language Debug",
  totvs_tdsreplay_debug: "TOTVS Language Debug via Web App",
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
    if (await this.isLauncherSaved(name)) {
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

  async isLauncherSaved(name: string): Promise<boolean> {
    const configs: string[] = await this.view.getLaunchConfigurations();

    return configs.indexOf(name) > -1;
  }

  async getEditorSource(source: string): Promise<TextEditorPageObject> {
    const editor: TextEditorPageObject = new TextEditorPageObject(source);

    return editor;
  }

}
