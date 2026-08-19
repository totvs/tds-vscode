#include "totvs.ch"
#include "debug.ch"

#define	pp_define_directive
#define row(x) (x*10)
#define row2    (x, y) (x*10, y*10)
#define print(msg) conout("warn: " + msg)
#define soma(x,y) x+y
#undef	pp_undef_directive

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
