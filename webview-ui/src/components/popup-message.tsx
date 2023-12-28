import "./popup-message.css";

export interface IPopupMessage {
	fieldName: string;
	message: string
}

function PopupMessage(type: "info" | "warning" | "error", props: IPopupMessage): JSX.Element {
	const mouseOver: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	const mouseOut: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	return (
		<span slot="end" className={`tds-popup codicon codicon-${type}`}
			onMouseOver={(event) => mouseOver(event)}
			onMouseOut={(event) => mouseOut(event)}
		>
			<span className="tds-popuptext" id={"popup_" + props.fieldName}>{props.message}.</span>
		</span>
	);
}

export function PopupInfo(props: IPopupMessage): JSX.Element {
	return PopupMessage("info", props);
}

export function PopupError(props: IPopupMessage): JSX.Element {
	return PopupMessage("error", props);
}

export function PopupWarning(props: IPopupMessage): JSX.Element {
	return PopupMessage("warning", props);
}