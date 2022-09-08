#include "protheus.ch"
/*/{Protheus.doc} abc
Função simples com dois argumentos.
@type function   
@version  
@author acandido
@since 05/09/2022
@param p1, variant, param_description
@param p2, variant, param_description
@return variant, return_description
/*/ 
user function abc(p1,p2)
    local x
    local a,b,c := ""
    local abc
         local y
     

    abc()

    
     abc1()
    
return


Function u_TLPPIncs()
  Local lRet := .F.
  Local cRet := ""
  Local aMessages := {}
  Local nI := 0

  ConOut("Getting TLPP includes ...")
  lRet := tlpp.environment.getIncludesTLPP(@cRet, @aMessages)

  If(lRet != .T.)
    ConOut("Error: " + cValToChar(cRet))
    For nI := 1 to Len(aMessages)
      ConOut(cValToChar(nI) + " Error: " + cValToChar(aMessages[nI]))
    Next
  Else
    ConOut("OK. 'includes' extracted on path: " + cValToChar(cRet))
  EndIf
Return lRet
