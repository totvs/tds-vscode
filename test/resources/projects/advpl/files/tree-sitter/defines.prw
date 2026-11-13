#include "totvs.ch"

#define MY_CONST 100
#define MODE
#define PSEUDO_FUN(x) (x*10)
#define another_define
//#define COMMENTED_DEFINE
#undef UNDEF_DEF

user function directives(p1)
  local nVar := MY_CONST
  
#define inner_define


  nVar := 20

  conout(MY_CONST)
  conout(MODE)
  conout(PSEUDO_FUNC(10))

return
