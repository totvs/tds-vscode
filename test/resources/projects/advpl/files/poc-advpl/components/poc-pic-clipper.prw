#include 'protheus.ch'

#define SAY_ROW(x) (015 * (x))

#define SAY_COL_GROUP 005
#define SAY_COL 010
#define SAY_COL_VALUE (SAY_COL + 160)
#define SAY_COL_EXPECTED (SAY_COL + 220)

#define GET_COL 160
#define GET_COL_2 (GET_COL + 160)

#define CHAR "abcde12345!@#$%"
#define NUMERIC 1234.1234
#define NEGATIVE -NUMERIC
#define ZERO 0
#define DATE stod("20251231")
#define LOGIC .T.

user function picClipper()
	local aOption := {;
		{"Say Picture Functions"       , { |aoParent| pic_01(aoParent) }},;
		{"Say Picture Template Symbols (1)", { |aoParent| pic_02(aoParent) }},;
		{"Say Picture Template Symbols (2)", { |aoParent| pic_03(aoParent) }},;
		{"Get Picture Functions", { |aoParent| pic_04(aoParent) }},;
		{"Get Picture Template Symbols", { |aoParent| pic_05(aoParent) }},;
		}

	public aCharPictures := {}
	public aGets := {}

	u_startRemoteLog("POC: picClipper")

	u_selectTest("Picture Clipper", aOption)

	u_stopRemoteLog()
return

//https://www.itlnet.net/programming/program/reference/c53g01c/ng12bdbd.html, acessado em 09/02/2026.
//https://tdn.totvs.com/pages/viewpage.action?pageId=273983558, acessado em 09/02/2026.
static function pic_01(aoParent)
	local nNumeric := NUMERIC
	local dDate := DATE
	local cCNPJ := "123456789000112"

	@SAY_ROW(1), SAY_COL_VALUE say "With Picture";
		of aoParent pixel
	@SAY_ROW(1), SAY_COL_EXPECTED say "Expected";
		of aoParent pixel

	@SAY_ROW(2), SAY_COL say "(@B) Display numbers left-justified" of aoParent pixels
	@SAY_ROW(2), SAY_COL_VALUE say nNumeric picture "@B 999,999,999.99" size 200,15 of aoParent pixels
	@SAY_ROW(2), SAY_COL_EXPECTED say "12,345.12" size 200,15 of aoParent pixels

	@SAY_ROW(3), SAY_COL say "(@C) Display CR after positive numbers" of aoParent pixels
	@SAY_ROW(3), SAY_COL_VALUE say nNumeric picture "@C 999,999,999.99" size 200,15 of aoParent pixels
	@SAY_ROW(3), SAY_COL_EXPECTED say "12,345.12 CR"  size 200,15 of aoParent pixels

	@SAY_ROW(4), SAY_COL say "(@D) Display date in SET DATE format" of aoParent pixels
	@SAY_ROW(4), SAY_COL_VALUE say dDate picture "@D" size 200,15 of aoParent pixels
	@SAY_ROW(4), SAY_COL_EXPECTED say dDate size 200,15 of aoParent pixels

	@SAY_ROW(5), SAY_COL say "(@E) Display date in British format" of aoParent pixels
	@SAY_ROW(5), SAY_COL_VALUE say dDate picture "@E" size 200,15 of aoParent pixels
	@SAY_ROW(5), SAY_COL_EXPECTED say dDate  size 200,15 of aoParent pixels

	@SAY_ROW(6), SAY_COL say "(@R) Insert non-template characters" of aoParent pixels
	@SAY_ROW(6), SAY_COL_VALUE say cCNPJ picture "@R 999,999,999/9999-99" size 200,15 of aoParent pixels
	@SAY_ROW(6), SAY_COL_EXPECTED say "123,456,789/0001-12"  size 200,15 of aoParent pixels

	@SAY_ROW(7), SAY_COL say "(@X) Display DB after negative numbers" of aoParent pixels
	@SAY_ROW(7), SAY_COL_VALUE say -nNumeric picture "@X 999,999.99" size 200,15 of aoParent pixels
	@SAY_ROW(7), SAY_COL_EXPECTED say "12,345.12 DB"  size 200,15 of aoParent pixels

	@SAY_ROW(8), SAY_COL say "(@Z) Display zeros as blanks" of aoParent pixels
	@SAY_ROW(8), SAY_COL_VALUE say 0 picture "@Z 999,999,999.99" size 200,15 of aoParent pixels
	@SAY_ROW(8), SAY_COL_EXPECTED say " "  size 200,15 of aoParent pixels

	@SAY_ROW(9), SAY_COL say "(@() Enclose negative numbers in parens" of aoParent pixels
	@SAY_ROW(9), SAY_COL_VALUE say -nNumeric picture "@( 999,999,999.99" size 200,15 of aoParent pixels
	@SAY_ROW(9), SAY_COL_EXPECTED say "(12,345.12)"  size 200,15 of aoParent pixels

	@SAY_ROW(10), SAY_COL say "(@!) Convert alpha characters to upper" of aoParent pixels
	@SAY_ROW(10), SAY_COL_VALUE say "abcde" picture "@!" size 200,15 of aoParent pixels
	@SAY_ROW(10), SAY_COL_EXPECTED say "ABCDE" size 200,15 of aoParent pixels

return

static function pic_02(aoParent)
	local nLine := 2

	@SAY_ROW(1), SAY_COL_VALUE say "With Picture";
		of aoParent pixel
	@SAY_ROW(1), SAY_COL_EXPECTED say "Expected";
		of aoParent pixel

	nLine := sayBlock(aoParent, nLine, "(A) Display digits for any data type", "AAAAAAAAAAAAAAA")
	nLine := sayBlock(aoParent, nLine, "(N) Display digits for any data type", "NNNNNNNNNNNNNNN")
	nLine := sayBlock(aoParent, nLine, "(X) Display digits for any data type", "XXXXXXXXXXXXXXX")
	nLine := sayBlock(aoParent, nLine, "(9) Display digits for any data type", "999999999999999")
	nLine := sayBlock(aoParent, nLine, "# Display digits for any data type", "###############")

return

static function pic_03(aoParent)
	local llogig := LOGIC
	local cChars := CHAR
	local nNumeric := NUMERIC

	@SAY_ROW(1), SAY_COL_VALUE say "With Picture";
		of aoParent pixel
	@SAY_ROW(1), SAY_COL_EXPECTED say "Expected";
		of aoParent pixel

	@SAY_ROW(2), SAY_COL say "(L) Display logicals as 'T' or 'F'" of aoParent pixels
	@SAY_ROW(2.5), SAY_COL+10 say "Boolean" of aoParent pixels
	@SAY_ROW(2.5), SAY_COL_VALUE say llogig picture "L" size 200,15 of aoParent pixels
	@SAY_ROW(2.5), SAY_COL_EXPECTED say "T" size 200,15 of aoParent pixels

	@SAY_ROW(3), SAY_COL+10 say "Boolean" of aoParent pixels
	@SAY_ROW(3), SAY_COL_VALUE say !llogig picture "L" size 200,15 of aoParent pixels
	@SAY_ROW(3), SAY_COL_EXPECTED say "F" size 200,15 of aoParent pixels

	@SAY_ROW(3.5), SAY_COL say "(Y) Display logicals as 'Y' or 'N'" of aoParent pixels
	@SAY_ROW(4), SAY_COL+10 say "Boolean" of aoParent pixels
	@SAY_ROW(4), SAY_COL_VALUE say llogig picture "Y" size 200,15 of aoParent pixels
	@SAY_ROW(4), SAY_COL_EXPECTED say "Y" size 200,15 of aoParent pixels

	@SAY_ROW(4.5), SAY_COL+10 say "Boolean" of aoParent pixels
	@SAY_ROW(4.5), SAY_COL_VALUE say !llogig picture "Y" size 200,15 of aoParent pixels
	@SAY_ROW(4.5), SAY_COL_EXPECTED say "N" size 200,15 of aoParent pixels

	@SAY_ROW(5), SAY_COL say "(!) Convert alpha character to upper" of aoParent pixels
	@SAY_ROW(5.5), SAY_COL+10 say "Mix" of aoParent pixels
	@SAY_ROW(5.5), SAY_COL_VALUE say cChars picture "!!!!!!!!!!!!!!!" size 200,15 of aoParent pixels
	@SAY_ROW(5.5), SAY_COL_EXPECTED say "ABCDE12345!#$%" size 200,15 of aoParent pixels

	@SAY_ROW(6), SAY_COL say "($) Display dollar sign instead of leading space in a numeric" of aoParent pixels
	@SAY_ROW(6.5), SAY_COL+10 say "Numérico" of aoParent pixels
	@SAY_ROW(6.5), SAY_COL_VALUE say nNumeric picture "$$$,$$9.99" size 200,15 of aoParent pixels
	@SAY_ROW(6.5), SAY_COL_EXPECTED say "$ 1,234.12" size 200,15 of aoParent pixels

	@SAY_ROW(7), SAY_COL say "(*) Display asterisk instead of leading space in a numeric" of aoParent pixels
	@SAY_ROW(7.5), SAY_COL+10 say "Numérico" of aoParent pixels
	@SAY_ROW(7.5), SAY_COL_VALUE say nNumeric picture "***,**9.99" size 200,15 of aoParent pixels
	@SAY_ROW(7.5), SAY_COL_EXPECTED say "**1,234.12" size 200,15 of aoParent pixels

	@SAY_ROW(8), SAY_COL say "(.)(,) Specify a decimal point and comma position" of aoParent pixels
	@SAY_ROW(8.5), SAY_COL+10 say "Numérico" of aoParent pixels
	//picture proposital simulando um código
	@SAY_ROW(8.5), SAY_COL_VALUE say nNumeric picture "9,9,9,9,9.999" size 200,15 of aoParent pixels
	@SAY_ROW(8.5), SAY_COL_EXPECTED say "  1,2,3,4.123" size 200,15 of aoParent pixels
return

static function pic_04(aoParent)
	local cChar := CHAR
	local nNumeric := NUMERIC
	local nNegative := NEGATIVE
	local nZero := ZERO
	local dDate := DATE
	local oGet1
	local oGet2
	local oGet3
	local oGet4
	local oGet5
	local oGet6
	local oGet7
	local oGet8
	local oGet9
	local oGet10
	local oGet11
	local oGet12
	local oGet13
	local oGet14
	local oGet15
	local oGet16

	@SAY_ROW(2), SAY_COL say "(@A) Allow only alpha characters";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oGet1;
		var cChar;
		picture "@A";
		of aoParent pixel

	@SAY_ROW(3), SAY_COL say "(@B) Display numbers left-justified";
		of aoParent pixel
	@SAY_ROW(3), GET_COL get oGet2;
		var nNumeric;
		picture "@B 999,999,999.99";
		of aoParent pixel

	@SAY_ROW(4), SAY_COL say "(@C) Display CR after positive numbers";
		of aoParent pixel
	@SAY_ROW(4), GET_COL get oGet3;
		var nNumeric;
		picture "@C 999,999,999.99";
		of aoParent pixel

	@SAY_ROW(5), SAY_COL say "(@D) Display dates in SET DATE format";
		of aoParent pixel
	@SAY_ROW(5), GET_COL get oGet4;
		var dDate;
		picture "@D";
		of aoParent pixel
	@SAY_ROW(5), GET_COL + 60 get oGet5;
		var nNumeric;
		picture "@D";
		of aoParent pixel

	@SAY_ROW(6), SAY_COL say "(@E) Display dates with day and month inverted";
		of aoParent pixel
	@SAY_ROW(6.5), SAY_COL + 5 say "independent of the current DATE SETting,";
		of aoParent pixel
	@SAY_ROW(7), SAY_COL + 5 say "numerics with comma and period reverse";
		of aoParent pixel
	@SAY_ROW(6), GET_COL get oGet6;
		var dDate;
		picture "@E";
		of aoParent pixel
	@SAY_ROW(6), GET_COL + 60 get oGet7;
		var nNumeric;
		picture "@E";
		of aoParent pixel

	@SAY_ROW(8), SAY_COL say "(@D) Display dates in SET DATE format";
		of aoParent pixel
	@SAY_ROW(8), GET_COL get oGet8;
		var dDate;
		picture "@D";
		of aoParent pixel
	@SAY_ROW(8), GET_COL + 60 get oGet9;
		var nNumeric;
		picture "@D";
		of aoParent pixel

	@SAY_ROW(9), SAY_COL say "(@K) Delete default text if first key is not a cursor key";
		of aoParent pixel
	@SAY_ROW(9), GET_COL get oGet10;
		var cChar;
		picture "@K";
		of aoParent pixel

	@SAY_ROW(10), SAY_COL say "(@R) Insert non-template characters in the display but";
		of aoParent pixel
	@SAY_ROW(10.5), SAY_COL + 5 say "do not save in the Get variable";
		of aoParent pixel
	@SAY_ROW(10), GET_COL get oGet11;
		var cChar;
		picture "@R XX.XXX-XX.XXX/XX.XXX";
		of aoParent pixel

	@SAY_ROW(11.5), SAY_COL say "(@S&lt;n&gt;) Allows horizontal scrolling within a Get.";
		of aoParent pixel
	@SAY_ROW(12), SAY_COL say "&lt;n&gt; is an integer that specifies the width of the region. &lt;n&gt;=5";
		of aoParent pixel
	@SAY_ROW(11.5), GET_COL get oGet12;
		var cChar;
		picture "@S5";
		of aoParent pixel

	@SAY_ROW(13), SAY_COL say "(@X) Display DB after negative numbers";
		of aoParent pixel
	@SAY_ROW(13), GET_COL get oGet13;
		var nNegative;
		picture "@X 999,999,999.99";
		of aoParent pixel

	@SAY_ROW(14), SAY_COL say "(@Z) Display zero as blanks";
		of aoParent pixel
	@SAY_ROW(14), GET_COL get oGet14;
		var nZero;
		picture "@Z";
		of aoParent pixel

	@SAY_ROW(15), SAY_COL say "(@() Display negative numbers in parentheses";
		of aoParent pixel
	@SAY_ROW(15.5), SAY_COL + 5 say " with leading spaces";
		of aoParent pixel
	@SAY_ROW(15), GET_COL get oGet15;
		var nNegative;
		picture "@( 999,999,999.99";
		of aoParent pixel

	@SAY_ROW(16.5), SAY_COL say "(@)) Display negative numbers in parentheses";
		of aoParent pixel
	@SAY_ROW(17), SAY_COL + 5 say "without leading spaces";
		of aoParent pixel
	@SAY_ROW(16.5), GET_COL get oGet15;
		var nNegative;
		picture "@) 999,999,999.99";
		of aoParent pixel

	@SAY_ROW(18), SAY_COL say "(@!) Convert alphabetic character to upper case";
		of aoParent pixel
	@SAY_ROW(18), GET_COL get oGet16;
		var cChar;
		picture "@!";
		of aoParent pixel

return

static function pic_05(aoParent)
	local cChar := CHAR
	local nNumeric := NUMERIC
	local llogig := LOGIC
	local oGet1
	local oGet2
	local oGet3
	local oGet4
	local oGet5
	local oGet6
	local oGet7
	local oGet8
	local oGet9
	local oGet10
	local oGet11
	local oGet12
	local oGet13
	local oGet14

	@SAY_ROW(2), SAY_COL say "(A) Allow only alpha characters";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oGet1;
		var cChar;
		picture "AAAAAAAAAAAAAAA";
		of aoParent pixel

	@SAY_ROW(3), SAY_COL say "(N) Allow only alphabetic and numeric characters";
		of aoParent pixel
	@SAY_ROW(3), GET_COL get oGet1;
		var cChar;
		picture "NNNNNNNNNNNNNNN";
		of aoParent pixel

	@SAY_ROW(4), SAY_COL say "(N) Allow any character";
		of aoParent pixel
	@SAY_ROW(4), GET_COL get oGet2;
		var cChar;
		picture "XXXXXXXXXXXXXXX";
		of aoParent pixel

	@SAY_ROW(5), SAY_COL say "(9) Allow digits for any data type including sign for numerics";
		of aoParent pixel
	@SAY_ROW(5), GET_COL get oGet3;
		var cChar;
		picture "999999999999999";
		of aoParent pixel
	@SAY_ROW(5), GET_COL + 80 get oGet4;
		var nNumeric;
		picture "999999999999999";
		of aoParent pixel

	@SAY_ROW(6), SAY_COL say "(#) Allow digits, signs and spaces for any data type";
		of aoParent pixel
	@SAY_ROW(6), GET_COL get oGet5;
		var cChar;
		picture "###############";
		of aoParent pixel

	@SAY_ROW(7), SAY_COL say "(L) Allow only T, F, Y or N";
		of aoParent pixel
	@SAY_ROW(7), GET_COL get oGet6;
		var llogig;
		picture "L";
		of aoParent pixel

	@SAY_ROW(8), SAY_COL say "(Y) Allow only Y or N";
		of aoParent pixel
	@SAY_ROW(8), GET_COL get oGet7;
		var llogig;
		picture "L";
		of aoParent pixel

	@SAY_ROW(9), SAY_COL say "(!) Convert alphabetic character to upper case";
		of aoParent pixel
	@SAY_ROW(9), GET_COL get oGet8;
		var cChar;
		picture "!!!!!!!!!!!!!!!";
		of aoParent pixel

	@SAY_ROW(10), SAY_COL say "($) Display a dollar sign in place of a leading";
		of aoParent pixel
	@SAY_ROW(10.5), SAY_COL + 10 say "space in a numeric";
		of aoParent pixel
	@SAY_ROW(10), GET_COL get oGet9;
		var nNumeric;
		picture "$$$,$$$,$$9.99";
		of aoParent pixel
	@SAY_ROW(10), GET_COL + 80 get oGet10;
		var nNumeric;
		picture "$$$,$$$,$$9.9999";
		of aoParent pixel

	@SAY_ROW(11.5), SAY_COL say "(*) Display an asterisk in place of a leading";
		of aoParent pixel
	@SAY_ROW(12), SAY_COL + 10 say "space in a numeric";
		of aoParent pixel
	@SAY_ROW(11.5), GET_COL get oGet11;
		var nNumeric;
		picture "***,***,**9.99";
		of aoParent pixel
	@SAY_ROW(11.5), GET_COL + 80 get oGet12;
		var nNumeric;
		picture "***,***,**9.9999";
		of aoParent pixel

	@SAY_ROW(13), SAY_COL say "(.)(,) Display a decimal point and comma";
		of aoParent pixel
	@SAY_ROW(13), GET_COL get oGet13;
		var nNumeric;
		picture "999,999,999.99";
		of aoParent pixel
	@SAY_ROW(13), GET_COL + 80 get oGet14;
		var nNumeric;
		picture "999,999,999.9999";
		of aoParent pixel
return

static function sayBlock(aoParent, anLine, acCaption, acPicture)
	local nNumeric := NUMERIC
	local dDate := DATE
	local cChars := CHAR
	local cCNPJ := "123456789000112"
	local llogig := .T.

	@SAY_ROW(anLine), SAY_COL say acCaption of aoParent pixels
	@SAY_ROW(anLine + 0.5), SAY_COL+10 say "Numeric" of aoParent pixels
	@SAY_ROW(anLine + 0.5), SAY_COL_VALUE say nNumeric picture acPicture size 200,15 of aoParent pixels
	@SAY_ROW(anLine + 0.5), SAY_COL_EXPECTED say "???????????" size 200,15 of aoParent pixels

	@SAY_ROW(anLine + 1), SAY_COL+10 say "Date" of aoParent pixels
	@SAY_ROW(anLine + 1), SAY_COL_VALUE say dDate picture acPicture size 200,15 of aoParent pixels
	@SAY_ROW(anLine + 1), SAY_COL_EXPECTED say "???????????" size 200,15 of aoParent pixels

	@SAY_ROW(anLine + 1.5), SAY_COL+10 say "Boolean" of aoParent pixels
	@SAY_ROW(anLine + 1.5), SAY_COL_VALUE say llogig picture acPicture size 200,15 of aoParent pixels
	@SAY_ROW(anLine + 1.5), SAY_COL_EXPECTED say "???????????" size 200,15 of aoParent pixels

	@SAY_ROW(anLine + 2), SAY_COL+10 say "CNPJ" of aoParent pixels
	@SAY_ROW(anLine + 2), SAY_COL_VALUE say cCNPJ picture acPicture size 200,15 of aoParent pixels
	@SAY_ROW(anLine + 2), SAY_COL_EXPECTED say "???????????" size 200,15 of aoParent pixels

	@SAY_ROW(anLine + 2.5), SAY_COL+10 say "Mix" of aoParent pixels
	@SAY_ROW(anLine + 2.5), SAY_COL_VALUE say cChars picture acPicture size 200,15 of aoParent pixels
	@SAY_ROW(anLine + 2.5), SAY_COL_EXPECTED say "???????????" size 200,15 of aoParent pixels

return anLine + 3
