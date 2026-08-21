#include "protheus.ch"
#include 'protheus.ch'

user function stringStyle()
local n := "1"
local total := '2'
local x1, x2, x3, x4, x5, x6

n := n + '0'
total := total + "10"
x := 30

conout('n: ' + str(n) + ;
", total: " + str(total) + ;
", x: " + str(x))

x1 := 'ABC"DEF'
x2 := 'ABC"DEF' + 'ABC"DEF'
x3 := '"ABC"DEF"'
x4 := '"ABC"DEF"' + '"ABC"DEF"'
x5 := "ABC'DEF"
x6 := "'ABC'DEF'"

return
