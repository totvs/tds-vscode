// Do not submit this file to the repository if any corrections are made.
#include "totvs.ch"

static nStaticOk := 1

user function main()
  local nValue := 10
  static nAcc := 0

  nAcc := nAcc + nValue
  conout(nStaticOk)
  conout(nAcc)
return
