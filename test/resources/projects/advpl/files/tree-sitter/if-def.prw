#include "totvs.ch"

#ifdef	pp_ifdef_directive
user function f1()
#endif

#ifndef	pp_ifndef_directive
#ifdef inner
#endif
#endif

#ifdef	ifdef_with_else

#else	

#endif //pp_endif_directive


user function main()
    local a, b, c
    a := row(1)
