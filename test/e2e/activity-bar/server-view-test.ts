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
  let view: SideBarView;
  let workbench: Workbench;

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
    workbench = new Workbench();

    await openAdvplProject();
    await delay();

    const activityBar = new ActivityBar();
    const control = await activityBar.getViewControl("TOTVS");

    view = await control.openView();
    await delay();
  });

  afterEach(async () => {
    await delay();
  });

  describe("Phase 1", async () => {
    it("No Servers", async () => {
      const content: ViewContent = view.getContent();
      const text: string = await content.getText();

      expect(text).is.empty;
    });

    it("Add Local Server", async () => {
      await workbench.executeCommand("Add server");
      await delay();

      const webView: WebView = new WebView();
      await webView.switchToFrame();

      await fillAddServerPage(webView, LOCALHOST_DATA, true);

      await delay();

      await webView.switchBack();
    });
  });

  describe("Phase 2", async () => {
    it("Remove Server", async () => {
      const c = view.getContent();
      const s = await c.getSections();
      const i2 = await s[0].getVisibleItems();

      await addNewServer(DELETE_DATA);

      const i = await s[0].findItem(DELETE_DATA.serverName);

      await i.select();
      await delay();

      await workbench.executeCommand("totvs-developer-studio.delete");
      await delay();

      const i3 = await s[0].getVisibleItems();
      expect(i3.length).is.lessThan(i2.length);
    });
  });
});
