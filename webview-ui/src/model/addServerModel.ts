export type TIncludeData = {
	id: string;
	path: string;
}

export type TAddServerModel = {
	serverName: string;
	includePatches: TIncludeData[]
}
