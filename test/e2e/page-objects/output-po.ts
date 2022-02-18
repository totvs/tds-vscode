import { expect } from "chai";
import { BottomBarPanel, OutputView } from "vscode-extension-tester";
import { delay } from "../helper";

export class OutputPageObject {
  private _channelName: string;
  private _view?: OutputView;
  private _bottomPanel?: BottomBarPanel;
  private _text: string[];

  protected constructor(channelName: string) {
    this._channelName = channelName;
    this._text = [];
  }

  async openPanel(): Promise<OutputView> {
    this._bottomPanel = new BottomBarPanel();
    await this._bottomPanel.toggle(true);
    await delay();

    this._view = await this._bottomPanel.openOutputView();

    return this._view;
  }

  private async selectChannel(): Promise<void> {
    await this._bottomPanel?.toggle(true);

    let current: string = (await this._view?.getCurrentChannel()) || "";

    if (current !== this._channelName) {
      await this._view?.selectChannel(this._channelName);
      await delay();
      current = (await this._view?.getCurrentChannel()) || "";
    }

    expect(this._channelName).equals(current);
  }

  async clearConsole(): Promise<void> {
    await this.selectChannel();
    await this._view?.clearText();
    await delay();
  }

  async getText(): Promise<string> {
    await this.selectChannel();

    return (await this._view?.getText()) || "";
  }

  private lineTest(line: string, target: RegExp): boolean {
    if (target.exec(line)) {
      return true;
    }

    return false;
  }

  protected startSequenceTest(target: RegExp): string | undefined {
    let result: string | undefined = undefined;

    while (this._text.length > 0 && !result) {
      const line: string = this._text[0];
      if (this.lineTest(line, target)) {
        result = line;
      }

      this._text.shift();
    }

    return result;
  }

  protected async lineSequenceTest(
    target: RegExp
  ): Promise<string | undefined> {
    const line: string = this._text.shift() || "";

    if (await this.lineTest(line, target)) {
      return line;
    }

    return undefined;
  }

  protected isNextSequenceTest(target: RegExp): boolean {
    if (this._text.length) {
      return this.lineTest(this._text[0], target);
    }

    return false;
  }

  protected endSequenceTest(target: RegExp): string | undefined {
    let result: string | undefined = undefined;

    if (this._text.length) {
      while (this._text.length > 0 && !result) {
        const line: string | undefined = this._text.shift();
        if (!line) {
          break;
        } else if (this.lineTest(line, target)) {
          result = line;
        }
      }
    }

    return result;
  }

  protected async extractSequenceTest(
    start: string | RegExp,
    end: string | RegExp
  ): Promise<string[]> {
    const text: (string | undefined)[] = [];

    await this.openPanel();
    await delay();

    const targetStart: RegExp =
      typeof start === "string"
        ? new RegExp(`(${start})`)
        : new RegExp(start, "i");
    const targetEnd: RegExp =
      typeof start === "string" ? new RegExp(`(${end})`) : new RegExp(end, "i");

    this._text = (await this.getText()).replace("\r", "").split(/\n/);

    text.push(this.startSequenceTest(targetStart));

    while (!this.isNextSequenceTest(targetEnd)) {
      const line: string | undefined = this._text.shift();

      text.push(line);
    }

    text.push(this.endSequenceTest(targetEnd));

    console.log("saida");

    return this.clearText(text);
  }

  private clearText(text: (string | undefined)[]): Promise<string[]> {
    let result: string[] = [];

    text.forEach((line: string | undefined) => {
      line = line?.replace(/\t|\r/gi, "").replace(/(..:.. \[.*\] )/, "") || "";

      result.push(line);
    });

    return Promise.resolve(result);
  }

  protected async sequenceDefaultTest(target: RegExp[]): Promise<void> {
    const beginSequence: RegExp = target[0];
    const endSequence: RegExp = target[target.length - 1];
    const sequence: RegExp[] = target.slice(1, -1);

    this._text = (await this.getText()).replace("\r", "").split(/\n/);

    this.startSequenceTest(beginSequence);

    while (sequence.length && !this.isNextSequenceTest(endSequence)) {
      const next: RegExp | undefined = sequence.shift();

      if (next) {
        this.lineSequenceTest(next);
      }
    }

    this.endSequenceTest(endSequence);
  }
}
