#include "protheus.ch"

class Animal
data cName
data nAge
method new() constructor
method speak()
endclass

method new() class Animal
::cName := "rex"
return self

method speak() class Animal
conout(::cName)
return
