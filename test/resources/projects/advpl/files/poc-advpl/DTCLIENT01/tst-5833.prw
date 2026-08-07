#include "protheus.ch"

#define SAY_COL 010
#define GET_COL 90
#define SAY_ROW(x) (015 * (x))

// Função principal
user Function tst5833()
	// local aOption := {;
		// 	{"Create", "tst5833_01" }, ;
		// 	{"Append", "tst5833_02" },;
		// 	{"Open", "tst5833_03" },;
		// 	}

	// u_selectTest("TDialog", aOption)

	u_tst5833_01()
return

user Function tst5833_01(aoParent)
	local oTextBtn
	local oLocal
	local oCreate
	local oOpen
	local oAppend
	local oRead
	local oClose
	local oKBytes

	private oWrite
	private oDlg
	private lLocal := .F.
	private lCreate := .F.
	private lOpen := .F.
	private lAppend := .F.
	private lRead := .F.
	private lWrite := .F.
	private lClose := .F.
	private nKBytes := 100
	private cLocal := "Marque para execução local"
	private cCreate := ""
	private cOpen := ""
	private cAppend := ""
	private cRead := ""
	private cWrite := ""
	private cClose := ""

	u_startRemoteLog("DTCLIENT01-5353: File operations")

	resetDialog()
	//oDlg := aoParent
	define dialog oDlg title "DTCLIENT01-5833" from 180,180 to 550,700 pixel

	@SAY_ROW(1), SAY_COL say "Manipulação de arquivos" pixel

	@SAY_ROW(2), SAY_COL say "Tamanho arquivos (KB)" pixel
	@SAY_ROW(2), GET_COL get oKBytes var nKBytes size 120, 10 picture "@E 9,999" of oDlg pixel

	bNewCheckBox("lLocal", SAY_ROW(3), SAY_COL, "Local Execution", oDlg, {||})
	@SAY_ROW(3), GET_COL get oLocal var cLocal when .f. of oDlg pixel

	bNewCheckBox("lCreate", SAY_ROW(4), SAY_COL, "FCreate", oDlg, { || ;
		lOpen := .f.,;
		lAppend := .f.,;
		lWrite := .t.,;
		lClose := .t.;
		})
	@SAY_ROW(4), GET_COL get oCreate var cCreate when .f. of oDlg pixel

	bNewCheckBox("lOpen", SAY_ROW(5), SAY_COL, "FOpen", oDlg, { || ;
		lCreate := .f.,;
		lAppend := .f.,;
		lWrite := .t.,;
		lClose := .t.;
		})
	@SAY_ROW(5), GET_COL get oOpen var cOpen when .f. of oDlg pixel

	bNewCheckBox("lAppend", SAY_ROW(6), SAY_COL, "FAppend", oDlg, { || ;
		lOpen := .f.,;
		lCreate := .f.,;
		lWrite := .t.,;
		lClose := .t.;
		})
	@SAY_ROW(6), GET_COL get oAppend var cAppend when .f. of oDlg pixel

	bNewCheckBox("lRead", SAY_ROW(7), SAY_COL, "FRead", oDlg, {||})
	@SAY_ROW(7), GET_COL get oRead var cRead when .f. of oDlg pixel

	bNewCheckBox("lWrite", SAY_ROW(8), SAY_COL, "FWrite", oDlg, {||})
	@SAY_ROW(8), GET_COL get oWrite var cWrite when .f. of oDlg pixel

	bNewCheckBox("lClose", SAY_ROW(9), SAY_COL, "FClose", oDlg, {|| .f.})
	@SAY_ROW(9), GET_COL get oClose var cClose when .f. of oDlg pixel

	@ SAY_ROW(11), SAY_COL button oTextBtn;
		prompt "Start";
		action {|| ;
		oTextBtn:lProcessing := .T.,;
		resetDialog(),;
		startProcess(),;
		oTextBtn:lProcessing := .F.,;
		};
		of oDlg pixel

	activate dialog oDlg centered

	conout(">>>> [" + procname(1) + "] Dialog finished")

	u_stopRemoteLog()

	conout(">>>> [" + procname(1) + "] Remote log finished")

Return

static function bNewCheckBox(varName, row, column, label, oParent, bChange)
	local oCheckBox := TCheckBox():New(row, column, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName
	oCheckBox:bChange := bChange

return oCheckBox

static function resetDialog()
	cCreate := space(30)
	cOpen := space(30)
	cAppend := space(30)
	cRead := space(30)
	cWrite := space(30)
	cClose := space(30)
return

static function startProcess()
	local cFile := iif(lLocal, "c:\temp\tst-5833.txt", "\tst-5833.txt")
	local nHdl := -1
	local nBytes

	if lCreate
		cCreate := iif(lLocal, "Creating Local File", "Creating Remote File")
		oDlg:ctrlRefresh()

		u_remoteLog("startProcess:FCreate:start " + cValToChar(cCreate))
		u_startChrono("FCreate")

		nHdl := FCreate(cFile)
		if nHdl < 1
			cCreate := "FError: " + str(ferror())
			oDlg:ctrlRefresh()
			return
		endif

		cCreate := "Created file. File: " + cFile + u_stopChrono("FCreate")
		oDlg:ctrlRefresh()
	endif

	if lOpen
		u_startChrono("FOpen")

		cOpen := iif(lLocal, "Openning Local File", "Openning Remote File")
		oDlg:ctrlRefresh()

		nHdl := FOpen(cFile)
		if nHdl < 1
			cCreate := "FError: " + str(ferror())
			oDlg:ctrlRefresh()
			return
		endif

		cCreate := "Openned file. File: " + cFile + u_stopChrono("FCreate")
		oDlg:ctrlRefresh()
	endif

	if lRead
		u_startChrono("FRead")

		nBytes := readFile(nHdl)
		cRead := "Read " + transform(nBytes, "@E 99,999,999,999") + " bytes" + u_stopChrono("FRead")
	endif

	if lWrite
		u_startChrono("FWrite")

		nBytes := writeFile("Create", nHdl)
		cWrite := "Recorded " + transform(nBytes, "@E 99,999,999,999") + " bytes" + u_stopChrono("FWrite")

	endif

	cClose := "Closing  File"
	oDlg:ctrlRefresh()

	u_startChrono("FClose")

	if !FClose(nHdl)
		cClose := "FError: " + str(ferror())
	else
		cClose := "Closed file " + u_stopChrono("FClose")
	endif

return

static function writeFile(acOperation, anHdl)
	local i,j
	local nBytes := 0

	lWrite := .t.

	nBytes += bWrite(anHdl,  "Operation: ")
	nBytes += bWrite(anHdl,  acOperation)
	nBytes += bWrite(anHdl,  CRLF)

	cBuffer := ""
	while len(cBuffer) < 1024
		for i := asc("0") to asc("Z")
			cBuffer += chr(i)
		next
	end
	cBuffer := left(cBuffer, 1024)

	for j := 1 to nKBytes
		for i := 1 to 1024
			nBytes += bWrite(anHdl,  strZero(i,4))
			nBytes += bWrite(anHdl,  ": ")
			nBytes += bWrite(anHdl,  cBuffer)
			nBytes += bWrite(anHdl,  CRLF)
		next

		cWrite := "Recorded " + transform(nBytes, "@E 99,999,999,999") + " bytes"
		oWrite:refresh()

		conout(cWrite)
	next

return nBytes

static function bWrite(anHdl,  data)
	local nBytes

	cWrite := ""
	oDlg:ctrlRefresh()

	nBytes := FWrite(anHdl, data, len(data))
	cWrite := iif(nBytes != len(data), " FError: " + str(ferror()), "Recorded "+strZero(nBytes, 4)+" bytes")
	oDlg:ctrlRefresh()

return nBytes

static function readFile(anHdl)
	local nBytes := 0
	local cBuffer := space(1024)
	local nLidos := 0

	while (nLidos := FRead(anHdl, @cBuffer, 1024))
		nBytes += nLidos

		conout("Read " + str(nBytes))
	end

return nBytes
