// Non-functional sources. For testing purposes only.

#include "protheus.ch"

/*/{Protheus.doc} SayGetMinimal
Comandos @ ..SAY e @ ..GET apenas com os parametros minimos (linha, coluna e
texto/variavel), com e sem o objeto (PROMPT / VAR).
@type user function
/*/
User Function SayGetMinimal()
	Local oDlg
	Local oSay
	Local oGet
	Local cName := Space(30)

	DEFINE MSDIALOG oDlg ;
		TITLE "Say/Get minimal" ;
		FROM 000, 000 TO 200, 400 ;
		PIXEL

	// SAY: linha, coluna e texto
	@ 010, 010 SAY "Name:"

	// SAY com objeto: linha, coluna, objeto, PROMPT e texto
	@ 025, 010 SAY oSay PROMPT "Name:"

	// GET: linha, coluna e variavel
	@ 010, 060 GET cName

	// GET com objeto: linha, coluna, objeto, VAR e variavel
	@ 025, 060 GET oGet VAR cName

	ACTIVATE MSDIALOG oDlg CENTERED
Return

/*/{Protheus.doc} SayGetOptional
Comandos @ ..SAY e @ ..GET com 2 ou 3 parametros opcionais, na mesma ordem em
que a gramatica (tree-sitter-tlpp 0.1.25) os define.
@type user function
/*/
User Function SayGetOptional()
	Local oDlg
	Local oFont
	Local oSay
	Local oGet
	Local cName := Space(30)
	Local cCode := Space(10)

	DEFINE MSDIALOG oDlg ;
		TITLE "Say/Get optional" ;
		FROM 000, 000 TO 200, 400 ;
		PIXEL

	// SAY com 2 opcionais: PICTURE e SIZE
	@ 010, 010 SAY oSay PROMPT "Name:" ;
		PICTURE "@!" ;
		SIZE 050, 010

	// SAY com 3 opcionais: COLOR, FONT e OF
	@ 025, 010 SAY "Code:" ;
		COLOR CLR_BLUE, CLR_WHITE ;
		FONT oFont ;
		OF oDlg

	// GET com 2 opcionais: PICTURE e VALID
	@ 010, 060 GET cName ;
		PICTURE "@!" ;
		VALID !Empty(cName)

	// GET com 3 opcionais: OF, SIZE e WHEN
	@ 025, 060 GET oGet VAR cCode ;
		OF oDlg ;
		SIZE 100, 010 ;
		WHEN .T.

	ACTIVATE MSDIALOG oDlg CENTERED
Return

/*/{Protheus.doc} SayGetOutOfOrder
Comandos @ ..SAY e @ ..GET com os parametros opcionais em ordem DIFERENTE da
definida na gramatica (tree-sitter-tlpp 0.1.25): SAY define PICTURE, COLOR, SIZE,
FONT, OF, PIXEL; GET define OF, PICTURE, VALID, COLOR, SIZE, FONT, PIXEL, WHEN,
ON CHANGE, READONLY, PASSWORD.
@type user function
/*/
User Function SayGetOutOfOrder()
	Local oDlg
	Local oFont
	Local oSay
	Local oGet
	Local cName := Space(30)
	Local cPass := Space(10)

	DEFINE MSDIALOG oDlg ;
		TITLE "Say/Get out of order" ;
		FROM 000, 000 TO 200, 400 ;
		PIXEL

	// SAY: PIXEL, OF, FONT, SIZE, COLOR e PICTURE (inverso da gramatica)
	@ 010, 010 SAY oSay PROMPT "Name:" ;
		PIXEL ;
		OF oDlg ;
		FONT oFont ;
		SIZE 050, 010 ;
		COLOR CLR_BLUE, CLR_WHITE ;
		PICTURE "@!"

	// SAY: SIZE, OF e PICTURE
	@ 025, 010 SAY "Code:" ;
		SIZE 050, 010 ;
		OF oDlg ;
		PICTURE "@!"

	// GET: WHEN, SIZE, VALID, PICTURE e OF (inverso da gramatica)
	@ 010, 060 GET oGet VAR cName ;
		WHEN .T. ;
		SIZE 100, 010 ;
		VALID !Empty(cName) ;
		PICTURE "@!" ;
		OF oDlg

	// GET: PASSWORD, PIXEL, FONT, COLOR e OF
	@ 025, 060 GET cPass ;
		PASSWORD ;
		PIXEL ;
		FONT oFont ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OF oDlg

	ACTIVATE MSDIALOG oDlg CENTERED
Return
