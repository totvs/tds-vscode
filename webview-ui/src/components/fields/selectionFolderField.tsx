import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";
import { TSendSelectResourceProps, sendSelectResource } from "../../utilities/common-command-webview";

type TdsSelectionFolderFieldProps = TdsFieldProps & {
	dialogTitle: string;
	selectMany?: boolean
}

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``SELECTION_FOLDER``no painel e da mensagem ```SELECTED_FOLDER``
 *   na aplicação (_view_).
 *
 * @param props
 *
 * @returns
 */
export function TdsSelectionFolderField(props: TdsSelectionFolderFieldProps): JSX.Element {
	const {
		register,
		getValues,
		formState: { isDirty }
	} = useFormContext();
	const { field, fieldState } = useController(props);

	const registerField = register(props.name, props.rules);
	const label = props.label || "Select Folder";

	return (
		<section
			className={`tds-field-container tds-label-field ${props.className ? props.className : ''}`}
		>
			<VSCodeButton
				onClick={() => {
					const propSelectResource: TSendSelectResourceProps = {
						model: getValues(),
						folder: true,
						file: false,
						currentFolder: "",
						dialogTitle: props.dialogTitle,
						label: label,
						selectMany: props.selectMany || false
					}

					sendSelectResource(propSelectResource);
				}}
				{...registerField}
			>
				{label}
				<PopupMessage field={{ ...props, label: label }} fieldState={fieldState} />
			</VSCodeButton>
		</section>
	)
}