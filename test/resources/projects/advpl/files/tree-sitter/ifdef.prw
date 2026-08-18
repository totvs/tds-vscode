#include "totvs.ch"

#include	pp_include_directive //erro proposital para teste do parser
#include "debug.ch"

#ifdef	not_closed


#ifdef	pp_ifdef_directive
#endif

#ifndef	pp_ifndef_directive
#endif

#ifdef	ifdef_with_else

#else	

#endif	pp_endif_directive

//#command	pp_command_directive
//#xcommand	pp_xcommand_directive
//#translate	pp_translate_directive
//#xtranslate	pp_xtranslate_directive
//#pragma	pp_pragma_directive
//#error	pp_error_directive


user function main()
    local a, b, c
    a := row(1)
    b := row2(1, 2)
    c := soma(a, b)
    print("Resultado: " + c)
