DATABASE logix

DEFINE mr_tela RECORD
               chave INTEGER,
               arquivo_foto CHAR(65)
               END RECORD

DEFINE m_image IMAGE

MAIN
  DEFER INTERRUPT
  CALL fgl_init4js()
  OPEN WINDOW w_imagem2x AT 10,02 WITH FORM "imagex"
       ATTRIBUTES(BORDER, FORM LINE 1, message line last, prompt line last)

  IF NOT cria_tabela_temp2() THEN
     RETURN
  END IF

  OPEN WINDOW w_imagem2 AT 02,02 WITH FORM "image"
       ATTRIBUTES(BORDER, MESSAGE LINE LAST, PROMPT LINE LAST)

  MENU "PRINCIPAL"
  COMMAND "CONSULTA"
    MESSAGE ""
    CALL select_image2()
  COMMAND "INCLUSAO"
    MESSAGE ""
    CALL insert_image2()
  COMMAND "MODIFICACAO"
    MESSAGE ""
    CALL update_image2()
  COMMAND "SEGUINTE"
    CALL paginacao2("SEGUINTE")
  COMMAND "ANTERIOR"
    CALL paginacao2("ANTERIOR")
  COMMAND "GRAVAR_DISCO"
    CALL gravar_imagem_no_disco2()
  COMMAND "FIM"
    MESSAGE ""
    EXIT MENU
  END MENU

  CLOSE WINDOW w_imagem2x
  CLOSE WINDOW w_imagem2
END MAIN

FUNCTION imagem2_exibe_dados()
   DEFINE l_comando CHAR(150)

   DISPLAY BY NAME mr_tela.*

   CURRENT WINDOW IS w_imagem2x
   CALL show_image(m_image,'img01')
   CURRENT WINDOW IS w_imagem2
END FUNCTION

FUNCTION cria_tabela_temp2()
  IF getDBtypeConnected() = "MSSQL" THEN
     WHENEVER ERROR CONTINUE
     CREATE TEMP TABLE img_totvstec2
            (chave   SERIAL  NOT NULL,
             imagem  IMAGE)
     #PREPARE var_x FROM "CREATE TEMP TABLE img_totvstec (chave   SERIAL  NOT NULL, imagem  IMAGE)"
     #execute var_x
     WHENEVER ERROR STOP
  ELSE
     WHENEVER ERROR CONTINUE
     CREATE TEMP TABLE img_totvstec2
            (chave   SERIAL    NOT NULL,
             imagem  BYTE      NOT NULL)
     WHENEVER ERROR STOP
  END IF
  IF sqlca.sqlcode <> 0 THEN
     CALL fgl_winmessage("Logix","Erro "||sqlca.sqlcode||" - CREATE TEMP TABLE","exclamation")
     RETURN FALSE
  END IF
  RETURN TRUE
END FUNCTION

FUNCTION insert_image2()
  INITIALIZE mr_tela.* TO NULL

  LET int_flag = 0

  INPUT BY NAME mr_tela.* WITHOUT DEFAULTS
  IF int_flag <> 0 THEN
     ERROR "Inclusão cancelada."
     RETURN
  END IF
  CALL locate_image2("DISPLAY")
  IF fgl_winquestion("Logix","Confirma inclusão?","yes","yes|no","question",0) = "yes" THEN
     CALL locate_image2("INSERT")
  END IF
END FUNCTION

FUNCTION update_image2()
  LET int_flag = 0

  INPUT BY NAME mr_tela.* WITHOUT DEFAULTS
  IF int_flag <> 0 THEN
     ERROR "Modificação cancelada."
     RETURN
  END IF

  CALL locate_image2("DISPLAY")
  IF fgl_winquestion("Logix","Confirma modificação?","yes","yes|no","question",0) = "yes" THEN
     CALL locate_image2("UPDATE")
  END IF
END FUNCTION

FUNCTION select_image2()
  DEFINE sql_stmt CHAR(500),
         where_clause CHAR(100)

  LET int_flag = 0
  CONSTRUCT BY NAME where_clause ON chave

  IF int_flag <> 0 THEN
     ERROR "Consulta cancelada."
     RETURN
  END IF

  INITIALIZE mr_tela.* TO NULL
  LET sql_stmt = "SELECT chave, imagem FROM img_totvstec2 WHERE ",where_clause CLIPPED," ORDER BY chave"
  PREPARE var_imagem FROM sql_stmt
  DECLARE cq_imagem SCROLL CURSOR WITH HOLD FOR var_imagem

  OPEN cq_imagem
  WHENEVER ERROR CONTINUE
  FETCH cq_imagem INTO mr_tela.chave, m_image
  WHENEVER ERROR STOP
  IF sqlca.sqlcode <> 0 THEN
     ERROR "Não existem dados a serem consultados."
     RETURN
  END IF

  CALL locate_image2("SELECT")
END FUNCTION

FUNCTION locate_image2(l_acao)
  DEFINE l_acao         CHAR(10)
  DEFINE l_comando      CHAR(100)

  CASE UPSHIFT(l_acao)
  WHEN "INSERT"
     WHENEVER ERROR CONTINUE
     INSERT INTO img_totvstec2 (imagem) VALUES (m_image)
     WHENEVER ERROR STOP
     IF sqlca.sqlcode = 0 THEN
        LET mr_tela.chave = sqlca.sqlerrd[2]
        DISPLAY BY NAME mr_tela.chave
     ELSE
        CALL fgl_winmessage("Logix","Erro "||sqlca.sqlcode||" - INSERT","exclamation")
        RETURN
     END IF

  WHEN "UPDATE"
     WHENEVER ERROR CONTINUE
     UPDATE img_totvstec2 SET imagem = m_image
      WHERE chave = mr_tela.chave
     WHENEVER ERROR STOP
     IF sqlca.sqlcode <> 0 THEN
        CALL fgl_winmessage("Logix","Erro "||sqlca.sqlcode||" - UPDATE","exclamation")
        RETURN
     END IF

  WHEN "SELECT"
     IF mr_tela.chave > 0 THEN
        WHENEVER ERROR CONTINUE
        SELECT imagem INTO m_image
          FROM img_totvstec2
         WHERE chave = mr_tela.chave
        WHENEVER ERROR STOP
        IF sqlca.sqlcode < 0 THEN
           CALL fgl_winmessage("Logix","Erro "||sqlca.sqlcode||" - SELECT IMAGE","exclamation")
           RETURN
        END IF
     END IF
  WHEN "DISPLAY"
    IF mr_tela.arquivo_foto <> " " THEN
       LET m_image = LOAD_IMAGE(mr_tela.arquivo_foto)
    else 
       initialize m_image TO NULL
    END IF
    IF status <> 0 THEN
       CALL fgl_winmessage("Logix","Erro "||status||" - LOAD_IMAGE","exclamation")
       RETURN
    END IF
    CALL show_image(m_image,"img01")
  END CASE

  CALL imagem2_exibe_dados()
END FUNCTION

FUNCTION paginacao2(l_acao)
 DEFINE l_acao  CHAR(10),
        l_chave INTEGER

 LET l_chave = mr_tela.chave

 WHILE TRUE
    WHENEVER ERROR CONTINUE
    CASE l_acao
    WHEN "SEGUINTE" FETCH NEXT     cq_imagem INTO mr_tela.chave
    WHEN "ANTERIOR" FETCH PREVIOUS cq_imagem INTO mr_tela.chave
    END CASE
    WHENEVER ERROR STOP
    IF sqlca.sqlcode = NOTFOUND THEN
       ERROR "Não existem mais itens nesta direção."
       LET mr_tela.chave = l_chave
       EXIT WHILE
    END IF

    SELECT chave INTO mr_tela.chave
      FROM img_totvstec2
     WHERE chave = mr_tela.chave
    IF sqlca.sqlcode = 0 THEN
       CALL locate_image2("SELECT")
       EXIT WHILE
    END IF
 END WHILE
END FUNCTION

FUNCTION gravar_imagem_no_disco2()
  CALL save_image('c:\\temp\\image2.bmp',m_image)
  CALL fgl_winmessage("Logix","Imagem gravada em c:\\temp\\imagem2.bmp","info")
END FUNCTION
