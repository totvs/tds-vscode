#include "totvs.ch"

user function tst5773()
	Local cToolTip:= 'cToolTip'
	Local cPrompt := 'cPrompt'
	local oTBar
	local oTBtnBmp1
	local oTBtnBmp2
	local oTBtnBmp3
	local oTBtnBmp4

	DEFINE DIALOG oDlg TITLE "DTCLIENT01-5773: TBar" FROM 180, 180 TO 550, 700 PIXEL

	oTBar := TBar():New( oDlg, 45, 72, .f.,,,, .F. )

	oTBtnBmp1 := TBtnBmp():NewBar( 'RPMNEW'   ,,,, '',	{ || Alert( 'TBtnBmp 01' ) };
		, .F., oTBar, .T.,;
		{ || .T. },cToolTip    , .F.,,, 1,cPrompt      ,,,, .T., )

	oTBtnBmp2 := TBtnBmp():NewBar( 'S4WB011N' ,,,, '', { || Alert( 'TBtnBmp 02' ) }, .F., oTBar, .T., { || .T. };
		,cToolTip    , .F.,,, 1,cPrompt      ,,,, .T., )

	oTBtnBmp3 := TBtnBmp():NewBar( 'BMPVISUAL',,,, '',;
		{ || Alert( 'TBtnBmp 03' ) };
		, .F., oTBar, .T.,;
		{ || .T. },cToolTip    , .F.,,, 1,cPrompt      ,,,, .T., )

	oTBtnBmp4 := TBtnBmp():NewBar( 'copyuser' ,,,, '', { || Alert( 'TBtnBmp 04' ) }, .F., oTBar, .T., { || .T. };
		,cToolTip    , .F.,,, 1,cPrompt      ,,,, .T., )

	//           tBtnBmp():newBar( 'S4WB011N' ,,,, '',
//{ || AxPesqui()            }
//,        , oTBar,        ,           ,'Pesquisar' ,        ,,,      ,'Pesquisar'  ,,,,     )
	ACTIVATE DIALOG oDlg CENTERED

return nil
