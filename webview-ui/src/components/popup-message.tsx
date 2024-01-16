import "./popup-message.css";

export interface IPopupMessage {
	fieldName: string;
	message: string
	type?: "info" | "warning" | "error"
}

export default function PopupMessage(props: IPopupMessage): JSX.Element {
	const OFFSET_LEFT: number = 20;
	const OFFSET_TOP: number = 2;

	const type = props.type || "info";
	var activateClick: boolean = false;

	const prepareElement: any = (event: any): HTMLSpanElement => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		var parent = popup.parentElement!.parentElement as HTMLElement;

		if (parent) {
			popup.style.width = `${parent.clientWidth - OFFSET_LEFT}px`;
			popup.style.left = `${OFFSET_LEFT - parent.clientWidth}px`;
			popup.style.top = `${parent.offsetHeight - OFFSET_TOP}px`;
		}

		return popup;
	};

	const mouseOver: any = (event: any) => {
		if (!activateClick) {
			const popup = prepareElement(event);

			popup.classList.toggle("show");
		}
	};

	const mouseOut: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.fieldName) as HTMLElement;
		popup.classList.toggle("show");
	};

	const mouseClick: any = (event: any) => {
		const popup = prepareElement(event);

		popup.classList.toggle("show");
		activateClick = !activateClick;
	};

	//onClick={(event) => mouseClick(event)}
	return (
		<span slot="end" className={`tds-popup codicon codicon-${type} tds-${type}`}
			onMouseOver={(event) => mouseOver(event)}
			onMouseOut={(event) => mouseOut(event)}
		>
			<span className={`tds-popup-text tds-${type}`} id={"popup_" + props.fieldName}>{props.message}.</span>
		</span>
	);
}
