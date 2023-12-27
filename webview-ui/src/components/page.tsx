import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import "./page.css";
import Header from "./header";
import Footer from "./footer";
import { ButtonAppearance } from "@vscode/webview-ui-toolkit";

export interface IPageAction {
	id: number;
	caption: string;
	action: any;
	enabled?: boolean;
	appearance?: ButtonAppearance;
}

export interface IPageView {
	title: string;
	linkToDoc?: string
	actions: IPageAction[];
	children: any
}

export default function Page(props: IPageView) {

	return (
		<>
			<Header title={props.title} />
			<div className="tds-content">
				{props.children}
			</div>
			<div className="tds-actions">
				{props.actions.map((action: IPageAction) => {
					if (action.appearance) {
						return <VSCodeButton key={action.id} appearance={action.appearance}>{action.caption}</VSCodeButton>
					} else {
						return <VSCodeButton key={action.id}>{action.caption}</VSCodeButton>
					}
				})}
			</div>
			<Footer linkToDoc={props.linkToDoc} />
		</>
	);
}
