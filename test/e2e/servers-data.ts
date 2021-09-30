import { IServerData, IUserData } from "./page-objects/interface-po";

export const LOCALHOST_DATA: IServerData = {
	serverName: "localhost",
	address: "localhost",
	port: 2030,
	includePath: ["m:\\protheus\\includes"],
};

export const DELETE_DATA: IServerData = {
	...LOCALHOST_DATA,
	serverName: "forDelete"
};

export const ADMIN_USER_DATA: IUserData = {
	username: "admin",
	password: "1234",
	compilekey: "",
	rpotoken: ""
};

export const NO_ADMIN_USER_DATA: IUserData = {
	username: "user",
	password: "1234",
	compilekey: "",
	rpotoken: ""
};

export const INVALID_USER_DATA: IUserData = {
	username: "mane",
	password: "0000",
	compilekey: "",
	rpotoken: ""
};
