#include "protheus.ch"
#include "tbiconn.ch"
#include "myIncs/alan.ch"

user function z()
	@ 10, 5 SAY oSay  PROMPT cText PICTURE cPict OF FONT oFont PIXEL COLORS nClrText ,nClrBack SIZE nWidth, nHeight HTML
return

	class abc from pai
		data a
	endclass

user function x()
	local abc := AQUI

//local srv := nil


	prepare  ENVIRONMENT  EMPRESA '99' FILIAL '01' USER 'admin' PASSWORD 'admin' TABLES 'SA1'

	meu comando abc
return

user function y()
	meu comando AQUI

return
