#include "totvs.ch"

user function tget()


oDlg := TDialog():New(180,180,550,700,'Exemplo TDialog',,,,,CLR_BLACK,CLR_WHITE,,,.T.)

cTGet1 := "Teste TGet 01"
oTGet1 := TGet():New( 01,01,{||cTGet1},oDlg,096,009,"@!", {||validaGet()},0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, .T. )

cTGet2 := "Teste TGet 02"
oTGet2 := TGet():New( 01,100,{||cTGet2},oDlg,096,009,"@!", /*{||validaGet()}*/,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet2,,,, )
oTGet2:bLostFocus := {||validaGet()}

cTGet3 := "Teste TGet 03"
oTGet3 := TGet():New( 20,01,{||cTGet3},oDlg,096,009,"@!",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet3,,,, )

b3 := TButton():New( 118, 010, "Abre Janela", oDlg,{|| abreJanela() 	},242,050,,,.F.,.T.,.F.,,.F.,,,.F. )
//b3:bGotFocus := {||conout("mudando foco"),oTGet1:SETFOCUS()}

oDlg:ACTIVATE(,,,,,,)

return


static function validaGet()

  Processa( {|| Sleep(1000) }, "Aguarde", "Aguarde", .F. )

Return

static function abreJanela()

  conout("abrindo janela")
  oDlg := TDialog():New(180,180,200,200,'Exemplo TDialog',,,,,CLR_BLACK,CLR_WHITE,,,.T.)
  oDlg:ACTIVATE(,,,,,,)

return
