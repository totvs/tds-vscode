import { CommonCommandFromWebView } from "../webviewProtocol";

export type TErrorType =
	"required"
	| "min"
	| "max"
	| "minLength"
	| "maxLength"
	| "pattern"
	| "validate"
	| "warning";

export type TFieldError = {
	type: TErrorType;
	message?: string
};

export type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

export function isErrors<M>(errors: TFieldErrors<M>) {
	return Object.keys(errors).length > 0
};

export type TModelPanel = {

}

export type ReceiveMessage<C extends CommonCommandFromWebView, T = any> = {
	command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

export type SendMessage<C, T = any> = {
	readonly command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}
export type TSendSelectResourceProps = TModelPanel & {
	firedBy: string;
	canSelectMany: boolean,
	canSelectFiles: boolean,
	canSelectFolders: boolean,
	currentFolder: string,
	title: string,
	openLabel: string,
	filters: {
		[key: string]: string[]
	}
}
