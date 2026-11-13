#include "protheus.ch"

// Função principal
User Function tst5156()
	local aBrowse   := {;
		{'CLIENTE 001','RUA CLIENTE 001','BAIRRO CLIENTE 001'+CRLF+'BAIRRO CLIENTE 001'+CRLF+'BAIRRO CLIENTE 001'+CRLF+'BAIRRO CLIENTE 001'},;
		{'CLIENTE 002','RUA CLIENTE 002','BAIRRO CLIENTE 002'},;
		{'CLIENTE 003','RUA CLIENTE 003','BAIRRO CLIENTE 003'};
		}

	DEFINE DIALOG oDlg TITLE "DTCLIENT01-5156" FROM 180,180 TO 550,700 PIXEL

	oBrowse := TSBrowse():New(01,01,260,184,oDlg,,16,,5)
	oBrowse:AddColumn( TCColumn():New('Nome',,,{|| },{|| }) )
	oBrowse:AddColumn( TCColumn():New('Endereço',,,{|| },{|| }) )
	oBrowse:AddColumn( TCColumn():New('Bairro',,,{|| },{|| }) )
	oBrowse:SetArray(aBrowse)

	ACTIVATE DIALOG oDlg CENTERED
Return
