#include "protheus.ch"

user function codeBlocks()
local bSimple := { || conout("simples") }
local bParams := {|x, y| x + y}
local bParams2 := {|x, y|;
(x + y) * 10 }
local bMultiline := { |x|;
x := x + 1,;
conout("X: " + str(x));
}
conout(Eval(bMultiline, 5))

private bCollapse := { |x|;
conout(x);
}
conout(Eval(bCollapse, 1))

if .t.
bMultiline := { |x,y|;
conout("x:",x,"y:",y),;
conout(x+y);
}
endif
return
