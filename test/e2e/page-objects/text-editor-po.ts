import {
  EditorView,
  TextEditor,
  By,
  promise,
  DebugToolbar,
  until,
} from "vscode-extension-tester";
import { delay, DELAY_LONG } from "../helper";
import { ContentAssistPageObject } from "./content-assist-po";
import { WorkbenchPageObject } from "./workbench-po";

export class TextEditorPageObject {
  private title: string;
  private editorView: EditorView;
  private editor: TextEditor;
  private _contentAssist: ContentAssistPageObject;
  private _workbenchPO: WorkbenchPageObject;

  public constructor(title: string) {
    this.title = title;
    this.editorView = new EditorView();
    this.editor = new TextEditor(this.editorView);
    this._workbenchPO = new WorkbenchPageObject();

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
    await delay(DELAY_LONG);
  }

  async setBreakpoint(line: number): Promise<boolean> {
    this._workbenchPO.promptCommand(`:${line}`); //garante linha visivel na área do editor
    await delay();
    let result: boolean = await this.editor.toggleBreakpoint(line);

    if (!result) {
      await delay();
      result = await this.editor.toggleBreakpoint(line);
    }

    await delay();
    return result;
  }

  async removeBreakpoint(line: number): Promise<boolean> {
    let result: boolean = await this.editor.toggleBreakpoint(line);

    if (result) {
      result = await this.editor.toggleBreakpoint(line);
    }

    return !result;
  }
}
