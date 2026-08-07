#include "protheus.ch"

#define NL chr(13)+chr(10)

static oFiredEvents
static cFiredEvents := ""
static nMarkCount := 0

/*/{Protheus.doc} panelEvents
Sets up the UI elements for displaying fired events in a panel.

@type function
@author acandido
@since 1/3/2025
@param aoParent, object, the parent panel to add the UI elements
/*/
user function panelEvents(aoParent, anStartRow)
	local oClearEvents
	local oMark

	if anStartRow == nil
		anStartRow := 190
	endif

	//readonly;
		// aparenta n�o funcionar
	//	on change {|| conout("XXXXXXXXXXXXXXXXXXXXXXX "+alltrim(cFiredEvents))} ;
		@anStartRow, 005 get oFiredEvents ;
		var cFiredEvents ;
		multiline;
		size 100, 150 ;
		of aoParent pixel
	oFiredEvents:cName := "cFiredEvents"
	oFiredEvents:cReadVar := "cFiredEvents"
	oFiredEvents:Align := CONTROL_ALIGN_BOTTOM

	@ 0,0 button oMark ;
		prompt "Mark" ;
		action {|| u_markEvents() };
		of aoParent pixel
	oMark:Align := CONTROL_ALIGN_BOTTOM

	@ 0,0 button oClearEvents ;
		prompt "Clear Events" ;
		action {|| u_clearEvents() };
		of aoParent pixel
	oClearEvents:Align := CONTROL_ALIGN_BOTTOM

	u_clearEvents()
return

/*/{Protheus.doc} srvEvents
Sets up various event handlers for the given UI element extended from TSrcObject.

@type function
@author acandido
@since 1/3/2025
@param aoElement, object, the UI element to set up event handlers
@param text, character, optional identifier for the element
@link https://tdn.totvs.com/display/tec/TSrvObject
/*/
user function srvEvents(aoElement, text)
	aoElement:bHelp := {|oSender| onHelp(oSender)}
	aoElement:bGotFocus := {|oSender| onGetFocus(oSender)}
	aoElement:bLClicked := {|oSender| onLClick(oSender)}
	aoElement:bLDblClick := {|oSender| onLDblClick(oSender)}
	aoElement:bLostFocus := {|oSender| onLostFocus(oSender, aoElement)}
	aoElement:bRClicked := {|oSender| onRClick(oSender)}
	aoElement:bValid := {|oSender| onValid(oSender)}
	aoElement:bWhen := {|oSender| onWhen(oSender)}

return

/*/{Protheus.doc} controlEvents
Sets up various event handlers for the given UI element extended from TControl.

@type function
@author acandido
@since 1/3/2025
@param aoElement, object, the UI element to set up event handlers
@param text, character, optional identiffier for the element
@link https://tdn.totvs.com/display/tec/TControl
/*/
user function controlEvents(aoElement, text)
	aoElement:bChange := {|oSender| onChange(oSender)}
return

/*/{Protheus.doc} OnEvent
 * Handles events triggered by a element.
 *
 * @param aoElement Object representing the element that triggered the event.
 * @param eventName Name of the event to handle.
 */
user function OnEvent(aoElement, eventName)
	local event := "aoElement:" + eventName
	local listener := "{|oSender| on" + substr(eventName,2)+ "(oSender)}"

	&event := &listener
return

/*/{Protheus.doc} popupMenu
Prepara um objeto de menu com itens falsos para teste.

@type function
@author acandido
@since 1/3/2025
@param aoParent, object, objeto que conter� o menu, normalmente di�logo ou pa�nel
@param acCaption, character, texto do 1o item de menu, para ajudar a identificar o menu disparado
@param alApplyCss, boolean, Opcional. Aplica ou não CSS customizado.
@return object, TMenu com a defini��o do menu
@remarks
Não adicionar/rempver itens no 1o nível em oMenu. Caso o faço. testes podem quebrar.
/*/
user function popupMenu(aoParent, acCaption, alApplycCSS)
	local oMenu := nil
	local oMenu00 := nil
	local oMenu01 := nil, oMenu0101 := nil, oMenu0102 := nil, oMenu0103 := nil
	local oMenu02 := nil, oMenu0201 := nil, oMenu0202 := nil, oMenu0203 := nil
	local oMenu03 := nil, oMenu0301 := nil, oMenu0302 := nil, oMenu0303 := nil
	local oMenu04 := nil
	local oMenu05 := nil
	local oSubMenu := nil

	if valType(alApplycCSS) == "U"
		alApplycCSS := .f.
	endif

	if alApplycCSS
		CSSDictAdd("TMENUITEM", "TMenuItem {background-color: pink; color: red;} TMenuItem:hover {background-color: green; color: yellow}")
	endif

	// menu principal
	oMenu := tMenu():new(0, 0, 0, 0, .T./*, , oMenu*/)

	// o 1o item, aparenta, determinar o largura do menu/itens podendo truncar maiores
	oMenu00 := tMenuItem():new(oMenu, "A" , , , , {|| u_firedEvent(nil, "Menu " + acCaption)}, , , , , , , , , .T.)

	// cria os menus
	oMenu01 := tMenuItem():new(oMenu, "Menu 1", , , , {|| }, , , , , , , , , .T.)
	oMenu02 := tMenuItem():new(oMenu, "Menu 2", , , , {|| }, , , , , , , , , .T.)
	oMenu03 := tMenuItem():new(oMenu, "Menu 3", , , , {|| }, , , , , , , , , .T.)
	oMenu04 := tMenuItem():new(oMenu, "Menu 4", , , , {|| u_firedEvent(nil, "Menu 4")}, , , , , , , , , .T.)
	oMenu05 := tMenuItem():new(oMenu, "Menu 5", , , , {|| u_firedEvent(nil, "Menu 5")}, , , , , , , , , .T.)

	oMenu:add(oMenu00)
	oMenu:add(oMenu01)
	oMenu:add(oMenu02)
	oMenu:add(oMenu03)
	oMenu:add(oMenu04)
	oMenu:add(oMenu05)

	// cria os itens dos menus
	oMenu0101 := tMenuItem():new(oMenu01, "Item 1.1", , , ,    {|| u_firedEvent(nil, "Item 1.1")}, , , , , , , , , .T.)
	oMenu0102 := tMenuItem():new(oMenu01, "Item 1.2", , , ,    {|| u_firedEvent(nil, "Item 1.2")}, , , , , , , , , .T.)
	oMenu0103 := tMenuItem():new(oMenu01, "Item 1.3", , , .F., {|| u_firedEvent(nil, "Item 1.3")}, , , , , , , , , .T.)
	oMenu0201 := tMenuItem():new(oMenu01, "Item 2.1", , , ,    {|| u_firedEvent(nil, "Item 2.1")}, , , , , , , , , .T.)
	oMenu0202 := tMenuItem():new(oMenu01, "Item 2.2", , , ,    {|| u_firedEvent(nil, "Item 2.2")}, , , , , , , , , .T.)
	oMenu0203 := tMenuItem():new(oMenu01, "Item 2.3", , , ,    {|| u_firedEvent(nil, "Item 2.3")}, , , , , , , , , .T.)
	oMenu0301 := tMenuItem():new(oMenu01, "Item 3.1", , , ,    {|| u_firedEvent(nil, "Item 3.1")}, , , , , , , , , .T.)
	oMenu0302 := tMenuItem():new(oMenu01, "Item 3.2", , , .F., {|| u_firedEvent(nil, "Item 3.2")}, , , , , , , , , .T.)
	oMenu0303 := tMenuItem():new(oMenu01, "Item 3.3", , , ,    {|| u_firedEvent(nil, "Item 3.3")}, , , , , , , , , .T.)

	if alApplycCSS
		oMenu0101:setCss("TMenuItem {background-color: pink; color: red;} TMenuItem:hover {background-color: green; color: yellow}")
		oMenu0102:setCSS("TMenuItem {background-color: pink; color: red;} TMenuItem:hover {background-color: green; color: yellow}")
	endif

	// adiciona os itens dos menus
	oMenu01:add(oMenu0101)

	// cria um subitem de um submenu
	oSubMenu := tMenuItem():new(oMenu0101, "Item 1.1.1", , , , {|| u_firedEvent("Item 1.1.1")}, , , , , , , , , .T.)

	// adiciona o subitem do submenu
	oMenu0101:add(oSubMenu)
	oMenu01:add(oMenu0102)
	oMenu01:add(oMenu0103)
	oMenu02:add(oMenu0201)
	oMenu02:add(oMenu0202)
	oMenu02:add(oMenu0203)
	oMenu03:add(oMenu0301)
	oMenu03:add(oMenu0302)
	oMenu03:add(oMenu0303)

return oMenu

/*/{Protheus.doc} firedEvent
Logs the firing of an event for a UI element, including information about the sender.

@type function
@author acandido
@since 1/3/2025
@param aoSender, object, the UI element that fired the event
@param acFiredEvent, character, the name of the event that was fired
/*/
user function firedEvent(aoSender, acFiredEvent)
	local cSender := ""
	local cMessage := ""

	if aoSender != nil
		if !empty(aoSender:cCaption)
			cSender := "(" + aoSender:cCaption + ") "
		elseif !empty(aoSender:cReadVar)
			cSender := "(" + aoSender:cReadVar + ") "
		elseif !empty(aoSender:cName)
			cSender := "(" + aoSender:cName + ") "
		endif
	endif

	cMessage := cSender + allTrim(acFiredEvent) + " Fired"
	u_remoteLog(cMessage)

	if valType(oFiredEvents) == "O"
		oFiredEvents:appendText(cMessage+NL)
		oFiredEvents:GoEnd() //FIX: aparenta n�o estar funcionado
	endif
return

/*/{Protheus.doc} allEvents
Handles all events for a given UI element, including both TSrvObject and TControl events.

@type function
@author acandido
@since 1/3/2025
@param aoElement, object, the UI element for which to handle events
@param acName, character, the name of the UI element
/*/
user function allEvents(aoElement, acName)

	//TSrvObject
	u_srvEvents(aoElement, acName)

	//TControl
	u_controlEvents(aoElement, acName)

return

/*/{Protheus.doc} clearEvents
Clears the list of fired events and initializes the event log with a header.

@type function
@author acandido
@since 1/3/2025
/*/
user function clearEvents()
	cFiredEvents := ""
	//oFiredEvents:clear()????
	//oFiredEvents:appendText("(Fired Events)" + NL)
	u_remoteLog(cFiredEvents)
return .T.

user function markEvents()
	nMarkCount++
	u_remoteLog("----- MARK "+strZero(nMarkCount, 4)+" -----")
return .T.

static function onWhen(aoSender)
	u_firedEvent(aoSender, "When")
return .T.

static function onValid(aoSender)
	u_firedEvent(aoSender, "Valid")
return .T.

static function onCLick(aoSender)
	u_firedEvent(aoSender, "Click")
return .T.

static function onRCLick(aoSender)
	u_firedEvent(aoSender, "RClick")
return .T.

static function onLCLick(aoSender)
	u_firedEvent(aoSender, "LClick")
return .T.

static function onGetFocus(aoSender)
	u_firedEvent(aoSender, "GetFocus")
return .T.

static function onHelp(aoSender)
	u_firedEvent(aoSender, "Help")
	//alert("Help Fired")
return .T.

static function onLDbLClick(aoSender)
	u_firedEvent(aoSender, "LDbLClick")
return .T.

static function onLostFocus(anHandle, aoElement)
	u_firedEvent(aoElement, "LostFocus") //esta vindo um numerico
return .T.

static function onSetGet(aoSender)
	u_firedEvent(aoSender, "SetGet")
return .T.

static function onChange(aoSender)
	local xValue := eval(aoSender:bSetget)

	u_firedEvent(aoSender, "onChange: "+ cValToChar(xValue) + " (" + valType(xValue) + ")")
return .T.
