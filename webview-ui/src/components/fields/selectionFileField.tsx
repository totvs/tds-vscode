import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { FieldValues, RegisterOptions, useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";

type TdsSelectionFileFieldProps = TdsFieldProps & {
	onSelect: (file: string[]) => any;

	//onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
}

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``SELECTION_FILE``no painel e da mensagem ```SELECTED_FILE``
 *   na aplicação (_view_).
 *
 * @param props
 *
 * @returns
 */
export function TdsSelectionFileField(props: TdsSelectionFileFieldProps): JSX.Element {
	const {
		register,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);

	const registerField = register(props.name, props.rules);
	const label = props.label || "Select File";

	return (
		<section
			className={`tds-field-container tds-selection-field ${props.className ? props.className : ''}`}
		>
			<VSCodeButton
				onClick={() => {
					alert("TODO: Implementar a seleção de arquivos");
				}}
				{...registerField}
			>
				Select Folder
				<PopupMessage field={{ ...props, label: label }} fieldState={fieldState} />
			</VSCodeButton>
		</section>
	)
}