#include "protheus.ch"

#define SAY_ROW(x) (015 * (x))
#define GET_COL 080

#define SAY_COL 010

// Função principal
User Function tst5741()
	Private oBtAdd
	Private oGContador
	Private oReadOnly
	Private nGContador := 0
	private lReadOnly := .t.

	DEFINE MSDIALOG oDlg TITLE "DTCLIENT01-5741: Contador...";
		FROM 000, 000 TO 200, 350 pixel

	@ SAY_ROW(1), SAY_COL say "Plain text: [" + cValToChar(nGContador) + "]" pixel

	@ SAY_ROW(2), SAY_COL say "Read Only";
		of oDlg;
		pixel
	@ SAY_ROW(2), GET_COL MSGET oGContador VAR nGContador SIZE 060, 010 READONLY PIXEL
	@ SAY_ROW(2), GET_COL + 70 CHECKBOX oReadOnly;
		VAR  lReadOnly;
		PROMPT "RO";
		SIZE 060, 010;
		ON CLICK { || conout(">>> click RO", lReadOnly), oGContador:lReadOnly := lReadOnly, oGContador:Refresh() };
		of oDlg;
		pixel

	@ SAY_ROW(3), SAY_COL say "Normal" ;
		of oDlg;
		pixel

	@ SAY_ROW(3), GET_COL MSGET oGador2 ;
		VAR nGContador ;
		SIZE 060, 010;
		of oDlg;
		pixel

	@ SAY_ROW(5), SAY_COL BUTTON oBtAdd ;
		PROMPT "+1" ;
		SIZE 030, 012 ;
		ACTION addContador(1);
		of oDlg;
		pixel
	@ SAY_ROW(5), SAY_COL + 35 BUTTON oBtAdd2 ;
		PROMPT "+10" ;
		SIZE 030, 012 ;
		ACTION addContador(10);
		of oDlg;
		pixel
	@ SAY_ROW(5), SAY_COL + 70 BUTTON oBtAdd2 ;
		PROMPT "+50" ;
		SIZE 030, 012 ;
		ACTION addContador(50);
		of oDlg;
		pixel

	ACTIVATE MSDIALOG oDlg CENTERED

Return .T.


Static Function addContador(qtde)
	nGContador += qtde
	oGContador:Refresh()
Return .T.
