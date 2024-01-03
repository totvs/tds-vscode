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
// export type _TFieldValues = Record<string, any>;
// export type TFieldValue<TFieldValues extends _TFieldValues> = TFieldValues[string];
//export type TFieldErrors = <TFieldValues extends FieldValues = FieldValues>;
export type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

export function isErrors<M>(errors: TFieldErrors<M>) {
	return Object.keys(errors).length > 0
};
