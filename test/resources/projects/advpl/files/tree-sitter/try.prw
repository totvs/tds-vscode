#include "totvs.ch"

user function exemplo()
 
    local oError := errorClass():new()
    try
        not_exist_function()
    catch oError
        if oError:description == "interfunctioncall: cannot find function chamadanaoexiste in appmap"
            conout("erro não encontrei esta função chamadanaoexiste") 
        endif
    endtry
return
