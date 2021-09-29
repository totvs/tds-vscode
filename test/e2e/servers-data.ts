import { IServerData } from "./page-objects/interface-po";

export const LOCALHOST_DATA: IServerData = {
	serverName: "localhost",
	address: "localhost",
	port: 2030,
	includePath: ["m:\\protheus\\includes"],
};

export const DELETE_DATA: IServerData = {
	serverName: "forDelete",
	address: "127.0.0.1",
	port: 2030,
	includePath: ["m:\\protheus\\includes"],
};