import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { ChangeHandler, useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsSelectionFieldProps = TdsFieldProps & {
	options?: {
		value: string;
		text: string;
	}[]
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
export function TdsSelectionField(props: TdsSelectionFieldProps): JSX.Element {
	const {
		register,
		getValues,
		setValue,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);
	const registerField = register(props.name, props.rules);
	const options = props.options || [];
	const currentValue: string = getValues(props.name);

	return (
		<section
			className={`tds-field-container tds-selection-field ${props.className ? props.className : ''}`}
		>
			<label
				htmlFor={field.name}
			>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeDropdown
				{...registerField}
			>
				{options.map(({ value, text }, index) => {
					return (
						<VSCodeOption key={index} value={value} checked={currentValue === value}>{text}</VSCodeOption>
					)
				})}
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeDropdown>
		</section>
	)
}