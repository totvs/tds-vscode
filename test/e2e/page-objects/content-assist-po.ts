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
  EditorView,
  TextEditor,
  By,
  promise,
  ContentAssist,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { WorkbenchPageObject } from "./workbench-po";

export class ContentAssistPageObject {
  private editor: TextEditor;
  private assist: ContentAssist;

  public constructor(editor: TextEditor) {
    this.editor = editor;
  }

  async open(): Promise<void> {
    this.assist = (await this.editor.toggleContentAssist(
      true
    )) as ContentAssist;
  }

  async close(): Promise<void> {
    this.assist = (await this.editor.toggleContentAssist(
      false
    )) as ContentAssist;
  }

  async fireItemAssist(title: string): Promise<void> {
    const assistItem = await this.assist.getItem(title);
    await assistItem.click();
    await delay();

    await this.editor.toggleContentAssist(false);
  }
}
