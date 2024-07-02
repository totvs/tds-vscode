#INCLUDE 'TOTVS.CH'

User Function XBEGINSQL
Local _cAlias       as Character

    /*
    _cAlias := GetNextAlias()

    BeginSql Alias _cAlias

        SELECT A1_COD FROM %TABLE:SA1%

    EndSql
*/
    While(!(_cAlias)->(EoF()))

        ConOut('Cliente: ' + (_cAlias)->A1_COD)

        (_cAlias)->(DbSkip())

    EndDo

    (_cAlias)->(DbCloseArea())

Return
