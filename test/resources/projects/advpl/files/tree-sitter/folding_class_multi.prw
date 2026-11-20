#include "totvs.ch"

class Base
  data cId
  method new()
endclass

class Derived from Base
  data cName
  method new()
  method run()
endclass

method new() class Base
return self

method new() class Derived
return self

method run() class Derived
  conout("run")
return
