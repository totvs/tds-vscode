import { ControllerFieldState } from "react-hook-form";
import "./popup-message.css";
import { TdsFieldProps } from "./form";

export interface IPopupMessage {
	field: TdsFieldProps,
	fieldState: ControllerFieldState
}

function buildMessage(props: IPopupMessage): string {
	const { label, info } = props.field;
	const { error } = props.fieldState;
	let message: string = info || "";

	if (error) {
		if (error.type == "required") {
			message = `[${label}] is required.`;
		} else if (error.type == "min") {
			message = `[${label}] is not valid range (min value).`;
		} else if (error.type == "max") {
			message = `[${label}] is not valid range (max value).`;
		} else {
			message = error.message || `${error.type}<Unknown>`
		}
	}

	return message;
}

export default function PopupMessage(props: IPopupMessage): JSX.Element {
	const OFFSET_LEFT: number = 20;
	const OFFSET_TOP: number = 2;
	const type: string = props.fieldState.invalid ? "error" : "info";

	let message: string = buildMessage(props);

	const preparePopup: any = (event: any): HTMLSpanElement => {
		var popup = document.getElementById("popup_" + props.field.name) as HTMLElement;
		var parent = popup.parentElement!.parentElement as HTMLElement;

		if (parent) {
			popup.style.width = `${parent.clientWidth - OFFSET_LEFT}px`;
			popup.style.left = `${OFFSET_LEFT - parent.clientWidth}px`;
			popup.style.top = `${parent.offsetHeight - OFFSET_TOP}px`;
		}

		return popup;
	};

	const mouseOver: any = (event: any) => {
		const popup = preparePopup(event);

		popup.classList.toggle("show");
	};

	const mouseOut: any = (event: any) => {
		var popup = document.getElementById("popup_" + props.field.name) as HTMLElement;
		popup.classList.toggle("show");
	};

	return (
		(message.length > 0) ?
			<span slot="end" className={`tds-popup codicon codicon-${type} tds-${type}`}
				onMouseOver={(event) => mouseOver(event)}
				onMouseOut={(event) => mouseOut(event)}
			>
				<span className={`tds-popup-text tds-${type}`} id={"popup_" + props.field.name}>{message}.</span>
			</span>
			: <></>
	);
}
