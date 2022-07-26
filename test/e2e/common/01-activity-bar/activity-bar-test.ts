import { expect } from "chai";
import { describe, before, it } from "mocha";
import { ActivityBar, SideBarView, ViewControl } from "vscode-extension-tester";
import { DEFAULT_DELAY, delay } from "../../helper";

describe.only("TOTVS Activity Bar", async () => {
  let control: ViewControl;

  before(async () => {
    const list:number[] = [];
    while (list.length < 10000) {
      list.push(0);
    }
    await delay(DEFAULT_DELAY);
    control = await new ActivityBar().getViewControl("TOTVS");
  });

  it("Activation", async () => {
    expect(control, "Control TOTVS not found in ActivityBar").not.null;

    const sidebar: SideBarView = await control.openView();
    await delay();
    expect(sidebar, "Sidebar view not found in ActivityBar").not.null;
  });

  it("Servers View Visible", async () => {
    const view = await control.openView();
    await delay();
    const klass = await control.getAttribute("class");

    expect(klass.indexOf("checked")).greaterThan(-1);
    expect(await view.isDisplayed()).is.true;

    const title = await view.getTitlePart().getTitle();
    expect(title.toLowerCase()).equals("totvs: servers");
  });
});
