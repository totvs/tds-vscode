import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

import "./footer.css";

export interface IFooter {
	linkToDoc?: string
}

export default function Footer(props: IFooter) {
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
		<footer className="tds-footer">
			{props.linkToDoc && <VSCodeLink href={href}>{text}</VSCodeLink>}
		</footer>
	);
}
