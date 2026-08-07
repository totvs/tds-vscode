#include 'Protheus.ch'
#include "colors.ch"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))
#define NL chr(13)+chr(10)

static function bNewCheckBox(varName, row, column, label, oParent)
	local oCheckBox := TCheckBox():New(row, column, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )
	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName
return oCheckBox;

User Function mscalend()
	local oCalend := nil
	local oCanMultSel
	local oWEndRest
	local oDlg

	private oSelectedDates
	private lCanMultSel := .f.
	private lWeekend := .f.
	private lWEndRest := .f.
	private cSelectedDates := ""

	set century on

	u_startRemoteLog("MSCalend")

	define dialog odlg title "MSCalend" from 180,180 to 550,700 pixel

	oCanMultSel := bNewCheckBox("lCanMultSel", SAY_ROW(1), SAY_COL, ":CanMultSel", oDlg)
	u_controlEvents(oCanMultSel)

	oWeekend := bNewCheckBox("lWeekend", SAY_ROW(2), SAY_COL, "Weekend highlighting", oDlg)
	u_controlEvents(oWeekend)

	oWEndRest := bNewCheckBox("lWEndRest", SAY_ROW(3), SAY_COL, "Weekend restricted", oDlg)
	u_controlEvents(oWEndRest)

	TButton():New(SAY_ROW(4), SAY_COL, "Create", oDlg, {|| ;
		oCalend := newCalend(oDlg);
		}, 40, 10,,,.F.,.T.,.F.,,.F.,,,.F. )

	@SAY_ROW(6), GET_COL get oSelectedDates ;
		var cSelectedDates ;
		multiline;
		size 150, 70 ;
		of oDlg pixel
	oSelectedDates:cName := "cSelectedDates"
	oSelectedDates:cReadVar := "cSelectedDates"

	activate dialog odlg centered

	u_stopRemoteLog()

Return

static function newCalend(aoParent)
	local oCalend := mscalend():new(SAY_ROW(1), GET_COL, aoParent, .t.)
	local nMonth
	local dWork

	oCalend:dDiaAtu := date()
	oCalend:bChange := {|| selectDate(oCalend:ddiaatu) }

	oCalend:bChangeMes := {||;
		oSelectedDates:appendText("Changed month: " + cMonth(oCalend:ddiaatu));
		}
	oCalend:canMultSel := lCanMultSel
	oCalend:cName := "oCalend"
	oCalend:cReadVar := "oCalend"

	if lWeekend
		oCalend:ColorDay(1, CLR_GREEN)
		oCalend:ColorDay(7, CLR_GREEN)
	endif

	oCalend:DelAllRestri()
	if lWEndRest
		nMonth := month(oCalend:ddiaatu)
		dWork := oCalend:ddiaatu - day(oCalend:ddiaatu) + 1

		while nMonth == month(dWork)
			if (dow(dWork) == 1) .or. ;
					(dow(dWork) == 7)
				oCalend:AddRestri( day(dWork), CLR_RED, CLR_RED)
			endif

			dWork += 1
		end do
	endif

	oCalend:dDiaAtu := date()
	cSelectedDates := "< To update, put in focus >"+NL
return oCalend

static function selectDate(adDate)
	//oSelectedDates:setUpdatesEnabled(.f.)

	if lCanMultSel
		if substr(cSelectedDates,1,1) == "<"
			cSelectedDates := dtoc(adDate)+NL
		else
			cSelectedDates += dtoc(adDate)+NL
		endif
	else
		cSelectedDates := dtoc(adDate)+NL
	endif

	//oSelectedDates:setUpdatesEnabled(.t.)

	// oSelectedDates:appendText(dtoc(adDate))
	// oSelectedDates:appendText(NL)
return
