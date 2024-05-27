export type TCompileKey = {
	path: string;
	machineId: string;
	issued: string;
	expire: string;
	buildType: string;
	tokenKey: string;
	authorizationToken: string;
	userId: string;
}

export type TAuthorization = {
	id: string;
	generation: string;
	validation: string;
	permission: string;
	key: string;
	canOverride: boolean;
}

export type TCompileKeyModel = TCompileKey &  TAuthorization;
