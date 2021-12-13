import { expect } from "chai";
import { describe, before, it } from "mocha";
import path = require("path");
import { delay, openProject } from "../../helper";
import { ApplyPatchPageObject } from "../../page-objects/apply-patch-po";
import { ApplyTemplatePageObject } from "../../page-objects/apply-template-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import {
  ADMIN_USER_DATA,
  APPSERVER_DATA,
  TEMPLATE_FILES,
} from "../../scenario";

//os testes com template não considera erros no template na validação
//normalmente erros de compilação
(TEMPLATE_FILES ? describe.skip : describe.skip)("Apply Template", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.addNewServer(APPSERVER_DATA);

    await delay();
  });

  beforeEach(async () => {
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  TEMPLATE_FILES["p20"].forEach((filename: string) => {
    it(`Apply template: ${path.basename(filename)}`, async () => {
      await workbenchPO.executeCommand("totvs-developer-studio.templateApply");

      const applyTemplatehPO: ApplyTemplatePageObject =
        new ApplyTemplatePageObject();
      await applyTemplatehPO.setTemplateFile(filename);
      await applyTemplatehPO.fireSubmitClose();
      await delay(2000);

      if (await serverItemPO.isServerP20OrGreater()) {
        expect(await workbenchPO.isApplyTemplateNotSuported()).is.true;
      } else {
        expect(await workbenchPO.applyTemplateInProgress()).is.true;
        await workbenchPO.waitApplyTemplate();
        expect(await workbenchPO.isTemplateApplied()).is.true;
      }
    });
  });
});
