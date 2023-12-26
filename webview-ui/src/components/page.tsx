import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import "./page.css";
import Header from "./header";
import Footer from "./footer";

export interface IPageView {
	title: string;
	linkToDoc?: string
	children: any
}

export default function Page(props: IPageView) {

	return (
		<>
			<Header title={props.title} />
			<div className="content">
				{props.children}
			</div>
			<Footer linkToDoc={props.linkToDoc} />
		</>
	);
}
