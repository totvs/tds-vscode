// import { vscode } from "../utilities/vscodeWrapper";
// import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

// import "./footer.css";

// export interface IFooter {
// 	linkToDoc?: string
// }

// export default function TdsFooter(props: IFooter) {
// 	const re: RegExp = /\[(.*)]\]?(.*)/g;
// 	let match: RegExpExecArray | null = re.exec(props.linkToDoc || "");
// 	let text: string;
// 	let href: string;

// 	if (match && match.length > 1) {
// 		text = match[1];
// 		href = "https://github.com/totvs/tds-vscode/blob/master/docs/" + match[2];
// 	} else {
// 		text = props.linkToDoc || "";
// 		href = props.linkToDoc || ""
// 	}

// 	return (
// 		<footer className="tds-footer">
// 			{props.linkToDoc && <VSCodeLink href={href}>{text}</VSCodeLink>}
// 		</footer>
// 	);
// }

import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import "./footer.css";
import React from "react";

export interface IFooter {
	//linkToDoc?: string
	children: any
}

export default function TdsFooter(props: IFooter) {
	// const re: RegExp = /\[(.*)]\]?(.*)/g;
	// let match: RegExpExecArray | null = re.exec(props.linkToDoc || "");
	// let text: string;
	// let href: string;

	// if (match && match.length > 1) {
	// 	text = "Help";  //match[1];
	// 	href = "https://github.com/totvs/tds-vscode/blob/master/docs/" + match[2];
	// } else {
	// 	text = props.linkToDoc || "";
	// 	href = props.linkToDoc || ""
	// }

	const children = React.Children.toArray(props.children);

	//{props.linkToDoc && <div className="tds-help-doc"><VSCodeLink href={href}>{text}</VSCodeLink></div>}
	return (
		<section className="tds-footer">
			{children.length > 0 && <>
				<div className="tds-logo">
					<img src="..\..\icons\totvs-32x32.png" alt="TOTVS S.A." />
				</div>
				<div className="tds-footer-content">
					{...children}
				</div>
			</>
			}
		</section>
	);
}
