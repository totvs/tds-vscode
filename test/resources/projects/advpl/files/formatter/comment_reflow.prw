#include "protheus.ch"

user function commentreflow()
	local n := 1
	// short comment that stays as a single line and would be a candidate for wrapping if
	// commentReflow was implemented to reflow overly long comment lines
	/*
	 * this is a single line block comment that is also quite long and should be wrapped into
	 * multiple lines when commentReflow is enabled and left alone otherwise
	 */
	conout(str(n))

return
