import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import "./form.css";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";

export interface IFormAction {
	id: number;
	caption: string;
	action?: any;
	enabled?: boolean;
	type?: "submit" | "reset" | "button";
	appearance?: ButtonAppearance;
}

export interface IFormaProps {
	actions?: IFormAction[];
	children: any
}

export default function TDSForm(props: IFormaProps & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
	let actions: IFormAction[] = props.actions || [];

	if (actions.length == 0) {
		actions = [
			{
				id: -1,
				caption: "Save/Close",
				appearance: "primary",
				type: "submit",
			},
			{
				id: -2,
				caption: "Save",
				appearance: "secondary",
				type: "submit",
			},
			{
				id: -3,
				caption: "Close",
				type: "button",
			}
		];
	}

	return (
		<form {...props}>
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
		</form>
	);
}
