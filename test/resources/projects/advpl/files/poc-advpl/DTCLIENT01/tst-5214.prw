#include "protheus.ch"

#include "tbiconn.ch"

user function tst5214()
	local targetDir := ""
	PREPARE ENVIRONMENT EMPRESA "T1" FILIAL "D MG 01"

	targetDir:= cGetFile( 'Arquivos PDF |*.PDF' , 'Selecine o arquivo...', 0, 'C:\teste\', .T., nOR( 16,128 ),.F.)

	alert(targetDir)
return
