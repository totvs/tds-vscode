// Do not submit this file to the repository if any corrections are made.
#include "totvs.ch"

class Animal
  method create()
  method speak()
endclass

method create() class Animal
  return self

method run() class Animal
  return nil

class Dog
  method bark()
end class

class Cat
  method meow()
endclass

method bark() class Dog
  return nil

method meow() class Cat
  return nil
