import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsTextFieldProps = TdsFieldProps & {
	//onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
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
export function TdsTextField(props: TdsTextFieldProps): JSX.Element {
	const {
		register,
		setValue,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);
	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-text-field ${props.className ? props.className : ''}`}
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