// Do not submit this file to the repository if any corrections are made.
#include "protheus.ch"

user function uvfNoEffect()
  local nA := 1
  local nB := 2

  nA + nB
  nB * 2
  nA := nA + nB
  conout(nA)
return
