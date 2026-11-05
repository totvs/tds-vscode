//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function commentReflow()
local n := 1

// single line comment paragraph that is clearly longer than ninety columns so it must be wrapped into two lines

// first paragraph of the line comment block long enough to exceed the configured maximum line length here
//
// second paragraph of the line comment block also long enough to exceed the configured maximum line length
//
// third paragraph of the line comment block again long enough to exceed the configured maximum line length too

/* single line block comment paragraph that is also quite long and should be wrapped into multiple lines here */

/* first block paragraph long enough to exceed the configured maximum line length and force a wrap here now

second block paragraph also long enough to exceed the configured maximum line length and force a wrap too

third block paragraph again long enough to exceed the configured maximum line length and force a wrap as well */

conout(str(n))
conout("For encoding validation: não, é, ção")

if (n == 1)
    conout("This is a very long line that should be wrapped into multiple lines by the

return
