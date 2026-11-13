#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

/*/{Protheus.doc} TFileDialog
Presents a dialog with options to test different TFileDialog functionalities.

@type function
@version 1.0.0
@author acandido
@author tatiane.matias (código original)
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/????????????? (não localizado)
/*/
User Function TFileDialog()
	local oDlg
	local cMascara := ""
	local aMascara := { ;
		'All Files|*.*|Text|*.txt|Zip|*.zip',;
		'All Files (*.*)|Text(*.txt)|ZIP(*.zip)',;
		'All Files|*.*|Text 1|*.txt|Text 2|*.txt|Text 3|*.txt|Text 4|*.txt|Text 5|*.txt';
		}
	local cTitulo := 'Select: '
	local cDirInicial := padR(getTempPath(), 50)

	local nOptions := 0
	local bOptions := { || ;
		nOptions := 0,;
		nOptions += iif(lMultiSelect, GETF_MULTISELECT, 0),;
		nOptions += iif(lRetDirectory, GETF_RETDIRECTORY, 0),;
		nOptions;
		}

	local oMascara
	local oTitulo
	local oDirinicial
	local oSelection

	private lMultiSelect := .f.
	private lRetDirectory := .f.
	private lFolder := .f.
	private lSave := .f.
	private cSelection := space(50)

	u_startRemoteLog("TFileDialog: Parameters")

	define dialog oDlg TITLE "TFileDialog: Parameters" FROM 180,180 TO 550,700 PIXEL

	@SAY_ROW(1), SAY_COL say "Mask";
		of oDlg pixel
	oMascara := TComboBox():New(SAY_ROW(1), GET_COL,{|u|if(PCount()>0,cMascara:=u,cMascara)},;
		aMascara,100,20,oDlg,,nil;
		,,,,.T.,,,,,,,,,'cMascara')

	@SAY_ROW(2), SAY_COL say "Title";
		of oDlg pixel
	@SAY_ROW(2), GET_COL get oTitulo;
		var cTitulo;
		of oDlg PIXEL

	@SAY_ROW(3), SAY_COL say "Initial Path";
		of oDlg pixel
	@SAY_ROW(3), GET_COL get oDirinicial;
		var cDirInicial;
		of oDlg PIXEL

	@SAY_ROW(9), SAY_COL say "Selection";
		of oDlg pixel
	@SAY_ROW(9), GET_COL get oSelection;
		var cSelection;
		readonly;
		of oDlg PIXEL

	bNewCheckBox("lMultiSelect", SAY_ROW(4), SAY_COL, "GETF_MULTISELECT", oDlg)

	bNewCheckBox("lFolder", SAY_ROW(5), SAY_COL, "GETF_RETDIRECTORY", oDlg)

	bNewCheckBox("lSave", SAY_ROW(6), SAY_COL, "lSave", oDlg)

	TButton():New( 172, 110, "TFileDialog",oDlg,{|| ;
		getfile(cMascara, ;
		cTitulo + iif(lSave, " SAVE", " OPEN"), ;
		cDirInicial, lSave, eval(bOptions, nOptions));
		},40,10,,,.F.,.T.,.F.,,.F.,,,.F. )

	activate dialog oDlg centered

	u_stopRemoteLog()

return

static Function getfile(acMascara, acTitulo, acDirInicial, alSave, anOptions)
	Local cArqSel := ""
	acMascara := allTrim(acMascara)

	u_remoteLog("getFile: start: ",;
		{acMascara,;
		acTitulo,;
		acDirInicial,;
		cValToChar(alSave),;
		cValToChar(anOptions);
		})

	cArqSel := tFileDialog(;
		acMascara,;
		acTitulo,;
		nil,;
		acDirInicial,;
		alSave,;
		anOptions;
		)

	if !empty(cArqSel)
		cSelection := cArqSel
	else
		cSelection := "<not selected file/folder>"
	endIf

	u_remoteLog("getFile: end: " + cSelection)

return

static function bNewCheckBox(varName, row, column, label, oParent)
	local oCheckBox := TCheckBox():New(row, column, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName
return oCheckBox
