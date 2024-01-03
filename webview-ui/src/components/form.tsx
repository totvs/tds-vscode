import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import "./form.css";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";
import PopupMessage from "./popup-message";
import { FieldError, Form, FormProps, UseControllerProps, useController } from "react-hook-form";
import { sendClose } from "../utilities/common-command-webview";
import { error } from "console";

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

export default function TDSForm(props: /*FormProps*/ any): JSX.Element {
	//return <button disabled={!isDirty || !isValid} />;
	let actions: IFormAction[] = props.actions || [];
	console.log(">>>>> TDSForm");
	console.dir(props)
	// props.rules = {
	// 	...props.rules,
	// 	validate: {
	// 		value: /\d+/gm,
	// 		message: `[${props.label}] only accepts numbers`
	// 	}
	// };

	if (actions.length == 0) {
		actions = [
			{
				id: -1,
				caption: "Save",
				hint: "Salva as informações e fecha a página",
				appearance: "primary",
				type: "submit",
				enabled: props.isDirty && props.isValid
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
						console.log(">>>> BUTTONS");
						console.dir(propsField);

						return (<VSCodeButton {...propsField} >{action.caption}</VSCodeButton>)
					})}
				</div>
			</div>
		</Form >
	);
}
