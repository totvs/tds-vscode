//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function wrapArguments()
local n := 1
	conout("value one", "value two", "value three")
	myFunc(1)
conout("For encoding validation: não, é, ção")
myFunc2("p1", myFunc3("p3.1", "p3.2", "p3.3"), "p2")
myFunc2("p1", myFunc3("p3.1", "p3.2", "p3.3"), "p2", myFunc4("p4.1", myFunc42()))
 
return
