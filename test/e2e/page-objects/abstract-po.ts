import { By, EditorView, TextEditor, WebElement, WebView } from "vscode-extension-tester";
import { delay } from "../helper";
import { expect } from 'chai';

export class AbstractPageObject {
	private _webView: WebView;

	public get webView(): WebView {
		return this._webView;
	}

	async beginWebView(): Promise<void> {
		this._webView = new WebView();

		await this.webView.wait()
		await this.webView.switchToFrame();
		await delay(2000);
	}

	async endWebView(): Promise<void> {
		this.webView.switchBack();
		await delay(2000);

		this._webView = null;
	}

	async findElement(id: string) {
		return await this.webView.findWebElement(By.id(id))
	}

	async getValue(elementId: string): Promise<string> {
		let element: WebElement = await this.findElement(elementId);

		return await element.getAttribute("value") || await element.getText();
	}

	async setValue(elementId: string, value: string): Promise<void> {
		let element: WebElement = await this.findElement(elementId);
		await element.clear();
		await element.sendKeys(value);
	}

	async click(elementId: string): Promise<void> {
		let element: WebElement = await this.findElement(elementId);

		await element.click();
		await delay();
	}
}

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
}
