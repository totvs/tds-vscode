#INCLUDE "TOTVS.CH"
 
Function u_scan()
local cText := ""
  oDlg = TDialog():New( 0, 0, 228, 500, "Read Barcode",,,.F.,,,,,,.T.,,,,, )
    oDlg:setCss("QPushButton{}")
 
    oBtn1 := TButton():New( 002, 002, "Lê barcode",oDlg,{|| readBarcode() }, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )  
    oBtn2 := TButton():New( 002, 044, "Habilita na bandeja",oDlg,{|| systray() }, 60,10,,,.F.,.T.,.F.,,.F.,,,.F. )  
 
    oMGet := TMultiget():new(18,01,{| u | if( pCount() > 0, cText := u, cText )},oDlg,252,94,,,,,,.T.)
    oMGet:setCss("font-size: 24px;")
  oDlg:Activate()
return
 
Static Function readBarcode()
  cFile := getClientDir()+"barcode_scan"
  cFile := "C:\Users\acandido\Downloads\barcode_scan_rs.exe"
  WaitRun(cFile, 1 )
 
  oMGet:setFocus()
  alert("De um Ctrl+V no campo")
return
 
Static Function systray()
  cDir := iif(GetOS()=="UNIX", Subs(getClientDir(),3), getClientDir())
  ShellExecute("Open", cDir + "barcode_scan", "-systray", cDir, 1 )
return
 
Static Function GetOS()
  local stringOS := Upper(GetRmtInfo()[2])
 
  if GetRemoteType() == 0 .or. GetRemoteType() == 1
      return "WINDOWS"
  elseif GetRemoteType() == 2
      return "UNIX" // Linux ou MacOS      
  elseif GetRemoteType() == 5
      return "HTML" // Smartclient HTML    
  elseif ("ANDROID" $ stringOS)
      return "ANDROID"
  elseif ("IPHONEOS" $ stringOS)
      return "IPHONEOS"
  endif   
return ""
