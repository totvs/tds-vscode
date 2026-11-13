#Include "PROTHEUS.CH"
#Include "APWEBSRV.CH"

// Declaração do WebService SOAP
WSSERVICE MeuServicoSoap DESCRIPTION "Descrição do meu Web Service SOAP" NAMESPACE "http://seusite.com.br"

    WSDATA cCodigo AS STRING
    WSDATA cRetorno AS STRING

    WSMETHOD RetornarCliente DESCRIPTION "Retorna dados do cliente com base no código"

ENDWSSERVICE

// Implementação do Método
WSMETHOD RetornarCliente WSRECEIVE cCodigo WSSEND cRetorno WSSERVICE MeuServicoSoap
    Local lRet := .T.
    
    // Lógica de negócio (ex: buscar no banco de dados)
    ::cRetorno := "Cliente encontrado: " + Alltrim(::cCodigo)
    
Return lRet
