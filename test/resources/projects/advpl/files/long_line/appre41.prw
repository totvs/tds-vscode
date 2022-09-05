#INCLUDE "TOTVS.CH"
#include "TbiConn.ch"

User Function line1K(cRecno)
    Local cCaminho := "" //"C:\\teste.png"//
    Local nHnd
    
    PREPARE ENVIRONMENT EMPRESA "00" FILIAL "0101"
    
    nHnd := FCreate(cCaminho)
        If nHnd == -1
            MsgStop("Falha ao criar arquivo ["+cCaminho+"]","FERROR "+cValToChar(fError()))
            FClose(nHnd)
            Return .f.
        Endif

    cResponse := "iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAklEQVR4AewaftIAAAotSURBVO3BQY7gRpIAQXei/v9lXx3jlADBrFZrNszsH6y1rnhYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrXPKy1rnlYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrX/PCRyp9U8YbKTRVvqJxUvKFyUjGpnFRMKm9UfKEyVUwqf1LFFw9rrWse1lrXPKy1rvnhsoqbVL6oOFGZKt5QmSpOKk5Upoqp4kRlqjhROal4Q2WqmFSmijcqblK56WGtdc3DWuuah7XWNT/8MpU3Kt5Q+ZNUpopJZap4o2JSeaPijYr/MpU3Kn7Tw1rrmoe11jUPa61rfvh/pmJSOVE5UZkqJpWp4kRlqvhNKl9UfKEyVfyXPay1rnlYa13zsNa65of/MRVfqEwVk8qJylRxonKi8kbFicpU8YXKVDGp/H/ysNa65mGtdc3DWuuaH35Zxb9J5aTiROWNii8q3lCZVKaKE5UvKk4qflPF3+RhrXXNw1rrmoe11jU/XKbyN6uYVKaKk4pJ5URlqnhDZao4qZhUpopJZaqYVKaKSWWqmFSmikllqjhR+Zs9rLWueVhrXfOw1rrG/sF/mMobFScqU8UXKm9UvKEyVZyoTBUnKlPFicpU8f/Jw1rrmoe11jUPa61r7B98oDJVTCo3Vbyh8kbFpPJGxYnK36xiUpkqJpWpYlKZKiaVqWJSuaniNz2sta55WGtd87DWusb+wQcqJxX/JSonFZPKVDGpTBWTyknFicpJxYnKScWJyhsVX6hMFX+Th7XWNQ9rrWse1lrX/PBRxRcqU8WkMlW8oXJSMVWcqEwVJxVvVHxRcaIyVZyonFR8oTJVvKHyRsVxxxxxxxxxxxxxxTh7XWNQ9rrWse1lrX/PBRxRcqU8WkMlW8oXJSMVWcqEwVJxVvVHxRcaIyVZyonFR8oTJVvKHyRsVxxxxxxxxxxxxxxxxxxxxxxxxvexxxxxxxxxxxxxxxxvexxxxxxxxxxxlhrXfOw1rrmxxxxxxxxxxxxxYa11zQ+"
    cTexto    := Decode64(cResponse)
    FWrite(nHnd,cTexto)
    FClose(nHnd)
    cHtml := '</body></html>'
        

    //força a corrupção do arquivo
