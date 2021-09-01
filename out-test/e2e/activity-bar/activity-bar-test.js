"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mocha_1 = require("mocha");
const vscode_extension_tester_1 = require("vscode-extension-tester");
(0, mocha_1.describe)('ActivityBar TOTVS', () => {
    let browser;
    let driver;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        browser = vscode_extension_tester_1.VSBrowser.instance;
        driver = browser.driver;
    }));
    (0, mocha_1.it)('Add new server', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityBar = new vscode_extension_tester_1.ActivityBar();
        const control = yield activityBar.getViewControl('TOTVS');
        assert(control, "Control TOTVS not found in ActivityBar");
        const sidebar = yield control.openView();
        assert(sidebar, "Sidebar view not found in ActivityBar");
    }));
});
//# sourceMappingURL=activity-bar-test.js.map