#include 'totvs.ch'
#include "tbiconn.ch"

#define SAY_ROW(x) (015 * (x))

#define SAY_COL 010
#define SAY_COL_2 (SAY_COL + 160)
#define GET_COL 080
#define GET_COL_2 (GET_COL + 160)

user function tbar()
	local aOption := {;
		{"Visual"     , { |aoParent| tbar_01(aoParent) }},;
		{"Events"     , { |aoParent| tbar_02(aoParent) }},;
		{"SimpleEdit" , { |aoParent| tbar_03(aoParent) }},;
		{"Custom"     , { |aoParent| tbar_04(aoParent) }},;
		}

	u_startRemoteLog("POC: TBar")

	u_selectTest("TBar", aOption)

	u_stopRemoteLog()
return

static function tbar_03(aoParent)
	local oGetFw
	local oDlg
	local lReadOnly := .F.

	define msdialog oDlg;
		title "TBAR: Simple Edit";
		from 000,000 to 200,300 ;
		pixel

	oGetFw := FWSimpEdit():New(05,05,0,0,"teste","teste",1,,,oDlg,lReadOnly)
	oGetFw:oPanel:Align := CONTROL_ALIGN_ALLCLIENT
	oGetFw:SetText("Teste")

	activate msdialog odlg;
		centered
return

static function tbar_04(aoParent)
	Local oDlgTst
	Local oBar
	Local oBtnCalc
	Local oBtnPar
	Local oBtnOk

	//prepare environment empresa "T1" filial "D MG 01"

	//Criando a janela
	oDlgTst := MsDialog():New(000,000,305,505, "TBAR: Custom",,,,,,,,,.T.)

	//Criando a barra de botões
	//DEFINE BUTTONBAR oBar SIZE 42,42 3D TOP OF oDlgTst
	oBar := TBar():New(oDlgTst, 42, 42,.T.,,,,.F. )

	//oBar:nHeight := 48

	//Criando botões pertencentes a barra de botões
	DEFINE BUTTON RESOURCE "S4WB005N" OF oBar ACTION NaoDisp() TOOLTIP "Recortarrrrrrrrrrrrrrrrr"
	DEFINE BUTTON RESOURCE "S4WB006N" OF oBar ACTION NaoDisp() TOOLTIP "Copiar"
	DEFINE BUTTON RESOURCE "S4WB007N" OF oBar ACTION NaoDisp() TOOLTIP "Colar"
	DEFINE BUTTON oBtnCalc RESOURCE "S4WB008N" OF oBar GROUP ACTION Calculadora() TOOLTIP "Calculadora"
	DEFINE BUTTON RESOURCE "S4WB009N" OF oBar ACTION Agenda() TOOLTIP "Agenda"
	DEFINE BUTTON RESOURCE "S4WB010N" OF oBar ACTION OurSpool() TOOLTIP "Spool"
	DEFINE BUTTON RESOURCE "S4WB016N" OF oBar GROUP ACTION HelProg() TOOLTIP "Ajuda"
	DEFINE BUTTON oBtnPar RESOURCE "PARAMETROS" OF oBar GROUP ACTION Sx1C020() TOOLTIP "Parâmetros"
	DEFINE BUTTON oBtnOk RESOURCE "FINAL" OF oBar GROUP ACTION oDlgTst:End() TOOLTIP "Sair"

//Definindo título de alguns botões
	oBtnCalc:cTitle := "Calc"
	oBtnPar:cTitle := "Param."

//Definindo clique com o botão direito
	oBar:bRClicked := {|| AllwaysTrue()}

	oDlgTst:lCentered := .T.
	oDlgTst:Activate()
return
