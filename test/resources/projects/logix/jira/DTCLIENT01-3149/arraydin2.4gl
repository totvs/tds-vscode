DEFINE ma_dados ARRAY[] OF RECORD
                           valor CHAR(10)
                           END RECORD
DEFINE ma_fixo ARRAY[10] OF RECORD
                           valor CHAR(10)
                           END RECORD

MAIN 
    DEFINE ma_local ARRAY[10] OF RECORD
                           valor CHAR(10)
                           END RECORD

    CALL arrayadditem(ma_dados,10)
    LET ma_dados[1].valor = '01'
    LET ma_dados[2].valor = '02'
    LET ma_dados[3].valor = '03'
    LET ma_dados[4].valor = '04'
    LET ma_dados[5].valor = '05'
    LET ma_dados[6].valor = '06'
    LET ma_dados[7].valor = '07'
    LET ma_dados[8].valor = '08'
    LET ma_dados[9].valor = '09'
    LET ma_dados[10].valor = '10'

    CALL conout("fim....")
END MAIN
