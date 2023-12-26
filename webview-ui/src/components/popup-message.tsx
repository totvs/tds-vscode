import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

import "./popup-message.css";

export interface IPopupMessage {
	id: string;
	message: string
}

export default function PopupMessage(props: IPopupMessage) {
	const mouseClick: React.MouseEventHandler<HTMLDivElement> = (event: any) => {
		var popup = document.getElementById("myPopup");
		popup!.classList.toggle("show");
	};

	//onMouseOver = {(event) => showInfoMessage(event, "Ajuda")

	return (
		<div className="popup" onClick={(event) => mouseClick(event)}>Click me!
			<span className="popuptext" id="myPopup">{props.message}.</span>
		</div>
	);
}
