globals
  define e smallint
  define a char(12)
  define b date
  define c smallint
  define d decimal(17,3)
end globals

function global2b_funcao()
   call conout("executando funcao global2b_funcao (SEM ACESSO A GLOBALS) (variavel A e D divergentes)- global2b.4gl")
end function

function global2b_funcao_acessando_global_mesmo_tipo()
   call conout("executando global2b_funcao_acessando_global_mesmo_tipo (ACESSO GLOBAL DE MESMO TIPO) (variavel A e D divergentes) - global2b.4gl")
   IF e = 20932 THEN
      CALL conout("OK - GLOBAL 'e' com valor correto 20392")
   ELSE
      CALL conout("ERRO - GLOBAL 'e' com valor incorreto "||e USING "<<<<&" ||" (correto 20392)")
   END IF
end function

function global2b_funcao_acessando_global_tipo_diferente()
   call conout("executando funcao global2b_funcao_acessando_global_tipo_diferente (ACESSO A GLOBAL DE TIPO DIFERENTE) (variavel A e D divergentes) - global2b.4gl")
   IF d = 123456.78 THEN ### DEVERIA ABORTAR NO IF q ta validando uma global q ta instanciada com tamanho diferente do ponto de origem da sua instancia em memoria.
      CALL conout("ERRO - GLOBAL 'A' CHAR(10) atual tem valor "||d||" igual ao valor da GLOBAL 'A' com tipo diferente da origem DECIMAL(17,2) que é 123456.78")
   ELSE
      CALL conout("ERRO - GLOBAL 'A' CHAR(10) atual tem valor "||d||" diferente do valor da GLOBAL 'A' com tipo diferente da origem DECIMAL(17,2) que é 123456.78")
   END IF
end function
