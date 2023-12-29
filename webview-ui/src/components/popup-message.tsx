import "./popup-message.css";

export interface IPopupMessage {
	fieldName: string;
	message: string
	type?: "info" | "warning" | "error"
}

export default function PopupMessage(props: IPopupMessage): JSX.Element {
	const type = props.type || "info";

	const mouseOver: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	const mouseOut: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	return (
		<span slot="end" className={`tds-popup codicon codicon-${type} tds-${type}`}
			onMouseOver={(event) => mouseOver(event)}
			onMouseOut={(event) => mouseOut(event)}
		>
			<span className={`tds-popup-text tds-${type}`} id={"popup_" + props.fieldName}>{props.message}.</span>
		</span>
	);
}
