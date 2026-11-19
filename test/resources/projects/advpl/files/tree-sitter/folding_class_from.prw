// Do not submit this file to the repository if any corrections are made.
#include "totvs.ch"

class Cat from Animal
  data cName
  data nAge
  method new()
endclass

method new() class Cat
  ::cName := "felix"
return self
