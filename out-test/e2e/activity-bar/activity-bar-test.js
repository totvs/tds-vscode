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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const vscode_extension_tester_1 = require("vscode-extension-tester");
(0, mocha_1.describe)("TOTVS Activity Bar", () => {
    let activityBar;
    let control;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        activityBar = new vscode_extension_tester_1.ActivityBar();
        control = yield activityBar.getViewControl("TOTVS");
    }));
    (0, mocha_1.it)("Activation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(control, "Control TOTVS not found in ActivityBar").not.null;
        const sidebar = yield control.openView();
        (0, chai_1.expect)(sidebar, "Sidebar view not found in ActivityBar").not.null;
    }));
    (0, mocha_1.it)("TOTVS: Servers View Visible", () => __awaiter(void 0, void 0, void 0, function* () {
        const view = yield control.openView();
        const klass = yield control.getAttribute("class");
        (0, chai_1.expect)(klass.indexOf("checked")).greaterThan(-1);
        (0, chai_1.expect)(yield view.isDisplayed()).is.true;
        const title = yield view.getTitlePart().getTitle();
        (0, chai_1.expect)(title.toLowerCase()).equals("totvs: servers");
    }));
});
//# sourceMappingURL=activity-bar-test.js.map