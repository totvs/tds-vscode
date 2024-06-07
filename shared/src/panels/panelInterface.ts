import { CommonCommandFromWebView } from "../webviewProtocol";

/**
 * Represents the different types of errors that can occur in the panel interface.
 */
export type TErrorType =
	"required"
	| "min"
	| "max"
	| "minLength"
	| "maxLength"
	| "pattern"
	| "validate"
	| "warning";

/**
 * Represents an error that occurred in a field.
 * @property {TErrorType} type - The type of the error.
 * @property {string} [message] - An optional error message.
 */
export type TFieldError = {
	type: TErrorType;
	message?: string
};

/**
 * Represents a partial record of field errors, where the keys are either the keys of the model type `M` or the string `"root"`.
 * The `"root"` key is used to represent errors that are not associated with a specific field. Use carefully as you can lock form.
 * This type should not be used directly, as the `"root"` key is not recommended.
 *
 * @template M - The model type for which the field errors are defined.
 */
export type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

/**
 * Checks if the provided `errors` object has any keys, indicating that there are errors.
 *
 * @param errors - An object of field errors, where the keys are the field names and the values are the error messages.
 * @returns `true` if the `errors` object has any keys, indicating that there are errors, `false` otherwise.
 */
export function isErrors<M>(errors: TFieldErrors<M>) {
	return Object.keys(errors).length > 0
};

/**
 * Represents the interface for an abstract model panel.
 */
export type TAbstractModelPanel = {

}

/**
 * Represents a message received from the web view, containing a command and associated data.
 *
 * @template C - The type of the command.
 * @template T - The type of the model data.
 * @property {C} command - The command received from the web view.
 * @property {object} data - The data associated with the command.
 * @property {T} data.model - The model data.
 * @property {object} data[key] - Additional data associated with the command.
 */
export type ReceiveMessage<C extends CommonCommandFromWebView, T = any> = {
	command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

/**
 * Represents a message that can be sent between components, with a command and associated data.
 *
 * @template C - The type of the command.
 * @template T - The type of the model data.
 */
export type SendMessage<C, T = any> = {
	readonly command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}
/**
 * Defines the props for a panel that allows the user to select one or more resources (files or folders).
 * @property firedBy - The string identifier of the component that triggered the panel to open.
 * @property canSelectMany - Indicates whether the user can select multiple resources.
 * @property canSelectFiles - Indicates whether the user can select files.
 * @property canSelectFolders - Indicates whether the user can select folders.
 * @property currentFolder - The path of the currently selected folder.
 * @property title - The title to display in the panel.
 * @property openLabel - The label for the button to open the selected resources.
 * @property filters - An object that maps file extensions to arrays of human-readable names for those extensions.
 * @property fileSystem - The string identifier of the filesystem for use in the panel.
 */
export type TSendSelectResourceProps = TAbstractModelPanel & {
	fileSystem?: string;
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
