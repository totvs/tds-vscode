#include "totvs.ch"

static nStaticUsed := 1
static nStaticLiteral := 2
static cStaticCall := conout("static")

user function uvfSingle()
  local cUnused
  local nUsed := 1

  for i := 1 to 10
    conout(i)
  next
  conout(nUsed)
  conout(nStaticUsed)
return

user function uvfLiteral()
  local nUnusedLit := 10
  local nUsedLit := 1
  conout(nUsedLit)
return

user function uvfMulti()
  local nUsedA := 1, cUnusedMid, nUsedB := 2
  conout(nUsedA + nUsedB)
return

user function uvfCall()
  local cUnusedCall := conout("called")
  local nUsedCall := 1
  conout(nUsedCall)
return

user function uvfMultiCall()
  local nUsedC := 1, cUnusedMulti := conout("multi"), nUsedD := 2
  conout(nUsedC + nUsedD)
return

class UvfClass
  method run()
endclass

method run() class UvfClass
  local cUnusedMethod
  conout("run")
return nil

user function uvfEdges()
  local cUnusedFirst, nUsedE := 1
  local nUsedF := 2, cUnusedLast
  local nUsedG := 3, cUnusedNote // trailing note
  local nUnusedTyped := 1 as numeric
  LOCAL nUsedI := "a,b", cUnusedStr
  static cUnusedStatic := conout("s")
  conout(nUsedE + nUsedF + nUsedG + nUsedI)
return
