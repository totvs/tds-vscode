import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsSimpleCheckBoxFieldProps = TdsFieldProps & {
	textLabel: string;

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
export function TdsSimpleCheckBoxField(props: TdsSimpleCheckBoxFieldProps): JSX.Element {
	const {
		register,
		setValue,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);

	const registerField = register(props.name, props.rules);
	const originalChange = registerField.onChange;
	registerField.onChange = (e) => {
		if (originalChange) {
			originalChange(e)
		}

		//const c = e.target as VSCodeCheckbox;
		setValue(registerField.name, e.target.checked ? "true" : "false");

		return e.target.checked;
	}

	return (
		<section
			className={`tds-field-container tds-simple-checkbox-field  ${props.className ? props.className : ''}`}
		>
			< VSCodeCheckbox
				readOnly={props.readOnly || false}
				{...registerField}
			>
				{props.textLabel}
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeCheckbox>
		</section>
	)
}