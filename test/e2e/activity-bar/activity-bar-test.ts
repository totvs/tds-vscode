import { expect } from "chai";
import { describe, before, it } from "mocha";
import { ActivityBar, SideBarView, ViewControl } from "vscode-extension-tester";

describe("TOTVS Activity Bar", () => {
  let activityBar: ActivityBar;
  let control: ViewControl;

  before(async () => {
    activityBar = new ActivityBar();
    control = await activityBar.getViewControl("TOTVS");
  });

  it("Activation", async () => {
    expect(control, "Control TOTVS not found in ActivityBar").not.null;

    const sidebar: SideBarView = await control.openView();
    expect(sidebar, "Sidebar view not found in ActivityBar").not.null;
  });

  it("TOTVS: Servers View Visible", async () => {
    const view = await control.openView();
    const klass = await control.getAttribute("class");

    expect(klass.indexOf("checked")).greaterThan(-1);
    expect(await view.isDisplayed()).to.be.true;

    const title = await view.getTitlePart().getTitle();
    expect(title.toLowerCase()).equals("totvs: servers");
  });
});
