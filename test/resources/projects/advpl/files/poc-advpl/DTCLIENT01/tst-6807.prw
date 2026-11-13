#include 'protheus.ch'

#define SAY_ROW(x) (015 * (x))

#define SAY_COL 010
#define SAY_COL_2 (SAY_COL + 160)
#define GET_COL 080
#define GET_COL_2 (GET_COL + 160)

#define IDX_PICTURE 1
#define IDX_EXPECTED 2
#define IDX_TYPE  3
#define IDX_DATA  4
#define IDX_VALID  5

#define DATA_CNPJ_EMPTY space(18)
#define DATA_CELULAR "+12(34)5-6978-9012"
#define DATA_CELULAR_RAW "1234569789012"
#define DATA_CNPJ_2026_04 "ab.971.297/0001-38"
#define DATA_CNPJ_2026_04_RAW "ab971297000138"
#define DATA_CPF "972.769.720-89"
#define DATA_CPF_RAW "97276972089"
#define DATA_CNPJ "87.092.634/0001-08"
#define DATA_CNPJ_RAW "87092634000108"
#define DATA_TEXT "Donald Duck         "
#DEFINE DATA_COORDS_RAW "1234567"
#DEFINE DATA_COORDS "123"+chr(176)+" 45' 67"
#DEFINE DATA_CRAZY_RAW "12ABCD123"
#DEFINE DATA_CRAZY "[ID:_12.a.B-cd/123]"

//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-6807
//Falha no Cadastro de Vendedor (MATA040) no campo A3_CGC
user function tst6807()
	local aOption := {;
		{"CNPJ or CPF", { |aoParent| proc_01(aoParent) }},;
		{"Mixed", { |aoParent| proc_02(aoParent) }},;
		{"Using Arrows", { |aoParent| proc_03(aoParent) }},;
		}
	u_startRemoteLog("POC: tst6807")

	u_selectTest("DTCLIENT01-6807", aOption)

	u_stopRemoteLog()
return

static function proc_01(aoParent)
	local i
	local oGet := nil

	public aCharPictures := {;
		{ "@!R 99.999.999/9999-99", "CNPJ", "C", DATA_CNPJ_RAW, .t. },;
		{ "@! 99.999.999/9999-99", "CNPJ", "C", DATA_CNPJ, .t. },;
		{ "@!R NN.NNN.NNN/NNNN-99", "CNPJ (04/2026)", "C", DATA_CNPJ_2026_04_RAW, .t. },;
		{ "@! NN.NNN.NNN/NNNN-99", "CNPJ (04/2026)", "C", DATA_CNPJ_2026_04, .t. },;
		{ "@R 999.999.999-99", "CPF", "C", DATA_CPF_RAW, .t. },;
		{ "999.999.999-99", "CPF", "C", DATA_CPF, .t. },;
		{ "@!R NN.NNN.NNN/NNNN-99", "CNPJ or CPF", "C", DATA_CNPJ_EMPTY, .t. },;
		{ "@! NN.NNN.NNN/NNNN-99", "CNPJ or CPF", "C", DATA_CNPJ_EMPTY, .t. },;
		}

	public aGets := {}

	@SAY_ROW(1), SAY_COL  say "Field / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Picture / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := nil

		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

	aAdd(aGets, displayAux(Len(aCharPictures)+1, aoParent))

return

static function proc_02(aoParent)
	local i
	local oGet := nil

	public aCharPictures := {;
		{ "@R +99(99)9-9999-9999", "Celular", "C", DATA_CELULAR_RAW, .f. },;
		{ "+99(99)9-9999-9999", "Celular", "C", DATA_CELULAR, .f. },;
		{ "@!", "Text", "C", DATA_TEXT, .f. },;
		{ "@R 999"+chr(176)+" 99' 99", "Coords", "C", DATA_COORDS_RAW, .f. },;
		{ "999"+chr(176)+" 99' 99", "Coords", "C", DATA_COORDS, .f. },;
		{ "@ER [ID:_99.A.A-XX/999]", "Crazy", "C", DATA_CRAZY_RAW, .f. },;
		{ "[ID:_99.A.A-XX/999]", "Crazy", "C", DATA_CRAZY, .f. },;
		}

	public aGets := {}

	@SAY_ROW(1), SAY_COL  say "Field / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Picture / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := nil

		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

	aAdd(aGets, displayAux(Len(aCharPictures)+1, aoParent))
return

static function proc_03(aoParent)
	local i
	local oGet := nil

	public aCharPictures := {;
		{ "@!R NN.NNN.NNN/NNNN-99", "CNPJ or CPF", "C", DATA_CNPJ_EMPTY, "31886555095   "  },;
		{ "@! NN.NNN.NNN/NNNN-99", "CNPJ or CPF", "C", DATA_CNPJ_EMPTY, "31.886.555/095 -  " },;
		{ "@!", "Text", "C", DATA_TEXT, "MICKEY MOUSE        " },;
		{ "@ER [ID:_99.A.A-XX/999]", "Crazy", "C", DATA_CRAZY_RAW, "98zYxW765" },;
		{ "[ID:_99.A.A-XX/999]", "Crazy", "C", DATA_CRAZY, "[ID:_98.z.Y-xW/765]" },;
		}

	public aGets := {}

	@SAY_ROW(1), SAY_COL  say "Field / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Picture / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := nil

		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

	aAdd(aGets, displayAux(Len(aCharPictures)+1, aoParent))

return

static function displayPic(anIndex, aaPicture, aoParent, avPrefix)
	local oGet := nil
	local oSay := nil
	local oSayRaw := nil
	local nRow := anIndex * 2
	local cData := ""

	if valtype(aaPicture) != "A"
		return
	endif

	cData := aaPicture[IDX_DATA];

	@SAY_ROW(nRow), SAY_COL say aaPicture[IDX_EXPECTED];
		of aoParent pixel

	if valType(aaPicture[IDX_VALID]) == "L"
		@SAY_ROW(nRow), GET_COL get oGet;
			var cData;
			picture aaPicture[IDX_PICTURE];
			size 110, 12;
			valid iif(aaPicture[IDX_VALID], validCNPJ(oGet, cData), validEmpty(oGet, cData));
			of aoParent pixel
	else
		@SAY_ROW(nRow), GET_COL get oGet;
			var cData;
			picture aaPicture[IDX_PICTURE];
			size 110, 12;
			valid validEqual(oGet, cData, aaPicture[IDX_VALID]);
			of aoParent pixel
	endif

	oGet:cName := "cData" + alltrim(str(anIndex))
	oGet:cReadVar := "cData" + alltrim(str(anIndex))
	u_OnEvent(oGet, "bChange")

	@SAY_ROW(nRow), SAY_COL + 190 say iif(aaPicture[IDX_PICTURE] == "", "(no picture)", aaPicture[IDX_PICTURE]);
		of aoParent pixel

	@SAY_ROW((nRow + 1.25)), GET_COL say oSay;
		prompt cData;
		size 110, 12;
		picture aaPicture[IDX_PICTURE];
		of aoParent pixel
	oSay:cName := "cSay" + alltrim(str(anIndex))
	oSay:cReadVar := "cSay" +  alltrim(str(anIndex))
	oSay:cReadVar := "cSay" +  alltrim(str(anIndex))
	//oSay:SetCSS( "{ background-color: rgb(75,75,75)")

	@SAY_ROW((nRow + 1.25)), GET_COL_2 say oSayRaw;
		prompt cData;
		size 110, 12;
		of aoParent pixel
	oSayRaw:cName := "cSayRaw" + alltrim(str(anIndex))
	oSayRaw:cReadVar := "cSayRaw" + alltrim(str(anIndex))
	//oSayRaw:SetCSS( "{ background-color: rgb(75,75,75)")
return oGet

/*
Utilizado para evitar a mudança de foco automática ao preencher o campo.
*/
static function displayAux(anIndex,  aoParent)
	local oGet := nil
	local nRow := 1; //(anIndex - 1) * 2

	public lCanNext  := .F.

	@SAY_ROW(nRow), GET_COL checkBox oGet;
		var lCanNext;
		prompt "Can I leave the field?";
		size 110, 12;
		of aoParent pixel

	oGet:cName := "lCanNext"
	oGet:cReadVar := "lCanNext"
	u_OnEvent(oGet, "bChange")

return oGet

static function cleanMask(acData, acMask)
	local cResult := acData

	cResult := strTran(cResult, ".", "")
	cResult := strTran(cResult, "/", "")
	cResult := strTran(cResult, "-", "")

return cResult

static function validCNPJ(aoSender, acData)
	local cData := cleanMask(acData, "99.999.999/9999-99")
	//não preparado para novo formato de CNPJ, que passa a valer a partir de 04/2026
	local lResult := CGC(cData)

	u_firedEvent(aoSender, "Valid: "+cValToChar(lResult))

return lCanNext //sempre retorna .t. para continuar o teste

static function validEmpty(aoSender, acData)
	local lResult := !vazio(acData)

	u_firedEvent(aoSender, "Valid: "+cValToChar(lResult))

return lCanNext .and. lResult

static function validEqual(aoSender, acData, acValue)
	local lResult := !vazio(acData)

	if lResult
		lResult := acData == acValue
	endif

	u_firedEvent(aoSender, "Valid: "+cValToChar(lResult) + " " + acValue)

return .T. //sempre retorna .t. para continuar o teste
