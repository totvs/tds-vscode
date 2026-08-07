#include 'protheus.ch'
*/

User Function window()
	local aOption := {;
		{"Empty Window", "win_00" }, ;
		{"With Menu and Sub-Menu", "win_01"};
	}

	u_selectTest("TWindow", aOption)

return

user function win_00()
	local oWindow := TWindow():New(10, 10, 200, 200, "Empty Window", nil, nil, nil, nil, nil, nil, nil,;
		CLR_BLACK, CLR_RED, nil, nil, nil, nil, nil, nil, .T.)

	oWindow:activate()
return
user function win_01()
	local oWindow := TWindow():New(10, 10, 200, 200, "Window with Menu", nil, nil, nil, nil, nil, nil, nil,;
		CLR_BLACK, CLR_GRAY, nil, nil, nil, nil, nil, nil, .T.)

	local oMenuMain := TMenuBar():New(oWindow)
	local oMenu1 := TMenu():New(nil, nil, nil, nil, .T., nil, oWindow)
	local oMenu2 := TMenu():New(nil, nil, nil, nil, .T., nil, oWindow)

	oMenuMain:AddItem("Item 1", oMenu1, .t.)
	oMenuMain:AddItem("Item 2", oMenu2, .t.)

	// Adiciona sub-Itens
	oMenu1:Add(TMenuItem():New2(oMenuMain:Owner(),'Sub-Item 1.1', nil, nil,{||Alert('TMenuItem 1.1')}))
	oMenu1:Add(TMenuItem():New2(oMenuMain:Owner(),'Sub-Item 1.2', nil, nil,{||Alert('TMenuItem 1.2')}))

	oMenu2:Add(TMenuItem():New2(oMenuMain:Owner(),'Sub-Item 2.1', nil, nil,{||Alert('TMenuItem 2.1')}))
	oMenu2:Add(TMenuItem():New2(oMenuMain:Owner(),'Sub-Item 2.2', nil, nil,{||Alert('TMenuItem 2.2')}))

	oWindow:activate()
Return

