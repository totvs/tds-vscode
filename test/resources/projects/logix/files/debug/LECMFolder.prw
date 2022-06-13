#INCLUDE "LOGIX.CH"

#DEFINE DOCUMENT_NOT_FOUND   -1

#DEFINE DOCUMENT_ID           1
#DEFINE DOCUMENT_TYPE         2
#DEFINE DOCUMENT_DESCRIPTION  3

#DEFINE FOLDER_ID             1
#DEFINE FOLDER_DESCRIPTION    2

#DEFINE FOLDER_LOGIX          "Logix"
#DEFINE FOLDER_LOGIX_CMT      "Pasta com documentos relacionados ao ERP Logix"

#DEFINE FOLDER_DOCS_ASSOC     "Documentos Associados"
#DEFINE FOLDER_DOCS_ASSOC_CMT "Pasta com documentos associados aos registros do ERP Logix"

#DEFINE FOLDER_REPORT         "Relatórios"
#DEFINE FOLDER_REPORT_CMT     "Pasta com os relatórios gerados a partir do ERP Logix"

#DEFINE FOLDER_CARDS          "Formulários"
#DEFINE FOLDER_CARDS_CMT      "Pasta com os formulários gerados a partir do ERP Logix"

CLASS LECMFolder From LECM
    DATA nLogixId
    DATA nDocsAssocId
    DATA nReportId
    DATA nCardsId

    DATA oFolderService

    METHOD NewLECMFolder(cName) CONSTRUCTOR

    METHOD GetFolderService()
    METHOD SetFolderService(oFolderService)

    METHOD CreateFolder(nParentId,cDescription,cComments,lPrivate,cColleagueId)
    METHOD DeleteFolder(nFolderId,lDestroy)

    METHOD GetFolders(nParentId)
    METHOD GetFolder(cDescription,nParentId,lCreate,cComments,lPrivate,cColleagueId)
    METHOD GetFolderFiles(nFolderId)
    METHOD GetFolderDocuments(nFolderId)

    METHOD GetFolderLogix()
    METHOD GetFolderDocsAssociated()
    METHOD GetFolderReport()
    METHOD GetFolderCards()
END CLASS

METHOD NewLECMFolder(cName) CLASS LECMFolder
_Super:NewLECM(cName)

::cType := "LECMFOLDER"

::nLogixId     := -1
::nDocsAssocId := -1
::nReportId    := -1
::nCardsId     := -1

::oFolderService := WSFolderService():New()
::oFolderService:_URL := ( ::GetUrl() + "FolderService" )
Return

METHOD GetFolderService() CLASS LECMFolder
Return ::oFolderService

METHOD SetFolderService(oFolderService) CLASS LECMFolder
Return ::oFolderService := oFolderService

METHOD CreateFolder(nParentId,cDescription,cComments,lPrivate,cColleagueId) CLASS LECMFolder
Local nFolderId
Local oFolderService := ::GetFolderService()

Local oDocument
Local oSecurity
Local oApprover

Default nParentId := 0
Default lPrivate  := .F.

oDocument := GetDocument(self,nParentId,cDescription,cComments,lPrivate,cColleagueId)
oSecurity := GetSecurity(self,lPrivate,cColleagueId)
oApprover := GetApprover()

If  oFolderService:CreateFolder(::GetUserName(),::GetUserPassword(),::GetCompanyId(),oDocument,oSecurity,oApprover) .And. ;
    Len(oFolderService:oWSCreateFolderResult:oWSItem) > 0 .And. ;
    Upper(oFolderService:oWSCreateFolderResult:oWSItem[1]:cWebServiceMessage) == "OK"
    nFolderId := oFolderService:oWScreateFolderresult:oWsItem[1]:nDocumentId
Else
    nFolderId := DOCUMENT_NOT_FOUND
    ::SetErrorMessage(oFolderService:oWSCreateFolderResult:oWSItem[1]:cWebServiceMessage)
EndIf
Return nFolderId

METHOD DeleteFolder(nFolderId,lDestroy) CLASS LECMFolder
Local oFolderService := ::GetFolderService()

Default lDestroy := .F.

If !oFolderService:DeleteDocument(::GetUserName(),::GetUserPassword(),::GetCompanyId(),nFolderId,::GetColleagueId()) .Or. ;
   !(Upper(oFolderService:oWSDeleteDocumentresult:oWSItem[1]:cWebServiceMessage) == "OK")
    ::SetErrorMessage(oFolderService:oWSdeleteDocumentresult:oWsItem[1]:cWebServiceMessage)
    Return .F.
EndIf

If  lDestroy
    If  !oFolderService:DestroyDocument(::GetUserName(),::GetUserPassword(),::GetCompanyId(),nFolderId,::GetColleagueId()) .Or. ;
        !(Upper(oFolderService:oWSDestroyDocumentresult:oWSItem[1]:cWebServiceMessage) == "OK")
        ::SetErrorMessage(oFolderService:oWSDestroyDocumentresult:oWSItem[1]:cWebServiceMessage)
        Return .F.
    EndIf
EndIf
Return .T.

METHOD GetFolder(cDescription,nParentId,lCreate,cComments,lPrivate,cColleagueId) CLASS LECMFolder
Local aFolders  := ::GetFolders(nParentId)
Local nFolderId := 0

Local i := AScan(aFolders,{|x| x[FOLDER_DESCRIPTION] == cDescription })

If  i > 0
    nFolderId := aFolders[i][FOLDER_ID]
ElseIf lCreate
    nFolderId := ::CreateFolder(nParentId,cDescription,cComments,lPrivate,cColleagueId)
Else
    nFolderId := DOCUMENT_NOT_FOUND
EndIf
Return nFolderId

METHOD GetFolders(nParentId) CLASS LECMFolder
Local aFolders := {}
Local aDocuments := Nil

Default nParentId := 0

aDocuments := ::GetFolderDocuments(nParentId)
aEval(aDocuments,{|x| If(x[DOCUMENT_TYPE] == "1", aAdd(aFolders,{ x[DOCUMENT_ID],x[DOCUMENT_DESCRIPTION] }), /* else */) })
Return aFolders

METHOD GetFolderFiles(nParentId) CLASS LECMFolder
Local aFiles := {}
Local aDocuments := Nil

Default nParentId := 0

aDocuments := ::GetFolderDocuments(nParentId)
aEval(aDocuments,{|x| If(x[DOCUMENT_TYPE] != "1", aAdd(aFiles,{ x[DOCUMENT_ID],x[DOCUMENT_DESCRIPTION] }), /* else */) })
Return aFiles

METHOD GetFolderDocuments(nFolderId) CLASS LECMFolder
Local oWSItem

Local aDocuments := {}
Local oFolderService := ::GetFolderService()

If !oFolderService:GetChildren(::GetUserName(),::GetUserPassword(),::GetCompanyId(),nFolderId,::GetColleagueId())
    Return aDocuments
Else
    oWSItem := oFolderService:oWSGetChildrenDocument:oWSItem
EndIf

aEval(oWSItem,{|x| If(x:nDocumentId != Nil,aAdd(aDocuments,{x:nDocumentId,x:cDocumentType,x:cDocumentDescription}),/* else */) })
Return aDocuments

METHOD GetFolderLogix() CLASS LECMFolder
If  ::nLogixId < 0
    ::nLogixId := ::GetFolder(FOLDER_LOGIX,0,.T.,FOLDER_LOGIX_CMT,.F.,::GetUserColleagueId())
EndIf
Return ::nLogixId

METHOD GetFolderDocsAssociated() CLASS LECMFolder
If  ::nDocsAssocId < 0
    ::nDocsAssocId := ::GetFolder(FOLDER_DOCS_ASSOC,::GetFolderLogix(),.T.,FOLDER_DOCS_ASSOC_CMT,.F.,::GetUserColleagueId())
EndIf
Return ::nDocsAssocId

METHOD getFolderReport() CLASS LECMFolder
If  ::nReportId < 0
    ::nReportId := ::GetFolder(FOLDER_REPORT,::GetFolderLogix(),.T.,FOLDER_REPORT_CMT,.F.,::GetUserColleagueId())
EndIf
Return ::nReportId

METHOD getFolderCards() CLASS LECMFolder
If  ::nCardsId < 0
    ::nCardsId := ::GetFolder(FOLDER_CARDS,::GetFolderLogix(),.T.,FOLDER_CARDS_CMT,.F.,::GetUserColleagueId())
EndIf
Return ::nCardsId

Static Function GetDocument(oECMFolder,nParentId,cDescription,cComments,lPrivate,cColleagueId)
Local oDocument := FolderService_documentDto():New()
Local oDocumentArray := FolderService_documentDtoArray():New()

Default cColleagueId := oECMFolder:getColleagueId()

oDocument:nAccessCount := 0
oDocument:lActiveVersion := .T.
oDocument:cAdditionalComments := cComments
oDocument:lApprovalAndOr := .T.
oDocument:lApproved := .T.
oDocument:cApprovedDate := SoapDtMount(Date())
oDocument:nAtualizationId := 1
oDocument:cColleagueId := cColleagueId
oDocument:nCompanyId := oECMFolder:getCompanyId()
oDocument:cCreateDate := SoapDtMount(Date())
oDocument:cDatasetName := ""
oDocument:lDeleted := .F.
oDocument:cDocumentDescription := cDescription
oDocument:nDocumentPropertyNumber := 0
oDocument:nDocumentPropertyVersion := 0
oDocument:cDocumentType := "1"  // 1 - Pasta; 2 - Documento; 3 - Documento Externo; 4 - Fichário; 5 - Fichas; 9 - Aplicativo; 10 - Relatório.
oDocument:cDocumentTypeId := ""
oDocument:lDownloadEnabled := .T.
oDocument:lExpires := .F.
oDocument:cExternalDocumentId := ""
oDocument:nIconId := 0
oDocument:lImutable := .F.
oDocument:lIndexed := .F.
oDocument:lInheritSecurity := .F. //If(lPrivate,.F.,.T.)
oDocument:cKeyWord := ""
oDocument:cLanguageId := "pt"
oDocument:cLastModifiedDate := SoapDtMount(Date())
oDocument:cLastModifiedTime := SoapDtMount(Date())
oDocument:nParentDocumentId := nParentId
oDocument:cPrivateColleagueId := If(lPrivate,cColleagueId,Nil)
oDocument:lPrivateDocument := lPrivate
oDocument:lProtectedCopy := .F.
oDocument:cPublisherId := cColleagueId
oDocument:nTopicId := 1
oDocument:lTranslated := .F.
oDocument:lUpdateIsoProperties := .T.
oDocument:lUserNotify := .F.
oDocument:cValidationStartDate := SoapDtMount(Date())
oDocument:cVersionDescription := ""
oDocument:cVersionOption := "0" // 0 - Mantém versão atual; 1 - Cria nova revisão; 2 - Cria nova versão.
oDocument:cVolumeId := "Default"

aAdd(oDocumentArray:oWsItem,oDocument)
Return oDocumentArray

Static Function GetSecurity(oECMFolder,lPrivate,cColleagueId)
Local oSecurity := FolderService_documentSecurityConfigDto():New()
Local oSecurityArray := FolderService_documentSecurityConfigDtoArray():New()

Default cColleagueId := oECMFolder:GetColleagueId()

oSecurity:nAttributionType := If(lPrivate,1,3) // 1 - Colaborador; 2 - Grupos; 3 - Todos.
oSecurity:cAttributionValue := If(lPrivate,cColleagueId,"")
oSecurity:nCompanyId := oECMFolder:getCompanyId()
oSecurity:cFoo := {}
oSecurity:lPermission := .T.
oSecurity:nSecurityLevel := If(lPrivate,0,3) // 0 - Leitura; 1 - Gravação; 2 - Modificação; 3 - Total.
oSecurity:lSecurityVersion := .F.
oSecurity:lShowContent := .T.

aAdd(oSecurityArray:oWsItem,oSecurity)
Return oSecurityArray

Static Function GetApprover()
Return FolderService_approverDtoArray():New()

Function LECMFolder_version_info()
Return "$Archive: /Logix/Fontes_Doc/Sustentacao/10R2-11R0/10R2-11R0/framework/web_desk/ged/LECMFolder.prw $|$Revision: 14 $|$Date: 24/06/15 14:59 $|$Modtime: $"