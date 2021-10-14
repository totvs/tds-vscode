import { expect } from "chai"
import { describe, before, it, afterEach } from "mocha"
import { EditorView, TextEditor } from "vscode-extension-tester"
import {
  avoidsBacksliding,
  delay,
  readServersJsonFile,
  openAdvplProject
} from "../helper"
import { CompileKeyPageObject } from "../page-objects/compile-key-po"
import { IncludePageObject } from "../page-objects/include-po"
import { ICompileKeyData, IIncludeData } from "../page-objects/interface-po"
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po"
import { ServerTreePageObject } from "../page-objects/server-tree-po"
import { WorkbenchPageObject } from "../page-objects/workbench-po"
import {
  ADD_INCLUDE_PATH_DATA,
  CHANGE_INCLUDE_PATH_DATA,
  COMPILE_KEY_FILE,
  DELETE_DATA
} from "../servers-data"

describe("TOTVS: Server View Configurations", () => {
  let serverTreePO: ServerTreePageObject
  let serverItemPO: ServerTreeItemPageObject
  let workbenchPO: WorkbenchPageObject

  before(async () => {
    await openAdvplProject()

    workbenchPO = new WorkbenchPageObject()
    serverTreePO = new ServerTreePageObject()
    serverTreePO.openView()

    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getNewServer(DELETE_DATA)
    )

    await delay()
  })

  afterEach(async () => {
    await delay(5000)
  })

  it("Include (change)", async () => {
    const includePO: IncludePageObject = new IncludePageObject()
    await serverItemPO.fireInclude()

    await includePO.fillIncludePage(CHANGE_INCLUDE_PATH_DATA)
    await includePO.fireSave(true)

    await serverItemPO.fireInclude()
    const pageData: IIncludeData = await includePO.getIncludePage()

    expect(pageData.includePath.join(";")).to.equal(
      CHANGE_INCLUDE_PATH_DATA.includePath.join(";")
    )
    await includePO.fireSave(true)
  })

  it("Include (add more patchs)", async () => {
    await avoidsBacksliding()

    const includePO: IncludePageObject = new IncludePageObject()
    await serverItemPO.fireInclude()

    const oldValue: IIncludeData = await includePO.getIncludePage()
    const newValue: IIncludeData = {
      includePath: [
        ...oldValue.includePath,
        ...ADD_INCLUDE_PATH_DATA.includePath
      ]
    }

    await includePO.fillIncludePage(newValue)
    await includePO.fireSave(true)
    await avoidsBacksliding()

    await serverItemPO.fireInclude()
    const pageData: IIncludeData = await includePO.getIncludePage()

    expect(pageData.includePath.join(";")).to.equal(
      newValue.includePath.join(";")
    )
    await includePO.fireSave(true)
  })

  it("Configure Server View", async () => {
    await serverTreePO.fireConfigureServerView()

    const view: EditorView = new EditorView()
    const editor: TextEditor = new TextEditor(view)
    const title: string = await editor.getTitle()
    const textServer: string = await readServersJsonFile()
    const transform = (text: string): string => {
      const replaces: any[][] = [
        [/\r/g, ""]
        // [/\\n/g, "\n"],
        // [/\\t/g, "\t"]
      ]

      replaces.forEach((element: any[]) => {
        text = text.replace(element[0], element[1])
      })

      return text
    }
    const text = await editor.getText()
    expect(transform(text)).to.equals(transform(textServer))

    await view.closeEditor(title)
  })

  it("Compile key (valid input)", async () => {
    const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject()
    await serverItemPO.fireCompileKey()

    const oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage()

    expect(oldValue.machineId).not.empty

    const newValue: ICompileKeyData = {
      ...oldValue,
      compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId]
    }
    await compileKeyPO.fillCompileKeyPage(newValue)

    expect(await compileKeyPO.isValidKey()).is.true
    await compileKeyPO.fireSave(true)

    expect(await workbenchPO.isLoggedIn()).is.true
  })

  it("Compile key (clear)", async () => {
    const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject()
    await serverItemPO.fireCompileKey()
    const oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage()
    let newValue: ICompileKeyData = {
      ...oldValue,
      compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId]
    }
    await compileKeyPO.fillCompileKeyPage(newValue)
    await compileKeyPO.fireSave(true)

    await serverItemPO.fireCompileKey()
    await compileKeyPO.fireClear()
    await compileKeyPO.fireSave(false)

    newValue = await compileKeyPO.getCompileKeyPage()
    await compileKeyPO.fireSave(true)

    expect(newValue.token).is.empty
    expect(await workbenchPO.isNotLoggedIn()).is.true
  })
})
