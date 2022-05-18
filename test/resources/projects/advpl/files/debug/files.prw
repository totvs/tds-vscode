//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"
#INCLUDE "TBICONN.CH"

user function files()
    conout(">>> files")
    
    PREPARE ENVIRONMENT EMPRESA ("T1") FILIAL ("D MG 01")
                
    chkFile("SF1")

    
return

