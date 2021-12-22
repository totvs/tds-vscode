import { expect } from "chai";
import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ViewSection,
  ViewItem,
  TitleActionButton,
  ViewTitlePart,
  ActivityBar,
  ViewControl,
  BottomBarPanel,
  OutputView,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { WorkbenchPageObject } from "./workbench-po";

export class OutputPageObject {
  protected workbenchPO: WorkbenchPageObject;
  private _channelName: string;
  private _view: OutputView;
  private _text: string[];
  private _bottomPanel: BottomBarPanel;

  protected constructor(workbenchPO: WorkbenchPageObject, channelName: string) {
    this._channelName = channelName;
    this.workbenchPO = workbenchPO;
  }

  async openPanel(): Promise<OutputView> {
    this._bottomPanel = new BottomBarPanel();
    await this._bottomPanel.toggle(true);
    await delay();

    this._view = await this._bottomPanel.openOutputView();

    return this._view;
  }

  private async selectChannel(): Promise<void> {
    await this._bottomPanel.toggle(true);

    let current: string = await this._view.getCurrentChannel();

    if (current !== this._channelName) {
      await this._view.selectChannel(this._channelName);
      await delay();
      current = await this._view.getCurrentChannel();
    }

    expect(this._channelName).equals(current);
  }

  async clearConsole(): Promise<void> {
    await this.selectChannel();
    await this._view.clearText();
    await delay();
  }

  async getText(): Promise<string> {
    await this.selectChannel();

    return await this._view.getText();
  }

  private async lineTest(
    line: string,
    targetText: string | RegExp
  ): Promise<boolean> {
    const target: RegExp = new RegExp(targetText, "i");
    await delay(250);

    if (target.exec(line)) {
      return true;
    }

    return false;
  }

  protected async startSequenceTest(target: string | RegExp): Promise<void> {
    let result: boolean = false;
    const text: string[] = (await this.getText()).replace("\r", "").split(/\n/);
    this._text = text;

    while (this._text.length > 0 && !result) {
      const line: string = this._text.shift();
      result = await this.lineTest(line, target);
    }

    expect(
      result,
      `start: ${target} = ${text[0]} (more ${text.length - 1} lines)`
    ).is.true;
  }

  protected async lineSequenceTest(target: string | RegExp): Promise<void> {
    const line: string = this._text.shift();
    const result: boolean = await this.lineTest(line, target);

    expect(result, `line: ${target} = ${line}`).is.true;
  }

  protected async nextSequenceTest(target: string | RegExp): Promise<boolean> {
    const line: string = this._text.length > 0 ? this._text[0] : "";
    const result: boolean = await this.lineTest(line, target);

    return result;
  }

  protected async endSequenceTest(target: string | RegExp): Promise<void> {
    let result: boolean = false;
    const lastLine: string = this._text[this._text.length - 1];

    while (this._text.length > 0 && !result) {
      const line: string = this._text.shift();
      result = await this.lineTest(line, target);
    }

    expect(result, `end: ${target} = ${lastLine}`).is.true;
  }

  protected async sequenceDefaultTest(
    target: (string | RegExp)[]
  ): Promise<void> {
    const beginSequence: string | RegExp = target[0];
    const endSequence: string | RegExp = target[target.length - 1];
    const sequence: (string | RegExp)[] = target.slice(1, -1);

    await this.startSequenceTest(beginSequence);

    while (sequence.length && !(await this.nextSequenceTest(endSequence))) {
      await this.lineSequenceTest(sequence.shift());
    }

    await this.endSequenceTest(endSequence);
  }
}
