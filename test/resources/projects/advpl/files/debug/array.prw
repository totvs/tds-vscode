/*
#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#
*/

#include "totvs.ch"

user function array1()
	local list_50   := array(50)
	local list_100  := array(100)
	local list_101  := array(101)
	local list_199  := array(199)
	local list_200  := array(200)
	local list_223  := array(223)
	local list_250  := array(250)
	local list_500  := array(500)
	local list_1000 := array(1000)
	local _index    := 0

	conout("start array")

	for _index := 1 TO 1000
		if (_index < 51)
		  list_50[_index] := _index
		endif

		if (_index < 101)
		  list_100[_index] := _index
		endif

		if (_index < 102)
		  list_101[_index] := _index
		endif

		if (_index < 200)
		  list_199[_index] := _index
		endif

		if (_index < 201)
		  list_200[_index] := _index
		endif

		if (_index < 224)
		  list_223[_index] := _index
		endif

		if (_index < 251)
		  list_250[_index] := _index
		endif

		if (_index < 501)
		  list_500[_index] := _index
		endif

		list_1000[_index] := _index
	next

	conout("display com erro")
   	conout( list_1000[2000])

	conout("depois do display com erro")

return

user function array2()
	local list_200   := array(200)
	local _index    := 0

	conout("start array")

	for _index := 1 TO 200

		list_200[_index] := {}

		while len(list_200[_index]) < 200 
			aAdd(list_200[_index], len(list_200[_index])+201)
		enddo

	next

	conout("display com erro")

return
