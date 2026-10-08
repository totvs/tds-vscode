#include "protheus.ch"



Class FWAdvplParser From FWLexer
	Data lInObjectAccess
	Method New()
EndClass


Method New(lFilter) Class FWAdvplParser
	Default lFilter := .F.
return

user function tst_class()
	local  advplParser := FWAdvplParser():new()

