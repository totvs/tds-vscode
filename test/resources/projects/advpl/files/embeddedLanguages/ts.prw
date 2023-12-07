#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function ts()
	local myVar := ;
		"Variavel preenchida manualmente via ADVPL"
	local cCode


	beginContent var cCode as TS
import {
  DocumentFormattingEditProvider,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  ProviderResult,
  TextEdit,
} from "vscode";

const myVar: string = %Exp:myVar%
	endContent

return myVar
