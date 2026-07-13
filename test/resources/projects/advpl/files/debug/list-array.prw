/*
#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#
*/

#include "totvs.ch"

/*/{Protheus.doc} outArray()

Prints each item from an array to the console output.
@type user function
@sample outArray({"A", "B", "C"})
@param AArray - Array with values to be listed
@return Nil
@author Copilot
@since 10/06/2026
@version 1.0
*/

user function outArray(AArray)
	local _index := 0

	conout("start list array")

	for _index := 1 TO len(AArray)
		conout(AArray[_index])
	next

	conout("end list array")

return
