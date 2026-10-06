#include "protheus.ch"

User Function line2K(cRecno)
    Local cCaminho := "" //"C:\\teste.png"//
    Local nHnd

    //PREPARE ENVIRONMENT EMPRESA "00" FILIAL "0101"


    nHnd := FCreate(cCaminho)
        If nHnd == -1
            MsgStop("Falha ao criar arquivo ["+cCaminho+"]","FERROR "+cValToChar(fError()))
            FClose(nHnd)
            Return .f.
        Endif

    cResponse := "iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAklEQVR4AewaftIAAAotSURBVO3BQY7gRpIAQXei/v9lXx3jlADB" + ;
                 "rFZrNszsH6y1rnhYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrXPKy1rnlYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrX/PCR" + ;
                 "yp9U8YbKTRVvqJxUvKFyUjGpnFRMKm9UfKEyVUwqf1LFFw9rrWse1lrXPKy1rvnhsoqbVL6oOFGZKt5QmSpOKk5Upoqp4kRlqjhR" + ;
                 "Oal4Q2WqmFSmijcqblK56WGtdc3DWuuah7XWNT/8MpU3Kt5Q+ZNUpopJZap4o2JSeaPijYr/MpU3Kn7Tw1rrmoe11jUPa61rfvh/" + ;
                 "pmJSOVE5UZkqJpWp4kRlqvhNKl9UfKEyVfyXPay1rnlYa13zsNa65of/MRVfqEwVk8qJylRxonKi8kbFicpU8YXKVDGp/H/ysNa6" + ;
                 "5mGtdc3DWuuaH35Zxb9J5aTiROWNii8q3lCZVKaKE5UvKk4qflPF3+RhrXXNw1rrmoe11jU/XKbyN6uYVKaKk4pJ5URlqnhDZao4" + ;
                 "qZhUpopJZaqYVKaKSWWqmFSmikllqjhR+Zs9rLWueVhrXfOw1rrG/sF/mMobFScqU8UXKm9UvKEyVZyoTBUnKlPFicpU8f/Jw1rr" + ;
                 "moe11jUPa61r7B98oDJVTCo3Vbyh8kbFpPJGxYnK36xiUpkqJpWpYlKZKiaVqWJSuaniNz2sta55WGtd87DWusb+wQcqJxX/JSon" + ;
                 "FZPKVDGpTBWTyknFicpJxYnKScWJyhsVX6hMFX+Th7XWNQ9rrWse1lrX/PBRxRcqU8WkMlW8oXJSMVWcqEwVJxVvVHxRcaIyVZyo" + ;
                 "nFR8oTJVvKHyRsVvelhrXfOw1rrmYa11zQ+XqUwVX1RMKlPFScWk8obKVDGpfFExqUwVJxVfqJxUfKEyVUwVk8obFScqf9LDWuua" + ;
                 "h7XWNQ9rrWt++EhlqphUvlCZKiaVk4oTlaniRGWqeEPlJpWp4o2KSWVSmSomlTdUTiomlanib/aw1rrmYa11zcNa65ofLlN5o2JS" + ;
                 "mSpOKk5UpopJ5Y2KSWWqmFS+UHlD5YuKE5WpYlK5qeJE5aTiRGWq+OJhrXXNw1rrmoe11jX2D/4gld9U8YbKScUXKicVk8pUMalM" + ;
                 "FX+SyknFGypfVJyoTBW/6WGtdc3DWuuah7XWNT98pPJGxRcqU8Wk8kXFpPJvUpkqJpWpYlJ5o2JSuUnli4qbVKaKLx7WWtc8rLWu" + ;
                 "eVhrXfPDRxW/SWWqeKNiUjlReaNiUjmpeKPipGJSmSpOVCaVqeJEZVL5TSonFf+mh7XWNQ9rrWse1lrX/PCXUZkqJpWTijcq3lA5" + ;
                 "qbhJZaqYVKaKE5Wp4kTli4oTlZOKSWWqmFTeqLjpYa11zcNa65qHtdY1P1ymMlW8UTGpfKFyojJVfKEyVUwqU8VU8UbFpPKGyhsV" + ;
                 "k8pUcaIyVZyofFExqZxUfPGw1rrmYa11zcNa6xr7BxepnFTcpDJVvKHyRcWkclIxqdxU8YXKScUbKlPFpDJVvKEyVfybHtZa1zys" + ;
                 "ta55WGtdY//gA5WpYlL5kyreUHmjYlKZKiaV/5KKSWWq+ELlb1Jx08Na65qHtdY1D2uta374qOKmijdUTlTeqJhUbqqYVKaKN1Te" + ;
                 "qDhRmSpOVKaKk4pJZap4Q2WqmFSmit/0sNa65mGtdc3DWuuaHy5TOamYVE5UpoqbKk4qJpWpYlKZKiaVN1SmijcqvlCZKqaKSeWk" + ;
                 "4g2VqeJEZar4kx7WWtc8rLWueVhrXfPDRypvqLxR8YbKVPGFylRxUjGpfFHxRsWkMlVMKlPFicpUcVIxqbxR8UbFpPJGxRcPa61r" + ;
                 "HtZa1zysta6xf/AvUrmp4g2VqeINlaliUvmbVJyoTBUnKlPFicpvqnhDZar44mGtdc3DWuuah7XWNT98pDJVTCpTxVTxhcqkclIx" + ;
                 "Vbyh8kXFGyp/UsWkMlV8UTGpTBWTyknFicpUMVXc9LDWuuZhrXXNw1rrmh8uU5kqvlCZKk4qJpVJ5W+iMlWcVEwqU8WJylQxqUwV" + ;
                 "JxUnKlPFGxUnKicVJypTxRcPa61rHtZa1zysta754ZepTBWTylQxVUwqU8WkclLxhspU8YXKVDGpTBUnFScqU8WkMlVMKn+SylTx" + ;
                 "hcqf9LDWuuZhrXXNw1rrmh8uq5hUvlB5o2JSeUNlqphUTiqmikllUpkqJpU3KqaKk4o3Km6qmFROVKaKE5Wp4jc9rLWueVhrXfOw" + ;
                 "1rrG/sEHKicVN6ncVDGpfFHxhspJxYnKTRWTylRxonJScaJyUjGpTBWTyknFTQ9rrWse1lrXPKy1rrF/8ItUTiomlZsqJpU3Kv4k" + ;
                 "laniROWkYlI5qfhfojJVTCpTxRcPa61rHtZa1zysta754S9XMalMFZPKScWk8m9SmSomlanii4pJ5UTljYpJ5aTiROWNihOVqeKm" + ;
                 "h7XWNQ9rrWse1lrX/PCRylTxhspUMam8UTGpTBVTxYnKFxU3qZxUTCpvqEwVk8pUcVLxRcWk8kXFpDJVfPGw1rrmYa11zcNa65of" + ;
                 "LlM5qZhUTipOVG5S+aJiUpkqTlSmihOVk4pJZao4UTlR+TdVnFT8SQ9rrWse1lrXPKy1rvnho4rfpDJVnFRMKm9UnKicqEwVk8pU" + ;
                 "MalMKicVJypTxaTyRsWkMlW8oTJVfKHyRsVND2utax7WWtc8rLWu+eEylZsqJpWpYlI5UZkqvqh4o2JSOamYVN6o+KLiDZWTiqni" + ;
                 "C5U3Kn7Tw1rrmoe11jUPa61rfvhIZao4UXlDZap4o+JvovKGyonKTRWTylTxhcpvqphU/qSHtdY1D2utax7WWtfYP/gPUzmpmFSm" + ;
                 "ikllqjhRmSpOVE4q3lD5omJSmSreUDmpmFSmijdUvqi46WGtdc3DWuuah7XWNT98pPInVUwVJyp/kspJxaRyojJVvFExqbyhMlX8" + ;
                 "SSpTxRcVk8pU8cXDWuuah7XWNQ9rrWt+uKziJpUTlTcqJpUTlaniC5U3Kt6oOKk4qZhUvqj4ouKNikllUpkqbnpYa13zsNa65mGt" + ;
                 "dc0Pv0zljYqbKiaVqWJSmSr+JJUvVKaKSWWqmFS+qJhUpooTld9UMalMFV88rLWueVhrXfOw1rrmh/9xKlPFb6r4QmWq+EJlqphU" + ;
                 "popJ5Q2VqeKNii9U3qi46WGtdc3DWuuah7XWNT/8j6n4TSpTxRcqb6hMFScVk8oXKicVk8pUcaIyVbxRMan8SQ9rrWse1lrXPKy1" + ;
                 "rvnhl1X8pooTlZOKqWJSOVF5o2KqmFTeUPmi4qRiUpkqJpU/SeUNlanipoe11jUPa61rHtZa1/xwmcqfpHJScaLyRsWJyonKScVJ" + ;
                 "xYnKVDGpTCpTxaRyk8pUcaJyUjGpTBV/0sNa65qHtdY1D2uta+wfrLWueFhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtc8rLWu" + ;
                 "eVhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtf8H53Ebrn2DZfWAAAAAElFTkSuQmCC"
    cTexto    := Decode64(cResponse)
    FWrite(nHnd,cTexto)
    FClose(nHnd)

    //força a corrupção do arquivo
    cResponse2 := "iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAklEQVR4AewaftIAAAotSURBVO3BQY7gRpIAQXei/v9lXx3jlADB" + ;
                  "rFZrNszsH6y1rnhYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrXPKy1rnlYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrX/PCR" + ;
                  "yp9U8YbKTRVvqJxUvKFyUjGpnFRMKm9UfKEyVUwqf1LFFw9rrWse1lrXPKy1rvnhsoqbVL6oOFGZKt5QmSpOKk5Upoqp4kRlqjhR" + ;
                  "Oal4Q2WqmFSmijcqblK56WGtdc3DWuuah7XWNT/8MpU3Kt5Q+ZNUpopJZap4o2JSeaPijYr/MpU3Kn7Tw1rrmoe11jUPa61rfvh/" + ;
                  "pmJSOVE5UZkqJpWp4kRlqvhNKl9UfKEyVfyXPay1rnlYa13zsNa65of/MRVfqEwVk8qJylRxonKi8kbFicpU8YXKVDGp/H/ysNa6" + ;
                  "5mGtdc3DWuuaH35Zxb9J5aTiROWNii8q3lCZVKaKE5UvKk4qflPF3+RhrXXNw1rrmoe11jU/XKbyN6uYVKaKk4pJ5URlqnhDZao4" + ;
                  "qZhUpopJZaqYVKaKSWWqmFSmikllqjhR+Zs9rLWueVhrXfOw1rrG/sF/mMobFScqU8UXKm9UvKEyVZyoTBUnKlPFicpU8f/Jw1rr" + ;
                  "moe11jUPa61r7B98oDJVTCo3Vbyh8kbFpPJGxYnK36xiUpkqJpWpYlKZKiaVqWJSuaniNz2sta55WGtd87DWusb+wQcqJxX/JSon" + ;
                  "FZPKVDGpTBWTyknFicpJxYnKScWJyhsVX6hMFX+Th7XWNQ9rrWse1lrX/PBRxRcqU8WkMlW8oXJSMVWcqEwVJxVvVHxRcaIyVZyo" + ;
                  "nFR8oTJVvKHyRsVvelhrXfOw1rrmYa11zQ+XqUwVX1RMKlPFScWk8obKVDGpfFExqUwVJxVfqJxUfKEyVUwVk8obFScqf9LDWuua" + ;
                  "h7XWNQ9rrWt++EhlqphUvlCZKiaVk4oTlaniRGWqeEPlJpWp4o2KSWVSmSomlTdUTiomlanib/aw1rrmYa11zcNa65ofLlN5o2JS" + ;
                  "mSpOKk5UpopJ5Y2KSWWqmFS+UHlD5YuKE5WpYlK5qeJE5aTiRGWq+OJhrXXNw1rrmoe11jX2D/4gld9U8YbKScUXKicVk8pUMalM" + ;
                  "FX+SyknFGypfVJyoTBW/6WGtdc3DWuuah7XWNT98pPJGxRcqU8Wk8kXFpPJvUpkqJpWpYlJ5o2JSuUnli4qbVKaKLx7WWtc8rLWu" + ;
                  "eVhrXfPDRxW/SWWqeKNiUjlReaNiUjmpeKPipGJSmSpOVCaVqeJEZVL5TSonFf+mh7XWNQ9rrWse1lrX/PCXUZkqJpWTijcq3lA5" + ;
                  "qbhJZaqYVKaKE5Wp4kTli4oTlZOKSWWqmFTeqLjpYa11zcNa65qHtdY1P1ymMlW8UTGpfKFyojJVfKEyVUwqU8VU8UbFpPKGyhsV" + ;
                  "k8pUcaIyVZyofFExqZxUfPGw1rrmYa11zcNa6xr7BxepnFTcpDJVvKHyRcWkclIxqdxU8YXKScUbKlPFpDJVvKEyVfybHtZa1zys" + ;
                  "ta55WGtdY//gA5WpYlL5kyreUHmjYlKZKiaV/5KKSWWq+ELlb1Jx08Na65qHtdY1D2uta374qOKmijdUTlTeqJhUbqqYVKaKN1Te" + ;
                  "qDhRmSpOVKaKk4pJZap4Q2WqmFSmit/0sNa65mGtdc3DWuuaHy5TOamYVE5UpoqbKk4qJpWpYlKZKiaVN1SmijcqvlCZKqaKSeWk" + ;
                  "4g2VqeJEZar4kx7WWtc8rLWueVhrXfPDRypvqLxR8YbKVPGFylRxUjGpfFHxRsWkMlVMKlPFicpUcVIxqbxR8UbFpPJGxRcPa61r" + ;
                  "HtZa1zysta6xf/AvUrmp4g2VqeINlaliUvmbVJyoTBUnKlPFicpvqnhDZar44mGtdc3DWuuah7XWNT98pDJVTCpTxVTxhcqkclIx" + ;
                  "Vbyh8kXFGyp/UsWkMlV8UTGpTBWTyknFicpUMVXc9LDWuuZhrXXNw1rrmh8uU5kqvlCZKk4qJpVJ5W+iMlWcVEwqU8WJylQxqUwV" + ;
                  "JxUnKlPFGxUnKicVJypTxRcPa61rHtZa1zysta754ZepTBWTylQxVUwqU8WkclLxhspU8YXKVDGpTBUnFScqU8WkMlVMKn+SylTx" + ;
                  "hcqf9LDWuuZhrXXNw1rrmh8uq5hUvlB5o2JSeUNlqphUTiqmikllUpkqJpU3KqaKk4o3Km6qmFROVKaKE5Wp4jc9rLWueVhrXfOw" + ;
                  "1rrG/sEHKicVN6ncVDGpfFHxhspJxYnKTRWTylRxonJScaJyUjGpTBWTyknFTQ9rrWse1lrXPKy1rrF/8ItUTiomlZsqJpU3Kv4k" + ;
                  "laniROWkYlI5qfhfojJVTCpTxRcPa61rHtZa1zysta754S9XMalMFZPKScWk8m9SmSomlanii4pJ5UTljYpJ5aTiROWNihOVqeKm" + ;
                  "h7XWNQ9rrWse1lrX/PCRylTxhspUMam8UTGpTBVTxYnKFxU3qZxUTCpvqEwVk8pUcVLxRcWk8kXFpDJVfPGw1rrmYa11zcNa65of" + ;
                  "LlM5qZhUTipOVG5S+aJiUpkqTlSmihOVk4pJZao4UTlR+TdVnFT8SQ9rrWse1lrXPKy1rvnho4rfpDJVnFRMKm9UnKicqEwVk8pU" + ;
                  "MalMKicVJypTxaTyRsWkMlW8oTJVfKHyRsVND2utax7WWtc8rLWu+eEylZsqJpWpYlI5UZkqvqh4o2JSOamYVN6o+KLiDZWTiqni" + ;
                  "C5U3Kn7Tw1rrmoe11jUPa61rfvhIZao4UXlDZap4o+JvovKGyonKTRWTylTxhcpvqphU/qSHtdY1D2utax7WWtfYP/gPUzmpmFSm" + ;
                  "ikllqjhRmSpOVE4q3lD5omJSmSreUDmpmFSmijdUvqi46WGtdc3DWuuah7XWNT98pPInVUwVJyp/kspJxaRyojJVvFExqbyhMlX8" + ;
                  "SSpTxRcVk8pU8cXDWuuah7XWNQ9rrWt+uKziJpUTlTcqJpUTlaniC5U3Kt6oOKk4qZhUvqj4ouKNikllUpkqbnpYa13zsNa65mGt" + ;
                  "dc0Pv0zljYqbKiaVqWJSmSr+JJUvVKaKSWWqmFS+qJhUpooTld9UMalMFV88rLWueVhrXfOw1rrmh/9xKlPFb6r4QmWq+EJlqphU" + ;
                  "popJ5Q2VqeKNii9U3qi46WGtdc3DWuuah7XWNT/8j6n4TSpTxRcqb6hMFScVk8oXKicVk8pUcaIyVbxRMan8SQ9rrWse1lrXPKy1" + ;
                  "rvnhl1X8pooTlZOKqWJSOVF5o2KqmFTeUPmi4qRiUpkqJpU/SeUNlanipoe11jUPa61rHtZa1/xwmcqfpHJScaLyRsWJyonKScVJ" + ;
                  "xYnKVDGpTCpTxaRyk8pUcaJyUjGpTBV/0sNa65qHtdY1D2uta+wfrLWueFhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtc8rLWu" + ;
                  "eVhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtf8H53Ebrn2DZfWAAAAAElFTkSuQmCCiVBORw0KGgoAAAANSUhEUgAAANQAAADU" + ;
                  "CAYAAADk3g0YAAAAAklEQVR4AewaftIAAAotSURBVO3BQY7gRpIAQXei/v9lXx3jlADBrFZrNszsH6y1rnhYa13zsNa65mGtdc3D" + ;
                  "Wuuah7XWNQ9rrWse1lrXPKy1rnlYa13zsNa65mGtdc3DWuuah7XWNQ9rrWse1lrX/PCRyp9U8YbKTRVvqJxUvKFyUjGpnFRMKm9U" + ;
                  "fKEyVUwqf1LFFw9rrWse1lrXPKy1rvnhsoqbVL6oOFGZKt5QmSpOKk5Upoqp4kRlqjhROal4Q2WqmFSmijcqblK56WGtdc3DWuua" + ;
                  "h7XWNT/8MpU3Kt5Q+ZNUpopJZap4o2JSeaPijYr/MpU3Kn7Tw1rrmoe11jUPa61rfvh/pmJSOVE5UZkqJpWp4kRlqvhNKl9UfKEy" + ;
                  "VfyXPay1rnlYa13zsNa65of/MRVfqEwVk8qJylRxonKi8kbFicpU8YXKVDGp/H/ysNa65mGtdc3DWuuaH35Zxb9J5aTiROWNii8q" + ;
                  "3lCZVKaKE5UvKk4qflPF3+RhrXXNw1rrmoe11jU/XKbyN6uYVKaKk4pJ5URlqnhDZao4qZhUpopJZaqYVKaKSWWqmFSmikllqjhR" + ;
                  "+Zs9rLWueVhrXfOw1rrG/sF/mMobFScqU8UXKm9UvKEyVZyoTBUnKlPFicpU8f/Jw1rrmoe11jUPa61r7B98oDJVTCo3Vbyh8kbF" + ;
                  "pPJGxYnK36xiUpkqJpWpYlKZKiaVqWJSuaniNz2sta55WGtd87DWusb+wQcqJxX/JSonFZPKVDGpTBWTyknFicpJxYnKScWJyhsV" + ;
                  "X6hMFX+Th7XWNQ9rrWse1lrX/PBRxRcqU8WkMlW8oXJSMVWcqEwVJxVvVHxRcaIyVZyonFR8oTJVvKHyRsVvelhrXfOw1rrmYa11" + ;
                  "zQ+XqUwVX1RMKlPFScWk8obKVDGpfFExqUwVJxVfqJxUfKEyVUwVk8obFScqf9LDWuuah7XWNQ9rrWt++EhlqphUvlCZKiaVk4oT" + ;
                  "laniRGWqeEPlJpWp4o2KSWVSmSomlTdUTiomlanib/aw1rrmYa11zcNa65ofLlN5o2JSmSpOKk5UpopJ5Y2KSWWqmFS+UHlD5YuK" + ;
                  "E5WpYlK5qeJE5aTiRGWq+OJhrXXNw1rrmoe11jX2D/4gld9U8YbKScUXKicVk8pUMalMFX+SyknFGypfVJyoTBW/6WGtdc3DWuua" + ;
                  "h7XWNT98pPJGxRcqU8Wk8kXFpPJvUpkqJpWpYlJ5o2JSuUnli4qbVKaKLx7WWtc8rLWueVhrXfPDRxW/SWWqeKNiUjlReaNiUjmp" + ;
                  "eKPipGJSmSpOVCaVqeJEZVL5TSonFf+mh7XWNQ9rrWse1lrX/PCXUZkqJpWTijcq3lA5qbhJZaqYVKaKE5Wp4kTli4oTlZOKSWWq" + ;
                  "mFTeqLjpYa11zcNa65qHtdY1P1ymMlW8UTGpfKFyojJVfKEyVUwqU8VU8UbFpPKGyhsVk8pUcaIyVZyofFExqZxUfPGw1rrmYa11" + ;
                  "zcNa6xr7BxepnFTcpDJVvKHyRcWkclIxqdxU8YXKScUbKlPFpDJVvKEyVfybHtZa1zysta55WGtdY//gA5WpYlL5kyreUHmjYlKZ" + ;
                  "KiaV/5KKSWWq+ELlb1Jx08Na65qHtdY1D2uta374qOKmijdUTlTeqJhUbqqYVKaKN1TeqDhRmSpOVKaKk4pJZap4Q2WqmFSmit/0" + ;
                  "sNa65mGtdc3DWuuaHy5TOamYVE5UpoqbKk4qJpWpYlKZKiaVN1SmijcqvlCZKqaKSeWk4g2VqeJEZar4kx7WWtc8rLWueVhrXfPD" + ;
                  "RypvqLxR8YbKVPGFylRxUjGpfFHxRsWkMlVMKlPFicpUcVIxqbxR8UbFpPJGxRcPa61rHtZa1zysta6xf/AvUrmp4g2VqeINlali" + ;
                  "UvmbVJyoTBUnKlPFicpvqnhDZar44mGtdc3DWuuah7XWNT98pDJVTCpTxVTxhcqkclIxVbyh8kXFGyp/UsWkMlV8UTGpTBWTyknF" + ;
                  "icpUMVXc9LDWuuZhrXXNw1rrmh8uU5kqvlCZKk4qJpVJ5W+iMlWcVEwqU8WJylQxqUwVJxUnKlPFGxUnKicVJypTxRcPa61rHtZa" + ;
                  "1zysta754ZepTBWTylQxVUwqU8WkclLxhspU8YXKVDGpTBUnFScqU8WkMlVMKn+SylTxhcqf9LDWuuZhrXXNw1rrmh8uq5hUvlB5" + ;
                  "o2JSeUNlqphUTiqmikllUpkqJpU3KqaKk4o3Km6qmFROVKaKE5Wp4jc9rLWueVhrXfOw1rrG/sEHKicVN6ncVDGpfFHxhspJxYnK" + ;
                  "TRWTylRxonJScaJyUjGpTBWTyknFTQ9rrWse1lrXPKy1rrF/8ItUTiomlZsqJpU3Kv4klaniROWkYlI5qfhfojJVTCpTxRcPa61r" + ;
                  "HtZa1zysta754S9XMalMFZPKScWk8m9SmSomlanii4pJ5UTljYpJ5aTiROWNihOVqeKmh7XWNQ9rrWse1lrX/PCRylTxhspUMam8" + ;
                  "UTGpTBVTxYnKFxU3qZxUTCpvqEwVk8pUcVLxRcWk8kXFpDJVfPGw1rrmYa11zcNa65ofLlM5qZhUTipOVG5S+aJiUpkqTlSmihOV" + ;
                  "k4pJZao4UTlR+TdVnFT8SQ9rrWse1lrXPKy1rvnho4rfpDJVnFRMKm9UnKicqEwVk8pUMalMKicVJypTxaTyRsWkMlW8oTJVfKHy" + ;
                  "RsVND2utax7WWtc8rLWu+eEylZsqJpWpYlI5UZkqvqh4o2JSOamYVN6o+KLiDZWTiqniC5U3Kn7Tw1rrmoe11jUPa61rfvhIZao4" + ;
                  "UXlDZap4o+JvovKGyonKTRWTylTxhcpvqphU/qSHtdY1D2utax7WWtfYP/gPUzmpmFSmikllqjhRmSpOVE4q3lD5omJSmSreUDmp" + ;
                  "mFSmijdUvqi46WGtdc3DWuuah7XWNT98pPInVUwVJyp/kspJxaRyojJVvFExqbyhMlX8SSpTxRcVk8pU8cXDWuuah7XWNQ9rrWt+" + ;
                  "uKziJpUTlTcqJpUTlaniC5U3Kt6oOKk4qZhUvqj4ouKNikllUpkqbnpYa13zsNa65mGtdc0Pv0zljYqbKiaVqWJSmSr+JJUvVKaK" + ;
                  "SWWqmFS+qJhUpooTld9UMalMFV88rLWueVhrXfOw1rrmh/9xKlPFb6r4QmWq+EJlqphUpopJ5Q2VqeKNii9U3qi46WGtdc3DWuua" + ;
                  "h7XWNT/8j6n4TSpTxRcqb6hMFScVk8oXKicVk8pUcaIyVbxRMan8SQ9rrWse1lrXPKy1rvnhl1X8pooTlZOKqWJSOVF5o2KqmFTe" + ;
                  "UPmi4qRiUpkqJpU/SeUNlanipoe11jUPa61rHtZa1/xwmcqfpHJScaLyRsWJyonKScVJxYnKVDGpTCpTxaRyk8pUcaJyUjGpTBV/" + ;
                  "0sNa65qHtdY1D2uta+wfrLWueFhrXfOw1rrmYa11zcNa65qHtdY1D2utax7WWtc8rLWueVhrXfOw1rrmYa11zcNa65qHtdY1D2ut" + ;
                  "ax7WWtf8H53Ebrn2DZfWAAAAAElFTkSuQmCC"


return
