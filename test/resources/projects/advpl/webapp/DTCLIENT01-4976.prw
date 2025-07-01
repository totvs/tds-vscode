#include 'protheus.ch'
#include 'parmtype.ch'
#include 'totvs.ch'
#Include "RwMake.Ch"
#include "tbiconn.ch"

user function F4976()
	Local oDlg, oButton1, oButton2, oButton3, oButton4

	PREPARE ENVIRONMENT EMPRESA ("T1") FILIAL ("D MG 01")

	DEFINE DIALOG oDlg TITLE "Teste ShellExecute" FROM 180,180 TO 550,700 PIXEL

	oButton1 := TButton():New( 024, 010, "Abre PDF"      ,oDlg,	{|| ShellExecute( "Open", "C:\teste\pdf-linux-tec.pdf", "", "TESTE", 1 )  }, 75,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oButton2 := TButton():New( 038, 010, "Abre NotePad++",oDlg, {|| ShellExecute( "open", "M:\protheus\appServer\onca-broker\start-broker.bat", "", "TESTE", 1 ) }, 75,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oButton3 := TButton():New( 052, 010, "Abre Browser"  ,oDlg,	{|| ShellExecute( "open", "http://www.google.com.br", "", "TESTE", 1 )  }, 75,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oButton4 := TButton():New( 104, 108, "Fechar"        ,oDlg,	{|| oDlg:end()  }, 96,10,,,.F.,.T.,.F.,,.F.,,,.F. )

	ACTIVATE DIALOG oDlg CENTERED

	Conout ('Chamada de funcao de usuario via Client')

Return
