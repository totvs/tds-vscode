export type TErrorType =
	"required"
	| "min"
	| "max"
	| "minLength"
	| "maxLength"
	| "pattern"
	| "validate";

export type TFieldError = {
	type: TErrorType;
	message?: string
};

export type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

export function isErrors<M>(errors: TFieldErrors<M>) {
	return Object.keys(errors).length > 0
};

export type TIncludePath = {
	path: string;
}

export type TModelPanel = {

}

/**
 * Considerar métodos com prefixo '_' como privados.
 */
export interface ITdsPanel<M extends TModelPanel> {
	_validateModel(model: M, errors: TFieldErrors<M>): boolean;
	_saveModel(model: M): boolean;
	_sendValidateResponse(errors: TFieldErrors<M>): void;
	_sendUpdateModel(model: M): void;
}
