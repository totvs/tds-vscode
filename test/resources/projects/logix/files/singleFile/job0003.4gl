#-----------------------------------------------------------------#
# PROGRAMA: JOB0003 - AGENDADOR DE TAREFAS                        #
# AUTOR...: RUBENS DOS SANTOS FILHO                               #
# DATA....: 12/05/2011                                            #
#-----------------------------------------------------------------#
DATABASE logix

GLOBALS
    DEFINE p_user             LIKE usuarios.cod_usuario
    DEFINE p_cod_empresa      LIKE empresa.cod_empresa
END GLOBALS

DEFINE m_operation_val        CHAR(10)
DEFINE m_confirm_param_val    SMALLINT
DEFINE m_row_selected         SMALLINT

DEFINE m_form_program         VARCHAR(10)
DEFINE m_form_execution       VARCHAR(10)
DEFINE m_form_dependent       VARCHAR(10)
DEFINE m_form_parameter       VARCHAR(10)
DEFINE m_form_param_val       VARCHAR(10)
DEFINE m_form_reserved_words  VARCHAR(10)

DEFINE m_tree_parameter       VARCHAR(10)
DEFINE m_label_val_parametro  VARCHAR(10)
DEFINE m_label_obs_parametro  VARCHAR(10)
DEFINE m_parametro_seq_ref    VARCHAR(10)
DEFINE m_parametro_valor_ref  VARCHAR(10)

DEFINE m_popup_reference      VARCHAR(10)
DEFINE m_popup_update_param   VARCHAR(10)
DEFINE m_popup_delete_param   VARCHAR(10)
DEFINE m_popup_add_list_param VARCHAR(10)

DEFINE mr_job_gatilho         RECORD
                                  gatilho               LIKE job_gatilho.gatilho,
                                  titulo_gatilho        LIKE job_gatilho.titulo_gatilho,
                                  objetivo_gatilho      LIKE job_gatilho.objetivo_gatilho,
                                  respons_gatilho       LIKE job_gatilho.respons_gatilho,
                                  vt_nome_responsavel   CHAR(30),
                                  email_respons         LIKE job_gatilho.email_respons,
                                  envia_email           LIKE job_gatilho.envia_email,
                                  dat_ini_execucao      LIKE job_gatilho.dat_ini_execucao,
                                  vt_data_ini_execucao  DATE,
                                  vt_hora_ini_execucao  DATETIME HOUR TO SECOND,
                                  dat_final_execucao    LIKE job_gatilho.dat_final_execucao,
                                  vt_data_fim_execucao  DATE,
                                  vt_hora_fim_execucao  DATETIME HOUR TO SECOND,
                                  minuto_gatilho        LIKE job_gatilho.minuto_gatilho,
                                  vt_minuto_gatilho     LIKE job_gatilho.minuto_gatilho,
                                  hor_gatilho           LIKE job_gatilho.hor_gatilho,
                                  vt_hora_gatilho       LIKE job_gatilho.hor_gatilho,
                                  dia_mes_gatilho       LIKE job_gatilho.dia_mes_gatilho,
                                  vt_dia_mes_gatilho    LIKE job_gatilho.dia_mes_gatilho,
                                  mes_gatilho           LIKE job_gatilho.mes_gatilho,
                                  vt_mes_gatilho        LIKE job_gatilho.mes_gatilho,
                                  dia_semana_gatilho    LIKE job_gatilho.dia_semana_gatilho,
                                  vt_dia_semana_gatilho LIKE job_gatilho.dia_semana_gatilho,
                                  sit_gatilho           LIKE job_gatilho.sit_gatilho,
                                  sistema_gerador       LIKE job_gatilho.sistema_gerador,
                                  dat_incl_gatilho      LIKE job_gatilho.dat_incl_gatilho,
                                  vt_data_inclusao      DATE,
                                  vt_hora_inclusao      DATETIME HOUR TO SECOND,
                                  resp_atualizacao      LIKE job_gatilho.resp_atualizacao,
                                  dat_ult_atlz          LIKE job_gatilho.dat_ult_atlz,
                                  vt_data_atualizacao   DATE,
                                  vt_hora_atualizacao   DATETIME HOUR TO SECOND,
                                  selecionar            CHAR(01),
                                  execucao_gatilho      ARRAY[060]   OF CHAR(001),
                                  dependentes           ARRAY[100]   OF CHAR(001),
                                  num_parametro         LIKE job_gatilho_tarefa_parametros.num_parametro,
                                  seq_parametro         LIKE job_gatilho_tarefa_parametros.seq_parametro,
                                  val_parametro         LIKE job_gatilho_tarefa_parametros.val_parametro,
                                  obs_parametro         LIKE job_gatilho_tarefa_parametros.obs_parametro,
                                  palavras_reservadas   varchar(300)
                              END RECORD

DEFINE ma_job_gatilho_tarefa  ARRAY[100] OF
                              RECORD
                                  gatilho_tarefa       LIKE job_gatilho_tarefa.gatilho_tarefa,
                                  sequencia_tarefa     LIKE job_gatilho_tarefa.sequencia_tarefa,
                                  programa_tarefa      LIKE job_gatilho_tarefa.programa_tarefa,
                                  rotina_job           LIKE job_gatilho_tarefa.rotina_job,
                                  observacao_tarefa    LIKE job_gatilho_tarefa.observacao_tarefa,
                                  seq_dependente       LIKE job_gatilho_tarefa.seq_dependente,
                                  vt_tarefa_parametros SMALLINT
                              END RECORD

DEFINE m_debugMode SMALLINT

#------------------#
 FUNCTION job0003()
#------------------#
  IF LOG_initApp("PADRAO") = 0 THEN
     IF NOT job0003_create_t_parametros() THEN
        RETURN
     END IF

     INITIALIZE mr_job_gatilho.*,ma_job_gatilho_tarefa TO NULL

     LET m_form_program = _ADVPL_create_component(NULL,"LFORMMETADATA")
     CALL _ADVPL_set_property(m_form_program,"INIT_FORM","job0003",mr_job_gatilho,ma_job_gatilho_tarefa)
  END IF
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_create_t_parametros()
#--------------------------------------#
     WHENEVER ERROR CONTINUE
     DROP TABLE t_parametros

     CREATE TEMP TABLE t_parametros (
            seq_tarefa    SMALLINT,
            num_parametro SMALLINT,
            seq_parametro SMALLINT,
            val_parametro VARCHAR(255),
            obs_parametro VARCHAR(255) )
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("CREATE TEMP TABLE","t_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     CREATE UNIQUE INDEX ix1_t_parametros ON t_parametros (seq_tarefa,num_parametro,seq_parametro)
     WHENEVER ERROR STOP

     RETURN TRUE
 END FUNCTION

#-----------------------------#
 FUNCTION job0003_after_load()
#-----------------------------#
     DEFINE l_table_reference VARCHAR(10)

     CALL _ADVPL_set_property(m_form_program,"ENABLE_VALID_PRIMARY_KEY",FALSE,"job_gatilho_tarefa")

     RETURN TRUE
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_create_before_input()
#--------------------------------------#
     DEFINE l_component_reference VARCHAR(10)

     WHENEVER ERROR CONTINUE
     DELETE FROM t_parametros
     WHENEVER ERROR STOP

     LET l_component_reference = _ADVPL_get_property(m_form_program,"COMPONENT_REFERENCE","job_gatilho","sit_gatilho")
     CALL _ADVPL_set_property(l_component_reference,"CLEAR")

     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","P","Pendente")
     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","I","Inativo")

     CALL _ADVPL_set_property(l_component_reference,"SELECT_VALUE",mr_job_gatilho.sit_gatilho)
     CALL _ADVPL_set_property(l_component_reference,"REFRESH")

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","respons_gatilho",p_user CLIPPED)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","email_respons",log5600_busca_email_usuario())

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_ini_execucao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_ini_execucao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_fim_execucao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_fim_execucao",EXTEND("23:59:59",HOUR TO SECOND))

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_inclusao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_inclusao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_atualizacao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_atualizacao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","resp_atualizacao",p_user CLIPPED)

     CALL job0003_respons_gatilho_after_field()

     RETURN TRUE
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_update_before_input()
#--------------------------------------#
     DEFINE l_sit_gatilho         CHAR(01)
     DEFINE l_component_reference VARCHAR(10)

     IF mr_job_gatilho.sit_gatilho = "A" THEN
        CALL LOG_show_status_bar_text(m_form_program,"Não é permitido alterar gatilhos em andamento.","WARNING_TEXT")
        RETURN FALSE
     END IF
     LET l_sit_gatilho = mr_job_gatilho.sit_gatilho

     LET l_component_reference = _ADVPL_get_property(m_form_program,"COMPONENT_REFERENCE","job_gatilho","sit_gatilho")
     CALL _ADVPL_set_property(l_component_reference,"CLEAR")

     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","P","Pendente")
     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","I","Inativo")

     CALL _ADVPL_set_property(l_component_reference,"SELECT_VALUE",l_sit_gatilho)
     CALL _ADVPL_set_property(l_component_reference,"REFRESH")

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_atualizacao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_atualizacao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","resp_atualizacao",p_user CLIPPED)

     RETURN TRUE
 END FUNCTION

#------------------------------------#
 FUNCTION job0003_copy_before_input()
#------------------------------------#
     DEFINE l_sit_gatilho         CHAR(01)
     DEFINE l_component_reference VARCHAR(10)

     LET l_sit_gatilho = mr_job_gatilho.sit_gatilho

     LET l_component_reference = _ADVPL_get_property(m_form_program,"COMPONENT_REFERENCE","job_gatilho","sit_gatilho")
     CALL _ADVPL_set_property(l_component_reference,"CLEAR")

     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","P","Pendente")
     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","I","Inativo")

     CALL _ADVPL_set_property(l_component_reference,"SELECT_VALUE",l_sit_gatilho)
     CALL _ADVPL_set_property(l_component_reference,"REFRESH")

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_inclusao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_inclusao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_atualizacao",CURRENT YEAR TO DAY)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_atualizacao",CURRENT HOUR TO SECOND)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","resp_atualizacao",p_user CLIPPED)

     RETURN TRUE
 END FUNCTION

#------------------------------------#
 FUNCTION job0003_find_before_input()
#------------------------------------#
     DEFINE l_sit_gatilho         CHAR(01)
     DEFINE l_component_reference VARCHAR(10)

     LET l_component_reference = _ADVPL_get_property(m_form_program,"COMPONENT_REFERENCE","job_gatilho","sit_gatilho")
     CALL _ADVPL_set_property(l_component_reference,"CLEAR")

     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","P","Pendente")
     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","I","Inativo")
     CALL _ADVPL_set_property(l_component_reference,"ADD_ITEM","A","Andamento")

     RETURN TRUE
 END FUNCTION

#----------------------------------------#
 FUNCTION job0003_create_before_confirm()
#----------------------------------------#
     RETURN job0003_valid_form()
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_copy_before_confirm()
#--------------------------------------#
     RETURN job0003_valid_form()
 END FUNCTION

#----------------------------------------#
 FUNCTION job0003_update_before_confirm()
#----------------------------------------#
     RETURN job0003_valid_form()
 END FUNCTION

#----------------------------------------#
 FUNCTION job0003_delete_before_confirm()
#----------------------------------------#
     IF  mr_job_gatilho.sit_gatilho = "A" THEN
         CALL LOG_show_status_bar_text(m_form_program,"Não é permitido excluir tarefas em andamento.","WARNING_TEXT")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_execucao_parametros
      WHERE gatilho_execucao = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_execucao_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_gatilho_tarefa_parametros
      WHERE gatil_tarefa_par = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_gatilho_tarefa_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_gatilho_tarefa
      WHERE gatilho_tarefa = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_gatilho_tarefa")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_registro_execucao
      WHERE registro_gatilho = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_registro_execucao")
         RETURN FALSE
     END IF

     RETURN TRUE
 END FUNCTION

#----------------------------------------#
 FUNCTION job0003_create_confirm()
#----------------------------------------#
     RETURN job0003_inclui_job_gatilho_tarefa_parametros()
 END FUNCTION

#-------------------------------#
 FUNCTION job0003_copy_confirm()
#-------------------------------#
     RETURN job0003_inclui_job_gatilho_tarefa_parametros()
 END FUNCTION

#---------------------------------#
 FUNCTION job0003_update_confirm()
#---------------------------------#
     RETURN job0003_inclui_job_gatilho_tarefa_parametros()
 END FUNCTION

#---------------------------------#
 FUNCTION job0003_delete_confirm()
#---------------------------------#
     RETURN TRUE
 END FUNCTION

#---------------------------------#
 FUNCTION job0003_process_confirm()
#---------------------------------#
  DEFINE l_situacao LIKE job_gatilho.sit_gatilho
  DEFINE l_opcao    CHAR(1)
  DEFINE l_mensagem CHAR(200)

  IF NOT LOGIN_logix_userIsAdministrator(p_user) THEN
     CALL LOG_message("Seu usuário não é administrador. Execução não autorizada.","STOP","","Apenas usuários com perfil de administrador tem permissão para executar esta operação.",0)
     RETURN TRUE
  END IF

  LET l_situacao = JOB_getSitGatilho(mr_job_gatilho.gatilho)
  IF l_situacao IS NULL THEN
     CALL LOG_show_status_bar_text(m_form_program,"Consulte um gatilho para executar esta operação.","WARNING_TEXT")
     RETURN TRUE
  END IF

  IF l_situacao = "I" OR NOT (CURRENT BETWEEN mr_job_gatilho.dat_ini_execucao AND mr_job_gatilho.dat_final_execucao) THEN
     LET l_mensagem = "O gatilho está atualmente "
     IF l_situacao = "I" THEN
        LET l_mensagem = l_mensagem CLIPPED, " INATIVO "
     END IF
     IF NOT (CURRENT BETWEEN mr_job_gatilho.dat_ini_execucao AND mr_job_gatilho.dat_final_execucao) THEN
        IF l_situacao = "I" THEN
           LET l_mensagem = l_mensagem CLIPPED, " e "
        END IF
        LET l_mensagem = l_mensagem CLIPPED, " registrado para um período fora de validade"
     END IF
     LET l_mensagem = l_mensagem CLIPPED, ".\n\nMesmo assim deseja executá-lo?"
     IF NOT LOG_question(l_mensagem) THEN
        CALL LOG_show_status_bar_text(m_form_program,"Processamento interrompido.","WARNING_TEXT")
        RETURN TRUE
     END IF
  END IF

  LET l_opcao = LOG_question_options("Processamento manual de gatilho",
                "Escolha o tipo de DEBUG para execução do gatilho:","A execução manual de gatilho irá gerar um arquivo de LOG de execução que, ao final do processamento, será transferido para pasta local para análise.\n\n   SQL - Debug com instruções SQL\n   PROFILER - Debug para avaliar performance\n   PADRÃO - Debug básico com informações de processamento\n",NULL,TRUE,
                "{'Desativado',}{'SQL',}{'Profiler',}{'Padrão',}")
  IF l_opcao IS NULL THEN
     CALL LOG_show_status_bar_text(m_form_program,"Processamento cancelado.","WARNING_TEXT")
     RETURN TRUE
  END IF

  #0 - DESATIVADO
  #1 - DEBUG SQL / DEBUG FRAMEWORK
  #2 - PROFILER / DEBUG FRAMEWORK
  #3 - DEBUG FRAMEWORK
  LET m_debugMode = l_opcao - 1

  IF job0003_verifyLostJob(mr_job_gatilho.gatilho,l_situacao) THEN
     CALL LOG_progresspopup_start("Execução de gatilho","job0003_execucao_manual_gatilho","PROCESS")
  END IF

  RETURN TRUE
 END FUNCTION

#------------------------------------------------#
 FUNCTION job0003_execucao_manual_gatilho()
#------------------------------------------------#
  DEFINE l_count        SMALLINT
  DEFINE l_sitGatilho   LIKE job_gatilho.sit_gatilho
  DEFINE lr_outFile     RECORD
                        drive     CHAR(5),
                        caminho   CHAR(100),
                        nome      CHAR(100),
                        extensao  CHAR(20)
                        END RECORD
  DEFINE l_logPath      CHAR(250)
  DEFINE l_status       SMALLINT
  DEFINE la_return      ARRAY[2] OF CHAR(250)
  DEFINE l_mensagem     CHAR(100)
  DEFINE la_logFiles    ARRAY[3] OF CHAR(250)
  DEFINE l_localZipFile CHAR(250)
  DEFINE l_pergunta     CHAR(200)

  CALL LOG_progresspopup_set_total("PROCESS",2)
  CALL _ADVPL_set_property(LOG_progresspopup_get_reference(),"TIME_REFRESH",1)
  CALL _ADVPL_cursor_wait()

  LET l_pergunta = "O gatilho está em andamento. Deseja aguardar o término da sua execução e processá-lo manualmente?"

  WHILE l_count < 15
     LET l_count = l_count + 1

     #Recuperar a situação anterior DO gatilho antes da execução, pois ao final precisa voltar para a mesma situação
     LET l_sitGatilho = JOB_getSitGatilho(mr_job_gatilho.gatilho)
     CASE
     WHEN l_sitGatilho = "A" #Andamento
        IF l_count = 1 THEN
           IF NOT LOG_question(l_pergunta) THEN
              CALL LOG_show_status_bar_text(m_form_program,"Processamento cancelado.","WARNING_TEXT")
              EXIT WHILE
           END IF
           IF NOT job0003_verifyLostJob(mr_job_gatilho.gatilho,l_sitGatilho) THEN
              #Se processo de finalizar gatilho interrompido falhar, conclui processo de tentativa de execução manual
              CALL LOG_show_status_bar_text(m_form_program,"Processamento interrompido.","ERROR_TEXT")
              EXIT WHILE
           END IF
        END IF
        CALL LOG_progresspopup_set_text("PROCESS","Aguardando o término da execução do gatilho..."||LOG_fillchar(".",l_count))

     WHEN l_sitGatilho = "P" OR l_sitGatilho = "I"
        CALL LOG_progresspopup_set_text("PROCESS","Aguarde! Executando o gatilho...")

        CALL LOG_progresspopup_increment("PROCESS")

        LET la_return = _ADVPL_JOB_ExecuteWaitReturn(mr_job_gatilho.gatilho,m_debugMode,"job0003")
        LET l_status  = la_return[1]
        LET l_logPath = la_return[2]

        IF l_status = 0 THEN #Retorno status 0 indica sucesso de execução DO gatilho
           LET l_mensagem = "Execução do gatilho concluída com sucesso."
        ELSE
           LET l_mensagem = "Execução do gatilho concluída com erro. (STATUS = ",l_status USING "<<&",")"
        END IF

        CALL LOG_progresspopup_increment("PROCESS")
        CALL job0003_verifyLostJob(mr_job_gatilho.gatilho,l_sitGatilho)

        #Se gerou arquivo de LOG da execução do gatilho ou gerou algum arquivo de debug no server para a execução manual
        #deve copiar os arquivos para a máquina local
        IF l_logPath <> " " THEN
           LET l_localZipFile = _ADVPL_LOG_downloadDebugLogFile(l_logPath,LOG_GetTempPath(TRUE))

           IF l_localZipFile <> " " THEN
              CALL _ADVPL_LOG_removeDebugPath(l_logPath)
              IF LOG_question(l_mensagem CLIPPED||"\n\nOs arquivos de LOG/DEBUG de execução deste gatilho estão disponíveis no disco local em "||l_localZipFile CLIPPED||".<br><br>Deseja visualizar o arquivo agora?") THEN
                 CALL LOG_file_previewInClient(l_localZipFile,TRUE,"")
              END IF
           ELSE
              CALL LOG_message(l_mensagem,log0030_mensagem_get_tipo(),log0030_mensagem_get_texto(),"Os arquivos de LOG/DEBUG de execução deste gatilho estão disponíveis no servidor em "||l_logPath CLIPPED||". Entre em contato com o administrador Logix.",0)
           END IF
        END IF
        CALL LOG_show_status_bar_text(m_form_program,l_mensagem CLIPPED,"INFO_TEXT")

        LET l_count = 0
        EXIT WHILE

     OTHERWISE
        EXIT WHILE  #SITUACAO INVALIDA
     END CASE

     SLEEP 2
     IF l_count = 15 THEN
        LET l_pergunta = "Gatilho continua em execução. Continuar aguardando para processar execução manual?"
        LET l_count = 0
     END IF
  END WHILE

  CALL _ADVPL_cursor_arrow()

  RETURN TRUE
 END FUNCTION

#---------------------------------#
 FUNCTION job0003_verifyLostJob(l_gatilho,l_situacao)
#---------------------------------#
 DEFINE l_gatilho                   LIKE job_gatilho.gatilho,
        l_registro_execucao         LIKE job_registro_execucao.registro_execucao,
        l_ajustou_gatilho           SMALLINT
 DEFINE l_sid_gatilho_andamento     LIKE job_gatilho.sid_gatilho_andamento
 DEFINE l_dat_sid_gatilho_andamento LIKE job_gatilho.dat_sid_gatilho_andamento
 DEFINE l_erro                      SMALLINT
 DEFINE l_situacao                  LIKE job_gatilho.sit_gatilho

 WHENEVER ERROR CONTINUE
 DECLARE cq_gatilho_perdido CURSOR WITH HOLD FOR
 SELECT job_registro_execucao.registro_execucao,
        job_gatilho.sid_gatilho_andamento, job_gatilho.dat_sid_gatilho_andamento
   FROM job_gatilho, job_registro_execucao
  WHERE job_gatilho.gatilho                    = l_gatilho
    AND job_gatilho.sit_gatilho                = 'A'
    AND job_registro_execucao.sit_execucao     = 'A'
    AND job_registro_execucao.registro_gatilho = job_gatilho.gatilho

 OPEN cq_gatilho_perdido
 WHENEVER ERROR STOP
 IF sqlca.sqlcode <> 0 THEN
    CALL log0030_processa_err_sql("OPEN", "CQ_GATILHO_PERDIDO", 1)
    RETURN FALSE
 END IF

 WHILE TRUE
    WHENEVER ERROR CONTINUE
    FETCH cq_gatilho_perdido INTO l_registro_execucao, l_sid_gatilho_andamento, l_dat_sid_gatilho_andamento
    WHENEVER ERROR STOP
    IF sqlca.sqlcode = NOTFOUND THEN
       EXIT WHILE
    END IF

    IF sqlca.sqlcode < 0 THEN
       CALL log0030_processa_err_sql("FETCH", "CQ_GATILHO_PERDIDO", 1)
       LET l_erro = TRUE
       EXIT WHILE
    END IF

    IF NOT log0011_verifica_sid_ativo(l_sid_gatilho_andamento,l_dat_sid_gatilho_andamento) THEN
       CALL job_gatilhoStop(l_gatilho,"I",l_registro_execucao,"Interrompido pelo Administrador (Gatilho perdido)",l_situacao)
       LET l_ajustou_gatilho = TRUE
    END IF
 END WHILE
 WHENEVER ERROR CONTINUE
 CLOSE cq_gatilho_perdido
 FREE cq_gatilho_perdido
 WHENEVER ERROR STOP

 #Ajustar a situação atual do gatilho em tela
 LET mr_job_gatilho.sit_gatilho = JOB_getSitGatilho(mr_job_gatilho.gatilho)
 CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","sit_gatilho",mr_job_gatilho.sit_gatilho)

 RETURN (NOT l_erro)
 END FUNCTION

#-----------------------------#
 FUNCTION job0003_valid_form()
#-----------------------------#
     DEFINE l_message CHAR(100)

     IF  NOT log5600_verifica_email_valido(mr_job_gatilho.email_respons) THEN
         LET l_message = "Email informado '",mr_job_gatilho.email_respons CLIPPED,"' inválido."

         CALL LOG_show_status_bar_text(m_form_program,l_message,"WARNING_TEXT")
         RETURN FALSE
     END IF

     LET mr_job_gatilho.dat_ini_execucao   = job0003_format_datetime(mr_job_gatilho.vt_data_ini_execucao,mr_job_gatilho.vt_hora_ini_execucao)
     LET mr_job_gatilho.dat_final_execucao = job0003_format_datetime(mr_job_gatilho.vt_data_fim_execucao,mr_job_gatilho.vt_hora_fim_execucao)

     LET mr_job_gatilho.dat_incl_gatilho = job0003_format_datetime(mr_job_gatilho.vt_data_inclusao   ,mr_job_gatilho.vt_hora_inclusao)
     LET mr_job_gatilho.dat_ult_atlz     = job0003_format_datetime(mr_job_gatilho.vt_data_atualizacao,mr_job_gatilho.vt_hora_atualizacao)

     IF  mr_job_gatilho.dat_ini_execucao > mr_job_gatilho.dat_final_execucao THEN
         CALL LOG_show_status_bar_text(m_form_program,"Data inicial de execução maior que a data final de execução.","WARNING_TEXT")
         RETURN FALSE
     END IF

     RETURN TRUE
 END FUNCTION

#-----------------------------------------------#
 FUNCTION job0003_format_datetime(l_date,l_time)
#-----------------------------------------------#
     DEFINE l_date     DATE
     DEFINE l_time     DATETIME HOUR TO SECOND
     DEFINE l_datetime DATETIME YEAR TO SECOND

     DEFINE l_datechar CHAR(19)

     LET l_datechar = EXTEND(l_date,YEAR TO DAY)," ",EXTEND(l_time,HOUR TO SECOND)
     LET l_datetime = EXTEND(l_datechar,YEAR TO SECOND)

     RETURN l_datetime
 END FUNCTION

#-------------------------------------------------------#
 FUNCTION job0003_inclui_job_gatilho_tarefa_parametros()
#-------------------------------------------------------#
     DEFINE l_ind,
            l_item_count SMALLINT

     LET l_item_count = LOG_table_get_item_count(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     DELETE FROM job_execucao_parametros
      WHERE gatilho_execucao = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_execucao_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_gatilho_tarefa_parametros
      WHERE gatil_tarefa_par = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_gatilho_tarefa_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     DELETE FROM job_gatilho_tarefa
      WHERE gatilho_tarefa = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","job_gatilho_tarefa")
         RETURN FALSE
     END IF

     FOR l_ind = 1 TO l_item_count
         WHENEVER ERROR CONTINUE
         INSERT INTO job_gatilho_tarefa ( gatilho_tarefa,
                                          sequencia_tarefa,
                                          programa_tarefa,
                                          rotina_job,
                                          observacao_tarefa,
                                          seq_dependente )
         VALUES ( ma_job_gatilho_tarefa[l_ind].gatilho_tarefa,
                  ma_job_gatilho_tarefa[l_ind].sequencia_tarefa,
                  ma_job_gatilho_tarefa[l_ind].programa_tarefa,
                  ma_job_gatilho_tarefa[l_ind].rotina_job,
                  ma_job_gatilho_tarefa[l_ind].observacao_tarefa,
                  ma_job_gatilho_tarefa[l_ind].seq_dependente )
         WHENEVER ERROR STOP
         IF  sqlca.sqlcode <> 0 THEN
             CALL log003_err_sql("INSERT","job_gatilho_tarefa")
             RETURN FALSE
         END IF
     END FOR

     WHENEVER ERROR CONTINUE
     INSERT INTO job_gatilho_tarefa_parametros
     SELECT g.gatilho,
            p.seq_tarefa,
            p.num_parametro,
            p.seq_parametro,
            p.val_parametro,
            p.obs_parametro
       FROM job_gatilho g,t_parametros p
      WHERE g.gatilho = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("INSERT","job_gatilho_tarefa_parametros")
         RETURN FALSE
     END IF

     RETURN TRUE
 END FUNCTION

#------------------------------------------------------------------------------#
FUNCTION job0003_exibe_dados()
#------------------------------------------------------------------------------#
    DEFINE l_cmp_reference VARCHAR(10)

    CALL job0003_load_parametros()

    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_ini_execucao",EXTEND(mr_job_gatilho.dat_ini_execucao,YEAR TO DAY))
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_ini_execucao",EXTEND(mr_job_gatilho.dat_ini_execucao,HOUR TO SECOND))

    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_fim_execucao",EXTEND(mr_job_gatilho.dat_final_execucao,YEAR TO DAY))
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_fim_execucao",EXTEND(mr_job_gatilho.dat_final_execucao,HOUR TO SECOND))

    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_inclusao",EXTEND(mr_job_gatilho.dat_incl_gatilho,YEAR TO DAY))
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_inclusao",EXTEND(mr_job_gatilho.dat_incl_gatilho,HOUR TO SECOND))

    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_data_atualizacao",EXTEND(mr_job_gatilho.dat_ult_atlz,YEAR TO DAY))
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_atualizacao",EXTEND(mr_job_gatilho.dat_ult_atlz,HOUR TO SECOND))

    CALL job0003_respons_gatilho_after_field()

    LET mr_job_gatilho.vt_hora_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.hor_gatilho,"HOR",TRUE)
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_gatilho",mr_job_gatilho.vt_hora_gatilho)

    LET mr_job_gatilho.vt_minuto_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.minuto_gatilho,"MIN",TRUE)
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_minuto_gatilho",mr_job_gatilho.vt_minuto_gatilho)

    LET mr_job_gatilho.vt_dia_mes_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.dia_mes_gatilho,"DIA",TRUE)
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_dia_mes_gatilho",mr_job_gatilho.vt_dia_mes_gatilho)

    LET mr_job_gatilho.vt_dia_semana_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.dia_semana_gatilho,"SEM",TRUE)
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_dia_semana_gatilho",mr_job_gatilho.vt_dia_semana_gatilho)

    LET mr_job_gatilho.vt_mes_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.mes_gatilho,"MES",TRUE)
    CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_mes_gatilho",mr_job_gatilho.vt_mes_gatilho)

    # Permite visualizar os parâmetros dos programas do gatilho pesquisado.
    LET l_cmp_reference = _ADVPL_get_property(m_form_program,"TABLE_REFERENCE","job_gatilho_tarefa")
    CALL _ADVPL_set_property(l_cmp_reference,"ENABLE",TRUE)

    LET l_cmp_reference = _ADVPL_get_property(m_form_program,"COMPONENT_REFERENCE","job_gatilho_tarefa","vt_zoom_programa_parametros")
    CALL _ADVPL_set_property(l_cmp_reference,"ENABLE",TRUE)

    RETURN TRUE
END FUNCTION

#----------------------------------#
 FUNCTION job0003_load_parametros()
#----------------------------------#
     DEFINE l_ind,
            l_item_count SMALLINT

     DEFINE l_table_reference VARCHAR(010)

     WHENEVER ERROR CONTINUE
     DELETE FROM t_parametros
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","t_parametros")
         RETURN TRUE
     END IF

     WHENEVER ERROR CONTINUE
     INSERT INTO t_parametros
     SELECT p.sequencia_tarefa,
            p.num_parametro,
            p.seq_parametro,
            p.val_parametro,
            p.obs_parametro
       FROM job_gatilho_tarefa_parametros p
      WHERE p.gatil_tarefa_par = mr_job_gatilho.gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("INSERT","t_parametros")
         RETURN TRUE
     END IF

     LET l_item_count = LOG_table_get_item_count(m_form_program,"","job_gatilho_tarefa")

     FOR l_ind = 1 TO l_item_count
         WHENEVER ERROR CONTINUE
         SELECT COUNT(*)
         INTO   ma_job_gatilho_tarefa[l_ind].vt_tarefa_parametros
         FROM   t_parametros p
         WHERE  p.seq_tarefa = ma_job_gatilho_tarefa[l_ind].sequencia_tarefa
         WHENEVER ERROR STOP
         IF  sqlca.sqlcode <> 0 THEN
             CALL log003_err_sql("SELECT","t_parametros")
             RETURN TRUE
         END IF
     END FOR

     LET l_table_reference = _ADVPL_get_property(m_form_program,"TABLE_REFERENCE","job_gatilho_tarefa")
     CALL _ADVPL_set_property(l_table_reference,"REFRESH")
 END FUNCTION

#-------------------------------------------------------#
 FUNCTION job0003_job_gatilho_tarefa_before_insert_row()
#-------------------------------------------------------#
     DEFINE l_item_count   SMALLINT
     DEFINE l_row_selected SMALLINT

     LET l_item_count   = LOG_table_get_item_count(m_form_program,"","job_gatilho_tarefa")
     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     IF  l_row_selected <= 1 AND l_item_count = 0 THEN
         RETURN TRUE
     END IF

     LET m_row_selected = l_row_selected

     IF  ma_job_gatilho_tarefa[l_row_selected].programa_tarefa IS NULL THEN
         CALL LOG_show_status_bar_text(m_form_program,"Programa da tarefa selecionada não informado.","WARNING_TEXT")
         RETURN FALSE
     END IF

     RETURN TRUE
 END FUNCTION

#------------------------------------------------------#
 FUNCTION job0003_job_gatilho_tarefa_after_insert_row()
#------------------------------------------------------#
     DEFINE l_item_count SMALLINT
     
     LET l_item_count = LOG_table_get_item_count(m_form_program,"","job_gatilho_tarefa")

     LET ma_job_gatilho_tarefa[l_item_count].sequencia_tarefa = l_item_count
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho_tarefa","sequencia_tarefa",ma_job_gatilho_tarefa[l_item_count].sequencia_tarefa,l_item_count)

     CALL job0003_t_parametros_copy(m_row_selected,l_item_count)
 END FUNCTION

#----------------------------------------------------#
 FUNCTION job0003_t_parametros_copy(l_curRow,l_newRow)
#----------------------------------------------------#
     DEFINE l_curRow SMALLINT
     DEFINE l_newRow SMALLINT

     DEFINE lr_parametros   RECORD
                                num_parametro    LIKE job_gatilho_tarefa_parametros.num_parametro,
                                seq_parametro    LIKE job_gatilho_tarefa_parametros.seq_parametro,
                                val_parametro    LIKE job_gatilho_tarefa_parametros.val_parametro,
                                obs_parametro    LIKE job_gatilho_tarefa_parametros.obs_parametro
                            END RECORD

     WHENEVER ERROR CONTINUE
     DECLARE cq_t_parametros CURSOR FOR
      SELECT p.num_parametro,
             p.seq_parametro,
             p.val_parametro,
             p.obs_parametro
        FROM t_parametros p
       WHERE p.seq_tarefa = l_curRow
       ORDER BY p.seq_tarefa,p.num_parametro,p.seq_parametro
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DECLARE CURSOR","cq_t_parametros")
         RETURN
     END IF

     WHENEVER ERROR CONTINUE
     FOREACH cq_t_parametros USING l_curRow
                              INTO lr_parametros.num_parametro,
                                   lr_parametros.seq_parametro,
                                   lr_parametros.val_parametro,
                                   lr_parametros.obs_parametro

         IF  sqlca.sqlcode <> 0 THEN
             CALL log003_err_sql("FOREACH CURSOR","cq_t_parametros")
             RETURN
         END IF

         INSERT INTO t_parametros
         VALUES (l_newRow,
                 lr_parametros.num_parametro,
                 lr_parametros.seq_parametro,
                 lr_parametros.val_parametro,
                 lr_parametros.obs_parametro)

         IF  sqlca.sqlcode <> 0 THEN
             CALL log003_err_sql("INSERT","t_parametros")
             RETURN
         END IF
     END FOREACH

     FREE cq_t_parametros
     WHENEVER ERROR STOP
 END FUNCTION

#-------------------------------------------------------#
 FUNCTION job0003_job_gatilho_tarefa_before_delete_row()
#-------------------------------------------------------#
     DEFINE l_row_selected SMALLINT

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     DELETE FROM t_parametros
      WHERE seq_tarefa = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DELETE","t_parametros")
         RETURN FALSE
     END IF

     WHENEVER ERROR CONTINUE
     UPDATE t_parametros
        SET seq_tarefa = seq_tarefa - 1
      WHERE seq_tarefa > ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("UPDATE","t_parametros")
         RETURN FALSE
     END IF

     RETURN TRUE
 END FUNCTION

#------------------------------------------------------#
 FUNCTION job0003_job_gatilho_tarefa_after_delete_row()
#------------------------------------------------------#
     DEFINE l_ind        SMALLINT
     DEFINE l_item_count SMALLINT

     DEFINE l_table_reference VARCHAR(10)

     LET l_item_count   = LOG_table_get_item_count(m_form_program,"","job_gatilho_tarefa")

     FOR l_ind = 1 TO l_item_count
         LET ma_job_gatilho_tarefa[l_ind].sequencia_tarefa = l_ind
     END FOR

     LET l_table_reference = _ADVPL_get_property(m_form_program,"TABLE_REFERENCE","job_gatilho_tarefa")
     CALL _ADVPL_set_property(l_table_reference,"REFRESH")
 END FUNCTION

#----------------------------------------------#
 FUNCTION job0003_respons_gatilho_after_field()
#----------------------------------------------#
     LET mr_job_gatilho.vt_nome_responsavel = job0003_get_vt_nome_responsavel(mr_job_gatilho.respons_gatilho)
     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_nome_responsavel",mr_job_gatilho.vt_nome_responsavel)
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_respons_gatilho_after_zoom()
#---------------------------------------------#
     CALL job0003_respons_gatilho_after_field()
 END FUNCTION

#-----------------------------------#
 FUNCTION job0003_hor_gatilho_zoom()
#-----------------------------------#
     CALL job0003_execucao_gatilho_set_value(mr_job_gatilho.hor_gatilho,"HOR")
     CALL job0003_execucao_gatilho_zoom("HOR","job0003_hor_gatilho_zoom_confirm")
 END FUNCTION

#-------------------------------------------#
 FUNCTION job0003_hor_gatilho_zoom_confirm()
#-------------------------------------------#
     LET mr_job_gatilho.hor_gatilho     = job0003_execucao_gatilho_get_value("HOR")
     LET mr_job_gatilho.vt_hora_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.hor_gatilho,"HOR",TRUE)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_hora_gatilho",mr_job_gatilho.vt_hora_gatilho)

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_minuto_gatilho_zoom()
#-------------------------------------#
     CALL job0003_execucao_gatilho_set_value(mr_job_gatilho.minuto_gatilho,"MIN")
     CALL job0003_execucao_gatilho_zoom("MIN","job0003_minuto_gatilho_zoom_confirm")
 END FUNCTION

#----------------------------------------------#
 FUNCTION job0003_minuto_gatilho_zoom_confirm()
#----------------------------------------------#
     LET mr_job_gatilho.minuto_gatilho    = job0003_execucao_gatilho_get_value("MIN")
     LET mr_job_gatilho.vt_minuto_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.minuto_gatilho,"MIN",TRUE)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_minuto_gatilho",mr_job_gatilho.vt_minuto_gatilho)

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#---------------------------------------#
 FUNCTION job0003_dia_mes_gatilho_zoom()
#---------------------------------------#
     CALL job0003_execucao_gatilho_set_value(mr_job_gatilho.dia_mes_gatilho,"DIA")
     CALL job0003_execucao_gatilho_zoom("DIA","job0003_dia_mes_gatilho_zoom_confirm")
 END FUNCTION

#-----------------------------------------------#
 FUNCTION job0003_dia_mes_gatilho_zoom_confirm()
#-----------------------------------------------#
     LET mr_job_gatilho.dia_mes_gatilho    = job0003_execucao_gatilho_get_value("DIA")
     LET mr_job_gatilho.vt_dia_mes_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.dia_mes_gatilho,"DIA",TRUE)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_dia_mes_gatilho",mr_job_gatilho.vt_dia_mes_gatilho)

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#------------------------------------------#
 FUNCTION job0003_dia_semana_gatilho_zoom()
#------------------------------------------#
     CALL job0003_execucao_gatilho_set_value(mr_job_gatilho.dia_semana_gatilho,"SEM")
     CALL job0003_execucao_gatilho_zoom("SEM","job0003_dia_semana_gatilho_zoom_confirm")
 END FUNCTION

#--------------------------------------------------#
 FUNCTION job0003_dia_semana_gatilho_zoom_confirm()
#--------------------------------------------------#
     LET mr_job_gatilho.dia_semana_gatilho    = job0003_execucao_gatilho_get_value("SEM")
     LET mr_job_gatilho.vt_dia_semana_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.dia_semana_gatilho,"SEM",TRUE)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_dia_semana_gatilho",mr_job_gatilho.vt_dia_semana_gatilho)

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#-----------------------------------#
 FUNCTION job0003_mes_gatilho_zoom()
#-----------------------------------#
     CALL job0003_execucao_gatilho_set_value(mr_job_gatilho.mes_gatilho,"MES")
     CALL job0003_execucao_gatilho_zoom("MES","job0003_mes_gatilho_zoom_confirm")
 END FUNCTION

#-------------------------------------------#
 FUNCTION job0003_mes_gatilho_zoom_confirm()
#-------------------------------------------#
     LET mr_job_gatilho.mes_gatilho    = job0003_execucao_gatilho_get_value("MES")
     LET mr_job_gatilho.vt_mes_gatilho = job0003_execucao_gatilho_replace_value(mr_job_gatilho.mes_gatilho,"MES",TRUE)

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho","vt_mes_gatilho",mr_job_gatilho.vt_mes_gatilho)

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#----------------------------------------------#
 FUNCTION job0003_programa_tarefa_before_zoom()
#----------------------------------------------#
     DEFINE l_where_clause CHAR(100)

     LET l_where_clause = 'menu_logix.cod_processo IS NOT NULL'
     CALL LOG_zoom_set_where_clause(l_where_clause)

     RETURN TRUE
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_programa_tarefa_after_zoom()
#---------------------------------------------#
     DEFINE l_cod_processo   LIKE menu_logix.cod_processo
     DEFINE l_row_selected   SMALLINT
     DEFINE l_zoom_reference VARCHAR(10)

     LET l_row_selected   = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     LET l_zoom_reference = _ADVPL_get_property(m_form_program,"ZOOM_REFERENCE","job_gatilho_tarefa","programa_tarefa")
     LET l_cod_processo   = _ADVPL_get_property(l_zoom_reference,"RETURN_BY_TABLE_COLUMN","menu_logix","cod_processo")

     IF  l_cod_processo IS NOT NULL THEN
         LET ma_job_gatilho_tarefa[l_row_selected].programa_tarefa = l_cod_processo
         CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho_tarefa","programa_tarefa",ma_job_gatilho_tarefa[l_row_selected].programa_tarefa,l_row_selected)
     END IF
 END FUNCTION

#-----------------------------------------------------------#
 FUNCTION job0003_get_vt_nome_responsavel(l_respons_gatilho)
#-----------------------------------------------------------#
     DEFINE l_respons_gatilho LIKE job_gatilho.respons_gatilho
     DEFINE l_nom_funcionario LIKE usuarios.nom_funcionario

     INITIALIZE l_nom_funcionario TO NULL

     WHENEVER ERROR CONTINUE
     SELECT usuarios.nom_funcionario
       INTO l_nom_funcionario
       FROM usuarios
      WHERE usuarios.cod_usuario = l_respons_gatilho
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 AND sqlca.sqlcode <> NOTFOUND THEN
         CALL log003_err_sql("SELECT","usuarios")
     END IF

     RETURN l_nom_funcionario
 END FUNCTION

#------------------------------------------------------------------#
 FUNCTION job0003_execucao_gatilho_set_value(l_execucao,l_function)
#------------------------------------------------------------------#
     DEFINE l_ind       SMALLINT
     DEFINE l_count     SMALLINT
     DEFINE l_value_1   SMALLINT
     DEFINE l_value_2   SMALLINT
     DEFINE l_max_value SMALLINT

     DEFINE l_item      CHAR(010)
     DEFINE l_function  CHAR(003)
     DEFINE l_execucao  CHAR(100)

     CASE l_function
         WHEN "HOR" LET l_max_value = 24
         WHEN "MIN" LET l_max_value = 60
         WHEN "DIA" LET l_max_value = 32 #Possui o item "L" de último dia.
         WHEN "SEM" LET l_max_value = 07
         WHEN "MES" LET l_max_value = 12
     END CASE

     IF  l_execucao = "*" THEN
         FOR l_ind = 1 TO l_max_value
             LET mr_job_gatilho.execucao_gatilho[l_ind] = "S"
         END FOR

         LET mr_job_gatilho.selecionar = "S"

         RETURN TRUE
     ELSE
         FOR l_ind = 1 TO l_max_value
             LET mr_job_gatilho.execucao_gatilho[l_ind] = "N"
         END FOR

         LET mr_job_gatilho.selecionar = "N"
     END IF

     LET l_count = LOG_strtokcount(l_execucao,",") + 1

     FOR l_ind = 1 TO l_count
         IF  LOG_strpos(l_execucao,",") THEN
             LET l_item     = LOG_strtok(l_execucao,",")
             LET l_execucao = l_execucao[LENGTH(l_item) + 2, LENGTH(l_execucao)]
         ELSE
             LET l_item = l_execucao
         END IF

         IF  LOG_strpos(l_item,"-") THEN
             LET l_value_1 = LOG_strtok(l_item,"-")
             LET l_value_2 = l_item[LOG_strpos(l_item,"-") + 1,LENGTH(l_item)]

             FOR l_value_1 = l_value_1 TO l_value_2
                 LET mr_job_gatilho.execucao_gatilho[l_value_1] = "S"
             END FOR

             CONTINUE FOR
         END IF

         IF  LOG_strpos(l_item,"L") THEN
             IF  l_item = 'L' THEN
                 LET mr_job_gatilho.execucao_gatilho[l_max_value] = "S"
             END IF

             CONTINUE FOR
         END IF

         IF  l_item <> '00' THEN
             LET l_value_1 = l_item
         ELSE
             LET l_value_1 = l_max_value
         END IF

         LET mr_job_gatilho.execucao_gatilho[l_value_1] = "S"
     END FOR
 END FUNCTION

#-------------------------------------------------------#
 FUNCTION job0003_execucao_gatilho_get_value(l_function)
#-------------------------------------------------------#
     DEFINE l_ind       SMALLINT
     DEFINE l_continue  SMALLINT
     DEFINE l_max_value SMALLINT

     DEFINE l_value     CHAR(255)
     DEFINE l_function  CHAR(003)
     DEFINE l_delimiter CHAR(001)

     CASE l_function
         WHEN "HOR" LET l_max_value = 24
         WHEN "MIN" LET l_max_value = 60
         WHEN "DIA" LET l_max_value = 32
         WHEN "SEM" LET l_max_value = 07
         WHEN "MES" LET l_max_value = 13
     END CASE

     FOR l_ind = 1 TO l_max_value + 1
         IF  mr_job_gatilho.execucao_gatilho[l_ind] = "S" THEN
             IF  l_ind = l_max_value THEN
                 RETURN "*"
             END IF
         ELSE
             EXIT FOR
         END IF
     END FOR

     FOR l_ind = 1 TO l_max_value
         IF  mr_job_gatilho.execucao_gatilho[l_ind] = "N" THEN
             IF  l_ind = l_max_value THEN
                 RETURN "*"
             END IF
         ELSE
             EXIT FOR
         END IF
     END FOR

     FOR l_ind = 1 TO l_max_value
         IF  mr_job_gatilho.execucao_gatilho[l_ind] = "N" THEN
             LET l_delimiter = ","
             CONTINUE FOR
         END IF

         IF  l_ind < l_max_value THEN
             IF  mr_job_gatilho.execucao_gatilho[l_ind + 1] = "S" THEN
                 IF  NOT l_continue THEN
                     LET l_continue  = TRUE
                     LET l_delimiter = "-"

                     IF  l_value IS NOT NULL THEN
                         LET l_value = l_value CLIPPED,",",l_ind USING "<<<&&"
                     END IF
                 END IF
             ELSE
                 IF  NOT l_continue THEN
                     LET l_delimiter = ","
                 ELSE
                     LET l_continue  = FALSE
                 END IF

                 IF  l_value IS NOT NULL THEN
                     LET l_value = l_value CLIPPED,l_delimiter CLIPPED,l_ind USING "<<<&&"
                 END IF
             END IF
         END IF

         IF  l_value IS NULL THEN
             LET l_value = l_ind USING "<<<&&"
         ELSE
             IF  l_ind = l_max_value THEN
                 LET l_value = l_value CLIPPED,l_delimiter CLIPPED, l_ind USING "<<<&&"
             END IF
         END IF
     END FOR

	 IF mr_job_gatilho.execucao_gatilho[l_max_value] = "S" AND l_value = l_max_value and (l_function = "DIA") THEN
            LET l_value = "L"
  	 ELSE
  	 	IF l_function = "DIA" THEN
	  	 	LET l_value = log0800_replace(l_value,l_max_value,"L")
        END IF
     END IF

     IF  mr_job_gatilho.execucao_gatilho[l_max_value] = "S" AND l_value = l_max_value AND l_function = "HOR" THEN
     	 LET l_value = "00"
     END IF

     IF  mr_job_gatilho.execucao_gatilho[l_max_value] = "S" AND l_value = l_max_value AND l_function = "MIN" THEN
         LET l_value = "00"
     ELSE
  	 IF l_function = "MIN" THEN
	    LET l_value = log0800_replace(l_value,l_max_value,"00")
	 END IF
     END IF

     RETURN l_value
 END FUNCTION

#---------------------------------------------------------------------------------#
 FUNCTION job0003_execucao_gatilho_replace_value(l_value,l_function,l_description)
#---------------------------------------------------------------------------------#
     DEFINE l_value       CHAR(255)
     DEFINE l_function    CHAR(003)

     DEFINE l_description SMALLINT

     IF  l_function = "DIA" THEN
         IF  l_description THEN
             LET l_value = LOG_replace(l_value,"L","UL")
         ELSE
             LET l_value = LOG_replace(l_value,"UL","L")
         END IF

         RETURN l_value
     END IF

     IF  l_function = "SEM" THEN
         IF  l_description THEN
             LET l_value = LOG_replace(l_value,"01","DOM")
             LET l_value = LOG_replace(l_value,"02","SEG")
             LET l_value = LOG_replace(l_value,"03","TER")
             LET l_value = LOG_replace(l_value,"04","QUA")
             LET l_value = LOG_replace(l_value,"05","QUI")
             LET l_value = LOG_replace(l_value,"06","SEX")
             LET l_value = LOG_replace(l_value,"07","SAB")
         ELSE
             LET l_value = LOG_replace(l_value,"DOM","01")
             LET l_value = LOG_replace(l_value,"SEG","02")
             LET l_value = LOG_replace(l_value,"TER","03")
             LET l_value = LOG_replace(l_value,"QUA","04")
             LET l_value = LOG_replace(l_value,"QUI","05")
             LET l_value = LOG_replace(l_value,"SEX","06")
             LET l_value = LOG_replace(l_value,"SAB","07")
         END IF

         RETURN l_value
     END IF

     IF  l_function = "MES" THEN
         IF  l_description THEN
             LET l_value = LOG_replace(l_value,"01","JAN")
             LET l_value = LOG_replace(l_value,"02","FEV")
             LET l_value = LOG_replace(l_value,"03","MAR")
             LET l_value = LOG_replace(l_value,"04","ABR")
             LET l_value = LOG_replace(l_value,"05","MAI")
             LET l_value = LOG_replace(l_value,"06","JUN")
             LET l_value = LOG_replace(l_value,"07","JUL")
             LET l_value = LOG_replace(l_value,"08","AGO")
             LET l_value = LOG_replace(l_value,"09","SET")
             LET l_value = LOG_replace(l_value,"10","OUT")
             LET l_value = LOG_replace(l_value,"11","NOV")
             LET l_value = LOG_replace(l_value,"12","DEZ")
         ELSE
             LET l_value = LOG_replace(l_value,"JAN","01")
             LET l_value = LOG_replace(l_value,"FEV","02")
             LET l_value = LOG_replace(l_value,"MAR","03")
             LET l_value = LOG_replace(l_value,"ABR","04")
             LET l_value = LOG_replace(l_value,"MAI","05")
             LET l_value = LOG_replace(l_value,"JUN","06")
             LET l_value = LOG_replace(l_value,"JUL","07")
             LET l_value = LOG_replace(l_value,"AGO","08")
             LET l_value = LOG_replace(l_value,"SET","09")
             LET l_value = LOG_replace(l_value,"OUT","10")
             LET l_value = LOG_replace(l_value,"NOV","11")
             LET l_value = LOG_replace(l_value,"DEZ","12")
         END IF

         RETURN l_value
     END IF

     RETURN l_value
 END FUNCTION

#------------------------------------------------------------#
 FUNCTION job0003_execucao_gatilho_zoom(l_function,l_confirm)
#------------------------------------------------------------#
     DEFINE l_cancel                CHAR(100)
     DEFINE l_confirm               CHAR(100)

     DEFINE l_text                  CHAR(003)
     DEFINE l_title                 CHAR(050)
     DEFINE l_function              CHAR(003)
     DEFINE l_variable              CHAR(025)

     DEFINE l_ind                   SMALLINT
     DEFINE l_columns               SMALLINT
     DEFINE l_max_value             SMALLINT

     DEFINE l_space_reference       VARCHAR(10)
     DEFINE l_panel_reference       VARCHAR(10)
     DEFINE l_layout_reference      VARCHAR(10)
     DEFINE l_component_reference   VARCHAR(10)
     DEFINE l_layout_form_reference VARCHAR(10)

     CASE l_function
         WHEN "HOR"
              LET l_title     = "Horas"
              LET l_columns   = 12
              LET l_max_value = 24

         WHEN "MIN"
              LET l_title     = "Minutos"
              LET l_columns   = 12
              LET l_max_value = 60

         WHEN "DIA"
              LET l_title     = "Dias do Mês"
              LET l_columns   = 16
              LET l_max_value = 32

         WHEN "SEM"
              LET l_title     = "Dias da Semana"
              LET l_columns   = 07
              LET l_max_value = 07

         WHEN "MES"
              LET l_title     = "Meses"
              LET l_columns   = 12
              LET l_max_value = 12
     END CASE

     LET m_form_execution = _ADVPL_create_component(NULL,"LPOPUPDIALOG")
     CALL _ADVPL_set_property(m_form_execution,"TITLE",l_title)
     CALL _ADVPL_set_property(m_form_execution,"ENABLE_ESC_CLOSE",FALSE)

     LET l_layout_form_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",m_form_execution)
     CALL _ADVPL_set_property(l_layout_form_reference,"MARGIN",FALSE)
     CALL _ADVPL_set_property(l_layout_form_reference,"MIN_WIDTH",280)
     CALL _ADVPL_set_property(l_layout_form_reference,"COLUMNS_COUNT",1)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",l_columns)

     FOR l_ind = 1 TO l_max_value
         LET l_text     = job0003_execucao_gatilho_get_text(l_function,l_ind,l_max_value)
         LET l_variable = "execucao_gatilho[", l_ind USING "<<<<<","]"

         LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_reference)
         CALL _ADVPL_set_property(l_panel_reference,"SIZE",30,35)

         LET l_component_reference = _ADVPL_create_component(NULL,"LCHECKBOX",l_panel_reference)
         CALL _ADVPL_set_property(l_component_reference,"POSITION",1,0)
         CALL _ADVPL_set_property(l_component_reference,"VALUE_CHECKED","S")
         CALL _ADVPL_set_property(l_component_reference,"VALUE_NCHECKED","N")
         CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,l_variable)

         LET l_component_reference = _ADVPL_create_component(NULL,"LCLABEL",l_panel_reference)
         CALL _ADVPL_set_property(l_component_reference,"TEXT",l_text)
         CALL _ADVPL_set_property(l_component_reference,"POSITION",0,20)
     END FOR

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"HEIGHT",24)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","BOTTOM")

     LET l_space_reference = _ADVPL_create_component(NULL,"LPANEL",l_panel_reference)
     CALL _ADVPL_set_property(l_space_reference,"WIDTH",09)
     CALL _ADVPL_set_property(l_space_reference,"ALIGN","LEFT")

     LET l_component_reference = _ADVPL_create_component(NULL,"LCHECKBOX",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","LEFT")
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",120)
     CALL _ADVPL_set_property(l_component_reference,"VALUE_CHECKED","S")
     CALL _ADVPL_set_property(l_component_reference,"VALUE_NCHECKED","N")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","Selecionar tudo")
     CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,"selecionar")
     CALL _ADVPL_set_property(l_component_reference,"CHANGE_EVENT","job0003_execucao_gatilho_select_all")

     LET l_space_reference = _ADVPL_create_component(NULL,"LPANEL",l_panel_reference)
     CALL _ADVPL_set_property(l_space_reference,"WIDTH",12)
     CALL _ADVPL_set_property(l_space_reference,"ALIGN","RIGHT")

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",70)
     CALL _ADVPL_set_property(l_component_reference,"FOCAL",TRUE)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","RIGHT")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&onfirmar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT",l_confirm)

     LET l_space_reference = _ADVPL_create_component(NULL,"LPANEL",l_panel_reference)
     CALL _ADVPL_set_property(l_space_reference,"WIDTH",03)
     CALL _ADVPL_set_property(l_space_reference,"ALIGN","RIGHT")

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",70)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","RIGHT")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&ancelar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_execucao_gatilho_cancel")

     LET l_space_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_space_reference,"HEIGHT",03)
     CALL _ADVPL_set_property(l_space_reference,"ALIGN","BOTTOM")

     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",TRUE)
 END FUNCTION

#------------------------------------------------------------------------#
 FUNCTION job0003_execucao_gatilho_get_text(l_function,l_ind,l_max_value)
#------------------------------------------------------------------------#
     DEFINE l_ind,
            l_max_value SMALLINT

     DEFINE l_text     CHAR(003)
     DEFINE l_function CHAR(003)

     IF  l_function = "HOR" OR l_function = "MIN" THEN
         IF  l_ind = l_max_value THEN
             LET l_text = "00"
         ELSE
             LET l_text = l_ind USING "<<<&&"
         END IF

         RETURN l_text
     END IF

     IF  l_function = "DIA" THEN
         IF  l_ind = l_max_value THEN
             LET l_text = "UL"
         ELSE
             LET l_text = l_ind USING "<<<&&"
         END IF

         RETURN l_text
     END IF

     IF  l_function = "SEM" THEN
         CASE l_ind
             WHEN 01 RETURN "DOM"
             WHEN 02 RETURN "SEG"
             WHEN 03 RETURN "TER"
             WHEN 04 RETURN "QUA"
             WHEN 05 RETURN "QUI"
             WHEN 06 RETURN "SEX"
             WHEN 07 RETURN "SAB"
         END CASE
     END IF

     IF  l_function = "MES" THEN
         CASE l_ind
             WHEN 01 RETURN "JAN"
             WHEN 02 RETURN "FEV"
             WHEN 03 RETURN "MAR"
             WHEN 04 RETURN "ABR"
             WHEN 05 RETURN "MAI"
             WHEN 06 RETURN "JUN"
             WHEN 07 RETURN "JUL"
             WHEN 08 RETURN "AGO"
             WHEN 09 RETURN "SET"
             WHEN 10 RETURN "OUT"
             WHEN 11 RETURN "NOV"
             WHEN 12 RETURN "DEZ"
         END CASE
     END IF

     RETURN ""
 END FUNCTION

#----------------------------------------------#
 FUNCTION job0003_execucao_gatilho_select_all()
#----------------------------------------------#
     DEFINE l_ind SMALLINT

     FOR l_ind = 1 TO 60
         LET mr_job_gatilho.execucao_gatilho[l_ind] = mr_job_gatilho.selecionar
     END FOR
 END FUNCTION

#------------------------------------------#
 FUNCTION job0003_execucao_gatilho_cancel()
#------------------------------------------#
     CALL _ADVPL_set_property(m_form_execution,"ACTIVATE",FALSE)
 END FUNCTION

#--------------------------------------#
 FUNCTION job0003_seq_dependente_zoom()
#--------------------------------------#
     DEFINE l_ind,
            l_row_selected SMALLINT

     DEFINE l_text,
            l_variable CHAR(20)

     DEFINE l_panel_reference,
            l_space_reference,
            l_layout_reference,
            l_component_reference,
            l_layout_form_reference VARCHAR(10)

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     IF  ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa = 1 THEN
         CALL LOG_show_status_bar_text(m_form_program,"Não é possível atribuir dependentes para a primeira tarefa.","WARNING_TEXT")
         RETURN
     END IF

     IF  ma_job_gatilho_tarefa[l_row_selected].programa_tarefa IS NULL THEN
         CALL LOG_show_status_bar_text(m_form_program,"Programa da tarefa selecionada não informado.","WARNING_TEXT")
         RETURN
     END IF

     CALL job0003_seq_dependente_zoom_set_value(ma_job_gatilho_tarefa[l_row_selected].seq_dependente)

     LET m_form_dependent = _ADVPL_create_component(NULL,"LPOPUPDIALOG")
     CALL _ADVPL_set_property(m_form_dependent,"TITLE","Dependentes")
     CALL _ADVPL_set_property(m_form_dependent,"ENABLE_ESC_CLOSE",FALSE)

     LET l_layout_form_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",m_form_dependent)
     CALL _ADVPL_set_property(l_layout_form_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_form_reference,"COLUMNS_COUNT",1)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LSCROLLPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"SIZE",320,240)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_panel_reference)
    #CALL _ADVPL_set_property(l_panel_reference,"ALIGN","NONE")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     FOR l_ind = 1 TO l_row_selected - 1
         LET l_text     = l_ind USING "<<&&&",": ",UPSHIFT(ma_job_gatilho_tarefa[l_ind].programa_tarefa)
         LET l_variable = "dependentes[", l_ind USING "<<<<<","]"

         LET l_component_reference = _ADVPL_create_component(NULL,"LCHECKBOX",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"TEXT",l_text)
         CALL _ADVPL_set_property(l_component_reference,"VALUE_CHECKED","S")
         CALL _ADVPL_set_property(l_component_reference,"VALUE_NCHECKED","N")
         CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,l_variable)
     END FOR

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"HEIGHT",24)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","BOTTOM")

     LET l_component_reference = _ADVPL_create_component(NULL,"LCHECKBOX",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","LEFT")
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",120)
     CALL _ADVPL_set_property(l_component_reference,"VALUE_CHECKED","S")
     CALL _ADVPL_set_property(l_component_reference,"VALUE_NCHECKED","N")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","Selecionar tudo")
     CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,"selecionar")
     CALL _ADVPL_set_property(l_component_reference,"CHANGE_EVENT","job0003_seq_dependente_zoom_select_all")

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"FOCAL",TRUE)
     CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","RIGHT")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&onfirmar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_seq_dependente_zoom_confirm")

     LET l_space_reference = _ADVPL_create_component(NULL,"LPANEL",l_panel_reference)
     CALL _ADVPL_set_property(l_space_reference,"WIDTH",05)
     CALL _ADVPL_set_property(l_space_reference,"ALIGN","RIGHT")

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_panel_reference)
     CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
     CALL _ADVPL_set_property(l_component_reference,"ALIGN","RIGHT")
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&ancelar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_seq_dependente_zoom_cancel")

     CALL _ADVPL_set_property(m_form_dependent,"ACTIVATE",TRUE)
 END FUNCTION

#----------------------------------------------------------------#
 FUNCTION job0003_seq_dependente_zoom_set_value(l_seq_dependente)
#----------------------------------------------------------------#
     DEFINE l_ind,
            l_count_dependent,
            l_value_dependent SMALLINT

     DEFINE l_item_dependent CHAR(03)

     DEFINE l_seq_dependente LIKE job_gatilho_tarefa.seq_dependente

     FOR l_ind = 1 TO 100
         LET mr_job_gatilho.dependentes[l_ind] = "N"
     END FOR

     LET mr_job_gatilho.selecionar = "N"

     IF  l_seq_dependente IS NULL THEN
         RETURN
     END IF

     LET l_count_dependent = LOG_strtokcount(l_seq_dependente,",") + 1

     FOR l_ind = 1 TO l_count_dependent
         IF  LOG_strpos(l_seq_dependente,",") THEN
             LET l_item_dependent = LOG_strtok(l_seq_dependente,",")
             LET l_seq_dependente = l_seq_dependente[LENGTH(l_item_dependent) + 2, LENGTH(l_seq_dependente)]
         ELSE
             LET l_item_dependent = l_seq_dependente
         END IF

         LET l_value_dependent = l_item_dependent
         LET mr_job_gatilho.dependentes[l_value_dependent] = "S"
     END FOR
 END FUNCTION

#-------------------------------------------------#
 FUNCTION job0003_seq_dependente_zoom_select_all()
#-------------------------------------------------#
     DEFINE l_ind,
            l_row_selected SMALLINT

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     FOR l_ind = 1 TO l_row_selected - 1
         LET mr_job_gatilho.dependentes[l_ind] = mr_job_gatilho.selecionar
     END FOR
 END FUNCTION

#----------------------------------------------#
 FUNCTION job0003_seq_dependente_zoom_confirm()
#----------------------------------------------#
     DEFINE l_ind,
            l_row_selected SMALLINT

     DEFINE l_seq_dependente LIKE job_gatilho_tarefa.seq_dependente

     LET l_row_selected   = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")
     LET l_seq_dependente = NULL

     FOR l_ind = 1 TO l_row_selected - 1
         IF  mr_job_gatilho.dependentes[l_ind] = "N" THEN
             CONTINUE FOR
         END IF

         IF  l_seq_dependente IS NULL THEN
             LET l_seq_dependente = l_ind USING "<<<<<"
         ELSE
             LET l_seq_dependente = l_seq_dependente CLIPPED,",",l_ind USING "<<<<<"
         END IF
     END FOR

     LET ma_job_gatilho_tarefa[l_row_selected].seq_dependente = l_seq_dependente

     CALL _ADVPL_set_property(m_form_dependent,"ACTIVATE",FALSE)
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_seq_dependente_zoom_cancel()
#---------------------------------------------#
     CALL _ADVPL_set_property(m_form_dependent,"ACTIVATE",FALSE)
 END FUNCTION

#-----------------------------------------#
 FUNCTION job0003_tarefa_parametros_zoom()
#-----------------------------------------#
     DEFINE l_row_selected SMALLINT
     DEFINE l_can_edit     SMALLINT

     DEFINE l_panel_reference       VARCHAR(10)
     DEFINE l_layout_form_reference VARCHAR(10)
     DEFINE l_layout_reference      VARCHAR(10)
     DEFINE l_label_reference       VARCHAR(10)
     DEFINE l_component_reference   VARCHAR(10)

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     IF  ma_job_gatilho_tarefa[l_row_selected].programa_tarefa IS NULL THEN
         CALL LOG_show_status_bar_text(m_form_program,"Programa da tarefa selecionada não informado.","WARNING_TEXT")
         RETURN
     END IF

     # Verifica se o usuário encontra-se em uma operação de inclusão, modificação
     # ou cópia para que seja permitida a alteração dos parâmetros do gatilho.
     LET l_can_edit = UPSHIFT(_ADVPL_get_property(m_form_program,"CURRENT_OPERATION")) IN ("CREATE","UPDATE","COPY")

     IF  LOG_transaction_isActive() THEN
         IF  NOT LOG_transaction_savepoint_begin("JOBPARAM") THEN
             CALL log003_err_sql("SAVEPOINT BEGIN","JOBPARAM")
             RETURN
         END IF
     END IF

     LET m_form_parameter = _ADVPL_create_component(NULL,"LPOPUPDIALOG")
     CALL _ADVPL_set_property(m_form_parameter,"TITLE","Parâmetros")
     CALL _ADVPL_set_property(m_form_parameter,"ENABLE_ESC_CLOSE",FALSE)

     LET l_layout_form_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",m_form_parameter)
     CALL _ADVPL_set_property(l_layout_form_reference,"MARGIN",FALSE)
     CALL _ADVPL_set_property(l_layout_form_reference,"COLUMNS_COUNT",1)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"HEIGHT",25)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","TOP")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     LET l_label_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(l_label_reference,"TEXT","<b>Sequência:</b>")
     CALL _ADVPL_set_property(l_label_reference,"WIDTH",80)

     LET l_component_reference = _ADVPL_create_component(NULL,"LNUMERICFIELD",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"LENGTH",5,0)
     CALL _ADVPL_set_property(l_component_reference,"ENABLE",FALSE)
     CALL _ADVPL_set_property(l_component_reference,"VARIABLE",ma_job_gatilho_tarefa[l_row_selected],"sequencia_tarefa")

     LET l_label_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(l_label_reference,"TEXT","<b>Programa:</b>")
     CALL _ADVPL_set_property(l_label_reference,"WIDTH",80)

     LET l_component_reference = _ADVPL_create_component(NULL,"LTEXTFIELD",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"LENGTH",15)
     CALL _ADVPL_set_property(l_component_reference,"ENABLE",FALSE)
     CALL _ADVPL_set_property(l_component_reference,"VARIABLE",ma_job_gatilho_tarefa[l_row_selected],"programa_tarefa")

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     LET m_tree_parameter = _ADVPL_create_component(NULL,"LTREEEX",l_layout_reference)
     CALL _ADVPL_set_property(m_tree_parameter,"SIZE",350,300)
     CALL _ADVPL_set_property(m_tree_parameter,"DYNAMIC",TRUE)
     CALL _ADVPL_set_property(m_tree_parameter,"USE_CACHE",FALSE)
     CALL _ADVPL_set_property(m_tree_parameter,"CHANGE_EVENT","job0003_tree_parametros_change")

     IF  l_can_edit THEN
         CALL job003_create_parametros_popup()

         CALL _ADVPL_set_property(m_tree_parameter,"DOUBLE_CLICK_EVENT","job0003_parametros_update_variable")
         CALL _ADVPL_set_property(m_tree_parameter,"POPUP",m_popup_reference)

         LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
         CALL _ADVPL_set_property(l_component_reference,"TEXT","Açõ&es")
         CALL _ADVPL_set_property(l_component_reference,"POPUP",m_popup_reference)
     END IF

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",1)

     LET m_label_val_parametro = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(m_label_val_parametro,"TEXT","<b>Valor:</b> Não informado.")

     LET m_label_obs_parametro = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(m_label_obs_parametro,"TEXT","<b>Observação:</b> Não informado.")

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     IF  l_can_edit THEN
         LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
         CALL _ADVPL_set_property(l_component_reference,"FOCAL",TRUE)
         CALL _ADVPL_set_property(l_component_reference,"TEXT","C&onfirmar")
         CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_tarefa_parametros_zoom_confirm")

         LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
         CALL _ADVPL_set_property(l_component_reference,"TEXT","C&ancelar")
         CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_tarefa_parametros_zoom_cancel")
     ELSE
         LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
         CALL _ADVPL_set_property(l_component_reference,"FOCAL",TRUE)
         CALL _ADVPL_set_property(l_component_reference,"TEXT","&Fechar")
         CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_tarefa_parametros_zoom_cancel")
     END IF

     CALL _ADVPL_set_property(m_form_parameter,"INIT_EVENT","job0003_tarefa_parametros_get_values")
     CALL _ADVPL_set_property(m_form_parameter,"ACTIVATE",TRUE)
 END FUNCTION

#-------------------------------------------------#
 PRIVATE FUNCTION job003_create_parametros_popup()
#-------------------------------------------------#
     DEFINE l_parent_component    VARCHAR(10)
     DEFINE l_popupitem_reference VARCHAR(10)

     LET m_popup_reference = _ADVPL_create_component(NULL,"LPOPUP",l_parent_component)
     CALL _ADVPL_set_property(m_popup_reference,"BEFORE_POPUP_EVENT","job0003_parametros_before_popup")

     LET l_popupitem_reference = _ADVPL_create_component(NULL,"LPOPUPITEM",m_popup_reference)
     CALL _ADVPL_set_property(l_popupitem_reference,"IMAGE","frw_icon_variable_create_16")
     CALL _ADVPL_set_property(l_popupitem_reference,"TEXT","Incluir parâmetro")
     CALL _ADVPL_set_property(l_popupitem_reference,"CLICK_EVENT","job0003_parametros_create_variable")

     LET l_popupitem_reference = _ADVPL_create_component(NULL,"LPOPUPITEM",m_popup_reference)
     CALL _ADVPL_set_property(l_popupitem_reference,"IMAGE","frw_icon_array_create_16")
     CALL _ADVPL_set_property(l_popupitem_reference,"TEXT","Incluir lista de parâmetros")
     CALL _ADVPL_set_property(l_popupitem_reference,"CLICK_EVENT","job0003_parametros_create_list_variable")

     LET m_popup_add_list_param = _ADVPL_create_component(NULL,"LPOPUPITEM",m_popup_reference)
     CALL _ADVPL_set_property(m_popup_add_list_param,"IMAGE","frw_icon_variable_sequence_16")
     CALL _ADVPL_set_property(m_popup_add_list_param,"TEXT","Incluir sequência ao parâmetro")
     CALL _ADVPL_set_property(m_popup_add_list_param,"CLICK_EVENT","job0003_parametros_create_sequence_variable")

     LET m_popup_update_param = _ADVPL_create_component(NULL,"LPOPUPITEM",m_popup_reference)
     CALL _ADVPL_set_property(m_popup_update_param,"TEXT","Alterar parâmetro")
     CALL _ADVPL_set_property(m_popup_update_param,"IMAGE","frw_icon_variable_update_16")
     CALL _ADVPL_set_property(m_popup_update_param,"CLICK_EVENT","job0003_parametros_update_variable")

     LET m_popup_delete_param = _ADVPL_create_component(NULL,"LPOPUPITEM",m_popup_reference)
     CALL _ADVPL_set_property(m_popup_delete_param,"TEXT","Excluir parâmetro")
     CALL _ADVPL_set_property(m_popup_delete_param,"IMAGE","frw_icon_variable_delete_16")
     CALL _ADVPL_set_property(m_popup_delete_param,"CLICK_EVENT","job0003_parametros_delete_variable")
 END FUNCTION

#-----------------------------------------#
 FUNCTION job0003_tree_parametros_change()
#-----------------------------------------#
     DEFINE l_treeitem      VARCHAR(10)
     DEFINE la_value_item   ARRAY[02] OF CHAR(02)

     DEFINE l_text_item     CHAR(300)
     DEFINE l_value_item    CHAR(006)

     DEFINE l_val_parametro CHAR(255)
     DEFINE l_obs_parametro CHAR(255)

     DEFINE l_row_selected  SMALLINT
     DEFINE l_num_parametro SMALLINT
     DEFINE l_seq_parametro SMALLINT

     LET l_treeitem   = _ADVPL_get_property(m_tree_parameter,"SELECT_ITEM_REFERENCE")

     LET l_value_item = _ADVPL_get_property(l_treeitem,"VALUE")

     IF  l_value_item IS NULL THEN
         RETURN
     END IF

     LET la_value_item   = LOG_getStrTokArr(l_value_item,",")

     LET l_row_selected  = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")
     LET l_num_parametro = la_value_item[1]
     LET l_seq_parametro = la_value_item[2]

     WHENEVER ERROR CONTINUE
     SELECT val_parametro,obs_parametro
       INTO l_val_parametro,l_obs_parametro
       FROM t_parametros
      WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
        AND num_parametro = l_num_parametro
        AND seq_parametro = l_seq_parametro
     WHENEVER ERROR STOP

     IF  l_val_parametro IS NULL THEN
         LET l_val_parametro = "Não informado"
     END IF

     IF  l_obs_parametro IS NULL THEN
         LET l_obs_parametro = "Não informado"
     END IF

     LET l_text_item = "<b>Valor:</b> ",l_val_parametro CLIPPED,"."
     CALL _ADVPL_set_property(m_label_val_parametro,"TEXT",l_text_item)

     LET l_text_item = "<b>Observação:</b> ",l_obs_parametro CLIPPED,"."
     CALL _ADVPL_set_property(m_label_obs_parametro,"TEXT",l_text_item)
 END FUNCTION

#------------------------------------------#
 FUNCTION job0003_parametros_before_popup()
#------------------------------------------#
     DEFINE l_image_node CHAR(50)
     DEFINE l_image_item CHAR(50)

     DEFINE l_treeitem   VARCHAR(10)
     DEFINE l_treenode   VARCHAR(10)

     LET l_treeitem   = _ADVPL_get_property(m_tree_parameter,"SELECT_ITEM_REFERENCE")
     LET l_treenode   = _ADVPL_get_property(l_treeitem,"PARENT_REFERENCE")

     LET l_image_item = _ADVPL_get_property(l_treeitem,"IMAGE")
     LET l_image_node = _ADVPL_get_property(l_treenode,"IMAGE")

     IF  l_image_item IS NULL THEN
         CALL _ADVPL_set_property(m_popup_update_param,"ENABLE",FALSE)
         CALL _ADVPL_set_property(m_popup_add_list_param,"ENABLE",FALSE)
         CALL _ADVPL_set_property(m_popup_delete_param,"ENABLE",FALSE)

         RETURN TRUE
     ELSE
         CALL _ADVPL_set_property(m_popup_delete_param,"ENABLE",TRUE)
     END IF

     IF  l_image_item = "frw_icon_array_16" THEN
         CALL _ADVPL_set_property(m_popup_update_param,"ENABLE",FALSE)
         CALL _ADVPL_set_property(m_popup_add_list_param,"ENABLE",TRUE)
     ELSE
         CALL _ADVPL_set_property(m_popup_update_param,"ENABLE",TRUE)

         IF  l_image_item = "frw_icon_variable_16" AND l_image_node = "frw_icon_array_16" THEN
             CALL _ADVPL_set_property(m_popup_add_list_param,"ENABLE",TRUE)
         ELSE
             CALL _ADVPL_set_property(m_popup_add_list_param,"ENABLE",FALSE)
         END IF
     END IF

     RETURN TRUE
 END FUNCTION

#-----------------------------------------------#
 FUNCTION job0003_tarefa_parametros_get_values()
#-----------------------------------------------#
     DEFINE l_text_item     CHAR(50)
     DEFINE l_value_item    CHAR(50)
     DEFINE l_image_item    CHAR(50)

     DEFINE l_treenode      VARCHAR(10)
     DEFINE l_treeitem      VARCHAR(10)
     DEFINE l_treeitem_sel  VARCHAR(10)

     DEFINE lr_parametros   RECORD
                                sequencia_tarefa LIKE job_gatilho_tarefa_parametros.sequencia_tarefa,
                                num_parametro    LIKE job_gatilho_tarefa_parametros.num_parametro,
                                seq_parametro    LIKE job_gatilho_tarefa_parametros.seq_parametro,
                                val_parametro    LIKE job_gatilho_tarefa_parametros.val_parametro,
                                obs_parametro    LIKE job_gatilho_tarefa_parametros.obs_parametro
                            END RECORD

     DEFINE l_row_selected  SMALLINT
     DEFINE l_num_parametro SMALLINT

     INITIALIZE l_num_parametro TO NULL

     CALL _ADVPL_set_property(m_tree_parameter,"CLEAR")

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     DECLARE cq_t_parametros CURSOR FOR
      SELECT p.seq_tarefa,
             p.num_parametro,
             p.seq_parametro,
             p.val_parametro,
             p.obs_parametro
        FROM t_parametros p
       WHERE p.seq_tarefa = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
       ORDER BY p.seq_tarefa,p.num_parametro,p.seq_parametro
     WHENEVER ERROR STOP
     IF  sqlca.sqlcode <> 0 THEN
         CALL log003_err_sql("DECLARE CURSOR","cq_t_parametros")
         RETURN
     END IF

     WHENEVER ERROR CONTINUE
     FOREACH cq_t_parametros INTO lr_parametros.sequencia_tarefa,
                                  lr_parametros.num_parametro,
                                  lr_parametros.seq_parametro,
                                  lr_parametros.val_parametro,
                                  lr_parametros.obs_parametro

         IF  sqlca.sqlcode <> 0 THEN
             CALL log003_err_sql("FOREACH CURSOR","cq_t_parametros")
             RETURN
         END IF

         IF  lr_parametros.seq_parametro > 0 THEN
             IF  l_num_parametro IS NULL OR l_num_parametro <> lr_parametros.num_parametro THEN
                 LET l_text_item  = "Parâmetro: ",lr_parametros.num_parametro USING "<<<&&"
                 LET l_value_item = lr_parametros.num_parametro USING "<<<&&",",00"

                 LET l_treenode = _ADVPL_create_component(NULL,"LTREEITEMEX",m_tree_parameter)
                 CALL _ADVPL_set_property(l_treenode,"TEXT",l_text_item)
                 CALL _ADVPL_set_property(l_treenode,"VALUE",l_value_item)
                 CALL _ADVPL_set_property(l_treenode,"IMAGE","frw_icon_array_16")
             END IF

             LET l_num_parametro = lr_parametros.num_parametro
         ELSE
             LET l_treenode = m_tree_parameter
             LET l_num_parametro = lr_parametros.num_parametro
         END IF

         IF  lr_parametros.seq_parametro > 0 THEN
             LET l_text_item  = "Sequência: ",lr_parametros.seq_parametro USING "<<<&&"
             LET l_image_item = "frw_icon_variable_16"
         ELSE
             LET l_text_item  = "Parâmetro: ",lr_parametros.num_parametro USING "<<<&&"
             LET l_image_item = "frw_icon_variable_16"
         END IF

         LET l_value_item = lr_parametros.num_parametro USING "<<<&&",",",lr_parametros.seq_parametro USING "<<<&&"

         LET l_treeitem = _ADVPL_create_component(NULL,"LTREEITEMEX",l_treenode)
         CALL _ADVPL_set_property(l_treeitem,"TEXT",l_text_item)
         CALL _ADVPL_set_property(l_treeitem,"IMAGE",l_image_item)
         CALL _ADVPL_set_property(l_treeitem,"VALUE",l_value_item)

         IF  l_treeitem_sel IS NULL THEN
             IF  l_treenode IS NOT NULL AND l_treenode <> m_tree_parameter THEN
                 LET l_treeitem_sel = l_treenode
             ELSE
                 LET l_treeitem_sel = l_treeitem
             END IF
         END IF

         CALL _ADVPL_set_property(m_tree_parameter,"SELECT_ITEM",l_treeitem)
     END FOREACH

     FREE cq_t_parametros
     WHENEVER ERROR STOP

     IF  l_num_parametro IS NULL THEN
         LET l_treeitem = _ADVPL_create_component(NULL,"LTREEITEMEX",m_tree_parameter)
         CALL _ADVPL_set_property(l_treeitem,"IMAGE","x.png")
         CALL _ADVPL_set_property(l_treeitem,"VALUE","0,0")
         CALL _ADVPL_set_property(l_treeitem,"TEXT","Nenhum parâmetro informado.")
         LET l_treeitem_sel = l_treeitem
     END IF

    #CALL _ADVPL_set_property(m_tree_parameter,"RELEASE_CACHE")
     CALL _ADVPL_set_property(m_tree_parameter,"FORCE_GET_FOCUS")
     CALL _ADVPL_set_property(m_tree_parameter,"SELECT_ITEM",l_treeitem_sel)

     CALL job0003_tree_parametros_change()
 END FUNCTION

#----------------------------------------------------------------------------------#
 FUNCTION job0003_t_parametros_insert(l_seq_tarefa,l_num_parametro,l_seq_parametro)
#----------------------------------------------------------------------------------#
     DEFINE l_gatilho       INTEGER

     DEFINE l_seq_tarefa    SMALLINT
     DEFINE l_num_parametro SMALLINT
     DEFINE l_seq_parametro SMALLINT

     DEFINE l_val_parametro CHAR(255)
     DEFINE l_obs_parametro CHAR(255)

     LET l_gatilho       = mr_job_gatilho.gatilho
     LET l_val_parametro = mr_job_gatilho.val_parametro
     LET l_obs_parametro = mr_job_gatilho.obs_parametro

     WHENEVER ERROR CONTINUE
     INSERT INTO t_parametros
     VALUES (l_seq_tarefa,l_num_parametro,l_seq_parametro,l_val_parametro,l_obs_parametro)
     WHENEVER ERROR STOP
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_parametros_create_variable()
#---------------------------------------------#
     DEFINE l_row_selected  SMALLINT
     DEFINE l_num_parametro SMALLINT

     INITIALIZE mr_job_gatilho.val_parametro,mr_job_gatilho.obs_parametro TO NULL

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     SELECT MAX(num_parametro)
       INTO l_num_parametro
       FROM t_parametros
      WHERE seq_tarefa = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
     WHENEVER ERROR STOP

     IF  l_num_parametro IS NULL THEN
         LET l_num_parametro = 0
     END IF
     LET l_num_parametro = l_num_parametro + 1

     LET mr_job_gatilho.num_parametro = l_num_parametro
     LET mr_job_gatilho.seq_parametro = 0

     IF  NOT job0003_tarefa_parametros_form_valor(FALSE,"CREATE") THEN
         RETURN
     END IF

     CALL job0003_t_parametros_insert(ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa,mr_job_gatilho.num_parametro,mr_job_gatilho.seq_parametro)

     CALL job0003_tarefa_parametros_get_values()
 END FUNCTION

#--------------------------------------------------#
 FUNCTION job0003_parametros_create_list_variable()
#--------------------------------------------------#
     DEFINE l_row_selected  SMALLINT
     DEFINE l_num_parametro SMALLINT

     INITIALIZE mr_job_gatilho.val_parametro,mr_job_gatilho.obs_parametro TO NULL

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     SELECT MAX(num_parametro)
       INTO l_num_parametro
       FROM t_parametros
      WHERE seq_tarefa = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
     WHENEVER ERROR STOP

     IF  l_num_parametro IS NULL THEN
         LET l_num_parametro = 0
     END IF
     LET l_num_parametro = l_num_parametro + 1

     LET mr_job_gatilho.num_parametro = l_num_parametro
     LET mr_job_gatilho.seq_parametro = 1

     IF  NOT job0003_tarefa_parametros_form_valor(FALSE,"CREATE") THEN
         RETURN
     END IF

     CALL job0003_t_parametros_insert(ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa,mr_job_gatilho.num_parametro,mr_job_gatilho.seq_parametro)

     CALL job0003_tarefa_parametros_get_values()
 END FUNCTION

#------------------------------------------------------#
 FUNCTION job0003_parametros_create_sequence_variable()
#------------------------------------------------------#
     DEFINE la_value        ARRAY[02] OF CHAR(02)
     DEFINE l_value         CHAR(05)
     DEFINE l_treeitem      VARCHAR(10)
     DEFINE l_row_selected  SMALLINT
     DEFINE l_seq_tarefa    SMALLINT
     DEFINE l_num_parametro SMALLINT
     DEFINE l_seq_parametro SMALLINT

     INITIALIZE mr_job_gatilho.val_parametro,mr_job_gatilho.obs_parametro TO NULL

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     LET l_treeitem = _ADVPL_get_property(m_tree_parameter,"SELECT_ITEM_REFERENCE")

     LET l_value  = _ADVPL_get_property(l_treeitem,"VALUE")
     LET la_value = LOG_getStrTokArr(l_value,",")

     LET l_num_parametro = la_value[1]
     LET l_seq_parametro = la_value[2]

     WHENEVER ERROR CONTINUE
     SELECT MAX(seq_parametro)
       INTO l_seq_parametro
       FROM t_parametros
      WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
        AND num_parametro = l_num_parametro
     WHENEVER ERROR STOP

     IF  l_seq_parametro IS NULL THEN
         LET l_seq_parametro = 0
     END IF
     LET l_seq_parametro = l_seq_parametro + 1

     LET mr_job_gatilho.num_parametro = l_num_parametro
     LET mr_job_gatilho.seq_parametro = l_seq_parametro

     IF  NOT job0003_tarefa_parametros_form_valor(TRUE,"CREATE") THEN
         RETURN
     END IF

     CALL job0003_t_parametros_insert(ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa,mr_job_gatilho.num_parametro,mr_job_gatilho.seq_parametro)

     CALL job0003_tarefa_parametros_get_values()
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_parametros_update_variable()
#---------------------------------------------#
     DEFINE la_value        ARRAY[02] OF CHAR(02)
     DEFINE l_value         CHAR(05)
     DEFINE l_treeitem      VARCHAR(10)
     DEFINE l_image_item    CHAR(50)
     DEFINE l_row_selected  SMALLINT
     DEFINE l_seq_tarefa    SMALLINT
     DEFINE l_num_parametro SMALLINT
     DEFINE l_seq_parametro SMALLINT

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     LET l_treeitem = _ADVPL_get_property(m_tree_parameter,"SELECT_ITEM_REFERENCE")
     LET l_image_item = _ADVPL_get_property(l_treeitem,"IMAGE")

     IF  NOT l_image_item = "frw_icon_array_16" THEN
         LET l_value  = _ADVPL_get_property(l_treeitem,"VALUE")
         LET la_value = LOG_getStrTokArr(l_value,",")

         LET l_num_parametro = la_value[1]
         LET l_seq_parametro = la_value[2]

         INITIALIZE mr_job_gatilho.val_parametro,mr_job_gatilho.obs_parametro TO NULL

         WHENEVER ERROR CONTINUE
         SELECT val_parametro,obs_parametro
           INTO mr_job_gatilho.val_parametro,mr_job_gatilho.obs_parametro
           FROM t_parametros
          WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
            AND num_parametro = l_num_parametro
            AND seq_parametro = l_seq_parametro
         WHENEVER ERROR STOP

         LET mr_job_gatilho.num_parametro = l_num_parametro
         LET mr_job_gatilho.seq_parametro = l_seq_parametro

         IF  NOT job0003_tarefa_parametros_form_valor(l_seq_parametro > 0,"UPDATE") THEN
             RETURN
         END IF

         WHENEVER ERROR CONTINUE
         UPDATE t_parametros
            SET num_parametro = mr_job_gatilho.num_parametro,
                val_parametro = mr_job_gatilho.val_parametro,
                obs_parametro = mr_job_gatilho.obs_parametro
          WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
            AND num_parametro = l_num_parametro
            AND seq_parametro = l_seq_parametro
         WHENEVER ERROR STOP

         CALL job0003_tarefa_parametros_get_values()
     END IF
 END FUNCTION

#---------------------------------------------#
 FUNCTION job0003_parametros_delete_variable()
#---------------------------------------------#
     DEFINE la_value        ARRAY[02] OF CHAR(02)
     DEFINE l_value         CHAR(005)
     DEFINE l_treeitem      VARCHAR(10)
     DEFINE l_row_selected  SMALLINT
     DEFINE l_seq_tarefa    SMALLINT
     DEFINE l_num_parametro SMALLINT
     DEFINE l_seq_parametro SMALLINT

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     LET l_treeitem = _ADVPL_get_property(m_tree_parameter,"SELECT_ITEM_REFERENCE")

     LET l_value  = _ADVPL_get_property(l_treeitem,"VALUE")
     LET la_value = LOG_getStrTokArr(l_value,",")

     LET l_num_parametro = la_value[1]
     LET l_seq_parametro = la_value[2]

     IF  l_seq_parametro > 0 THEN
         WHENEVER ERROR CONTINUE
         DELETE FROM t_parametros
          WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
            AND num_parametro = l_num_parametro
            AND seq_parametro = l_seq_parametro
         WHENEVER ERROR STOP
     ELSE
         WHENEVER ERROR CONTINUE
         DELETE FROM t_parametros
          WHERE seq_tarefa    = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
            AND num_parametro = l_num_parametro
         WHENEVER ERROR STOP
     END IF

     # Como agora pode-se alterar o índice do parâmetro manualmente, não efetuar
     # a reordenação automática.
     # IF  l_seq_parametro > 0 THEN
     #     WHENEVER ERROR CONTINUE
     #     UPDATE t_parametros
     #        SET seq_parametro = seq_parametro - 1
     #      WHERE seq_tarefa    = l_row_selected
     #        AND num_parametro = l_num_parametro
     #        AND seq_parametro > l_seq_parametro
     #     WHENEVER ERROR STOP
     # END IF

     CALL job0003_tarefa_parametros_get_values()
 END FUNCTION

#-------------------------------------------------#
 FUNCTION job0003_tarefa_parametros_zoom_confirm()
#-------------------------------------------------#
     DEFINE l_row_selected SMALLINT

     LET l_row_selected = LOG_table_get_row_selected(m_form_program,"","job_gatilho_tarefa")

     WHENEVER ERROR CONTINUE
     SELECT COUNT(*)
       INTO ma_job_gatilho_tarefa[l_row_selected].vt_tarefa_parametros
       FROM t_parametros p
      WHERE p.seq_tarefa = ma_job_gatilho_tarefa[l_row_selected].sequencia_tarefa
     WHENEVER ERROR STOP

     CALL _ADVPL_set_property(m_form_program,"VALUE","job_gatilho_tarefa","vt_tarefa_parametros",ma_job_gatilho_tarefa[l_row_selected].vt_tarefa_parametros,l_row_selected)

     CALL _ADVPL_set_property(m_form_parameter,"ACTIVATE",FALSE)
 END FUNCTION

#------------------------------------------------#
 FUNCTION job0003_tarefa_parametros_zoom_cancel()
#------------------------------------------------#
     IF  LOG_transaction_isActive() THEN
         IF  NOT LOG_transaction_savepoint_rollback("JOBPARAM") THEN
             CALL log003_err_sql("SAVEPOINT ROLLBACK","JOBPARAM")
             RETURN
         END IF
     END IF

     CALL _ADVPL_set_property(m_form_parameter,"ACTIVATE",FALSE)
 END FUNCTION

#-----------------------------------------------#
FUNCTION job0003_showReservedValues()
#-----------------------------------------------#
     DEFINE l_layout_form_reference 	VARCHAR(10)
     DEFINE l_button_reference 			VARCHAR(10)
     DEFINE l_panel_reference       	VARCHAR(10)
     DEFINE m_texto_palavras_reservadas VARCHAR(10)
     DEFINE l_reserved_word_help		VARCHAR(1000)

     LET mr_job_gatilho.palavras_reservadas = " As seguintes palavras são reservadas e podem ser usadas como parâmetros: "
     LET mr_job_gatilho.palavras_reservadas = mr_job_gatilho.palavras_reservadas || "\n" || "  TODAY = Retorna a data atual "
     LET mr_job_gatilho.palavras_reservadas = mr_job_gatilho.palavras_reservadas || "\n" || "  TIME = Retorna a hora atual "
     LET mr_job_gatilho.palavras_reservadas = mr_job_gatilho.palavras_reservadas || "\n" || "  USER = Retorna o usuário logado "
     LET mr_job_gatilho.palavras_reservadas = mr_job_gatilho.palavras_reservadas || "\n" || "  COMPANY = Retorna a empresa logada "

     LET m_form_reserved_words = _ADVPL_create_component(NULL,"LPOPUPDIALOG")
     CALL _ADVPL_set_property(m_form_reserved_words,"TITLE","Palavras reservadas")
     CALL _ADVPL_set_property(m_form_reserved_words,"ENABLE_ESC_CLOSE",TRUE)
     CALL _ADVPL_set_property(m_form_reserved_words,"SIZE",300,300)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",m_form_reserved_words)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_form_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_form_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_form_reference,"COLUMNS_COUNT",1)
     CALL _ADVPL_set_property(l_layout_form_reference,"EXPANSIBLE",1)

     LET m_texto_palavras_reservadas = _ADVPL_create_component(NULL,"LTEXTAREA",l_layout_form_reference)
     CALL _ADVPL_set_property(m_texto_palavras_reservadas,"ALIGN","CENTER")
     CALL _ADVPL_set_property(m_texto_palavras_reservadas,"ENABLE",FALSE)
     CALL _ADVPL_set_property(m_texto_palavras_reservadas,"VARIABLE",mr_job_gatilho,"palavras_reservadas")

     LET l_button_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_form_reference)
     CALL _ADVPL_set_property(l_button_reference,"SIZE",70,25)
     CALL _ADVPL_set_property(l_button_reference,"TEXT","Fechar")
     CALL _ADVPL_set_property(l_button_reference,"CLICK_EVENT","job0003_closeReservedWordsModal")

     CALL _ADVPL_set_property(m_texto_palavras_reservadas,"FORCE_GET_FOCUS")

     CALL _ADVPL_set_property(m_form_reserved_words,"ACTIVATE",TRUE)

END FUNCTION
#-----------------------------------------------#
FUNCTION job0003_closeReservedWordsModal()
#-----------------------------------------------#
     CALL _ADVPL_set_property(m_form_reserved_words,"ACTIVATE",FALSE)
END FUNCTION

#-----------------------------------------------------------------#
 FUNCTION job0003_tarefa_parametros_form_valor(l_list,l_operation)
#-----------------------------------------------------------------#
     DEFINE l_layout_form_reference VARCHAR(10)
     DEFINE l_layout_reference      VARCHAR(10)
     DEFINE l_layout_in_reference   VARCHAR(10)
     DEFINE l_panel_reference       VARCHAR(10)
     DEFINE l_component_reference   VARCHAR(10)

     DEFINE l_list      SMALLINT
     DEFINE l_operation CHAR(10)

     LET m_operation_val = l_operation

     LET m_form_param_val = _ADVPL_create_component(NULL,"LPOPUPDIALOG")
     CALL _ADVPL_set_property(m_form_param_val,"TITLE","Parâmetro")
     CALL _ADVPL_set_property(m_form_param_val,"ENABLE_ESC_CLOSE",FALSE)

     LET l_layout_form_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",m_form_param_val)
     CALL _ADVPL_set_property(l_layout_form_reference,"MARGIN",FALSE)
     CALL _ADVPL_set_property(l_layout_form_reference,"COLUMNS_COUNT",1)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     LET l_component_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"TEXT","<b>Parâmetro:</b>")
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",80)

     LET m_parametro_seq_ref = _ADVPL_create_component(NULL,"LSPINEDIT",l_layout_reference)
     CALL _ADVPL_set_property(m_parametro_seq_ref,"RANGE",1,99)
     CALL _ADVPL_set_property(m_parametro_seq_ref,"WIDTH",220)
     CALL _ADVPL_set_property(m_parametro_seq_ref,"ENABLE",NOT l_list AND l_operation = "CREATE")
     CALL _ADVPL_set_property(m_parametro_seq_ref,"VARIABLE",mr_job_gatilho,"num_parametro")

     IF  mr_job_gatilho.seq_parametro > 0 THEN
         LET l_component_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"TEXT","<b>Sequência:</b>")
         CALL _ADVPL_set_property(l_component_reference,"WIDTH",80)

         LET l_component_reference = _ADVPL_create_component(NULL,"LNUMERICFIELD",l_layout_reference)
         CALL _ADVPL_set_property(l_component_reference,"WIDTH",220)
         CALL _ADVPL_set_property(l_component_reference,"ENABLE",FALSE)
         CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,"seq_parametro")
     END IF

     LET l_component_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"TEXT","<b>Valor:</b>")
     CALL _ADVPL_set_property(l_component_reference,"WIDTH",80)

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_reference)
     LET l_layout_in_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_in_reference,"MARGIN",FALSE)
     CALL _ADVPL_set_property(l_layout_in_reference,"COLUMNS_COUNT",2)

     LET m_parametro_valor_ref = _ADVPL_create_component(NULL,"LTEXTFIELD",l_layout_in_reference)
     CALL _ADVPL_set_property(m_parametro_valor_ref,"LENGTH",255)
     CALL _ADVPL_set_property(m_parametro_valor_ref,"WIDTH",195)
     CALL _ADVPL_set_property(m_parametro_valor_ref,"ENABLE",TRUE)
     CALL _ADVPL_set_property(m_parametro_valor_ref,"VARIABLE",mr_job_gatilho,"val_parametro")

     LET l_component_reference = _ADVPL_create_component(NULL,"LIMAGE",l_layout_in_reference)
     CALL _ADVPL_set_property(l_component_reference,"IMAGE","btinfo")
     CALL _ADVPL_set_property(l_component_reference,"SIZE",24,20)
     CALL _ADVPL_set_property(l_component_reference,"STRETCH",FALSE)
     CALL _ADVPL_set_property(l_component_reference,"CAN_GOT_FOCUS",TRUE)
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_showReservedValues")
     CALL _ADVPL_set_property(l_component_reference,"TOOLTIP","Palavras reservadas")

     LET l_component_reference = _ADVPL_create_component(NULL,"LLABEL",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"TEXT","Observação:")

     LET l_component_reference = _ADVPL_create_component(NULL,"LTEXTAREA",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"SIZE",220,50)
     CALL _ADVPL_set_property(l_component_reference,"ENABLE",TRUE)
     CALL _ADVPL_set_property(l_component_reference,"VARIABLE",mr_job_gatilho,"obs_parametro")

     LET l_panel_reference = _ADVPL_create_component(NULL,"LPANEL",l_layout_form_reference)
     CALL _ADVPL_set_property(l_panel_reference,"ALIGN","CENTER")

     LET l_layout_reference = _ADVPL_create_component(NULL,"LLAYOUTMANAGER",l_panel_reference)
     CALL _ADVPL_set_property(l_layout_reference,"MARGIN",TRUE)
     CALL _ADVPL_set_property(l_layout_reference,"COLUMNS_COUNT",2)

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"SIZE",70,24)
     CALL _ADVPL_set_property(l_component_reference,"FOCAL",TRUE)
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&onfirmar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_tarefa_parametros_form_valor_confirm")

     LET l_component_reference = _ADVPL_create_component(NULL,"LBUTTON",l_layout_reference)
     CALL _ADVPL_set_property(l_component_reference,"SIZE",70,25)
     CALL _ADVPL_set_property(l_component_reference,"TEXT","C&ancelar")
     CALL _ADVPL_set_property(l_component_reference,"CLICK_EVENT","job0003_tarefa_parametros_form_valor_cancel")

     CALL _ADVPL_set_property(m_parametro_seq_ref,"GET_FOCUS")
     CALL _ADVPL_set_property(m_form_param_val,"ACTIVATE",TRUE)

     RETURN m_confirm_param_val
 END FUNCTION

#--------------------------------------------------------#
 FUNCTION job0003_tarefa_parametros_form_valor_cancel()
#--------------------------------------------------------#
     LET m_confirm_param_val = FALSE
     CALL _ADVPL_set_property(m_form_param_val,"ACTIVATE",FALSE)
 END FUNCTION

#---------------------------------------------------------#
 FUNCTION job0003_tarefa_parametros_form_valor_confirm()
#---------------------------------------------------------#
	 DEFINE l_enabled SMALLINT

     # Somente valida o índice do parâmetro se o mesmo pôde ser alterado.
     IF  m_operation_val <> "UPDATE" THEN
         IF  mr_job_gatilho.seq_parametro > 0 THEN
    	     WHENEVER ERROR CONTINUE
    	     SELECT 1
    	       FROM t_parametros
    	      WHERE num_parametro = mr_job_gatilho.num_parametro
    	        AND seq_parametro = mr_job_gatilho.seq_parametro
    	      UNION
    	     SELECT 1
               FROM t_parametros
              WHERE num_parametro = mr_job_gatilho.num_parametro
                AND seq_parametro = 0
    	     WHENEVER ERROR STOP
    	 ELSE
    	     WHENEVER ERROR CONTINUE
    	     SELECT 1
               FROM t_parametros
              WHERE num_parametro = mr_job_gatilho.num_parametro
    	     WHENEVER ERROR STOP
    	 END IF
	     IF  sqlca.sqlcode <> 0 THEN
	         IF  sqlca.sqlcode <> NOTFOUND THEN
	             CALL log0030_processa_err_sql("SELECT","T_PARAMETROS",0)
	             RETURN FALSE
	         END IF
	     ELSE
	         CALL log0030_processa_mensagem("Parâmetro de índice "||mr_job_gatilho.num_parametro USING "<<<<<<<<<&"||" já cadastrado.","excl",0)
	         CALL _ADVPL_set_property(m_parametro_seq_ref,"GET_FOCUS")
	         RETURN FALSE
	     END IF
	 END IF

     LET m_confirm_param_val = TRUE
     CALL _ADVPL_set_property(m_form_param_val,"ACTIVATE",FALSE)

     RETURN TRUE
 END FUNCTION

#-------------------------------#
 FUNCTION job0003_version_info()
#-------------------------------#
RETURN "$Archive: /Logix/Fontes_Doc/Sustentacao/V12/V12/framework/agendador/programas/job0003.4gl $|$Revision: 26 $|$Date: 07/04/20 15:37 $|$Modtime: 07/04/20 15:37 $" # Informações do controle de versão do SourceSafe - Não remover esta linha (FRAMEWORK)
 END FUNCTION

