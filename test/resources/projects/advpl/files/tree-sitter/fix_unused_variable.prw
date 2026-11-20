#include "totvs.ch"

static nStaticUsed := 1

user function uvf2Single()
  local nUsed := 1
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

user function uvf2MultiCall()
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
  conout(nUsedE + nUsedF + nUsedG + nUsedI)
return

user function uvfForAfterLocal()
  local nTotal := 0
  local cName := "x", nCount := 1
  conout(cName)
  for nI := 1 to 10
    nTotal += nI
  next
  conout(nTotal + nCount)
return

user function uvfForNoLocal()
  conout("start")
  for nJ := 1 to 5
    conout(nJ)
  next
return

user function uvfForUpperLocal()
  LOCAL nSum := 0
  for nK := 1 to 3
    nSum += nK
  next
  conout(nSum)
return

user function uvfCommentEnd()
  local nUsedJ := 1, cUnusedBlk := "*/"
  conout(nUsedJ)
return
