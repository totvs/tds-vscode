import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

import "./popup-message.css";

export interface IPopupMessage {
	fieldName: string;
	message: string
}

export default function PopupMessage(props: IPopupMessage) {
	const mouseOver: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	const mouseOut: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	return (
		<span slot="end" className="tds-popup codicon codicon-info"
			onMouseOver={(event) => mouseOver(event)}
			onMouseOut={(event) => mouseOut(event)}
		>
			<span className="tds-popuptext" id={"popup_" + props.fieldName}>{props.message}.</span>
		</span>
	);
}
