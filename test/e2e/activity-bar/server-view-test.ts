// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  ActivityBar,
  SideBarView,
  ViewContent,
  ViewControl,
  ViewSection,
  ViewTitlePart,
  VSBrowser,
  WebDriver,
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  showSideBarTotvs as openSideBarTotvs,
} from "../helper";
//import { showSideBarTotvs } from "../helper";

// Create a Mocha suite
describe.skip("TOTVS: Server View", () => {
  // initialize the browser and webdriver
  let activityBar: ActivityBar;
  let control: ViewControl;
  let view: SideBarView;
  let content: ViewContent;

  before(async (done) => {
    await openAdvplProject();
    await delay();

    const view = await (
      await new ActivityBar().getViewControl("TOTVS: SERVERS")
    ).openView();
    await delay();

    content = view.getContent();
    done();
  });

  afterEach(async () => {
    //    await menu.close();
  });

  it("No servers", async () => {
    const sections: ViewSection[] = await content.getSections();

    console.log("Size " + sections.length);

    sections.forEach(async (section: ViewSection) => {
      const text: string = await section.getText();
      console.log("**************** " + text);
    });
  });
});
