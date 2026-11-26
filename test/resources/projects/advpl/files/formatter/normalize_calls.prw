//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

User Function MinhaFuncao()
Local nRet := 0

// A chamada abaixo esta em maiusculas e deve virar u_MinhaFuncao
u_MINHAFUNCAO()
// A chamada abaixo esta em minusculas e deve virar u_Calcular
nRet := U_calcular(10)

// Dentro de string nao pode ser alterada: OUTRAFUNC()
conout("Chamada em texto: CALCULAR()")
// Comentario com chamada nao muda: CALCULAR()

// Palavra reservada seguida de parentese nao e chamada
If (nRet > 0)
	nRet := 1
Endif

// Funcao inexistente no cache permanece como esta
naoExiste()

Return nRet

User Function Calcular(nValor)
Return nValor * 2
