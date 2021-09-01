// import the webdriver and the high level browser wrapper
import assert = require("assert");
import { describe, before, it } from "mocha";
import { VSBrowser, WebDriver } from 'vscode-extension-tester';

// Create a Mocha suite
describe('My Test Suite in activiry-bar', () => {
  let browser: VSBrowser;
  let driver: WebDriver

  // initialize the browser and webdriver
  before(async () => {
    browser = VSBrowser.instance;
    driver = browser.driver;
  });

  // test whatever we want using webdriver, here we are just checking the page title
  it('My Test Case activiry-bar', async () => {
    const title = await driver.getTitle();

    assert(title == "XWelcome - Visual Studio Code", 'Proposital');
  });
});