#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 90
#define SAY_ROW(x) (015 * (x))

#translate CBOX_HIDDEN(<ind>) =>;
	@SAY_ROW(1+<ind>), SAY_COL checkbox oHidden\[<ind>\] ;
	var aHidden\[<ind>\];
	prompt "Folder " + strZero(<ind>, 2);
	size 100, 20;
	of aoParent pixel;;
	oHidden\[<ind>\]:cName := "oHidden[" + strZero(<ind>,1) + "]";;
	oHidden\[<ind>\]:cReadVar := oHidden\[<ind>\]:cName

#translate CBOX_DISABLED(<ind>) =>;
	@SAY_ROW(1+<ind>), SAY_COL + 120 checkbox oDisabled\[<ind>\] ;
	var aDisabled\[<ind>\];
	prompt "Folder " + strZero(<ind>, 2);
	size 100, 20;
	of aoParent pixel ;;
	oDisabled\[<ind>\]:cName := "aDisabled[" + strZero(<ind>,1) + "]";;
	oDisabled\[<ind>\]:cReadVar := oDisabled\[<ind>\]:cName

#translate GET_IN_FOLDER(<ind>) =>;
	cTGet<ind> := "Teste TGet " + strZero(<ind>,2);;
	oTGet<ind> := TGet():New(SAY_ROW(2), 01,{||cTGet<ind>},oTFolder:aDialogs\[<ind>\],096,009,;
	"",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet<ind>,,,, )

#translate SAY_IN_FOLDER(<ind>) =>;
	@SAY_ROW(1), SAY_COL say "Teste TSay Folder " + strZero(<ind>,2) of oTFolder:aDialogs\[<ind>\] pixel

/*/{Protheus.doc} folder
Presents a dialog with options to test different folder functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TFolder
/*/

user Function folder()
	local aOption := {;
		{"Visual", { |aoParent| fldr_01(aoParent) }}, ;
		{"Events", { |aoParent| fldr_02(aoParent) }},;
		{"Hidden", { |aoParent| fldr_03(aoParent) }},;
		}

	u_startRemotrLog("start folder")

	u_selectTest("TFolder", aOption)

	u_stopRemotrLog("start folder")

return

/*/{Protheus.doc} folder
* Handles folder operations for the POC (Proof of Concept) component
*
* @type function
* @version 1.0.0
* @author acandido
/*/
static function fldr_01(aoParent)
	local aTFolder
	local oTFolder

	// Cria a Folder
	aTFolder :=	{ 'RO .F.', 'RO .T.', 'Disabled' }
	oTFolder := TFolder():New(SAY_ROW(1), 0, aTFolder,, aoParent,,,,.T.,,260,184 )
	oTFolder:aDialogs[2]:lReadOnly :=.t.
	oTFolder:aDialogs[3]:lReadOnly :=.t.
	oTFolder:aEnable(3, .f.)

	// Insere um TGet em cada aba da folder
	makeChild(1, oTFolder:aDialogs[1], .f.)
	makeChild(2, oTFolder:aDialogs[2], .t.)
	makeChild(3, oTFolder:aDialogs[3], .f.)

return

static function fldr_02(aoParent)
	local aTFolder
	local oTFolder

	// Cria a Folder
	aTFolder :=	{ 'RO .F.', 'RO .T.', 'Disabled', "With Panel (RO .T.)" }
	oTFolder := TFolder():New( SAY_ROW(1), SAY_COL,aTFolder,,aoParent,,,,.T.,, SAY_ROW(11), 200 )
	oTFolder:aDialogs[2]:lReadOnly :=.t.
	oTFolder:aDialogs[3]:lReadOnly :=.t.
	oTFolder:aEnable(3, .f.)

	// Insere um TGet em cada aba da folder
	makeChild(1, oTFolder:aDialogs[1], .f.)
	makeChild(2, oTFolder:aDialogs[2], .t.)
	makeChild(3, oTFolder:aDialogs[3], .f.)
	makeChild(4, oTFolder:aDialogs[4], .t.)

	u_allEvents(oTFolder, "oTFolder")

return

static function makeChild(anIndex, aoFolder, alReadOnly)
	local cGet := pad("This is folder #" + strZero(anIndex,2), 40, " ")
	local oGet
	local cGetRO := pad("This is allways RO", 40, " ")
	local oGetRO
	local lCheckRO := .t.
	local oCheckRO
	local lCheck := .t.
	local oCheck
	local oList
	local oCombo
	local cCombo
	local aList := {"Item 1", "Item 2", "Item 3", "Item 4"}
	local nList := anIndex
	local oParent := aoFolder

	if anIndex == 4
		oParent := TPanel():new(SAY_ROW(1), SAY_COL, "", aoFolder, nil,.T.,;
			, CLR_YELLOW, CLR_BLUE;
			, 230, SAY_ROW(9), .t., .t.)
	endif

	@SAY_ROW(1), SAY_COL say "ReadOnly is " + cValToChar(alReadOnly) of oParent pixel
	@SAY_ROW(2), SAY_COL say "This is folder #" + strZero(anIndex, 2) of oParent pixel
	@SAY_ROW(2), GET_COL get oGet var cGet size 120, 10 of oParent pixel
	@SAY_ROW(3), SAY_COL say "Allways RO" of oParent pixel
	@SAY_ROW(3), GET_COL get oGetRO var cGetRO size 120, 10 of oParent pixel

	oCheckRO := TCheckBox():New(SAY_ROW(4), SAY_COL, "This element is allways RO",;
		{|u| If( PCount() == 0, lCheckRO , lCheckRO := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheckRO:cName := "lCheckRO" + strZero(anIndex,2)
	oCheckRO:cReadVar := oCheckRO:cName

	oCheck := TCheckBox():New(SAY_ROW(5), SAY_COL, "This element is normal",;
		{|u| If( PCount() == 0, lCheck , lCheck := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheck:cName := "lCheck" + strZero(anIndex,2)
	oCheck:cReadVar := oCheck:cName

	oCombo := TComboBox():New(SAY_ROW(6), SAY_COL,{|u|if(PCount()>0,cCombo:=u,cCombo)},;
		aList,100,20,oParent,,nil;
		,,,,.T.,,,,,,,,,'cCombo')

	oList := TListBox():New(SAY_ROW(6), GET_COL + 30, {|u|if(Pcount()>0,nList:=u,nList)},aList, 100, 30 ,;
		nil, oParent,,,,.T.)

	oGetRO:lReadOnly := .t.
	oCheckRO:lReadOnly := .t.

return

static function fldr_03(aoParent)
	local oHidden := array(5)
	local aHidden := array(5)
	local oDisabled := array(5)
	local aDisabled := array(5)
	local nSelectPage := 0
	local oSelectPage

	@SAY_ROW(1), SAY_COL;
		say "Hidden";
		of aoParent;
		pixel

	@SAY_ROW(1), SAY_COL + 120 ;
		say "Disabled";
		of aoParent;
		pixel

	afill(aHidden, .f.)
	afill(aDisabled, .f.)

	CBOX_HIDDEN(1)
	CBOX_HIDDEN(2)
	CBOX_HIDDEN(3)
	CBOX_HIDDEN(4)
	CBOX_HIDDEN(5)

	CBOX_DISABLED(1)
	CBOX_DISABLED(2)
	CBOX_DISABLED(3)
	CBOX_DISABLED(4)
	CBOX_DISABLED(5)

	@SAY_ROW(9), SAY_COL;
		say "Folder #" ;
		size 110, 12;
		of aoParent pixel

	@SAY_ROW(9), SAY_COL+60 ;
		get oSelectPage ;
		var nSelectPage ;
		size 110, 12;
		of aoParent pixel

	@SAY_ROW(11), SAY_COL button oBtn;
		prompt "Create Folders";
		action {|| makeFolder(aHidden, aDisabled, nSelectPage) };
		of aoParent;
		pixel

	@SAY_ROW(11), SAY_COL + 120 button oBtn;
		prompt "Reset";
		action {||;
		afill(aHidden, .f.),;
		afill(aDisabled, .f.),;
		nSelectPage := 0;
		};
		of aoParent;
		pixel

return

static function makeFolder(aaHidden, aaDisabled, anPage)
	u_remoteLog("makeFolder: ", {{ "hidden", aaHidden}, { "disabled", aaDisabled}, { "setOption", anPage }})

	define dialog odlg;
		title "TFolder: Hidden/Disabled";
		from 180,180 to 550,700;
		pixel

	// Cria a Folder
	aTFolder := { 'Folder 01', 'Folder 02', 'Folder 03', 'Folder 04', 'Folder 05' }
	oTFolder := TFolder():New( 0,0,aTFolder,,oDlg,,,,.T.,,260,184 )
	oTFolder:bChange    := {|| u_remoteLog("TFolder:bChange: " + str(oTFolder:nOption)) }
	oTFolder:bSetOption := {|| u_remoteLog("TFolder:bSetOption: " + str(oTFolder:nOption)) }
	if anPage > 0
		oTFolder:setOption(anPage)
	endif
	aEval(aaHidden, { |value,index| iif(value, oTFolder:hidePage(index),)})
	aEval(aaDisabled, { |value,index| oTFolder:aEnable(index, !value)})

	// Insere um TGet em cada aba da folder
	SAY_IN_FOLDER(1)
	SAY_IN_FOLDER(2)
	SAY_IN_FOLDER(3)
	SAY_IN_FOLDER(4)
	SAY_IN_FOLDER(5)

	// Insere um TGet em cada aba da folder
	//GET_IN_FOLDER(1)
	//GET_IN_FOLDER(2)
	//GET_IN_FOLDER(3)
	//GET_IN_FOLDER(4)
	//GET_IN_FOLDER(5)

	activate dialog oDlg centered
return
