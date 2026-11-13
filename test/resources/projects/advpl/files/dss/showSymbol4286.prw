// Múltipla exibição de variável
// https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4286
// erros de compilação são esperados, não corrigir
#include "protheus.ch"

public x4286 := "pub:"
public x4286pub := "pub:"
static x4286sta := "sta:"

user function F4286()
	local x4286 := "loc:F4286"
	private x4286 := "pri:F4286"
	private x4286pri := "pri:F4286"
	static x4286sta := "sta:F4286"

	conout( x4286)
	conout( x4286pri)
	conout( y4286)
return

static function F4286_A(x4286)
	local y4286 := 9999
	local x4286 := "loc:F4286_A"
	static x4286 := "sta:F4286_A"
	private x4286pri := "pri:F4286_A"

	conout(x4286)
	conout(y4286)
return
