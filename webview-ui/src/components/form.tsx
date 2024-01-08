import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";

import "./form.css";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";
import PopupMessage from "./popup-message";
import { FieldError, FieldValues, Form, FormProps, UseControllerProps, useController } from "react-hook-form";
import { sendClose } from "../utilities/common-command-webview";
import { ChangeEvent, ChangeEventHandler, EventHandler } from "react";

/**
 * - 'hook' useFieldArray e propriedade 'disabled':
 *   Por comportamento do 'hook', campos com 'disabled' ativo não são armazenados no array associado ao 'hook'.
 *   Use 'readOnly' como paliativo.
 */

declare module "react" {
	interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
		webkitdirectory?: string;
		directory?: string;
	}
}

export interface IFormAction {
	id: number;
	caption: string;
	hint?: string;
	action?: any;
	enabled?: boolean;
	type?: "submit" | "reset" | "button";
	appearance?: ButtonAppearance;
}

type TDSFromProps = any //o correto é FormProps<T, U>, mas não consegui usar. acandido.
	& {
		actions: IFormAction[];
		isValid?: boolean;
		isDirty?: boolean;
		children: any
	};

type TDSReadOnlyProp = {
	readOnly?: boolean
}

type TDSFieldProps = TDSReadOnlyProp & {
	label: string;
	info: string;
}

type TDSCheckBoxProps = TDSReadOnlyProp & {
	label: string;
	textLabel: string;
}

type TDSSelectionFieldProps = TDSFieldProps & {
	options?: {
		value: string;
		text: string;
	}[]
}

type TDSSelectionFolderFieldProps = {
	info: string;
	onSelect: (event: ChangeEvent<HTMLInputElement>) => any;
}

function buildMessage(props: any, error: FieldError | undefined): string {
	const { label, info } = props;
	let message: string = info || "";

	if (error) {
		if (error.type == "required") {
			message = `[${label}] is required`;
		} else if (error.type == "min") {
			message = `[${label}] is not valid range (min value).`;
		} else if (error.type == "max") {
			message = `[${label}] is not valid range (max value).`;
		} else {
			message = error.message || `${error.type}<Unknown>`
		}
	}

	return message;
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSSelectionField(props: UseControllerProps<any> & TDSSelectionFieldProps) {
	const { field, fieldState } = useController(props);
	const options = props.options || [];
	const rules = props.rules || {};
	let message: string = buildMessage(props, fieldState.error);

	return (
		<section className="tds-dropdown-container">
			<label htmlFor={props.name}>
				{props.label}
				{rules.required && <span className="tds-required" />}
			</label>
			<VSCodeDropdown {...field} >
				{options.map(({ value, text }, index) =>
					<VSCodeOption key={index} value={value}>{text}</VSCodeOption>
				)}
				<PopupMessage type={fieldState.invalid ? "error" : "info"} fieldName={props.name} message={message} />
			</VSCodeDropdown>
		</section>
	)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSTextField(props: UseControllerProps<any> & TDSFieldProps) {
	const { field, fieldState } = useController(props);
	let message: string = buildMessage(props, fieldState.error);

	return (
		<section className="tds-text-field-container">
			<label htmlFor={props.name}>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField
				{...field} >
				<PopupMessage type={fieldState.invalid ? "error" : "info"} fieldName={props.name} message={message} />
			</VSCodeTextField>
		</section>
	)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSCheckBoxField(props: UseControllerProps<any> & TDSCheckBoxProps) {
	const { field, fieldState } = useController(props);

	return (
		<section className="tds-text-field-container">
			<label htmlFor={props.name}>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeCheckbox
				checked={field.value}
				{...field} >
				{props.textLabel}
			</VSCodeCheckbox>
		</section>
	)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSSimpleTextField(props: UseControllerProps<any> & TDSReadOnlyProp) {
	const { field, fieldState } = useController(props);
	const message: string = buildMessage(props, fieldState.error);
	const readOnly: boolean = (props.readOnly) || false;

	return (
		<section className="tds-simple-text-field-container">
			<VSCodeTextField
				readOnly={readOnly}
				{...field}
			>
				{fieldState.invalid && <PopupMessage type={"error"} fieldName={props.name} message={message} />}
			</VSCodeTextField>
		</section>
	)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSNumericField(props: UseControllerProps<any> & TDSFieldProps) {
	const rules = {
		...props.rules,
		pattern: {
			value: /\d+/gm,
			message: `[${props.label}] only accepts numbers`
		}
	};

	const { field, fieldState } = useController({ ...props, rules: rules });
	let message: string = buildMessage(props, fieldState.error);

	return (
		<section className="tds-numeric-field-container">
			<label htmlFor={props.name}>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField
				{...field} >
				<PopupMessage type={fieldState.invalid ? "error" : "info"} fieldName={props.name} message={message} />
			</VSCodeTextField>
		</section>
	)
}

export function getDefaultActionsForm(): IFormAction[] {
	return [
		{
			id: -1,
			caption: "Save",
			hint: "Salva as informações e fecha a página",
			appearance: "primary",
			type: "submit",
		},
		{
			id: -2,
			caption: "Close",
			hint: "Fecha a página, sem salvar as informações",
			appearance: "secondary",
			action: () => {
				sendClose();
			},
		}
	];
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */

export default function TDSForm(props: TDSFromProps): JSX.Element {
	let actions: IFormAction[] = props.actions;

	return (
		<Form {...props}>
			<div className={"tds-form-content"}>
				{props.children}
			</div>
			<div className="tds-actions">
				<div className="tds-message">
					{props.errors.root && <span className={`tds-error`}>{props.errors.root.message}.</span>}
				</div>
				<div className="tds-buttons">
					{actions.map((action: IFormAction) => {
						let propsField: any = {};

						propsField["key"] = action.id;
						propsField["type"] = action.type || "button";

						if (action.enabled !== undefined) {
							propsField["disabled"] = !action.enabled;
						}
						if (action.appearance) {
							propsField["appearance"] = action.appearance;
						}
						if (action.action) {
							propsField["onClick"] = action.action;
						}

						return (<VSCodeButton {...propsField} >{action.caption}</VSCodeButton>)
					})}
				</div>
			</div>
		</Form >
	);
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSSelectionFolderField(props: UseControllerProps<any> & TDSSelectionFolderFieldProps) {
	const fireBtnFile = () => {
		const button: HTMLInputElement = document.getElementsByName(`btn-file-${props.name}`)[0] as HTMLInputElement;
		button.click();
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		console.dir(event);
		var input: any = event.target;

		if (input.files.length > 0) {
			props.onSelect(event);
		}
	}

	return (
		<section className="tds-selection-field-container">
			{/* ts-expect-error */}
			<VSCodeButton name={props.name} onClick={() => fireBtnFile()}>Select folder</VSCodeButton>
			<input type="file" name={`btn-file-${props.name}`}
				onChange={(event) => onChange(event)}
				webkitdirectory="" directory="" className="display:hidden" />
		</section>)
}
