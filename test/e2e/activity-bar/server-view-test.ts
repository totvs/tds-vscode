// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  ActivityBar,
  By,
  EditorView,
  ISize,
  SideBarView,
  TitleBar,
  ViewContent,
  ViewControl,
  ViewSection,
  ViewTitlePart,
  VSBrowser,
  WebDriver,
  WebView,
  Workbench,
} from "vscode-extension-tester";
import {
  addNewServer,
  delay,
  fillAddServerPage,
  IAddServerPage,
  openAdvplProject,
  showSideBarTotvs as openSideBarTotvs,
} from "../helper";
//import { showSideBarTotvs } from "../helper";

// Create a Mocha suite
describe("TOTVS: Server View", () => {
  // initialize the browser and webdriver
  let view: SideBarView;
  let titlebar: TitleBar;

  const LOCALHOST_DATA: IAddServerPage = {
    serverName: "localhost",
    address: "localhost",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  const DELETE_DATA: IAddServerPage = {
    serverName: "forDelete",
    address: "127.0.0.1",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  before(async () => {
    await openAdvplProject();
    await delay();

    const activityBar = new ActivityBar();
    const control = await activityBar.getViewControl("TOTVS");

    view = await control.openView();
    await delay();

    titlebar = new TitleBar();
  });

  it("No Servers", async () => {
    const content: ViewContent = view.getContent();
    const text: string = await content.getText();

    expect(text).is.empty;
  });

  it("Add Local Server", async () => {
    await new Workbench().executeCommand("Add server");
    await delay();

    const webView: WebView = new WebView();
    await webView.switchToFrame();

    await fillAddServerPage(webView, LOCALHOST_DATA, true);

    await delay();

    await webView.switchBack();
  });

  it("Remove Server", async () => {
    //await addNewServer(DELETE_DATA);

    await new Workbench().executeCommand("Add server");
    await delay();

    const webView: WebView = new WebView();
    await webView.switchToFrame();

    await fillAddServerPage(webView, DELETE_DATA, true);

    await delay();

    await webView.switchBack();

    const text: string = await webView.getText();

    expect(text).equal("*******");
  });
});
