#include "totvs.ch"

// U_TSTGRID ( Executa Grid )
//------------------------------------------------------------------
USER FUNCTION gridtdn()
    Local oDlg, aData:={}, i /*, oGridLocal*/, oEdit, nEdit:= 0
    Local oBtnAdd, oBtnClr, oBtnLoa
        
    // configura pintura da TGridLocal
    cCSS:= "QTableView{ alternate-background-color: red; background: yellow; selection-background-color: #669966 }"
        
    // configura pintura do Header da TGrid
    cCSS+= "QHeaderView::section { background-color: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #616161, stop: 0.5 #505050, stop: 0.6 #434343,  stop:1 #656565); color: white; padding-left: 4px; border: 1px solid #6c6c6c; }"
        
    // Dados
    for i:=1 to 10000
        cCodProd:= StrZero(i,6)
        if i<3
            // inserindo imagem nas 2 primeiras linhas
            cProd:= "RPO_IMAGE=OK.BMP"
        else
            cProd:= 'Produto '+cCodProd
        endif
            
        cVal = Transform( 10.50, "@E 99999999.99" )
        AADD( aData, { cCodProd, cProd, cVal } )
    next
        
    DEFINE DIALOG oDlg FROM 0,0 TO 500,500 PIXEL

    oGrid:= MyGrid():New(oDlg,aData)
    oGrid:SetFreeze(2)
    oGrid:SetCSS(cCSS)
    //oGrid:SetHScrollState(GRID_HSCROLL_ALWAYSON) // Somente build superior a 131227A
        
    // Aplica configuração de pintura via CSSoGrid:SetCSS(cCSS)
    @ 210, 10 GET oEdit VAR nEdit OF oDlg PIXEL PICTURE "99999"
    @ 210, 70 BUTTON oBtnAdd PROMPT "Go" OF oDlg PIXEL ACTION oGrid:SelectRow(nEdit)
    @ 210, 100 BUTTON oBtnClr PROMPT "Clear" OF oDlg PIXEL ACTION oGrid:ClearRows()
    @ 210, 150 BUTTON oBtnLoa PROMPT "Update" OF oDlg PIXEL ACTION oGrid:DoUpdate()
    ACTIVATE DIALOG oDlg CENTERED
        
RETURN
