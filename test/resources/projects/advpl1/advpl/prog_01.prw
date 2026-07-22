
#include "totvs.ch"

// public _pub := 10
// static _stat := 10
// private _priv := 10

/*/{Protheus.doc} prog_01
Prog_01.prw

@type static function
@sintax prog_01() => nil
@return nil
/*/


static function prog_01()
	local index := 0
	//_index++

	index := 1
	_pub := 20

	conout("Program 01")
	listSa1Customers()
	prog_01()

	tlpp1.u_calcFactorial(5)
	tlpp1.U_a()
return

//------------------------------
/*/{Protheus.doc} listSa1Customers
Lista clientes da tabela SA1.

@type static function
@sintax listSa1Customers() => nil
@return nil
/*/
static function listSa1Customers()
	local aArea := GetArea()
	local cAlias := GetNextAlias()
	local cLine := ""
	local cDateLimit := DToS(Date() - 30)

	BeginSQL Alias cAlias
		SELECT DISTINCT
			SA1.A1_COD  AS A1_COD,
			SA1.A1_LOJA AS A1_LOJA,
			SA1.A1_NOME AS A1_NOME
		FROM %table:SA1% SA1
			INNER JOIN %table:SF2% SF2
				ON SF2.%notDel%
				AND SF2.F2_FILIAL = %xfilial:SF2%
				AND SF2.F2_CLIENTE = SA1.A1_COD
				AND SF2.F2_LOJA = SA1.A1_LOJA
				AND SF2.F2_EMISSAO >= %exp:cDateLimit%
		WHERE SA1.%notDel%
			AND SA1.A1_FILIAL = %xfilial:SA1%
		ORDER BY SA1.A1_COD, SA1.A1_LOJA
	EndSQL

	if (cAlias)->(Eof())
		ConOut("Nenhum cliente com compras nos ultimos 30 dias.")
	else
		ConOut("Clientes com compras nos ultimos 30 dias:")

		while !(cAlias)->(Eof())
			cLine := (cAlias)->A1_COD + "/" + (cAlias)->A1_LOJA + " - " + AllTrim((cAlias)->A1_NOME)
			ConOut(cLine)
			(cAlias)->(DbSkip())
		enddo
	endif

	(cAlias)->(DbCloseArea())
	RestArea(aArea)
Return

