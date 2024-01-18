import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsSimpleTextFieldProps = Omit<TdsFieldProps, "label"> & {
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
export function TdsSimpleTextField(props: TdsSimpleTextFieldProps): JSX.Element {
	const {
		register,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);

	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-simple-text-field ${props.className ? props.className : ''}`}
		>
			<VSCodeTextField
				readOnly={props.readOnly || false}
				{...registerField}
			>
				<PopupMessage field={{...props, label: ""}} fieldState={fieldState} />
			</VSCodeTextField>
		</section>
	)
}