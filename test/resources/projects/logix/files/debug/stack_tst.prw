//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"

#define TOTAL 100

user function stack_tst()

    local level := 0
	local oHello := THello():new("Olá Amigo!")
	local aList := {}
	local cMsg := "Apenas uma mensagem de teste"
	local flag := .t.

	private stack := {}
	
	asize(aList, 100)
	afill(aList, "****")

	subStack1(level, oHello, aList, cMsg, flag)
return

static function subStack1(level, obj, list, msg, flag)
    conout(">>> subStack 1=" + strZero(level,3))
	aAdd(stack, procname())
	
	local oHello := THello():new("Olá Amigo! " + strZero(level,3))
	conout(oHello:cmsg)

	private pilha := level
	
	flag = !flag

	level++
	if level < TOTAL
		subStack2(level, obj, list, msg, flag)
	endif

return

static function subStack2(level, obj, list, msg, flag)
    conout(">>> subStack 2=" + strZero(level,3))

	level++
	if level < TOTAL
		subStack3(level, obj, list, msg, flag)
	endif

return

static function subStack3(level, obj, list, msg, flag)
    conout(">>> subStack 3=" + strZero(level,3))

	level++
	if level < TOTAL
		subStack1(level, obj, list, msg, flag)
	endif

return
