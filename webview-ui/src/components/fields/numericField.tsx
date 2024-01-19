import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { IFormAction, TdsFieldProps } from "../form";
import { sendClose } from "../../utilities/common-command-webview";

type TdsNumericFieldProps = TdsFieldProps & {
	//onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
}

export function getDefaultActionsForm(): IFormAction[] {
	return [
		{
			id: -1,
			caption: "Save",
			hint: "Salva as informações e fecha a página",
			appearance: "primary",
			type: "submit",
			isProcessRing: true
		},
		{
			id: -2,
			caption: "Close",
			hint: "Fecha a página, sem salvar as informações",
			appearance: "secondary",
			action: () => {
				sendClose();
			},
		},
		{
			id: -3,
			caption: "Clear",
			hint: "Reinicia os campos do formulário",
			appearance: "secondary",
			type: "reset",
			visible: false
		}
	];
}

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * @param props
 *
 * @returns
 */
export function TdsNumericField(props: TdsNumericFieldProps): JSX.Element {
	const {
		register,
		setValue,
		formState: { isDirty }
	} = useFormContext();
	const rules = {
		...props.rules,
		valueAsNumber: true,
		pattern: {
			value: /\d+/gm,
			message: `[${props.label}] only accepts numbers`
		},
	};
	const { field, fieldState } = useController({ ...props, rules: rules });
	const registerField = register(props.name);

	return (
		<section
			className={`tds-field-container tds-numeric-field ${props.className ? props.className : ''}`}
		>
			<label
				htmlFor={field.name}
			>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField
				readOnly={props.readOnly || false}
				{...registerField}
			>
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeTextField>
		</section>
	)
}