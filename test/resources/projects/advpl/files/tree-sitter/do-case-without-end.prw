#include "protheus.ch"

user function case()
    local nDay := 3
    local cDayName := ""

    do case
        case nDay == 1
            cDayName := "Domingo"
        case nDay == 2
            cDayName := "Segunda-feira"
        case nDay == 3
            cDayName := "Terça-feira"
        otherwise
            cDayName := "Outro dia"


    msgInfo(cDayName)
return
