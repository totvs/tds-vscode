#include "totvs.ch"
//------------------------------------------------------------------
//Exemplo de configuração de TGrid em array com navegação por linha
//------------------------------------------------------------------
#define GRID_MOVEUP       0
#define GRID_MOVEDOWN     1
#define GRID_MOVEHOME     2
#define GRID_MOVEEND      3
#define GRID_MOVEPAGEUP   4
#define GRID_MOVEPAGEDOWN 5
//------------------------------------------------------------------
//Valores para a propriedade nHScroll que define o comportamento da
//barra de rolagem horizontal
//------------------------------------------------------------------
#define GRID_HSCROLL_ASNEEDED   0
#define GRID_HSCROLL_ALWAYSOFF  1
#define GRID_HSCROLL_ALWAYSON   2


// MyGrid ( Classe para encapsular acesso ao componente TGrid )
//------------------------------------------------------------------------------
CLASS MyGrid
    DATA oGrid
    DATA oFrame
    DATA oButtonsFrame
    DATA oButtonHome
    DATA oButtonPgUp
    DATA oButtonUp
    DATA oButtonDown
    DATA oButtonPgDown
    DATA oButtonEnd
    DATA aData
    DATA nLenData
    DATA nRecNo
    DATA nCursorPos
    DATA nVisibleRows
    DATA nFreeze
    DATA nHScroll
        
    METHOD New(oDlg) CONSTRUCTOR
    METHOD onMove( o,nMvType,nCurPos,nOffSet,nVisRows )
    METHOD isBof()
    METHOD isEof()
    METHOD ShowData( nFirstRec, nCount )
    METHOD ClearRows()
    METHOD DoUpdate()
    METHOD SelectRow(n)
    METHOD GoHome()
    METHOD GoEnd()
    METHOD GoPgUp()
    METHOD GoPgDown()
    METHOD GoUp(nOffSet)
    METHOD GoDown(nOffSet)
    METHOD SetCSS(cCSS)
    METHOD SetFreeze(nFreeze)
    METHOD SetHScrollState(nHScroll)
ENDCLASS



METHOD New(oDlg, aData) CLASS MyGrid
    //Local oFont
            
    ::oFrame:= tPanel():New(0,0,,oDlg,,,,,,200,200 )
    ::nRecNo:= 1
    ::nCursorPos:= 0
    ::nVisibleRows:= 14
    // Forçado para 1o ::GoEnd()
    ::aData:= aData
    ::nLenData:= Len(aData)
    ::oGrid:= tGrid():New( ::oFrame )
    ::oGrid:Align:= CONTROL_ALIGN_ALLCLIENT
        
    //oFont := TFont():New('Tahoma',,-32,.T.)
    //::oGrid:SetFont(oFont)
    //::oGrid:setRowHeight(50)
        
    ::oButtonsFrame:= tPanel():New(0,0,, ::oFrame,,,,,, 10,200,.F.,.T. )
    ::oButtonsFrame:Align:= CONTROL_ALIGN_RIGHT
    ::oButtonHome:= tBtnBmp():NewBar( "VCTOP.BMP",,,,, {||::GoHome()},,::oButtonsFrame )
    ::oButtonHome:Align:= CONTROL_ALIGN_TOP
    ::oButtonPgUp:= tBtnBmp():NewBar( "VCPGUP.BMP",,,,, {||::GoPgUp()},,::oButtonsFrame )
    ::oButtonPgUp:Align:= CONTROL_ALIGN_TOP
    ::oButtonUp:= tBtnBmp():NewBar( "VCUP.BMP",,,,,{||::GoUp(1)},,::oButtonsFrame )
    ::oButtonUp:Align:= CONTROL_ALIGN_TOP
    ::oButtonEnd:= tBtnBmp():NewBar( "VCBOTTOM.BMP",,,,, {||::GoEnd()},,::oButtonsFrame )
    ::oButtonEnd:Align:= CONTROL_ALIGN_BOTTOM
    ::oButtonPgDown:= tBtnBmp():NewBar( "VCPGDOWN.BMP",,,,, {||::GoPgDown()},,::oButtonsFrame )
    ::oButtonPgDown:Align:= CONTROL_ALIGN_BOTTOM
    ::oButtonDown:= tBtnBmp():NewBar( "VCDOWN.BMP",,,,, {||::GoDown(1)},,::oButtonsFrame )
    ::oButtonDown:Align:= CONTROL_ALIGN_BOTTOM
    ::oGrid:addColumn( 1, "Código", 50, CONTROL_ALIGN_LEFT )
    ::oGrid:addColumn( 2, "Descrição", 150, 0 )
    ::oGrid:addColumn( 3, "Valor", 50, CONTROL_ALIGN_RIGHT )
    ::oGrid:bCursorMove:= {|o,nMvType,nCurPos,nOffSet,nVisRows| ::onMove(o,nMvType,nCurPos,nOffSet,nVisRows) }
    ::ShowData(1)
    ::SelectRow( ::nCursorPos )
    // configura acionamento do duplo clique
    ::oGrid:bLDblClick:= {|| MsgStop("oi") }
RETURN
METHOD isBof() CLASS MyGrid
RETURN  ( ::nRecno==1 )
METHOD isEof() CLASS MyGrid
RETURN ( ::nRecno==::nLenData )
METHOD GoHome() CLASS MyGrid
    if ::isBof()
        return
    endif
    ::nRecno = 1
    ::oGrid:ClearRows()
    ::ShowData( 1, ::nVisibleRows )
    ::nCursorPos:= 0
    ::SelectRow( ::nCursorPos )
RETURN
METHOD GoEnd() CLASS MyGrid
    if ::isEof()
        return
    endif
        
    ::nRecno:= ::nLenData
    ::oGrid:ClearRows()
    ::ShowData( ::nRecno - ::nVisibleRows + 1, ::nVisibleRows )
    ::nCursorPos:= ::nVisibleRows-1
    ::SelectRow( ::nCursorPos )
RETURN
METHOD GoPgUp() CLASS MyGrid
    if ::isBof()
        return
    endif
        
    // força antes ir para a 1a linha da grid
    if ::nCursorPos != 0
        ::nRecno -= ::nCursorPos
        if ::nRecno <= 0
            ::nRecno:=1
        endif
        ::nCursorPos:= 0
        ::oGrid:setRowData( ::nCursorPos, {|o| { ::aData[::nRecno,1], ::aData[::nRecno,2], ::aData[::nRecno,3] } } )
    else
        ::nRecno -= ::nVisibleRows
        if ::nRecno <= 0
            ::nRecno:=1
        endif
        ::oGrid:ClearRows()
        ::ShowData( ::nRecno, ::nVisibleRows )
        ::nCursorPos:= 0
    endif
    ::SelectRow( ::nCursorPos )
RETURN
METHOD GoPgDown() CLASS MyGrid
    Local nLastVisRow
        
    if ::isEof()
        return
    endif
        
    // força antes ir para a última linha da grid
    nLastVisRow:= ::nVisibleRows-1
        
    if ::nCursorPos!=nLastVisRow
        
        if ::nRecno+nLastVisRow > ::nLenData
            nLastVisRow:= ( ::nRecno+nLastVisRow ) - ::nLenData
            ::nRecno:= ::nLenData
        else
            ::nRecNo += nLastVisRow
        endif
            
        ::nCursorPos:= nLastVisRow
        ::ShowData( ::nRecNo - ::nVisibleRows + 1, ::nVisibleRows )
    else
        ::oGrid:ClearRows()
        ::nRecno += ::nVisibleRows
            
        if ::nRecno > ::nLenData
            ::nVisibleRows = ::nRecno-::nLenData
            ::nRecno:= ::nLenData
        endif
            
        ::ShowData( ::nRecNo - ::nVisibleRows + 1, ::nVisibleRows )
        ::nCursorPos:= ::nVisibleRows-1
    endif
        
    ::SelectRow( ::nCursorPos )
RETURN
        
METHOD GoUp(nOffSet) CLASS MyGrid
    Local lAdjustCursor:= .F.
    if ::isBof()
        RETURN
    endif
    if ::nCursorPos==0
        ::oGrid:scrollLine(-1)
        lAdjustCursor:= .T.
    else
        ::nCursorPos -= nOffSet
    endif
    ::nRecno -= nOffSet
        
    // atualiza linha corrente
    ::oGrid:setRowData( ::nCursorPos, {|o| { ::aData[::nRecno,1], ::aData[::nRecno,2], ::aData[::nRecno,3] } } )
        
    if lAdjustCursor
        ::nCursorPos:= 0
    endif
    ::SelectRow( ::nCursorPos )
RETURN
METHOD GoDown(nOffSet) CLASS MyGrid
    Local lAdjustCursor:= .F.
    if ::isEof()
        RETURN
    endif
        
    if ::nCursorPos==::nVisibleRows-1
        ::oGrid:scrollLine(1)
        lAdjustCursor:= .T.
    else
        ::nCursorPos += nOffSet
    endif
    ::nRecno += nOffSet
        
    // atualiza linha corrente
    ::oGrid:setRowData( ::nCursorPos, {|o| { ::aData[::nRecno,1], ::aData[::nRecno,2], ::aData[::nRecno,3] } } )
    if lAdjustCursor
        ::nCursorPos:= ::nVisibleRows-1
    endif
    ::SelectRow( ::nCursorPos )
RETURN
METHOD onMove( oGrid,nMvType,nCurPos,nOffSet,nVisRows ) CLASS MyGrid
    ::nCursorPos:= nCurPos
    ::nVisibleRows:= nVisRows
        
    if nMvType == GRID_MOVEUP
        ::GoUp(nOffSet)
    elseif nMvType == GRID_MOVEDOWN
        ::GoDown(nOffSet)
    elseif nMvType == GRID_MOVEHOME
        ::GoHome()
    elseif nMvType == GRID_MOVEEND
        ::GoEnd()
    elseif nMvType == GRID_MOVEPAGEUP
        ::GoPgUp()
    elseif nMvType == GRID_MOVEPAGEDOWN
        ::GoPgDown()
    endif
RETURN
METHOD ShowData( nFirstRec, nCount ) CLASS MyGrid
    local i, nRec, ci
    DEFAULT nCount:=30
        
    for i=0 to nCount-1
        nRec:= nFirstRec+i
        if nRec > ::nLenData
            RETURN
        endif
        ci:= Str( nRec )
        cb:= "{|o| { Self:aData["+ci+",1], Self:aData["+ci+",2], Self:aData["+ci+",3] } }"
        ::oGrid:setRowData( i, &cb )
    next i
RETURN
METHOD ClearRows() CLASS MyGrid
    ::oGrid:ClearRows()
    ::nRecNo:=1
RETURN
METHOD DoUpdate() CLASS MyGrid
    ::nRecNo:=1
    ::Showdata(1)
    ::SelectRow(0)
RETURN
METHOD SelectRow(n) CLASS MyGrid
    valor := n - ::nCursorPos
    ::nRecno += valor
    if ::nRecno <= 0
      ::nRecno = 1
    endif
    ::nCursorPos:=n
    ::oGrid:setSelectedRow(n)
RETURN
METHOD SetCSS(cCSS) CLASS MyGrid
    ::oGrid:setCSS(cCSS)
RETURN
    
METHOD SetFreeze(nFreeze) CLASS MyGrid
    ::nFreeze := nFreeze
    ::oGrid:nFreeze := nFreeze
RETURN
METHOD SetHScrollState(nHScroll) CLASS MyGrid
    ::nHScroll := nHScroll
    ::oGrid:nHScroll := nHScroll
RETURN
    