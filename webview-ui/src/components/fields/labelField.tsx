import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { FieldValues, RegisterOptions, useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsLabelFieldProps = TdsFieldProps & {
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
export function TdsLabelField(props: TdsLabelFieldProps): JSX.Element {
	const {
		register,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);

	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-label-field ${props.className ? props.className : ''}`}
		>
			<label
				{...registerField}
			>
				{props.label}
			</label>
		</section>
	)
}