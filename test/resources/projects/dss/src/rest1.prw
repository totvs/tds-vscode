//Bibliotecas
#Include "Totvs.ch"
#Include "RESTFul.ch"
#Include "TopConn.ch"
  
/*/{Protheus.doc} WSGrupoProdAnt
WS Grupo de Produtos
@type WSRESTFUL
@author Atilio
@since 02/10/2022
@version 1.0
@obs Codigo gerado automaticamente pelo Autumn Code Maker
@see http://autumncodemaker.com
/*/
WSRESTFUL WSGrupoProdAnt DESCRIPTION 'WS Grupo de Produtos'
    //Atributos
    WSDATA id         AS STRING
   
    //Métodos
    WSMETHOD GET  ID  DESCRIPTION 'Retorna o registro pesquisado' WSSYNTAX '/WSGrupoProdAnt/get_id?{id}'                       PATH 'get_id'        PRODUCES APPLICATION_JSON
END WSRESTFUL
  
/*/{Protheus.doc} WSMETHOD GET ID
Busca registro via ID
@author Atilio
@since 02/10/2022
@version 1.0
@param id, Caractere, String que será pesquisada através do MsSeek
@obs Codigo gerado automaticamente pelo Autumn Code Maker
@see http://autumncodemaker.com
/*/
  
WSMETHOD GET ID WSRECEIVE id WSSERVICE WSGrupoProdAnt
    Local lRet       := .T.
    Local jResponse  := JsonObject():New()
    Local cAliasWS   := 'SBM'
  
    //Se o id estiver vazio
    If Empty(::id)
        //SetRestFault(500, 'Falha ao consultar o registro') //caso queira usar esse comando, você não poderá usar outros retornos, como os abaixo
        Self:setStatus(500) 
        jResponse['errorId']  := 'ID001'
        jResponse['error']    := 'ID vazio'
        jResponse['solution'] := 'Informe o ID'
    Else
        DbSelectArea(cAliasWS)
        (cAliasWS)->(DbSetOrder(1))
  
        //Se não encontrar o registro
        If ! (cAliasWS)->(MsSeek(FWxFilial(cAliasWS) + ::id))
            //SetRestFault(500, 'Falha ao consultar ID') //caso queira usar esse comando, você não poderá usar outros retornos, como os abaixo
            Self:setStatus(500) 
            jResponse['errorId']  := 'ID002'
            jResponse['error']    := 'ID não encontrado'
            jResponse['solution'] := 'Código ID não encontrado na tabela ' + cAliasWS + ', informe outro código'
        Else
            //Define o retorno
            jResponse['grupo'] := (cAliasWS)->BM_GRUPO 
            jResponse['desc'] := (cAliasWS)->BM_DESC 
        EndIf
    EndIf
  
    //Define o retorno
    Self:SetContentType('application/json')
    Self:SetResponse(jResponse:toJSON())
Return lRet
