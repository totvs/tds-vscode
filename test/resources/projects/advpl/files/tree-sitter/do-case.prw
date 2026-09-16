#include "protheus.ch"

user function case()
    local nDia := 3
    local cNomeDia := ""

    do case
        case nDia == 1
            cNomeDia := "Domingo"
        case nDia == 2
            cNomeDia := "Segunda-feira"
        case nDia == 3
            cNomeDia := "Terça-feira"
        otherwise
            cNomeDia := "Outro dia"
    endCase

    msgInfo(cNomeDia)
return
