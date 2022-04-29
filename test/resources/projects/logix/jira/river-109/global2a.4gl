database logix

globals
  define e like sit_funcio.cod_situacao ##No BD é tipo SMALLINT
  define a char(10)
  define b date
  define c smallint
  define d decimal(17,2)
end globals

function global2a_funcao()
   LET d = 123456.78

   call conout("executando funcao global2a_funcao (SEM ACESSO A GLOBALS) (variavel A divergente) - global2a.4gl")
   CALL global2b_funcao()
end function

function global2a_funcao_acessando_global_mesmo_tipo()
   call conout("executando global2a_funcao_acessando_global_mesmo_tipo (ACESSO GLOBAL DE MESMO TIPO) (variavel A divergente) - global2a.4gl")
   IF e = 20932 THEN
      CALL conout("OK - GLOBAL 'e' com valor correto 20392")
   ELSE
      CALL conout("ERRO - GLOBAL 'e' com valor incorreto "||e USING "<<<<&" ||" (correto 20392)")
   END IF
   CALL global2b_funcao_acessando_global_mesmo_tipo()
end function

function global2a_funcao_acessando_global_tipo_diferente()
   call conout("executando funcao global2a_funcao_acessando_global_tipo_diferente (ACESSO A GLOBAL DE TIPO DIFERENTE) (variavel A divergente)  - global2a.4gl")
   IF a = '0123456789012' THEN ### DEVERIA ABORTAR NO IF q ta validando uma global q ta instanciada com tamanho diferente do ponto de origem da sua instancia em memoria.
      CALL conout("ERRO - GLOBAL 'A' CHAR(10) atual tem valor "||a CLIPPED||" igual ao valor da GLOBAL 'A' com tipo diferente da origem CHAR(12) que é '0123456789012'")
   ELSE
      CALL conout("ERRO - GLOBAL 'A' CHAR(10) atual tem valor "||a CLIPPED||" diferente do valor da GLOBAL 'A' com tipo diferente da origem CHAR(12) que é '0123456789012'")
   END IF
   CALL global2b_funcao_acessando_global_tipo_diferente()
end function

