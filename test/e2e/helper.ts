import path = require("path");
import fs = require("fs-extra");
import { PROJECT_FOLDER } from "./scenario";
import {
  By,
  VSBrowser,
  InputBox,
  WebElement,
  QuickPickItem,
  ContextMenu,
  ViewItem,
  ContextMenuItem,
  ViewControl,
  EditorView,
} from "vscode-extension-tester";
import { expect } from "chai";
import { IUserData } from "./page-objects/interface-po";
import { setTimeout } from "timers/promises";

const DEFAULT_DELAY = 1000;

function clearVscodeFiles(projectFolder: string): void {
  const serversJsonFile: string = path.join(
    projectFolder,
    ".vscode",
    "servers.json"
  );

  if (fs.existsSync(serversJsonFile)) {
    fs.removeSync(serversJsonFile);
  }

  const launchJsonFile: string = path.join(
    projectFolder,
    ".vscode",
    "launch.json"
  );

  if (fs.existsSync(launchJsonFile)) {
    fs.removeSync(launchJsonFile);
  }
}

async function closeAllEditors(): Promise<void> {
  const editorView: EditorView = new EditorView();
  await editorView.closeAllEditors();

  await delay();
}

export interface IOpenProject {
  linter: boolean;
}

const DEFAULT_OPEN_PROJECT: IOpenProject = {
  linter: false,
};

export async function openProject(
  optionsOpenProject: Partial<IOpenProject> = {}
): Promise<void> {
  const options: IOpenProject = {
    ...DEFAULT_OPEN_PROJECT,
    ...optionsOpenProject,
  };

  clearVscodeFiles(PROJECT_FOLDER);

  await VSBrowser.instance.openResources(PROJECT_FOLDER);

  await delay(2000);

  //const settingsPO: SettingsPageObject = new SettingsPageObject();
  //await settingsPO.openView();
  //await settingsPO.setLinter(options.linter);

  await closeAllEditors();
}

export async function readServersJsonFile(): Promise<string> {
  const serversJsonFile: string = path.join(
    PROJECT_FOLDER,
    ".vscode",
    "servers.json"
  );
  let result: string = "< file not found >";

  if (fs.existsSync(serversJsonFile)) {
    const buffer: Buffer = fs.readFileSync(serversJsonFile);
    result = buffer.toString();
  }

  return result;
}

export const delay = async (duration: number = DEFAULT_DELAY) => {
  await setTimeout(duration);
};

export const avoidsBacksliding = async () => {
  await delay(3000);
};

export async function takeQuickPickAction(
  pickBox: InputBox,
  titleAction: string
): Promise<boolean> {
  const actionContainer: WebElement = pickBox.findElement(
    By.className("actions-container")
  );
  const actionList: WebElement[] = await actionContainer.findElements(
    By.className("action-item")
  );
  const actions: WebElement[] = actionList.filter(
    async (action: WebElement) => {
      const link: WebElement = await action.findElement(
        By.css("a.action-label")
      );
      const title: string = (await link.getAttribute("title")).toLowerCase();
      return title === titleAction.toLowerCase();
    }
  );

  if (actions.length == 1) {
    await actions[0].click();
    await delay();
    return true;
  }

  return false;
}

export async function fillEnvironment(environment: string) {
  const pickBox = new InputBox();
  await delay();

  let title = await pickBox.getTitle();
  expect(title).is.equal("Connection (1/1)");

  const quickPicks: QuickPickItem[] = await pickBox.getQuickPicks();
  const find: boolean =
    quickPicks.filter(async (element: QuickPickItem) => {
      return (await element.getText()) == environment;
    }).length > 0;

  if (!find) {
    expect(await takeQuickPickAction(pickBox, "action")).is.true;
    title = await pickBox.getMessage();
    expect(title.startsWith("Enter the name of the environment")).is.true;
    await delay();
  }

  await pickBox.setText(environment);
  await delay();

  await pickBox.confirm();
  await delay();
}

export async function fillUserdata(userData: IUserData) {
  const pickBox = new InputBox();
  await delay();
  pickBox.wait();

  let title = await pickBox.getTitle();
  title = await pickBox.getTitle();
  expect(title).is.equal("Authentication (1/2)");

  await pickBox.setText(userData.username);
  await delay();
  await pickBox.confirm();
  await delay();

  await pickBox.wait();
  title = await pickBox.getTitle();
  expect(title).is.equal("Authentication (2/2)");

  await pickBox.setText(userData.password);
  await delay();
  await pickBox.confirm();
  await delay();
}

export async function fireContextMenuAction(
  element: ViewItem | ViewControl,
  name: string
) {
  const menu: ContextMenu = await element.openContextMenu();
  await menu.select(name);

  // const action: ContextMenuItem = await menu.getItem(name);
  // await action.click();
  await delay();
}

export async function fillProgramName(program: string, ...args: string[]) {
  const pickBox = new InputBox();
  await delay();

  let title = await pickBox.getTitle();
  expect(title).is.equal("Please enter the name of an AdvPL/4GL function");

  await pickBox.setText(`${program} ${args ? args.join(",") : ""}`);
  await delay();

  await pickBox.confirm();
  await delay();
}
