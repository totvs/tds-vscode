import { describe, before, it } from "mocha"
import { delay, openAdvplProject } from "../helper"
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po"
import { ServerTreePageObject } from "../page-objects/server-tree-po"
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data"

describe("Patch Operations", () => {
  let serverTreePO: ServerTreePageObject
  let serverItemPO: ServerTreeItemPageObject

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment

  before(async () => {
    await openAdvplProject()

    serverTreePO = new ServerTreePageObject()
    serverTreePO.openView()

    await serverTreePO.addNewServer(LOCALHOST_DATA)

    await delay()
  })

  beforeEach(async () => {
    await serverTreePO.connect(
      LOCALHOST_NAME,
      LOCALHOST_ENVIRONMENT,
      ADMIN_USER_DATA
    )
    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(LOCALHOST_NAME)
    )
  })

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction()
    serverItemPO = null
  })

  it.skip("Patch Generation (from RPO)", async () => {})

  it.skip("Patch Generation (by difference)", async () => {})

  it.skip("Patch Apply", async () => {})
})
