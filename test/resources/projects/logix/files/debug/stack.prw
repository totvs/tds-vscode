//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"

user function stack()
    local l_index := -1
	local l_number := -1

    conout(">>> Local variables")
	_local()

    conout(">>> Private variables")
	_private()

    conout(">>> All scope variables")
	_allScope()

return

static function _local()
    local l_index
	local l_number := 0
	local l_date := stod("20220101")
	local l_string := "This is string"
	local l_boolean := .f.
	local l_codeBlock := { |x| conout(x) }

    conout(">>> Loop")
	for l_index := 1 to 5
        l_number += 1
        l_date += 1
        l_string += "#"
	    l_boolean = !l_boolean
		conout(l_index)
	next

    conout(">>> Codeblock")
	eval(l_codeBlock, "This is codeBlock. Exec 1")

return

static function _private()
	private p_number := 1
	private p_date := stod("20220101")
	private p_string := "This is private-1"
	private p_boolean := .f.
	private p_codeBlock := { |x| conout("L1" + x) }

    conout(">>> Call Private level 1")
	listPrivate()

	conout(">>> Call Private level 2")
	_private_2()

	conout(">>> Call Private level 3")
	_private_3()

return

static function _private_2()
	p_number := 11
	p_date := stod("20220102")
	p_string := "This is private-2"
	p_boolean := .t.
	p_codeBlock := { |x| conout("L2" + x) }

    conout(">>> Private level 2")
	listPrivate()
return

static function _private_3()
	private p_number := 3
	private p_date := stod("20220103")
	private p_string := "This is private-3"
	private p_boolean := nil
	private p_codeBlock := { |x| conout("L3" + x) }

    conout(">>> Private level 3")
	listPrivate()
return

static function _allScope()
    local l_index
	local l_number := 0
	local l_date := stod("20220101")
	local l_string := "This is string"
	local l_boolean := .f.
	local l_codeBlock := { |x| conout(x) }

	public x_today := date()

	private a_number := 1
	private a_date := stod("20220101")
	private a_string := "This is private-1"
	private a_boolean := .f.
	private a_codeBlock := { |x| conout("L1" + x) }

return

static function listPrivate()
	conout(p_number)
	conout(p_date)
	conout(p_string)
	conout(p_boolean)
	conout(p_codeBlock)
return
