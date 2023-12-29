import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./form.css";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";
import PopupMessage from "./popup-message";
import { FieldError, Form, FormProps, UseControllerProps, useController } from "react-hook-form";

export interface IFormAction {
	id: number;
	caption: string;
	hint?: string;
	action?: any;
	enabled?: boolean;
	type?: "submit" | "reset" | "button";
	appearance?: ButtonAppearance;
}

export interface IFormProps {
	actions?: IFormAction[];
	children: any
}

type TDSFieldProps =
	{
		label: string;
		info: string;
		options?: {
			value: string;
			text: string;
		}[]
	}

function buildMessage(props: any, error: FieldError | undefined): string {
	const { label, info } = props;
	let message: string = info || "";

	if (error) {
		if (error.type == "required") {
			message = `[${label}] is required`;
		} else {
			message = error.message || "<Unknown>"
		}
	}

	return message;
}

export function TDSSelectionField(props: UseControllerProps<any> & TDSFieldProps) {
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

export function TDSTextField(props: UseControllerProps<any> & TDSFieldProps) {
	const { field, fieldState } = useController(props);
	let message: string = buildMessage(props, fieldState.error);

	// console.log(">>>>> TDSTextField");
	// console.log(props.name);
	// console.dir(props);
	// <span>{fieldState.isDirty && "Dirty "}</span>
	// <span>{fieldState.invalid ? "invalid " : "valid"}</span>
	// <span>{fieldState.error?.type}</span>
	return (
		<section className="tds-text-field-container">
			<label htmlFor={props.name}>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField {...field} >
				<PopupMessage type={fieldState.invalid ? "error" : "info"} fieldName={props.name} message={message} />
			</VSCodeTextField>
		</section>
	)
}

export function TDSNumericField(props: UseControllerProps<any> & TDSFieldProps) {
	const { field, fieldState } = useController(props);
	let message: string = buildMessage(props, fieldState.error);

	// console.log(">>>>> TDSNumericField");
	// console.log(props.name);
	// console.dir(props);
	// <span>{fieldState.isDirty && "Dirty "}</span>
	// <span>{fieldState.invalid ? "invalid " : "valid"}</span>
	// <span>{fieldState.error?.type}</span>
	return (
		<section className="tds-numeric-field-container">
			<label htmlFor={props.name}>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField {...field} >
				<PopupMessage type={fieldState.invalid ? "error" : "info"} fieldName={props.name} message={message} />
			</VSCodeTextField>
		</section>
	)
}

export default function TDSForm(props: /*FormProps*/ any): JSX.Element {
	let actions: IFormAction[] = props.actions || [];

	if (actions.length == 0) {
		actions = [
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
				type: "submit",
			}
		];
	}

	return (
		<Form {...props}>
			<div className={"tds-form-content"}>
				{props.children}
			</div>
			<div className="tds-actions">
				{actions.map((action: IFormAction) => {
					const type: any = action.type || "button";

					if (action.appearance) {
						return <VSCodeButton type={type} key={action.id} appearance={action.appearance}>{action.caption}</VSCodeButton>
					} else {
						return <VSCodeButton type={type} key={action.id}>{action.caption}</VSCodeButton>
					}
				})}
			</div>
		</Form>
	);
}
