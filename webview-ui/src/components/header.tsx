import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

import "./header.css";

export interface IHeader {
	title: string;
	linkToDoc?: string
}

export default function Header(props: IHeader) {
	const re: RegExp = /\[(.*)]\]?(.*)/g;
	let match: RegExpExecArray | null = re.exec(props.linkToDoc || "");
	let text: string;
	let href: string;

	if (match && match.length > 1) {
		text = match[1];
		href = "https://github.com/totvs/tds-vscode/blob/master/docs/" + match[2];
	} else {
		text = props.linkToDoc || "";
		href = props.linkToDoc || ""
	}

	return (
		<div className="tds-header">
			<div className="tds-logo">
				<img src="..\..\icons\totvs-32x32.png" alt="TOTVS S.A." />
			</div>
			<h1>{props.title}</h1>
			{props.linkToDoc && <div className="tds-help-doc"><VSCodeLink href={href}>{text}</VSCodeLink></div>}
		</div>
	);
}
