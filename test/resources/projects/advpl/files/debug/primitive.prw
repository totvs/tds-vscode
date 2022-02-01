//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"

user function primitive()
    conout(">>> Local variables")
	_local()

return

static function _local()
    local index
	local number := 0
	local date := stod("20220101")
	local string := "This is string"
	local boolean := .f.

    conout(">>> Number")
	for index := 0 to 5
        number += 1
		conout(number)
	next

    conout(">>> Date")
	for index := 0 to 5
        date += 1
		conout(date)
	next

    conout(">>> String")
	for index = 0 to 5
        string += "#"+string
		conout(string)
	next

    conout(">>> Boolean")
	conout(boolean)
    boolean = !boolean
	conout(boolean)

return
