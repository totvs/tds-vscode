import { TIncludePath, TModelPanel } from "./field-model";


export type TIncludeModel = TModelPanel & {
	includePaths: TIncludePath[];
}