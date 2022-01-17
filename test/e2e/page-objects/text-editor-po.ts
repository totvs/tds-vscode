import {
  EditorView,
  TextEditor,
  By,
  promise,
  DebugToolbar,
  until,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { ContentAssistPageObject } from "./content-assist-po";

export class TextEditorPageObject {
  private title: string;
  private editorView: EditorView;
  private editor: TextEditor;
  private _contentAssist: ContentAssistPageObject;

  public constructor(title: string) {
    this.title = title;
    this.editorView = new EditorView();
    this.editor = new TextEditor(this.editorView);
    this._contentAssist = new ContentAssistPageObject(this.editor);
  }

  async sendKeys(
    ...var_args: Array<string | number | promise.Promise<string | number>>
  ) {
    await this.editor
      .findElement(By.className("inputarea"))
      .sendKeys(...var_args);
  }

  get contentAssist(): ContentAssistPageObject {
    return this._contentAssist;
  }

  async close(): Promise<void> {
    await this.editorView.closeEditor(this.title);
  }

  async save(): Promise<void> {
    await this.editor.save();
    await delay(5000);
  }

  async toggleBreakpoint(line: number): Promise<boolean> {
    return await this.editor.toggleBreakpoint(line);
  }

  async waitStopDebugger(debugBar: DebugToolbar) {
    await this.editor.getDriver().wait(until.elementIsNotVisible(debugBar));
  }
}
