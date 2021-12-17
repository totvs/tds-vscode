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

  protected constructor(workbenchPO: WorkbenchPageObject, channelName: string) {
    this._channelName = channelName;
    this.workbenchPO = workbenchPO;
  }

  async openPanel(): Promise<OutputView> {
    const bottomPanel = new BottomBarPanel();
    await bottomPanel.toggle(true);
    const view: OutputView = await bottomPanel.openOutputView();

    this._view = view;

    return view;
  }

  private async selectChannel(): Promise<void> {
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
    this._view.clearText();
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

  protected async startSequenceTest(target: string | RegExp): Promise<boolean> {
    let result: boolean = false;
    this._text = (await this.getText()).replace("\r", "").split(/\n/);

    while (this._text.length > 0 && !result) {
      result = await this.lineSequenceTest(target);
    }

    return result;
  }

  protected async lineSequenceTest(target: string | RegExp): Promise<boolean> {
    const line: string = this._text.shift();
    const result: boolean = await this.lineTest(line, target);

    return result;
  }

  protected async nextSequenceTest(target: string | RegExp): Promise<boolean> {
    const line: string = this._text.length > 0 ? this._text[0] : "";
    const result: boolean = await this.lineTest(line, target);

    return result;
  }

  protected async endSequenceTest(target: string | RegExp): Promise<boolean> {
    let result: boolean = false;

    while (this._text.length > 0 && !result) {
      result = await this.lineSequenceTest(target);
    }

    return result;
  }

  protected async sequenceDefaultTest(
    target: (string | RegExp)[]
  ): Promise<void> {
    const beginSequence: string | RegExp = target[0];
    const endSequence: string | RegExp = target[target.length - 1];
    const sequence: (string | RegExp)[] = target.slice(1, -1);

    expect(true, `begin: ${beginSequence}`).is.equal(
      await this.startSequenceTest(beginSequence)
    );

    while (sequence.length && !(await this.nextSequenceTest(endSequence))) {
      expect(true, `line: ${sequence[0]}`).is.equal(
        await this.lineSequenceTest(sequence.shift())
      );
    }

    expect(true, `end: ${endSequence}`).is.equal(
      await this.endSequenceTest(endSequence)
    );
  }
}
