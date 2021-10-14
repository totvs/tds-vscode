import path = require("path");
import { IIncludeData, IServerData, IUserData } from "./page-objects/interface-po"

const TEST_RESOURCE = path.join(__dirname, "..", "..", "test", "resources")

export const LOCALHOST_DATA: IServerData = {
  serverName: "localhost",
  address: "localhost",
  port: 2030,
  environment: "p12",
  includePath: ["m:\\protheus\\includes"]
}

export const DELETE_DATA: IServerData = {
  ...LOCALHOST_DATA,
  serverName: "forDelete"
}

export const ADMIN_USER_DATA: IUserData = {
  username: "admin",
  password: "1234"
}

export const NO_ADMIN_USER_DATA: IUserData = {
  username: "user",
  password: "1234"
}

export const INVALID_USER_DATA: IUserData = {
  username: "mane",
  password: "0000"
}

export const INCLUDE_PATH_DATA: IIncludeData = {
  includePath: [
    "m:/protheus/includes"
  ]
}

export const CHANGE_INCLUDE_PATH_DATA: IIncludeData = {
  includePath: [
    "m:/change/includes"
  ]
}

export const ADD_INCLUDE_PATH_DATA: IIncludeData = {
  includePath: [
    "m:/more_1/includes"
  ]
}

export const COMPILE_KEY_FILE = {
  "9DA4-26D1": path.join(TEST_RESOURCE, "compile-key", "acandido.aut")
}
