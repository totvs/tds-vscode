globals
  define e smallint
  define a char(12)
  define b date
  define c smallint
  define d decimal(17,2)
end globals

main
   LET e = 20932
   LET a = '0123456789012'

   call global2a_funcao() # fonte global2a.4gl
   CALL global2a_funcao_acessando_global_mesmo_tipo()
   CALL global2a_funcao_acessando_global_tipo_diferente()
end main

