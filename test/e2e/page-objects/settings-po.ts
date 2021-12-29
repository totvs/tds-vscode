import {
  CheckboxSetting,
  ComboSetting,
  SettingsEditor,
  TextSetting,
  Workbench,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { expect } from "chai";

export class SettingsPageObject {
  private _settingsEditor: SettingsEditor;

  constructor() {}

  async openView(
    perspective: "User" | "Workspace" = "Workspace"
  ): Promise<SettingsEditor> {
    this._settingsEditor = await new Workbench().openSettings();
    await delay();

    //await this._settingsEditor.switchToPerspective(perspective);
    //await delay();

    return this._settingsEditor;
  }

  private async findCheckbox(keys: string[]): Promise<CheckboxSetting> {
    const checkboxSetting: CheckboxSetting =
      (await this._settingsEditor.findSetting(
        keys[0],
        ...keys.slice(1)
      )) as CheckboxSetting;

    expect(checkboxSetting, `Settings: ${keys.join(".")}`).not.undefined;

    return checkboxSetting;
  }

  private async findCombo(keys: string[]): Promise<ComboSetting> {
    const comboSetting: ComboSetting = (await this._settingsEditor.findSetting(
      keys[0],
      ...keys.slice(1)
    )) as ComboSetting;

    expect(comboSetting, `Settings: ${keys.join(".")}`).not.undefined;

    return comboSetting;
  }

  private async findText(keys: string[]): Promise<TextSetting> {
    const textSetting: TextSetting = (await this._settingsEditor.findSetting(
      keys.reverse()[0],
      ...keys.reverse().slice(1)
    )) as ComboSetting;

    expect(textSetting, `Settings: ${keys.join(".")}`).not.undefined;

    return textSetting;
  }
  async isLinter(): Promise<boolean> {
    const chexkBox: CheckboxSetting = await this.findCheckbox([
      "totvsLanguageServer",
      "editor",
      "linter",
    ]);

    return await chexkBox.getValue();
  }

  async setLinter(value: boolean): Promise<void> {
    const chexkBox: CheckboxSetting = await this.findCheckbox([
      "totvsLanguageServer",
      "editor",
      "linter",
    ]);

    await chexkBox.setValue(value);
  }
}
