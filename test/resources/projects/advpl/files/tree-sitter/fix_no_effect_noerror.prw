#include "protheus.ch"

user function uvfNoError()
  local nA := 1

  nA := 2 NOERROR
  conout(nA)
return
