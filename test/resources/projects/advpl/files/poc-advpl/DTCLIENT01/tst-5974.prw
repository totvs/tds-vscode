#INCLUDE "TOTVS.CH"

#define SAY_COL 010
#define GET_COL 90
#define SAY_ROW(x) (015 * (x))

user function tst5974()
	local aTFolder
	local oTFolder

	u_startRemoteLog("DTCLIENT01-5974: comportamento da propriedade lReadOnly nos componentes: TFolder e TCheckBox")

	DEFINE DIALOG oDlg TITLE "DTCLIENT01-5974" FROM 180,180 TO 550,700 PIXEL
	// Cria a Folder
	aTFolder :=	{ 'RO .F.', 'RO .T.', 'Disabled', "With Panel (RO .T.)" }
	oTFolder := TFolder():New( 0,0,aTFolder,,oDlg,,,,.T.,,260,184 )
	oTFolder:aDialogs[2]:lReadOnly :=.t.
	oTFolder:aDialogs[3]:lReadOnly :=.t.
	oTFolder:aEnable(3, .f.)

	// Insere um TGet em cada aba da folder
	makeChild(1, oTFolder:aDialogs[1], .f.)
	makeChild(2, oTFolder:aDialogs[2], .t.)
	makeChild(3, oTFolder:aDialogs[3], .f.)
	makeChild(4, oTFolder:aDialogs[4], .t.)

	ACTIVATE DIALOG oDlg CENTERED

	u_stopRemoteLog()

Return

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

