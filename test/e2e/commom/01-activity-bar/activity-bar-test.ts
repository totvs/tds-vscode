import { expect } from "chai";
import { describe, before, it } from "mocha";
import { ActivityBar, SideBarView, ViewControl } from "vscode-extension-tester";

describe("TOTVS Activity Bar", () => {
  let control: ViewControl;

  before(async () => {
    control = await new ActivityBar().getViewControl("TOTVS");
  });

  it("Activation", async () => {
    expect(control, "Control TOTVS not found in ActivityBar").not.null;

    const sidebar: SideBarView = await control.openView();
    expect(sidebar, "Sidebar view not found in ActivityBar").not.null;
  });

  it("Servers View Visible", async () => {
    const view = await control.openView();
    const klass = await control.getAttribute("class");

    expect(klass.indexOf("checked")).greaterThan(-1);
    expect(await view.isDisplayed()).is.true;

    const title = await view.getTitlePart().getTitle();
    expect(title.toLowerCase()).equals("totvs: servers");
  });
});
