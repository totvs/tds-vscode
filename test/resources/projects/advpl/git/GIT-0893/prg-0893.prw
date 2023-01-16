#include "protheus.ch"

class AB
	data bT
	data bF
	data dt
	data c
	data n0
	data n2
	data n8
	data cb

	method ab()
endclass

method ab() ;
	class AB
	
	::bT := .t.
	::bF := .F.
	::dt := date()
	::c  := "string"
	::n0 := 123
	::n2 := 123.45
	::n8 := 123.45678
	::cb := { |p1,p1| 10+20}

	private ondeEstou := "class ab"


return
