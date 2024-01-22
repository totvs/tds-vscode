        SELECT    
            B1_COD,
            B1_DESC
        FROM
            %table:SB1% SB1 
        WHERE
            B1_FILIAL  = %xFilial:SB1%
            AND B1_MSBLQL != '1'
            AND %Exp:cWhere%
            AND SB1.%notDel%
