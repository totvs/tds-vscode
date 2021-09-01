// import the webdriver and the high level browser wrapper
import assert = require("assert");
import { describe, before, it } from "mocha";
import { ActivityBar, SideBarView, ViewControl, VSBrowser, WebDriver } from 'vscode-extension-tester';

// Create a Mocha suite
describe('ActivityBar TOTVS', () => {
  let browser: VSBrowser;
  let driver: WebDriver

  // initialize the browser and webdriver
  before(async () => {
    browser = VSBrowser.instance;
    driver = browser.driver;
  });

  it('Add new server', async () => {
    const activityBar = new ActivityBar();
    const control: ViewControl = await activityBar.getViewControl('TOTVS');

    assert(control, "Control TOTVS not found in ActivityBar");

    const sidebar: SideBarView = await control.openView();
    assert(sidebar, "Sidebar view not found in ActivityBar");

  });
});