#include 'protheus.ch'
#include "tbiconn.ch"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

user function multiGet()
	local aOption := {;
		{"Use dash"       , { |aoParent| memo_01(aoParent)} },;
		{"UTF8 characters", { |aoParent| memo_02(aoParent)} },;
		}

	u_selectTest("TMultGet", aOption)
return

static function memo_01(aoParent)
	local cMemo1 := "– Dólar"
	local cMemo2
	local cGet := "Not blank" + space(10)
	local oMemo1
	local oMemo2
	local oButton
	local oGet

	@SAY_ROW(1), SAY_COL say "Get w/valid";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet;
		var cGet;
		valid { || !(trim(cGet) == "")};
		size 120, 15;
		multiline;
		of aoParent;
		pixel

	@SAY_ROW(2), SAY_COL say "Memo 1/Echo";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oMemo1;
		var cMemo1;
		size 80,50;
		multiline;
		of aoParent;
		pixel
	oMemo1:bChange := { |aoSender|;
		xValue := eval(aoSender:bSetget),;
		u_firedEvent(aoSender, "onChange: "+ cValToChar(xValue) + " (" + valType(xValue) + ")"),;
		conout(cMemo1), cMemo2 := cMemo1 };

	@SAY_ROW(2), GET_COL+100 get oMemo2;
		var cMemo2;
		size 80,50;
		multiline;
		of aoParent;
		pixel

	@ SAY_ROW(6), SAY_COL button oButton;
		prompt "Click here";
		action {|| u_firedEvent(oButton, " onClick")};
		of aoParent pixel

	@SAY_ROW(8), SAY_COL say "typing 'em dash (—)': alt+0151 | 'en dash (–)': alt+0150, followed by any text";
		of aoParent pixel
	@SAY_ROW(9), SAY_COL say "After typing in Memo, click 'Click Here' (do not use tabs)";
		of aoParent pixel
return

static function memo_02(aoParent)
	local cMemo1 := ""
	local cMemo2
	local cGet := "Not blank" + space(10)
	local oMemo1
	local oMemo2
	local oButton
	local oGet

	@SAY_ROW(1), SAY_COL say "Get w/valid";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet;
		var cGet;
		valid { || !(trim(cGet) == "")};
		size 120, 15;
		multiline;
		of aoParent;
		pixel

	@SAY_ROW(2), SAY_COL say "Memo 1/Echo";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oMemo1;
		var cMemo1;
		size 80,50;
		multiline;
		of aoParent;
		pixel
	oMemo1:bChange := { |aoSender|;
		xValue := eval(aoSender:bSetget),;
		u_firedEvent(aoSender, "onChange: "+ cValToChar(xValue) + " (" + valType(xValue) + ")"),;
		conout(cMemo1), cMemo2 := cMemo1 };

	@SAY_ROW(2), GET_COL+100 get oMemo2;
		var cMemo2;
		size 80,50;
		multiline;
		of aoParent;
		pixel

	@ SAY_ROW(6), SAY_COL button oButton;
		prompt "Click here";
		action {|| u_firedEvent(oButton, " onClick")};
		of aoParent pixel

return
