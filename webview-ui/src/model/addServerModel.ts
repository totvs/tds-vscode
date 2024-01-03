export type TModelData = {
	[key: string]: any;
} | undefined

export type TIncludeData = TModelData &
{
	id: string;
	path: string;
}

