#include "protheus.ch"

/*/{Protheus.doc} TQuad
Efetua o cálculo da área ou perímetro em quadriláteros.
@type    class
@version (sem restrição)
@author  acandido 
@since   05/09/2022
/*/

class TQuad
    //{pdoc} Tamanho da base do quadrilátero.
	//{pdoc} @propType numeric
    data base
	
    //{pdoc} Altura quadrilátero
	//{pdoc} @propType numeric
    data altura 
	
    //{pdoc} Tamanho da base menor, nos trapézios.
    //{pdoc} @propType numeric
	data baseMenor

	//ProtheusDOC de métodos devem ser efetuados na implementação.
    method new(base, altura)
    method base(nValor)
    method altura(nValor)
    method baseMenor(nValor)

    method area()
    method perimetro()

endClass

/*/{Protheus.doc} TQuad::new
Cria o objeto para calcular área e perímetro de quadriláteros.
@type method
@author  acandido
@param base, numeric, medida da base do quadrilátero.
@param altura, numeric, medida da altura do quadrilátero.
@return object, instância do objeto ``TQuad``.
/*/
method new(nBase, nAltura) class TQuad
    ::base := nBase
	::altura := nAltura
	::baseMenor := 0
	
return self

/*/{Protheus.doc} TQuad::base
Recupera o valor atual da propriedade base. Se ``nValue`` for informado, ajusta
o valor da propriedade ``base`` para ``nValue``.
@type method
@author  acandido
@param [nValue], numeric, nova medida da base do quadrilátero se informado.
...outras marcações ProtheusDOC...
@return numeric, base do quadrilátero.
/*/
method base(nValor) class TQuad
    if (valtype(nValor) == "N") 
		::base = nValor
	endif
return ::base

/*/{Protheus.doc} TQuad::altura
Recupera o valor atual da propriedade ``altura``. Se ``nValue`` for informado, ajusta
o valor da propriedade ``altura`` para ``nValue``.
@type method
@author  acandido
@param [nValue], numeric, nova medida da altura do quadrilátero se informado.
@return numeric, altura do quadrilátero.
/*/
method altura(nValor) class TQuad
    if (valtype(nValor) == "N") 
		::altura = nValor
	endif
return ::altura

/*/{Protheus.doc} TQuad::baseMenor
Recupera o valor atual da propriedade ``baseMenor``. Se ``nValue`` for informado, ajusta
o valor da propriedade ``baseMenor`` para ``nValue``.
@type method
@author  acandido
@param [nValue], numeric, nova medida da base menor do quadrilátero se informado.
@return numeric, base menor do quadrilátero.
/*/
method baseMenor(nValor) class TQuad
    if (valtype(nValor) == "N") 
		::baseMenor = nValor
	endif
return ::baseMenor

/*/{Protheus.doc} TQuad::area
Calcula a área do quadrilátero.
@type method
@author  acandido
@return numeric, área do quadrilátero.
/*/
method area() class TQuad
    //{pdoc} Resultado da área calculada.
    local nArea := -1
    
	if (::baseMenor == 0) 
		nArea := ::base * ::altura //quadrados e retângulos
	else
		nArea := ((::base + ::baseMenor) * ::altura) / 2  //trapézios
	endif
return nArea

/*/{Protheus.doc} TQuad::perimetro
Calcula o perimetro do quadrilátero (somente quadrados e retângulos).
@type method
@author  acandido
@return numeric, perimetro do quadrilátero.
/*/
method perimetro() class TQuad
    //{pdoc} Resultado do perimetro calculado. -1, indica parâmetro inválido
    local nPerimetro := -1
    
	if (::baseMenor == 0) 
		nArea := ::base * 2 + ::altura * 2//quadrados e retângulos
	endif
return nPerimetro

user function tst_quad() 
    local quadrilatero := TQuad():new()
    local x

    conout(quadrilatero:perimetro())

return
