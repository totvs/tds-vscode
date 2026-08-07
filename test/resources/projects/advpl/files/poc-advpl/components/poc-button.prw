#include 'protheus.ch'

/*/{Protheus.doc} button
Presents a dialog with options to test different button functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TButton
/*/
user Function button()
	local aOption := {;
		{"Visual", { |aoParent| btn_01(aoParent) }}, ;
		{"Events", { |aoParent| btn_02(aoParent) }},;
		}

	u_selectTest("TButton", aOption)

return

/*/{Protheus.doc} btn_01
Presents a dialog with various button functionalities, including text buttons, image buttons,
disabled/enabled buttons, toggle buttons, and buttons with truncated menus.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static Function btn_01(aoParent)
	local oTextBtn := nil
	local oImageBtn := nil
	local oDisableBtn := nil
	local oToggleBtn := nil
	local lEnable := .t.
	local oMenuTruncatedBtn := nil
	local oRClickBtn := nil
	local oCSSBtn := nil

	@ 15, 005 button oTextBtn;
		prompt "Click here";
		action {|| u_firedEvent(oTextBtn, " onClick")};
		of aoParent pixel

	@ 15, 125 button oImageBtn;
		prompt "Image Button";
		action {|| u_firedEvent(oImageBtn, " onClick")};
		size 020, 020;
		of aoParent pixel
	oImageBtn:SetCSS( "TButton { background-image: url(rpo:open.png)")

	@ 30, 005 button oDisableBtn;
		prompt iif(lEnable,"Habilitado", "Disabled");
		when {|| oDisableBtn:cCaption := iif(lEnable,"Enabled", "Disabled"), lEnable };
		action {|| u_firedEvent(oDisableBtn, " onClick")};
		of aoParent pixel

	@ 45, 005 button oToggleBtn;
		prompt "Toggle state";
		action {|| lEnable := !lEnable };
		of aoParent pixel

	@ 060, 005 button oMenuTruncatedBtn;
		prompt "With Truncated Menu";
		action {|| };
		of aoParent pixel
	oMenuTruncatedBtn:SetPopupMenu(u_popupMenu(aoParent, "Truncated"))

	@ 080, 005 button oRClickBtn;
		prompt "RClick and Popup";
		action {|| };
		of aoParent pixel
	oRClickBtn:SetPopupMenu(u_popupMenu(aoParent, "RClick"))
	oRClickBtn:bRClicked := {|| alert("RClick") }

	@ 100, 005 button oCSSBtn;
		prompt "Menu with CSS";
		action {|| };
		of aoParent pixel
	oCSSBtn:SetPopupMenu(u_popupMenu(aoParent, "with CSS", .t.))
	oCSSBtn:bRClicked := {|| alert("Menu with CSS") }

Return

/*/{Protheus.doc} btn_02
Presents a dialog with a text button and a button with a menu.

@type function
@author acandido
@since 11/7/2024
/*/
static Function btn_02(aoParent)
	local oTextBtn := nil
	local oMenuBtn := nil

	@ 010, 010 button oTextBtn;
		prompt "Click here";
		action {|| u_firedEvent(oTextBtn, " onClick")};
		of aoParent pixel

	//TSrvObject and TControl
	u_allEvents(oTextBtn, "oTextBtn")

	//TButton
	oTextBtn:bAction := {|| u_firedEvent(oTextBtn, " onAction")}

	@ 030, 010 button oMenuBtn;
		prompt "With Menu";
		action {|| };
		of aoParent pixel
	oMenuBtn:SetPopupMenu(u_popupMenu(aoParent, "Button", .t.));

	//TSrvObject and TControl
	u_allEvents(oMenuBtn, "oMenuBtn")

return
