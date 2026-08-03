#include "protheus.ch"
#include 'protheus.ch'

user function stringStyle()
	local n := "1"
	local total := '2'
	local x
	
	n := n + '0'
	total := total + "10"
	x := 30

	conout('n: ' + str(n) + ;
	", total: " + str(total) + ;
	", x: " + str(x))
	
"\tx := 'ABC\"DEF'",
"\tx := 'ABC\"DEF' + 'ABC\"DEF'",
"\tx := '\"ABC\"DEF\"'",
"\tx := '\"ABC\"DEF\"' + '\"ABC\"DEF\"'",
"\tx := \"ABC'DEF\"",
"\tx := \"'ABC'DEF'\"",
	
	return