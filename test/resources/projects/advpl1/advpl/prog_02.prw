#include "totvs.ch"

static currentStatus := ""

static function prog_01()
	local  l4b := 0, l6 := 0, accumulatedValue   := 0

	l6++
	conout("XXXXXXXXXXXXXX")
	accumulatedValue += 1 + currentStatus

	accumulatedValue := accumulatedValue * accumulatedValue + accumulatedValue

	l4b := l4b * 2
	prog_01()
return

user function prog_02()
	local  l4 := 0, lineCount := 0, l8 := 0

	lineCount++

	l8 += 1
return
