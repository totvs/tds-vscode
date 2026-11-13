#include "protheus.ch"
#include "tbiconn.ch"
#include "tbiconn.ch"

#define SAY_ROW(x) (015 * (x))

#define SAY_COL 010
#define SAY_COL_2 (SAY_COL + 160)
#define GET_COL 080

//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-6985
//Campos Memos Virtuais n?o est?o gravando com quebra de linha no Banco de dados ao atulizar para Webapp 10.1.5
user function tst6985()
	local aOption := {;
		{"Memo/Multiline" , { |aoParent| memo_01(aoParent) }},;
		{"With enchoice" , { |aoParent| memo_02() }},;
		}

	u_startRemoteLog("DTCLIENT01-6985: Campos Memos Virtuais n?o est?o gravando com quebra de linha no Banco de dados")

	prepare environment empresa "T1" filial "D MG 01"

	u_selectTest("DTCLIENT01-6985", aOption)

	u_stopRemoteLog()
return

static function memo_01(aoParent)
	local oGet8 := nil
	local cMultiLine := "Line 1" + CRLF + "Line 2" + CRLF + "Line 3"
	local cPlainText := ""
	local oUseVirtual
	local lUseVirtual := .t.
	local oSYP
	local cSYP := ""
	local oSaveBtn
	//local oDlg

	// define dialog oDlg ;
		// 	title "Memo";
		// 	from 180,180 to 600,750;
		// 	pixel
	// aoParent := oDlg

	@SAY_ROW(1), SAY_COL say "Multiline";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet8;
		var cMultiLine;
		size 80,50;
		multiline;
		of aoParent pixel
	oGet8:cName := "cMultiLine"
	oGet8:cReadVar := "cMultiLine"
	u_controlEvents(oGet8)

	@SAY_ROW(1), SAY_COL_2 checkbox oUseVirtual;
		var lUseVirtual;
		prompt "Use virtual memo (SYP)";
		size 80,50;
		of aoParent pixel
	oUseVirtual:cName := "lUseVirtual"
	oUseVirtual:cReadVar := "lUseVirtual"

	@SAY_ROW(5), SAY_COL say "Plain Text";
		of aoParent pixel
	@SAY_ROW(5), GET_COL say oSay;
		prompt  cPlainText;
		size 160,50;
		of aoParent pixel
	oSay:cName := "cPlainText"
	oSay:cReadVar := "cPlainText"

	@SAY_ROW(8), SAY_COL say "SYP";
		of aoParent pixel
	@SAY_ROW(8), GET_COL say oSYP;
		prompt cSYP;
		size 160,50;
		of aoParent pixel
	oSYP:cName := "cSYP"
	oSYP:cReadVar := "cSYP"

	@SAY_ROW(11), SAY_COL say "Press Ctrl+S to save without changing focus";
		of aoParent pixel
	//u_firedEvent(aoParent, " K_CTRL_S triggered"),;
		setKey(K_CTRL_S, {||;
		writeMemo(lUseVirtual, cMultiLine), ;
		cPlainText := readMemo(lUseVirtual, cMultiLine),;
		cSYP := readSYP(lUseVirtual);
		})

	//u_firedEvent(oSaveBtn, " onClick"),;
		@SAY_ROW(12), SAY_COL button oSaveBtn;
		prompt "Save";
		action {||;
		writeMemo(lUseVirtual, cMultiLine), ;
		cPlainText := readMemo(lUseVirtual, cMultiLine),;
		cSYP := readSYP(lUseVirtual),;
		};
		of aoParent pixel
	//	oDlg:commitControls();

	@SAY_ROW(12), GET_COL say "Do not browse the fields. Press the 'Save' button directly to update.";
		of aoParent pixel

	//activate dialog oDlg centered
Return

static function writeMemo(alUseVirtual, acText)
	Local aArea := FWGetArea()
	Local cCodigo := "COM00000000000000000000000011" //chumbado com base em dados de SYP da base congelada
	Local cObservacao := ""
	Local nTamObserv := TamSX3("B1_OBS")[1]

	if !alUseVirtual
		return
	endif

	DbSelectArea("SB1")
	SB1->(DbSetOrder(1)) // Filial + Código

	If SB1->(MsSeek(FWxFilial("SB1") + cCodigo))
		cObservacao := "" //MSMM(SB1->B1_CODOBS, nTamObserv)
		MSMM(SB1->B1_CODOBS, nTamObserv, , , 2) //, , , "SB1", "B1_CODOBS") //limpa registros anteriores

		cObservacao := Alltrim(cObservacao) + ";editado no dia " + dToC(Date()) + " as " + Time() + ";"
		cObservacao += CRLF + acText

		RecLock("SB1", .F.)
		MSMM(, nTamObserv, , cObservacao, 1, , , "SB1", "B1_CODOBS")
		SB1->(MsUnlock())
	EndIf

	FWRestArea(aArea)

return

static function readMemo(alUseVirtual, acText)
	Local aArea := FWGetArea()
	Local cCodigo := "COM00000000000000000000000011" //chumbado com base em dados de SYP da base congelada
	Local nTamObserv := TamSX3("B1_OBS")[1]
	local cResult := acText

	if alUseVirtual
		DbSelectArea("SB1")
		SB1->(DbSetOrder(1)) // Filial + Código

		If SB1->(MsSeek(FWxFilial("SB1") + cCodigo))
			cResult := MSMM(SB1->B1_CODOBS, nTamObserv)
		EndIf

		FWRestArea(aArea)
	endif

	cResult := StrTran(cResult, CRLF, "\r\n" )

return cResult

static function readSYP(alUseVirtual)
	Local aArea := FWGetArea()
	Local cCodigo := "COM00000000000000000000000011" //chumbado com base em dados de SYP da base congelada
	local cResult := "<not using virtual memo>"

	if alUseVirtual
		cResult := ""
		DbSelectArea("SB1")
		SB1->(DbSetOrder(1)) // Filial + Código

		If SB1->(MsSeek(FWxFilial("SB1") + cCodigo))
			SYP->(dbGoTop())

			while SYP->(!eof())
				if SYP->YP_CHAVE == SB1->B1_CODOBS
					cResult += SYP->YP_TEXTO
				endif

				SYP->(dbSkip())
			enddo
		EndIf

		FWRestArea(aArea)
	EndIf

return cResult


static function memo_02()
	Local oPanel as object
	Local oGet1
	Local oFont
	Local oDlg as object

	Private cGet1 := "abcd" + chr(13)+chr(10) + "efgh" // Variavel do tipo caracter

	oDlg = MsDialog():New( 0, 0, 300, 300, ProcName(),,,.F.,,,,,,.T.,, ,.F. )

	oFont := TFont():New("Courier New",0,-12,, .F. ,,,, .F. , .F. )

	oPanel := TPanel():New( 030, 010,,,,.F.,.F.,,, 100, 100,.F.,.F. )

	oGet1 := TMultiGet():New( 030, 010, { | u | If( PCount() == 0, cGet1, cGet1 := u ) },oPanel, 100, 100, oFont,.F.,,,,.T.,,.F.,,.F.,.F.,.F.,,,.F.,, )
	oGet1:cName := "cGet1"
	oGet1:cReadVar := "cGet1"
	oGet1:Align := 5

	u_controlEvents(oGet1)

	TSay():New(130,10,{||"Campo texto"},oDlg,,,,,, .T. ,,,,)
	TButton():New( 130, 60, "Varinfo",oDlg,{|| btn1(cGet1, oDlg) },50,10,,, .F. , .T. , .F. ,, .F. ,,, .F.  )

	oDlg:Activate(,,,.T.,,,{|Self|EnchoiceBar(oDlg,{||btn1(cGet1, oDlg)},{||oDlg:End()})},,)

Return

//-------------------------------------------------------------------
/*/{Protheus.doc} btn1
    descricao
@author Caio Lima
@since 24/11/2025
//-----------------------------------------------------------------*/
static function btn1(cGet1, oDlg)
	local _aVarI := {}
	local cVarInfo := ""

    oDlg:CommitControls()

    _aVarI := {I18N("chr(13) is contained? #1",{chr(13) $ cGet1})}
    Aadd(_aVarI, I18N("chr(10) is contained? #1",{chr(10) $ cGet1}) )
    Aadd(_aVarI, I18N("chr(13)+10 is contained? #1",{chr(13)+chr(10) $ cGet1}) )

    Aadd(_aVarI, I18N("chr(13) At? #1",{At(chr(13), cGet1)}) )
    Aadd(_aVarI, I18N("chr(10) At? #1",{At(chr(10), cGet1)}) )
    Aadd(_aVarI, I18N("chr(13)+10 At? #1",{At(chr(13)+chr(10), cGet1)}) )

	cVarInfo := VarInfo('_aVarI', _aVarI)
	u_remoteLog("Memo Data", {;
	 { "cGet1", cGet1 };
	  })

	u_remoteLog("Memo VarInfo", {;
	 { "varInfo", cVarInfo};
	  })
Return
