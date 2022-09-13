/*
https://www.universoadvpl.com/advpl-funcoes/
http://tdn.totvs.com/pages/viewpage.action?pageId=6063792

Retorna um ou mais arrays contendo os dados das funções contidas no RPO - Repositório Portável de Objetos, a partir de uma máscara.
http://tdn.totvs.com/display/tec/GetFuncArray 

Retorna um array com o nome dos fontes compilados.
http://tdn.totvs.com/display/tec/GetSrcArray

Retorna um array multidimensional com todas as informações das propriedades da instância da classe contida no objeto informado como parâmetro
http://tdn.totvs.com/display/tec/ClassDataArr

LIsta Funcoes de BIN
__funarr()
*/

#include "totvs.ch"
#include "fileio.ch"

// Recupera funcoes e tipos de parametros
function u_get_func(target)
	conout("** TDS: running getFunctionsInfo")
	conout(target)
	if target == nil
		target = "W:\ws_tds_vscode\tds-vscode\test\resources\projects\advpl\files"
	endif
	conout("Target: " + target)
	nHandle := fcreate(target+'\funcs.txt', FC_NORMAL)
	If nHandle == -1
		MsgStop('Erro de abertura : FERROR '+str(ferror(),4))
		return
	Else
		FSeek(nHandle, 0, FS_END)
	endif

	doFunction(nHandle)

	fclose(nHandle)

	conout("** TDS: finished getFunctionsInfo")

return

static function doFunction(nHandle)
// Lista de funcoes ordenada
	local i
	local aFuncs := __funarr()
	aSort(aFuncs, , , {|x,y| lower(x[1]) < lower(y[1])})

	for i := 1 to len(aFuncs)
		FWrite(nHandle, lower(aFuncs[i,1]))
		FWrite(nHandle, ";")
		FWrite(nHandle, aFuncs[i,2])
		FWrite(nHandle, chr(10))
	next i

return

// Converte tipos de variaveis
static function getParamType(cParam)
	retParam := cParam
	do case
	case subs(cParam, 1, 1) == "A"
		retParam := "array"
	case subs(cParam, 1, 1) == "N"
		retParam := "numeric"
	case subs(cParam, 1, 1) == "D"
		retParam := "date"
	case subs(cParam, 1, 1) == "C"
		retParam := "character"
	case subs(cParam, 1, 1) == "O"
		retParam := "object"
	case subs(cParam, 1, 1) == "B"
		retParam := "block"
	case subs(cParam, 1, 1) == "L"
		retParam := "logical"
	case subs(cParam, 1, 1) == "*"
		retParam := "any"
	case subs(cParam, 1, 1) == "J"
		retParam := "json"
	endCase
return retParam
