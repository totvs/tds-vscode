import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import "./header.css";

export interface IHeader {
	title: string;
}

export default function Header(props: IHeader) {

	return (
		<div className="header">
			<div className="logo">
				<img src="https://twitter.com/TOTVSDevelopers" alt="TOTVS S.A." />
			</div>
			<h1>{props.title}</h1>
		</div>
	);
}
