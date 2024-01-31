import { useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form";
import PopupMessage from "../popup-message";
import { markdownToHtml } from "../../utilities/mdToHtml";
import { MarkdownString } from "vscode";

type TdsLabelFieldProps = TdsFieldProps & {
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
				<PopupMessage field={props} fieldState={fieldState} />
			</label>
		</section>
	)
}