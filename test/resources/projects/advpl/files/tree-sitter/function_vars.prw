#include "totvs.ch"

static _nCounter := 0
// private _cPriv := "priv"
// private _dDate := date()
// public _cGlobal := "global"
// public _nPublic := 99
  
user function testvars()
  local nValue := 10
  local cName  := "test"
  local aList  := {}
  static nCounter := 0
  private cPriv := "priv"
  private dDate := date()
  public cGlobal := "global"
  public nPublic := 99

  conout(_dDate)
return
