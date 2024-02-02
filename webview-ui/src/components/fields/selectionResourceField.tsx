import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useController, useFormContext } from "react-hook-form";
import PopupMessage from "../popup-message";
import { TdsFieldProps } from "../form";
import { TSendSelectResourceProps, sendSelectResource } from "../../utilities/common-command-webview";

type TdsSelectionResourceFieldProps = Omit<TdsFieldProps, "label"> & Omit<TSendSelectResourceProps, "label">;
type TdsSelectionFolderFieldProps = Omit<TdsSelectionResourceFieldProps, "model" | "canSelectMany" | "canSelectFiles" | "canSelectFolders" | "filters">;
type TdsSelectionFileFieldProps = Omit<TdsSelectionResourceFieldProps, "folders" | "files">;

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``AfterSelectResource`` em ``yourPanel extends TdsPanel<?>: panelListener(...)``
 *
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```

 * @param props
 *
 * @returns
 */
export function TdsSelectionResourceField(props: TdsSelectionResourceFieldProps): JSX.Element {
	const {
		register,
		getValues
	} = useFormContext();
	const { fieldState } = useController(props);

	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-selection-resource-field tds-label-field ${props.className ? props.className : ''}`}
		>
			<VSCodeButton
				onClick={() => {
					sendSelectResource(props.name, { ...props, model: getValues() });;
				}}
				{...registerField}
			>
				{props.openLabel}
				<PopupMessage field={{ ...props, label: props.openLabel }} fieldState={fieldState} />
			</VSCodeButton>
		</section>
	)
}

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``AfterSelectResource``em ``yourPanel extends TdsPanel<?>: panelListener(...)``
 *   na aplicação (_view_).
 *
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```
 *
 * @param props
 *
 * @returns
 */
export function TdsSelectionFolderField(props: Partial<TdsSelectionFolderFieldProps>): JSX.Element {
	const {
		getValues,
	} = useFormContext();

	return (<TdsSelectionResourceField
		name={props.name || "btnSelectionFolder"}
		title={props.title || "Select Folder"}
		canSelectFolders={true}
		canSelectFiles={false}
		canSelectMany={false}
		currentFolder={props.currentFolder || ""}
		openLabel={props.openLabel || "Select Folder"}
		filters={{}}
	/>)
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
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```
 *
 * @param props
 *
 * @returns
 */
export function TdsSelectionFileField(props: Partial<TdsSelectionFileFieldProps>): JSX.Element {

	return (<TdsSelectionResourceField
		name={props.name || "btnSelectionFile"}
		title={props.title || "Select File"}
		canSelectFolders={false}
		canSelectFiles={true}
		canSelectMany={props.canSelectMany || false}
		currentFolder={props.currentFolder || ""}
		openLabel={props.openLabel || "Select File"}
		filters={props.filters || {}}
	/>)
}