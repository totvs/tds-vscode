#include "totvs.ch"

static nStaticUsed := 1
static nStaticUnused := 2

user function main()
  local nUsed := 10
  local nUnused := 20
  static nStaticLocalUnused := 0

  conout(nUsed)
  conout(nStaticUsed)
return
