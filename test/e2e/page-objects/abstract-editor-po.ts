import {
  By,
  EditorView,
  TextEditor,
  WebElement,
} from "vscode-extension-tester";
import { delay } from "../helper";

export class AbstractEditorPageObject {
  private _view: EditorView;
  private _editor: TextEditor;
  private _expectTitle: string;

  constructor(expectTitle: string) {
    this._expectTitle = expectTitle;
  }

  public get expectTitle(): string {
    return this._expectTitle;
  }

  public get view(): EditorView {
    if (!this._view) {
      this._view = new EditorView();
    }

    return this._view;
  }

  public get editor(): TextEditor {
    if (!this._editor) {
      this._editor = new TextEditor(this.view);
    }

    return this._editor;
  }

  async close() {
    await delay();
    await this.view.closeEditor(await this.editor.getTitle());
  }

  async isOpen(): Promise<boolean> {
    await delay();
    const title: string = await this.editor.getTitle();

    return title == this.expectTitle;
  }

  async findElement(id: string) {
    return await this.editor.findElement(By.id(id));
  }

  async getValue(elementId: string): Promise<string> {
    const element: WebElement = await this.findElement(elementId);

    return (await element.getAttribute("value")) || (await element.getText());
  }

  async setValue(elementId: string, value: string): Promise<void> {
    const element: WebElement = await this.findElement(elementId);
    await element.clear();
    await element.sendKeys(value);
  }
}
