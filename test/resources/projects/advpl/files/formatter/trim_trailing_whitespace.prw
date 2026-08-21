//Recommendation: turn on 'show whitespaces'
#include "protheus.ch"

user function trimTrailingWhitespace()

// The line below ends with: \r\n
local x1 := 1

// The line below ends with: (space)\r\n
local x2 := 1 

// The line below ends with: (space)(space)\r\n
local x2 := 1  

// The line below ends with: \t\t\t\r\n
local x3 := 1			

// The line below ends with: \t\r\n
local x4 := 1	

// The line below ends with: \t\r\n
