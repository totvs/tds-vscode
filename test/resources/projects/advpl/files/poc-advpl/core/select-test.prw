#include "protheus.ch"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

user function selectTest(acTitle, aaOptions, anWidth)
	local oSelectTest
	local oLayout
	local oScrollBox
	local oButton

	set century on

	define dialog oSelectTest;
		title acTitle + " (select test)";
		from 0,0 to 600, iif(valType(anWidth) == "U",  950, anWidth);
		pixel

	oLayout := TGridLayout():New(oSelectTest, CONTROL_ALIGN_LEFT, 150, 0)
	oLayout:setColor(,CLR_BLUE)

	@ 000, 100 scrollbox oScrollBox;
		horizontal ;
		vertical ;
		size 600, 450 ;
		of oSelectTest ;
		border;
		pixel

	oScrollBox:Align := CONTROL_ALIGN_ALLCLIENT
	oScrollBox:cName := "oContentPanel"
	oScrollBox:cReadVar := "oContentPanel"

	@ 0,0 button oButton ;
		prompt "(00) Close This" ;
		of oLayout pixel;
		action { || oSelectTest:end() }
	oButton:Align := CONTROL_ALIGN_TOP
	//oLayout:addInLayout(oButton, LAYOUT_ALIGN_TOP)

	aEval(aaOptions, { |aOption, i| addButton(aOption, oLayout, oScrollBox, i) })

	u_panelEvents(oLayout)

	oSelectTest:lMaximized := .t.

	//Não captura INSERT
	//setKey(V_INS, {|| conout(">>>INS Acionado")}) //V_INS=22. 

	activate dialog oSelectTest ;
		centered
return

static function addButton(aaOption, aoParent, aoRunParent, index)
	local oButton
	local cLabel := ""

	if aaOption != nil
		cLabel := "("+strZero(index,2)+") " + aaOption[1]

		if valType(aaOption[2]) == "B"
			@ 0,0 button oButton ;
				prompt cLabel ;
				of aoParent pixel;
				action { ||;
				aoRunParent:FreeChildren(),;
				addTitle(aoRunParent, aaOption[1]),;
				eval(aaOption[2], aoRunParent);
				}
		else
			conout("@@DEPRECATED: use codeblock, e.g., { |aoParent| static_funcion(aoParent)}")

			@ 0,0 button oButton ;
				prompt cLabel ;
				of aoParent pixel;
				action { || ;
				aoRunParent:FreeChildren(),;
				runOption(aaOption, aoRunParent);
				}
		endif
		oButton:Align := CONTROL_ALIGN_TOP
		//aoParent:addInLayout(oButton, LAYOUT_ALIGN_TOP)

	endif
return

static function runOption(aaOption, aoParent)
	local call := "u_" + aaOption[2] + "(aoParent)"

	if (aoParent != nil)
		if substr(aaOption[2], 1,1) != "_"
			aoParent:FreeChildren()
		endif

		u_clearEvents()
	endif

	addTitle(aoParent, aaOption[1])

	&call

return

//aoParent:aControls retorna sem os elementos criados na chamada do codeblock da opÃƒÂ§ÃƒÂ£o
static function addTitle(aoParent, acTitle)
	local oSay

	@ SAY_ROW(0), 0 say oSay prompt acTitle size 300, 10 of aoParent pixel
	oSay:setCss("{background-color: #444444; color: silver; font-weight: bold; padding:2px; padding-left: 10px;}")

	// local oButton
	// local nChildCount := len(aoParent:aControls)

	// @ SAY_ROW(nChildCount + 0.5), 0 button oButton ;
		// 	prompt "Anchor for Tab" ;
		// 	of aoParent pixel;
		// 	size 100,10;
		// 	action { || }

	// oButton:setFocus()
	//oButton:setNextFocus(????)
return
