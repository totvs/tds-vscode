import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField, VSCodeCheckbox, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

import "./form.css";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";
import PopupMessage from "./popup-message";
import { FieldError, Form, UseControllerProps, useController } from "react-hook-form";
import { sendClose } from "../utilities/common-command-webview";
import { ChangeEvent } from "react";

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
	visible?: boolean;
	isProcessRing?: boolean
	type?: "submit" | "reset" | "button";
	appearance?: ButtonAppearance;
}

type TDSFormProps = any //o correto é FormProps<T, U>, mas não consegui usar. acandido.
	& {
		actions: IFormAction[];
		isValid?: boolean;
		isDirty?: boolean;
		children: any
	};

type TDSCommonProps = {
	readOnly?: boolean
	className?: string;
}

type TDSFieldProps = TDSCommonProps & {
	label: string;
	info: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
}

type TDSCheckBoxProps = TDSCommonProps & {
	label: string;
	textLabel: string;
	onChecked: (checked: boolean) => any;
}

type TDSSimpleCheckBoxProps = TDSCommonProps & {
	textLabel: string;
	onChecked: (checked: boolean) => any;
}

type TDSSelectionFieldProps = TDSFieldProps & {
	options?: {
		value: string;
		text: string;
	}[]
}

type TDSSelectionFolderFieldProps = TDSCommonProps & {
	info: string;
	onSelect: (folder: string) => any;
}

type TDSSelectionFileFieldProps = TDSCommonProps & {
	info: string;
	onSelect: (files: string[]) => any;
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
		<section className={`tds-dropdown-container ${props.className ? props.className : ''}`}>
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

	field.onChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (props.onChange) {
			props.onChange(event);
		}
	}

	return (
		<section className={`tds-text-field-container ${props.className ? props.className : ''}`}>
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

	field.onChange = (event: ChangeEvent<HTMLInputElement>) => {
		props.onChecked(event.target.checked);
	}

	return (
		<section className={`tds-text-field-container ${props.className ? props.className : ''}`}>
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
export function TDSSimpleTextField(props: UseControllerProps<any> & TDSCommonProps) {
	const { field, fieldState } = useController(props);
	const message: string = buildMessage(props, fieldState.error);
	const readOnly: boolean = (props.readOnly) || false;

	return (
		<section className={`tds-simple-text-field-container ${props.className ? props.className : ''}`}>
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
		<section className={`tds-numeric-field-container ${props.className ? props.className : ''}`}>
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
			isProcessRing: true
		},
		{
			id: -2,
			caption: "Close",
			hint: "Fecha a página, sem salvar as informações",
			appearance: "secondary",
			action: () => {
				sendClose();
			},
		},
		{
			id: -3,
			caption: "Clear",
			hint: "Reinicia os campos do formulário",
			appearance: "secondary",
			type: "reset",
			visible: false
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

export default function TDSForm(props: TDSFormProps): JSX.Element {
	let actions: IFormAction[] = props.actions;
	let isProcessRing: boolean = false;
	actions.forEach((action: IFormAction) => isProcessRing = isProcessRing || (action.isProcessRing || false));

	return (
		<Form
			onSubmitCapture={() => {
				var progressRing = document.getElementById("tds-loading-form");

				if (progressRing) {
					progressRing.classList.toggle("show");
					progressRing = document.getElementById("tds-loading--1");
					progressRing?.classList.toggle("show");
				}

				var buttons = document.getElementsByClassName("tds-button-button");
				for (var i = 0; i < buttons.length; i++) {
					(buttons[i] as HTMLButtonElement).disabled = true;
				}

				//props.onSubmit();
			}}
			{...props}>
			<div className={"tds-form-content"}>
				{props.children}
			</div>
			<div className="tds-actions">
				<div className="tds-message">
					{props.errors.root && <span className={`tds-error`}>{props.errors.root.message}.</span>}
					{isProcessRing && <span className="tds-loading" id={"tds-loading-form"}>Wait please. Processing...</span>}
				</div>
				<div className="tds-buttons">
					{actions.map((action: IFormAction) => {
						let propsField: any = {};
						let visible: string = "";

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

						if (action.visible !== undefined) {
							visible = action.visible ? "" : "tds-hidden";
							console.log(">>> %s = %s", propsField["type"], visible);
						}

						return (<VSCodeButton
							className={`tds-button-button ${visible}`}
							{...propsField} >
							{isProcessRing && <span className="tds-loading" id={`tds-loading-action$${action.id}`}><VSCodeProgressRing />.</span>}
							{action.caption}
						</VSCodeButton>)
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
		var input: any = event.target;

		if (input.files.length > 0) {
			let path: string = input.files[0].path;

			if (path.endsWith("/") || path.endsWith("\\")) {
				path = path.substring(0, path.length - 1);
			}

			props.onSelect(path);
		}
	}

	return (
		<section className={`tds-selection-folder-container ${props.className ? props.className : ''}`}>
			{/* ts-expect-error */}
			<VSCodeButton name={props.name} onClick={() => fireBtnFile()}>Select folder</VSCodeButton>
			<input type="file" name={`btn-file-${props.name}`}
				onChange={(event) => onChange(event)}
				webkitdirectory="" directory="" />
		</section>)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSSelectionFileField(props: UseControllerProps<any> & TDSSelectionFileFieldProps) {
	const fireBtnFile = () => {
		const button: HTMLInputElement = document.getElementsByName(`btn-file-${props.name}`)[0] as HTMLInputElement;
		button.click();
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		var input: any = event.target;

		if (input.files.length > 0) {
			let filenames: string[] = [];

			for (let i = 0; i < input.files.length; i++) {
				const element = input.files[i];
				filenames.push(element.path);
			}

			props.onSelect(filenames);
		}
	}

	return (
		<section className={`tds-selection-file-container ${props.className ? props.className : ''}`}>
			{/* ts-expect-error */}
			<VSCodeButton name={props.name} onClick={() => fireBtnFile()}>Select file</VSCodeButton>
			<input type="file" name={`btn-file-${props.name}`}
				onChange={(event) => onChange(event)} />
		</section>)
}

/**
 *
 * Se usar em 'hook' useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
export function TDSSimpleCheckBoxField(props: UseControllerProps<any> & TDSSimpleCheckBoxProps) {
	const { field, fieldState } = useController(props);

	field.onChange = (event: ChangeEvent<HTMLInputElement>) => {
		props.onChecked(event.target.checked);
	}

	return (
		<section className={`tds-text-field-container ${props.className ? props.className : ''}`}>
			<VSCodeCheckbox
				checked={field.value}
				{...field} >
				{props.textLabel}
			</VSCodeCheckbox>
		</section>
	)
}
