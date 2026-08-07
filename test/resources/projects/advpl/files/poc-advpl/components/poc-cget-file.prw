#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

/*/{Protheus.doc} button
Presents a dialog with options to test different button functionalities.

@type function
@version 1.0.0
@author acandido
@author tatiane.matias (código original)
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/cGetFile
/*/
user Function cGetFile()
	local oDlg
	local cMascara := ""
	local aMascara := { ;
		'All Files|*.*|Text|*.txt',;
		'All Files (*.*)|Text(*.txt)',;
		'All Files|*.*|Text 1|*.txt|Text 2|*.txt|Text 3|*.txt|Text 4|*.txt|Text 5|*.txt';
		}
	local cTitulo := 'Textos (TXT)'
	local nMascpadrao := "001"
	local cDirinicial := padR("\", 50)
	local cSelectedFile := space(50)
	local nOptions := 0
	local bOptions := { || ;
		nOptions := 0,;
		nOptions += iif(lMultiselect, GETF_MULTISELECT, 0),;
		nOptions += iif(lNoChangeDir, GETF_NOCHANGEDIR, 0),;
		nOptions += iif(lLocalFloppy, GETF_LOCALFLOPPY, 0),;
		nOptions += iif(lLocalHard, GETF_LOCALHARD, 0),;
		nOptions += iif(lNetworkDriver, GETF_NETWORKDRIVE,0),;
		nOptions += iif(lShareAware, GETF_SHAREAWARE, 0),;
		nOptions += iif(lRetDirectory, GETF_RETDIRECTORY, 0),;
		nOptions += iif(lOnlyServer, GETF_ONLYSERVER, 0),;
		nOptions;
		}
	local oMascara
	local oTitulo
	local oMascPadrao
	local oDirinicial
	local oSelectedFile

	private lOpen := .T.
	private lMultiselect := .F.
	private lNoChangeDir := .F.
	private lLocalFloppy := .F.
	private lLocalHard := .F.
	private lNetworkDriver := .F.
	private lShareAware := .F.
	private lRetDirectory := .F.
	private lOnlyServer := .F.
	private lTree := .T.
	private lKeepCase := .F.

	u_startRemoteLog("cGetFile: Parameters")

	define dialog oDlg ;
		title "cGetFile: Parameters";
		from 180,180 to 600,750;
		pixel


	@SAY_ROW(1), SAY_COL say "Mask";
		of oDlg pixel
	// @SAY_ROW(1), GET_COL get oMascara;
		// 	var cMascara;
		// 	of oDlg PIXEL

	oMascara := TComboBox():New(SAY_ROW(1), GET_COL,{|u|if(PCount()>0,cMascara:=u,cMascara)},;
		aMascara,100,20,oDlg,,nil;
		,,,,.T.,,,,,,,,,'cMascara')

	@SAY_ROW(2), SAY_COL say "Titulo";
		of oDlg pixel
	@SAY_ROW(2), GET_COL get oTitulo;
		var cTitulo;
		of oDlg PIXEL

	@SAY_ROW(3), SAY_COL say "Default Mask";
		of oDlg pixel
	@SAY_ROW(3), GET_COL get oMascPadrao;
		var nMascpadrao;
		of oDlg PIXEL

	@SAY_ROW(4), SAY_COL say "Initial Path";
		of oDlg pixel
	@SAY_ROW(4), GET_COL get oDirinicial;
		var cDirinicial;
		of oDlg PIXEL

	bNewCheckBox("lOpen", SAY_ROW(5), SAY_COL, "lOpen", oDlg)

	bNewCheckBox("lMultiselect", SAY_ROW(6), SAY_COL, "lMultiselect", oDlg)

	bNewCheckBox("lTree", SAY_ROW(7), SAY_COL, "Show folder tree", oDlg)

	bNewCheckBox("lKeepCase", SAY_ROW(8), SAY_COL, "Keep case", oDlg)

	bNewCheckBox("lNoChangeDir", SAY_ROW(5), GET_COL, "GETF_NOCHANGEDIR", oDlg)

	bNewCheckBox("lLocalFloppy", SAY_ROW(6), GET_COL, "GETF_LOCALFLOPPY", oDlg)

	bNewCheckBox("lLocalHard", SAY_ROW(7), GET_COL, "GETF_LOCALHARD", oDlg)

	bNewCheckBox("lNetworkDriver", SAY_ROW(8), GET_COL, "GETF_NETWORKDRIVE", oDlg)

	bNewCheckBox("lShareAware", SAY_ROW(9), GET_COL, "GETF_SHAREAWARE", oDlg)

	bNewCheckBox("lRetDirectory", SAY_ROW(10), GET_COL, "GETF_RETDIRECTORY", oDlg)

	bNewCheckBox("lOnlyServer", SAY_ROW(11), GET_COL, "GETF_ONLYSERVER", oDlg)

	@SAY_ROW(13), SAY_COL say "Selected file";
		of oDlg pixel
	@SAY_ROW(13), GET_COL get oSelectedFile;
		var cSelectedFile;
		of oDlg PIXEL

	TButton():New( SAY_ROW(14), 110, "cGetFile",oDlg,{|| ;
		cSelectedFile := getfile(cMascara, cTitulo, val(nMascPadrao), cDirInicial, lOpen, eval(bOptions), lTree, lKeepCase);
		},40,10,,,.F.,.T.,.F.,,.F.,,,.F. )

	activate dialog oDlg centered

	u_stopRemoteLog()

return

static Function getfile(acMascara, acTitulo, anMascPadrao, acDirInicial, alOpen, anOptions, alTree, alKeepCase)
	local cResult := ""

	u_remoteLog("getFile: start: ",;
		{ ;
		{ "cMascara", acMascara},;
		{ "cTitulo", acTitulo},;
		{ "nMascPadrao", anMascPadrao},;
		{ "cDirInicial", acDirInicial},;
		{ "lOpen", alOpen},;
		{ "nOptions", anOptions},;
		{ "lTree", alTree},;
		{ "lKeepCase", alKeepCase};
		})

	cResult := cGetFile(acMascara, acTitulo, anMascpadrao, acDirinicial, alOpen, anOptions, alTree, alKeepCase )

	u_remoteLog("getFile: end: ", { { "cResult", cResult} });

return cResult

static function bNewCheckBox(varName, row, column, label, oParent)
	local oCheckBox := TCheckBox():New(row, column, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName
return oCheckBox;
