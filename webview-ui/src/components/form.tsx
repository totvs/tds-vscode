import { ButtonAppearance } from "@vscode/webview-ui-toolkit";
import "./form.css";
import { ChangeHandler, FieldValues, FormState, RegisterOptions, UseFormReturn, UseFormSetError, UseFormSetValue, useFormContext } from "react-hook-form";
import { VSCodeButton, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { sendClose } from "../utilities/common-command-webview";

export function getDefaultActionsForm(): IFormAction[] {
	return [
		{
			id: -1,
			caption: "Save",
			hint: "Salva as informações e fecha a página",
			appearance: "primary",
			type: "submit",
			isProcessRing: true,
			enabled: (isDirty: boolean, isValid: boolean) => {
				return isDirty && isValid;
			},
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
* Notas:
* - Usar _hook_ ``FormProvider`` antes de iniciar ``TDSForm``.
*   Esse _hook_ proverá informações para os elementos filhos e
*   fará a interface entre a aplicação e o formulário.
*
* - O tipo ``DataModel`` que complementa a definição de ``TDSFormProps``,
*   descreve a estrutura de dados do formulário. Normalmente,
*	você não precisa instanciar um objeto para armazenar os dados,
*   o _hook_ ``FormProvider`` proverá esse armazenamento e acesso aos dados,
*   através dos métodos ``getValues()``, ``setValues()``.
**/

type TDSFormProps<DataModel extends FieldValues> = {
	onSubmit: (data: any) => void;
	methods: UseFormReturn<DataModel>;
	actions?: IFormAction[];
	children: any
};

export interface IFormAction {
	id: number;
	caption: string;
	hint?: string;
	action?: any;
	enabled?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	visible?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	isProcessRing?: boolean
	type?: "submit" | "reset" | "button";
	appearance?: ButtonAppearance;
}

export type TdsFieldProps = {
	name: string;
	label: string;
	info?: string;
	readOnly?: boolean
	className?: string;
	rules?: RegisterOptions<FieldValues, string>;
	onChange?: ChangeHandler;
}

/**
 * Sets form values from a data model object.
 * Maps the data model object values to the form values by field name.
 * Handles undefined values to avoid errors.
 *
 * Passing ``setValue`` is necessary, as this function
 * is executed outside the form context.
*/
export function setDataModel<DataModel extends FieldValues>
	(setValue: UseFormSetValue<DataModel>, dataModel: Partial<DataModel>) {
	if (dataModel) {
		Object.keys(dataModel).forEach((fieldName: string) => {
			if (dataModel[fieldName] !== undefined) {
				setValue(fieldName as any, dataModel[fieldName]!);
			} else {
				console.error(`Erro chamar setValue no campo ${fieldName}`);
			}
		})
	} else {
		console.error("Parâmetro [DataModel] não informando (indefinido)");
	}
}

type TFieldError = {
	type: string;
	message?: string
};

type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

/**
 * Sets form field errors from an error model object.
 * Maps the error model object to field errors by field name.
 * Handles undefined error values to avoid errors.
 *
 * Passing ``setError`` is necessary, as this function
 * is executed outside the form context.
*
*/
export function setErrorModel<DataModel extends FieldValues>(setError: UseFormSetError<DataModel>, errorModel: TFieldErrors<DataModel>) {
	if (errorModel) {
		Object.keys(errorModel).forEach((fieldName: string) => {
			if (errorModel[fieldName] !== undefined) {
				setError(fieldName as any, {
					message: errorModel[fieldName]?.message,
					type: errorModel[fieldName]?.type
				})
			} else {
				console.error(`Erro ao chamar setError no campo ${fieldName}`);
			}
		});
	}
}

/**
 *
 * Se usar em _hook_ useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
let isProcessRing: boolean = false;

export function TdsForm<DataModel extends FieldValues>(props: TDSFormProps<DataModel>): JSX.Element {
	const {
		formState: { errors, isDirty, isValid, isSubmitting },
	} = useFormContext();

	let actions: IFormAction[] = props.actions ? props.actions : getDefaultActionsForm();

	if (isSubmitting) {
		isProcessRing = true;
	} else if (!isValid) {
		isProcessRing = false;
	}

	actions.forEach((action: IFormAction) => {
		action.isProcessRing = (action.isProcessRing !== undefined ? action.isProcessRing && isProcessRing : undefined)
	});

	return (
		<form onSubmit={props.methods.handleSubmit(props.onSubmit)}>
			<div className={"tds-form-content"}>
				{props.children}
			</div>
			<div className="tds-actions">
				<div className="tds-message">
					{errors.root && <span className={`tds-error`}>{errors.root.message}.</span>}
					{isProcessRing && <><VSCodeProgressRing /><span>Wait please. Processing...</span></>}
				</div>
				<div className="tds-buttons">
					{actions.map((action: IFormAction) => {
						let propsField: any = {};
						let visible: string = "";

						propsField["key"] = action.id;
						propsField["type"] = action.type || "button";

						if (isProcessRing) {
							propsField["disabled"] = true;
						} else if (action.enabled !== undefined) {
							if (typeof action.enabled === "function") {
								propsField["disabled"] = !(action.enabled as Function)(isDirty, isValid);
							} else {
								propsField["disabled"] = !action.enabled;
							}
						}

						if (action.appearance) {
							propsField["appearance"] = action.appearance;
						}

						if (action.action) {
							propsField["onClick"] = action.action;
						}

						if (action.visible !== undefined) {
							let isVisible: false;

							if (action.visible = typeof action.visible === "function") {
								isVisible = (Function)(action.visible)(isDirty, isValid)
							} else {
								isVisible = action.visible;
							}

							visible = isVisible ? "" : "tds-hidden";
							console.log(">>> %s = %s", propsField["type"], visible);
						}

						return (<VSCodeButton
							className={`tds-button-button ${visible}`}
							{...propsField} >
							{action.caption}
						</VSCodeButton>)
					})}
				</div>
			</div>
		</form >
	);
}

export { TdsCheckBoxField } from "./fields/checkBoxField";
export { TdsLabelField } from "./fields/labelField";
export { TdsNumericField } from "./fields/numericField";
export { TdsSelectionField } from "./fields/selectionField";
export { TdsSelectionFileField } from "./fields/selectionResourceField";
export { TdsSelectionFolderField } from "./fields/selectionResourceField";
export { TdsSimpleCheckBoxField } from "./fields/simpleCheckBoxField";
export { TdsTextField } from "./fields/textField";
export { TdsSimpleTextField } from "./fields/simpleTextField";
