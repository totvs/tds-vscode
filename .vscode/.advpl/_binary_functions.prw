#include "protheus.ch"
#xtranslate binary function <cNome> => function x_<cNome>

/*/{Protheus.doc} changequery
Esta função tem como objetivo retornar uma query modificada de acordo a escrita adequada para o banco de dados em uso.

@type binary function
@sintax ChangeQuery(<cQuery>) => character
@return character, String contendo a query com os ajustes e compatibilizações necessárias para ser executada execução através da conexão com o SGDB atual.

@param <cquery>, character, String contendo query de consulta de dados \( SELECT \) a ser avaliado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/changequery
/*/
binary function changequery(cquery)
return


/*/{Protheus.doc} dbapp
Esta função faz migração de dados de uma tabela/arquivo para tabela/arquivo

@type binary function
@sintax DBApp(<cSource>, [aFields], [bFirstCondition], [bSecondCondition], [nCount], [nRecno], [xRest], [cRDD]) => Nil
@return Nil, Sempre retorna nulo.

@param <csource>, character, String contendo o nome da tabela origem.
@param [afields], array, Array com campos TODO.
@param [bfirstcondition], codeblock, Primeiro Code Block com condição para inserir registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para inserir registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [nrecno], numeric, Unico registro a ser processado.
@param [xrest], variant, Compatibilidade.
@param [crdd], character, RDD utilizado para abertura da tabela cSource.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbapp
/*/
binary function dbapp(csource, afields, bfirstcondition, bsecondcondition, ncount, nrecno, xrest, crdd)
return


/*/{Protheus.doc} dbcopy
Esta função cria a tabela com a estrutura e dados da tabela corrente.

@type binary function
@sintax DBCopy(<cFile>, [aFields], [bFirstCondition], [bSecondCondition], [nCount], [nRecno], [xRest], [cRDD]) => Nil
@return Nil, Sempre retorna nulo.

@param <cfile>, character, String contendo o nome da nova tabela.
@param [afields], array, Array com campos para ser criados.
@param [bfirstcondition], codeblock, Primeiro Code Block com condição para inserir registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para inserir registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [nrecno], numeric, Unico registro a ser processado.
@param [xrest], logical, Compatibilidade.
@param [crdd], character, RDD utilizado para abertura da tabela cSource.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbcopy
/*/
binary function dbcopy(cfile, afields, bfirstcondition, bsecondcondition, ncount, nrecno, xrest, crdd)
return


/*/{Protheus.doc} dbdelim
Esta função cria um arquivo no Local File com a estrutura e dados da tabela corrente.

@type binary function
@sintax DBDelim(<lCopy>, <cFile>, [cDelim], [aFields], [bFirstCondition], [bSecondCondition], [nCount], [nRecno], [lRest]) => Nil
@return Nil, Sempre retorna nulo.

@param <lcopy>, logical, Realizar a cópia ou não
@param <cfile>, character, String contendo o diretorio e nome do arquivo aonde será salvo
@param [cdelim], character, Delimitador
@param [afields], array, Array com campos para ser criados.
@param [bfirstcondition], codeblock, Primeiro Code Block com condição para inserir registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para inserir registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [nrecno], numeric, Unico registro a ser processado.
@param [lrest], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbdelim
/*/
binary function dbdelim(lcopy, cfile, cdelim, afields, bfirstcondition, bsecondcondition, ncount, nrecno, lrest)
return


/*/{Protheus.doc} dblocate1
Esta função seleciona o recno dependendo das condições passadas.

@type binary function
@sintax DBLocate1([bFirstCondition], [bSecondCondition], [nCount], [xRecno], [lRest]) => Nil
@return Nil, Sempre retorna nulo.

@param [bfirstcondition], codeblock, Primeiro Code Block com condição para encontrar o registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para encontrar o registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [xrecno], variant, Unico registro a ser processado.
@param [lrest], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dblocate1
/*/
binary function dblocate1(bfirstcondition, bsecondcondition, ncount, xrecno, lrest)
return


/*/{Protheus.doc} dbsdf
Esta função cria um arquivo no Local File com a estrutura e dados da tabela corrente.

@type binary function
@sintax DBSdf(<lCopy>, <cFile>, [aFields], [bFirstCondition], [bSecondCondition], [nCount], [nRecno], [lRest]) => Nil
@return Nil, Sempre retorna nulo.

@param <lcopy>, logical, Realizar a cópia ou não
@param <cfile>, character, String contendo o diretorio e nome do arquivo aonde será salvo
@param [afields], array, Array com campos para ser criados.
@param [bfirstcondition], codeblock, Primeiro Code Block com condição para inserir registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para inserir registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [nrecno], numeric, Unico registro a ser processado.
@param [lrest], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbsdf
/*/
binary function dbsdf(lcopy, cfile, afields, bfirstcondition, bsecondcondition, ncount, nrecno, lrest)
return


/*/{Protheus.doc} dbzap
Exclui todos os registros da tabela/arquivo.

@type binary function
@sintax DBZap() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbzap
/*/
binary function dbzap()
return


/*/{Protheus.doc} hextodec
Converte um número da base hexadecimal para base decimal.

@type binary function
@sintax hextodec([cHex]) => numeric
@return numeric, Retorna um número em base decimal

@param [chex], character, Valor hexadecimal a ser convertido
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hextodec
/*/
binary function hextodec(chex)
return


/*/{Protheus.doc} dbskipper
Desloca para outro registro da tabela/arquivo.

@type binary function
@sintax DBSkipper([nCount]) => numeric
@return numeric, Retorno a quantidade de registros deslocados.

@param [ncount], numeric, Numero maximo de registros a ser deslocados \(Pode ser numero negativo\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbskipper
/*/
binary function dbskipper(ncount)
return


/*/{Protheus.doc} aadd
Inclui um elemento no array e ao elemento, do array recém-criado, é atribuído o valor especificado por parâmetro.

@type binary function
@sintax AAdd(<aDest>, <xExpr>) => variant
@return variant, Retorna o valor especificado em <**xExpr**>.

@param <adest>, array, Indica o array que receberá o novo elemento.
@param <xexpr>, variant, Indica uma expressão válida que será o valor do novo elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aadd
/*/
binary function aadd(adest, xexpr)
return


/*/{Protheus.doc} ablavailable
descrição da funcao

@type binary function
@sintax AblAvailable([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ablavailable
/*/
binary function ablavailable(tnomevar)
return


/*/{Protheus.doc} abs
Retorna o valor absoluto \(independente do sinal\) de uma expressão numérica.

@type binary function
@sintax Abs(<nExp>) => numeric
@return numeric, Retorna um número que representa o valor absoluto da expressão informada. O valor será um número positivo ou zero.

@param <nexp>, numeric, Indica a expressão que será avaliada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/abs
/*/
binary function abs(nexp)
return


/*/{Protheus.doc} acopy
Copia elementos de um array para outro.

@type binary function
@sintax ACopy(<aOrigem>, <aDestino>, [nInicio], [nCont], [nPosDestino]) => array
@return array, Retorna uma referência do array aDestino.

@param <aorigem>, array, Indica o array onde estão os elementos que serão copiados.
@param <adestino>, array, Indica o array de destino onde os elementos serão copiados.
@param [ninicio], numeric, Indica o elemento inicial do array aOrigem a partir do qual os conteúdos serão copiados. Caso não seja especificado, o valor padrão será um \(1\).
@param [ncont], numeric, Indica a quantidade de elementos que serão copiados do array a partir do nInicio. Caso não seja especificado, será copiado do nInicio até o último elemento.
@param [nposdestino], numeric, Indica a partir de qual posição do array aDestino os elementos serão copiados. Caso não seja especificado, o valor padrão é um \(1\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/acopy
/*/
binary function acopy(aorigem, adestino, ninicio, ncont, nposdestino)
return


/*/{Protheus.doc} acos
Calcula o valor em radianos do arco cosseno de um valor que representa o cosseno de um ângulo.

@type binary function
@sintax ACos(<nCos>) => numeric
@return numeric, Retorna um valor entre 0 e PI radianos.

@param <ncos>, numeric, Indica o valor que representa o cosseno de um ângulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/acos
/*/
binary function acos(ncos)
return


/*/{Protheus.doc} addcssrule
descrição da funcao

@type binary function
@sintax addcssrule([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcssrule
/*/
binary function addcssrule(tnomevar)
return


/*/{Protheus.doc} addfontalias
descrição da funcao

@type binary function
@sintax addfontalias([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addfontalias
/*/
binary function addfontalias(tnomevar)
return


/*/{Protheus.doc} adel
Elimina um elemento do array e "arrasta" os demais para trás tornando nulo o último elemento.

@type binary function
@sintax ADel(<aSource>, <nPos>) => array
@return array, Retorna o array especificado em <**aSource**>.

@param <asource>, array, Indica o array que contém um elemento para ser eliminado.
@param <npos>, numeric, Indica a posição do elemento no array, a partir do primeiro, que será eliminado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/adel
/*/
binary function adel(asource, npos)
return


/*/{Protheus.doc} adir
Preenche uma série de arrays com informações de arquivos e diretórios \(nomes de arquivos, tamanhos, datas, horas e atributos\).

@type binary function
@sintax ADir([cEspecArq], [@aNomesArq], [@aTamanhos], [@aDatas], [@aHoras], [@aAtributos], [lChangeCase]) => numeric
@return numeric, Retorna a quantidade de arquivos encontrados que correspondem à máscara de pesquisa no diretório especificado.

@param [cespecarq], character, Indica o path e máscara de arquivos a ser pesquisado. Para isso, pode-se incluir caracteres do tipo curinga \* e ?, como também se referenciar ao diretório ou path. Caso nada seja especificado, o parâmetro assumirá como padrão \*.\*
@param [@anomesarq], array, Indica o array que será preenchido com os nomes de arquivos que correspondem a . Cada elemento contém o nome do arquivo e extensão no formato string em maiúsculo.
@param [@atamanhos], array, Indica o array que será preenchido com os tamanhos dos arquivos correspondentes no array . Cada elemento será numérico.
@param [@adatas], array, Indica o array que será preenchido com as datas dos arquivos correspondentes no array . Cada elemento será do tipo data \(D\)
@param [@ahoras], array, Indica o array que será preenchido com as horas dos arquivos correspondentes no array . Cada elemento preenchido, contém uma string no formato hora, minutos e segundos \(hh:mm:ss\).
@param [@aatributos], array, Indica o array que será preenchido com os atributos dos arquivos correspondentes no array . Cada elemento é uma string. Caso seja especificado, os arquivos de diretório, sistema e escondidos são inclusos, assim como os arquivos normais. Mas se não for especificado, somente os arquivos normais serão inclusos.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/adir
/*/
binary function adir(cespecarq, anomesarq, atamanhos, adatas, ahoras, aatributos, lchangecase)
return


/*/{Protheus.doc} aduservalid
Faz a autenticação de uma conta de usuário de um domínio baseado no Active Directory do Microsoft Windows.

@type binary function
@sintax ADUserValid(<cDomainName>, <cUserName>, <cPassword>) => codeblock
@return codeblock, Retorna verdadeiro \(.T.\) se a autenticação no domínio foi realizada com sucesso, caso contrário, falso \(.F.\).

@param <cdomainname>, character, Cenário 1: Nome do domínio no qual encontra-se a estação. Cenário 2: Código SID do usuário autenticado na estação.
@param <cusername>, character, Cenário 1: Nome do usuário pertencente ao domínio informado. Cenário 2: String vazia, obrigatoriamente.
@param <cpassword>, character, Ambos os cenários: Senha do usuário informado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aduservalid
/*/
binary function aduservalid(cdomainname, cusername, cpassword)
return


/*/{Protheus.doc} aesdecrypt
Decripta textos usando o algoritmo AES no modo definido.

@type binary function
@sintax AESDecrypt(<nCipherID>, <cCipherText>, <cKey>, [cIV]) => array
@return array, Array com o resultado do processo de decriptação.

@param <ncipherid>, numeric, Código identificador do modo do algoritmo AES a ser usado na decriptação.
@param <cciphertext>, character, Texto de entrada a ser decriptado.
@param <ckey>, character, Key da decriptação, conforme o modo do algoritmo AES a ser usado.
@param [civ], character, IV \(Vetor de Inicialização\) da decriptação, conforme o modo do algoritmo AES a ser usado. **Obrigatório para o modo CBC.**
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aesdecrypt
/*/
binary function aesdecrypt(ncipherid, cciphertext, ckey, civ)
return


/*/{Protheus.doc} aesencrypt
Encripta textos usando o algoritmo AES no modo definido.

@type binary function
@sintax AESEncrypt(<nCipherID>, <cPlainText>, [cPassword], [cKey], [cIV]) => array
@return array, Array com o resultado do processo de encriptação.

@param <ncipherid>, numeric, Código identificador do modo do algoritmo AES a ser usado na encriptação.
@param <cplaintext>, character, Texto de entrada a ser encriptado.
@param [cpassword], character, Texto auxiliar na geração da key da encriptação.
@param [ckey], character, Key da encriptação, conforme o modo do algoritmo AES a ser usado.
@param [civ], character, IV \(Vetor de Inicialização\) da encriptação, conforme o modo do algoritmo AES a ser usado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aesencrypt
/*/
binary function aesencrypt(ncipherid, cplaintext, cpassword, ckey, civ)
return


/*/{Protheus.doc} aeval
Executa um bloco de código para cada elemento de um array.

@type binary function
@sintax AEval(<aArray>, <bBlock>, [nStart], [nCount]) => array
@return array, Retorna uma cópia do array indicado por **aArray** após a operação.

@param <aarray>, array, Indica o array que será lido.
@param <bblock>, codeblock, Indica o bloco de código que será executado para cada elemento encontrado.
@param [nstart], numeric, Indica o elemento inicial.
@param [ncount], numeric, Indica a quantidade de elementos que serão processados a partir do parâmetro **nStart**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aeval
/*/
binary function aeval(aarray, bblock, nstart, ncount)
return


/*/{Protheus.doc} afields
Preenche arrays com a estrutura da tabela atualmente em uso.

@type binary function
@sintax afields([@aFields], [@aTypes], [@aWidths], [@aDecimals]) => numeric
@return numeric, Retorna a quantidade de colunas.

@param [@afields], array, Nome dos campos
@param [@atypes], array, Tipo dos campos
@param [@awidths], array, Tamanho dos campos
@param [@adecimals], array, Casas decimais dos campos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/afields
/*/
binary function afields(afields, atypes, awidths, adecimals)
return


/*/{Protheus.doc} afill
Preenche um array com um único valor de qualquer tipo de dados \(inclusive array´s, blocos de código ou nulo\) na faixa especificada.

@type binary function
@sintax AFill(<aDest>, <xValue>, [nStart], [nCount]) => array
@return array, Retorna uma cópia do array indicado por **aDest** após a operação.

@param <adest>, array, Indica o array que será preenchido.
@param <xvalue>, variant, Indica o valor que será alocado em cada elemento do array. O conteúdo desse parâmetro, pode ser uma expressão de qualquer tipo de dado válido.
@param [nstart], numeric, Indica a posição do primeiro elemento que será preenchido. Caso não seja informado, o padrão é 1.
@param [ncount], numeric, Indica a quantidade de elementos que serão preenchidos. Caso não seja especificado, os elementos são preenchidos até o final do array.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/afill
/*/
binary function afill(adest, xvalue, nstart, ncount)
return


/*/{Protheus.doc} ains
Inclui um elemento nulo na posição informada e "empurra" os demais para frente descartando o último elemento.

@type binary function
@sintax AIns(<aDest>, <nPos>) => array
@return array, Retorna uma cópia do array indicado por **aDest** após a operação.

@param <adest>, array, Indica o array que será manipulado.
@param <npos>, numeric, Indica a posição, a partir da primeira, na qual será inserido um elemento nulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ains
/*/
binary function ains(adest, npos)
return


/*/{Protheus.doc} alias
Retorna o alias de uma área de trabalho especificada.

@type binary function
@sintax Alias([nWorkArea]) => character
@return character, Retorna o alias da área de trabalho, no formato string, em letras maiúsculas. Caso o parâmetro \(nWorkArea\) não seja informado, o retorna será o alias da área de trabalho corrente ou, se não houver nenhum arquivo em uso, uma string vazia \(""\).

@param [nworkarea], numeric, Indica o número \(entre 0 e 511\) da área de trabalho que será verificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/alias
/*/
binary function alias(nworkarea)
return


/*/{Protheus.doc} alltrim
Remove os espaços em branco à direita e à esquerda de uma string.

@type binary function
@sintax AllTrim(<cText>) => character
@return character, Retorna uma string com espaços em branco à direita e à esquerda removidos.

@param <ctext>, variant, Indica o texto cujos espaços em branco serão removidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/alltrim
/*/
binary function alltrim(ctext)
return


/*/{Protheus.doc} allwaysfalse
Função de compatibilidade que sempre retornará um valor falso \(.F.\).

@type binary function
@sintax AllwaysFalse() => logical
@return logical, Retorna um valor lógico falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/allwaysfalse
/*/
binary function allwaysfalse()
return


/*/{Protheus.doc} allwaystrue
Função de compatibilidade que sempre retornará um valor verdadeiro \(.T.\).

@type binary function
@sintax AllwaysTrue() => logical
@return logical, Retorna um valor lógico verdadeiro \(.T.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/allwaystrue
/*/
binary function allwaystrue()
return


/*/{Protheus.doc} ansitooem
Converte uma string do formato ANSI Text \(formato Microsoft Windows\) para OEM/MS-DOS

@type binary function
@sintax ANSIToOEM(<cStringAnsi>) => character
@return character, Retorna a string convertida \(formato OEM/MS-DOS\) para ser exibida no MS-DOS

@param <cstringansi>, character, Indica a string \(formato ANSI Text\) que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ansitooem
/*/
binary function ansitooem(cstringansi)
return


/*/{Protheus.doc} arc4
Cria uma sequência de caracteres criptografada, utilizando o algoritmo de criptografia de fluxo ARC4, a partir de uma sequência de caracteres que compõe o dado a ser criptografado e uma sequência de caracteres adicional usada como base para a criptografia, chamada de chave.   
Essa função é obsoleta, e deve ser substituída pela função [RC4Crypt](RC4Crypt).

@type binary function
@sintax Arc4(<cBase>, <cChave>) => character
@return character, Retorna uma string criptografada contendo os caracteres ASCII em hexadecimal separados por hífen \(-\).

@param <cbase>, character, Indica a sequência de caracteres que serão criptografadas.
@param <cchave>, character, Indica a sequência de caracteres a serem utilizados como chave para o algoritmo de criptografia.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/arc4
/*/
binary function arc4(cbase, cchave)
return


/*/{Protheus.doc} asc
Converte um caractere para seu valor ASCII mais à esquerda em uma string.

@type binary function
@sintax Asc(<cString>) => numeric
@return numeric, Retorna um valor numérico inteiro, na faixa de 0 à 255, que representa o valor ASCII do parâmetro <**cString**>.

@param <cstring>, character, Indica a string que será convertida para um número.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/asc
/*/
binary function asc(cstring)
return


/*/{Protheus.doc} ascan
Percorre um array procurando por um valor especificado. Pode ser especificado um valor a ser buscado, ou pode ser informada uma condição de busca através de um bloco de código.

@type binary function
@sintax AScan(<aDest>, <xExpr>, [nStart], [nCount]) => numeric
@return numeric, Caso o valor procurado seja encontrado, será retornado o número do elemento do array correspondente. Caso contrário, é retornado o valor 0 \(zero\).

@param <adest>, array, Array onde será feita a busca.
@param <xexpr>, variant, Indica a expressão de busca. Para um array de dimensão simples, pode ser colocado diretamente um valor a ser procurado. Para uma busca mais complexa ou para uma busca em array muti-dimensional, deve ser especificado um bloco de código.
@param [nstart], numeric, Indica a partir de qual elemento será realizada a busca. Por padrão a pesquisa inicia no elemento 1.
@param [ncount], numeric, Indica por quantos elementos serão considerados na operação de busca. Caso não especificado, todos os elementos do array a partir da posição inicial de busca serão considerados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ascan
/*/
binary function ascan(adest, xexpr, nstart, ncount)
return


/*/{Protheus.doc} ascanx
Realiza a leitura do array à procura de um valor específico. Funciona da mesma forma que a função **AScan**, porém quando utilizado um bloco de código para realizar a busca, o mesmo é chamado com um segundo parâmetro, informando qual é o elemento do array em questão que está sendo verificado na chamada corrente do bloco de código.

@type binary function
@sintax AScanX(<aDest>, <bSearch>, [nStart], [nCount]) => numeric
@return numeric, Retorna um valor numérico que representa a posição que ocupa no array pelo último elemento lido. Quando não encontrado é retornado 0.

@param <adest>, array, Indica o array onde será feita a busca.
@param <bsearch>, codeblock, Indica o valor que será pesquisado através de um bloco de código.
@param [nstart], numeric, Indica a partir de qual elemento será realizada busca. Por padrão a pesquisa inicia no elemento 1.
@param [ncount], numeric, Indica por quantos elementos serão considerados na operação de busca. Caso não especificado, todos os elementos do array a partir da posição inicial de busca serão considerados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ascanx
/*/
binary function ascanx(adest, bsearch, nstart, ncount)
return


/*/{Protheus.doc} asin
Retorna o valor em radianos do arco seno de um ângulo a partir do valor que representa o seno desse ângulo.

@type binary function
@sintax ASin(<nSin>) => numeric
@return numeric, Retorna um valor entre -PI/2 e PI/2.

@param <nsin>, numeric, Indica o valor que representa o seno de um ângulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/asin
/*/
binary function asin(nsin)
return


/*/{Protheus.doc} asize
Aumenta ou diminui um array a um tamanho especificado

@type binary function
@sintax ASize(<aDestino>, <nTamanho>) => Nil
@return Nil, Retorna Nulo \(nil\)

@param <adestino>, array, Indica o array que terá o tamanho manipulado.
@param <ntamanho>, numeric, Indica o novo tamanho do array.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/asize
/*/
binary function asize(adestino, ntamanho)
return


/*/{Protheus.doc} asort
Ordena uma parte ou o array inteiro.

@type binary function
@sintax ASort(<aVetor>, [nInicio], [nCont]) => array
@return array, Retorna uma referência ao array de origem aVetor.

@param <avetor>, array, Indica o array cujos elementos serão ordenados.
@param [ninicio], numeric, Indica a partir de qual elemento a ordenação será iniciada. Caso não seja especificado, a posição inicial será um \(1\).
@param [ncont], numeric, Indica a quantidade de elementos que serão ordenados. Caso não seja especificado, todos elementos a partir do nInicio serão ordenados. advpl_param bOrdem BO Indica o bloco de código utilizado para determinar a ordem que será seguida. Caso não seja especificado, a ordem padrão será ascendente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/asort
/*/
binary function asort(avetor, ninicio, ncont)
return


/*/{Protheus.doc} at
Retorna a posição da primeira ocorrência de uma substring em uma string. Para isso, a função pesquisa a string destino a partir da esquerda.

@type binary function
@sintax At(<cPesquisa>, <cDestino>, [nStart]) => numeric
@return numeric, Retorna a posição da string localizada, dentro da procurada, na forma de um valor numérico inteiro. Caso a string não seja localizada, o retorno será 0 \(zero\).

@param <cpesquisa>, character, Indica a string que será localizada.
@param <cdestino>, character, Indica a string que será procurada.
@param [nstart], numeric, Indica a partir de qual caractere iniciará a busca procurada, na forma de um valor numérico inteiro. O nStart deverá ser maior que zero, caso contrário o retorno será 0 \(zero\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/at
/*/
binary function at(cpesquisa, cdestino, nstart)
return


/*/{Protheus.doc} atail
Retorna o último elemento do array

@type binary function
@sintax ATail(<aArray>) => variant
@return variant, O último elemento do array.

@param <aarray>, array, Indica o array o qual o último elemento será retornado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/atail
/*/
binary function atail(aarray)
return


/*/{Protheus.doc} atan
Calcula o valor em radianos do arco tangente de um valor que representa a tangente de um ângulo.

@type binary function
@sintax ATan(<nTan>) => numeric
@return numeric, Retorna um valor entre 0 e PI radianos.

@param <ntan>, numeric, Indica o valor que representa a tangente de um ângulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/atan
/*/
binary function atan(ntan)
return


/*/{Protheus.doc} atn2
Calcula o valor do ângulo, em radianos, de um valor que representa o seno e de um valor que representa o cosseno.

@type binary function
@sintax Atn2(<nSin>, <nCos>) => numeric
@return numeric, Retorna um valor entre 0 e PI radianos.

@param <nsin>, numeric, Indica o valor que representa o seno de um ângulo.
@param <ncos>, numeric, Indica o valor que representa o cosseno de um ângulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/atn2
/*/
binary function atn2(nsin, ncos)
return


/*/{Protheus.doc} atohm
Converte uma matriz de dados em um tHashMap, podendo combinar as colunas para a chave de busca.

@type binary function
@sintax AToHM(<aMatriz>, [nColuna_1], [nTrim_1], [nColuna_N], [nTrim_N]) => object
@return object, Objeto da classe HashMap \(tHashMap\)

@param <amatriz>, array, Matriz com os elementos a serem convertidos
@param [ncoluna_1], numeric, Indica o número da coluna que contem o valor da chave \(pesquisa\)
@param [ntrim_1], numeric, Tipo de Trim para as colunas do tipo caractere.
@param [ncoluna_n], numeric, Informar mais de uma coluna se necessário
@param [ntrim_n], numeric, Tipo de Trim para as colunas do tipo caractere.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/atohm
/*/
binary function atohm(amatriz, ncoluna_1, ntrim_1, ncoluna_n, ntrim_n)
return


/*/{Protheus.doc} attismemberof
Indica se uma propriedade informada através de uma string por parâmetro existe na classe.

@type binary function
@sintax AttIsMemberOf(<oObj>, <cAttName>, [lRecursive]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a propriedade for encontrada; caso contrário, falso \(.F.\).

@param <oobj>, object, Indica o objeto que representa a instância da classe a ser pesquisada.
@param <cattname>, character, Indica o nome da propriedade a ser pesquisada.
@param [lrecursive], logical, \*Indica se as classes superiores também devem ser pesquisada, caso a instância atual possua herança. \( Default = .F. \)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/attismemberof
/*/
binary function attismemberof(oobj, cattname, lrecursive)
return


/*/{Protheus.doc} b_and
Realiza a operação binária **E** entre 2 números.

@type binary function
@sintax B_AND(<nNum1>, <nNum2>) => numeric
@return numeric, Retorna o valor do E binário entre **nNum1** e **nNum2**.

@param <nnum1>, numeric, 1º número a ser utlizado na operação de E binário.
@param <nnum2>, numeric, 2º número a ser utlizado na operação de E binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/b_and
/*/
binary function b_and(nnum1, nnum2)
return


/*/{Protheus.doc} b_or
Realiza a operação binária **OU** entre 2 números.

@type binary function
@sintax B_OR(<nNum1>, <nNum2>) => numeric
@return numeric, Retorna o valor do OU binário entre **nNum1** e **nNum2**.

@param <nnum1>, numeric, 1º número a ser utlizado na operação de OU binário.
@param <nnum2>, numeric, 2º número a ser utlizado na operação de OU binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/b_or
/*/
binary function b_or(nnum1, nnum2)
return


/*/{Protheus.doc} b_xor
Realiza a operação binária **OU EXCLUSIVO** entre 2 números.

@type binary function
@sintax B_XOR(<nNum1>, <nNum2>) => numeric
@return numeric, Retorna o valor do OU EXCLUSIVO binário entre **nNum1** e **nNum2**.

@param <nnum1>, numeric, 1º número a ser utlizado na operação de OU EXCLUSIVO binário.
@param <nnum2>, numeric, 2º número a ser utlizado na operação de OU EXCLUSIVO binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/b_xor
/*/
binary function b_xor(nnum1, nnum2)
return


/*/{Protheus.doc} beep
Emite um sinal sonoro

@type binary function
@sintax Beep() => logical
@return logical, Retorna True caso seja efetivamente mandado o comando para o lado cliente.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/beep
/*/
binary function beep()
return


/*/{Protheus.doc} bin2d
Converte um caractere de 64 bits sinalizado para um numérico de ponto flutuante.

@type binary function
@sintax Bin2D(<cString>) => numeric
@return numeric, Retorna um valor numérico de ponto flutuante que representa o caractere informado.

@param <cstring>, character, Indica um caractere de oito bytes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2d
/*/
binary function bin2d(cstring)
return


/*/{Protheus.doc} bin2f
Converte um caractere de 32 bits sinalizado para um numérico de ponto flutuante.

@type binary function
@sintax Bin2F(<cString>) => numeric
@return numeric, Retorna um valor numérico de ponto flutuante que representa o caractere informado.

@param <cstring>, character, Indica um caractere de quatro bytes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2f
/*/
binary function bin2f(cstring)
return


/*/{Protheus.doc} bin2i
Converte um caractere de 16 bits sinalizado para um numérico.

@type binary function
@sintax Bin2I(<cString>) => numeric
@return numeric, Retorna um valor numérico inteiro que representa o caractere informado.

@param <cstring>, character, Indica o caractere de dois bytes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2i
/*/
binary function bin2i(cstring)
return


/*/{Protheus.doc} bin2l
Converte um caractere de 32 bits sinalizado para um numérico.

@type binary function
@sintax Bin2L(<cString>) => numeric
@return numeric, Retorna um valor numérico inteiro que representa o caractere informado.

@param <cstring>, character, Indica um caractere de quatro bytes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2l
/*/
binary function bin2l(cstring)
return


/*/{Protheus.doc} bin2str
Converte uma string com caracteres para uma string com o valor binário de cada caractere.

@type binary function
@sintax Bin2Str(<cString>) => character
@return character, Retorna uma string formatada de acordo com a string informada.

@param <cstring>, character, Indica a string que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2str
/*/
binary function bin2str(cstring)
return


/*/{Protheus.doc} bin2w
Converte um caractere de 16 bits não sinalizado para um numérico.

@type binary function
@sintax Bin2W(<cString>) => numeric
@return numeric, Retorna um valor numérico inteiro que representa o caractere informado.

@param <cstring>, character, Indica o caractere de dois bytes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bin2w
/*/
binary function bin2w(cstring)
return


/*/{Protheus.doc} biton
Verifica se os primeiros bits de uma string são zero.

@type binary function
@sintax BitOn(<cStr>, <nStart>, <nQuant>, <nLength>) => NIL
@param <cstr>, character, Indica a string que será verificada.
@param <nstart>, numeric, Indica o índice do bit inicial.
@param <nquant>, numeric, Indica a quantidade de bits que devem estar em 0.
@param <nlength>, numeric, Indica a quantidade de bites que serão testados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/biton
/*/
binary function biton(cstr, nstart, nquant, nlength)
return


/*/{Protheus.doc} bmptojpg
Converte uma imagem do tipo BMP \(Bitmap\) para JPG \(Joint Photographic Group\).

@type binary function
@sintax BmpToJpg(<cFileOld>, <cFileNew>, [bChangeCase]) => codeblock
@return codeblock, 0, se o arquivo for salvo com sucesso, caso contrário retorna -1

@param <cfileold>, character, Indica o caminho, respeitando o diretório do Application Server, e o nome do arquivo, com extensão BMP \(Bitmap\), de origem.
@param <cfilenew>, character, Indica o caminho, respeitando o diretório do Application Server, e o nome do arquivo, com extensão JPG \(Joint Photographic Group\), de destino.
@param [bchangecase], logical, Caso .T. o caminho e nome dos arquivos informados \(cFileOld, e cFileNew\) serão convertidos para letras minúsculas. Valor padrão o valor é .F.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bmptojpg
/*/
binary function bmptojpg(cfileold, cfilenew, bchangecase)
return


/*/{Protheus.doc} bof
Informa se está no inicio do Arquivo/Tabela

@type binary function
@sintax Bof() => logical
@return logical, Retorna .T. \(Verdadeiro\) se estiver no início do arquivo/tabela; Caso contrário, .F. \(Falso\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/bof
/*/
binary function bof()
return


/*/{Protheus.doc} cdow
Retorna o dia da semana de uma determinada data.

@type binary function
@sintax CDow(<dExp>) => character
@return character, Retorna o nome do dia da semana no formato de uma string, no idioma Inglês. A primeira letra será maiúscula e as demais minúsculas. Para uma data em branco ou inválida, o retorno será uma string vazia \(""\).

@param <dexp>, date, Indica o valor data que será considerado para obter o dia da semana.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cdow
/*/
binary function cdow(dexp)
return


/*/{Protheus.doc} ceiling
Calcula o arrendodamento \(para cima\) do valor do ponto flutuante.

@type binary function
@sintax Ceiling(<nValor>) => numeric
@return numeric, Retorna o menor inteiro que é maior ou igual ao valor do ponto flutuante.

@param <nvalor>, numeric, Indica o valor que será arredondado \(para cima\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ceiling
/*/
binary function ceiling(nvalor)
return


/*/{Protheus.doc} chdclsarr
descrição da funcao

@type binary function
@sintax ChdClsArr([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/chdclsarr
/*/
binary function chdclsarr(tnomevar)
return


/*/{Protheus.doc} chkrpochg
Verifica se houve alteração da configuração de SourcePath \(RPO Ativo\) após o início do processo atual.

@type binary function
@sintax ChkRpoChg() => logical
@return logical, Retorna verdadeiro \(.T.\), se o programa atual for carregado a partir do SourcePath do arquivo de configuração \(totvsappserver.ini\) do TOTVS Application Server; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/chkrpochg
/*/
binary function chkrpochg()
return


/*/{Protheus.doc} chmod
Altera as permissões de um arquivo.

@type binary function
@sintax CHMOD(<cFileName>, <nFileMode>, [uParam3], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a alteração da restrição for realizada com sucesso; caso contrário, falso \(.F.\).

@param <cfilename>, character, Indica o nome do arquivo no qual se deseja alterar suas propriedades \(atributos\) do sistema.
@param <nfilemode>, numeric, Indica a permissão que será atribuída ao proprietário, grupo ou representante do arquivo indicado no parâmetro <cFileName>.
@param [uparam3], numeric, Compatibility parameter. Pass NIL.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/chmod
/*/
binary function chmod(cfilename, nfilemode, uparam3, lchangecase)
return


/*/{Protheus.doc} chr
Converte um código ASCII para caractere.

@type binary function
@sintax Chr(<nCodigo>) => character
@return character, Retorna um único valor caractere cujo código ASCII está especificado no parâmetro nCodigo.

@param <ncodigo>, numeric, Indica um código ASCII na faixa de 0 à 255.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/chr
/*/
binary function chr(ncodigo)
return


/*/{Protheus.doc} classdataarr
Retorna um array multidimensional com todas as informações das propriedades da instância da classe contida no objeto informado como parâmetro

@type binary function
@sintax ClassDataArr(<oObj>, [lParent]) => array
@return array, Retorna um array multidimensional com todas as informações das propriedades da instância da classe contida no objeto informado como parâmetro.

@param <oobj>, object, Indica um objeto para obter os dados / propriedades.
@param [lparent], logical, Se verdadeiro \(.T.\) retorna todos os parametros, inclusive os parâmetros herdados de outras classes, adiciona o nome da classe na 4ª coluna do array
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/classdataarr
/*/
binary function classdataarr(oobj, lparent)
return


/*/{Protheus.doc} classmetharr
Retorna um array multidimensional com todas as informações dos métodos da instância da classe contida no objeto informado como parâmetro

@type binary function
@sintax ClassMethArr(<oObj>, [lParent]) => array
@return array, Retorna um array multidimensional com todas as informações das propriedades da instância da classe contida no objeto informado como parâmetro.

@param <oobj>, object, Indica um objeto para obter os métodos.
@param [lparent], logical, Se verdadeiro \(.T.\) retorna todos os parametros, inclusive os parâmetros herdados de outras classes, adiciona o nome da classe na 3ª coluna do array
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/classmetharr
/*/
binary function classmetharr(oobj, lparent)
return


/*/{Protheus.doc} clearglbvalue
Limpa um conteúdo armazenado em uma variável global.

@type binary function
@sintax ClearGlbValue(<cGlbName>, [nTimeOut]) => numeric
@return numeric, Retorna o número de variáveis globais limpas da memória.

@param <cglbname>, character, Indica o nome da variável global.
@param [ntimeout], numeric, Indica o tempo mínimo \(em segundos\) a partir do último acesso/leitura desta variável, para ela ser eliminada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearglbvalue
/*/
binary function clearglbvalue(cglbname, ntimeout)
return


/*/{Protheus.doc} clearvarsetget
Retira o bloco de código atribuído ao uso da variável, de forma que quando a variável for usada o bloco não será mais executado.

@type binary function
@sintax ClearVarSetGet(<cNameVar>) => NIL
@param <cnamevar>, character, Indica o nome da variável que deve estar declarada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearvarsetget
/*/
binary function clearvarsetget(cnamevar)
return


/*/{Protheus.doc} cmonth
Retorna o mês, como string, a partir de uma data passada como parâmetro.

@type binary function
@sintax CMonth(<dData>) => character
@return character, Retorna o mês \(em inglês\) a partir de uma data passada como parâmetro. A primeira letra será maiúscula e as demais minúsculas. Para uma data em branco ou inválida, o retorno será uma string nula \(""\).

@param <ddata>, date, Indica a data que terá seu mês convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cmonth
/*/
binary function cmonth(ddata)
return


/*/{Protheus.doc} cmpbuildstr
Compara duas strings em formato nnn.nnn.nnn.nnn, considerando os quatro primeiros blocos numéricos

@type binary function
@sintax CmpBuildStr(<cLeft>, <cRight>) => numeric
@return numeric, Retorna 0 se ambas são iguais, 1 se a primeira build é maior que a segunda, e -1 se a primeira build for menor que a segunda.

@param <cleft>, character, Primeira string para comparação
@param <cright>, character, Segunda string para comparação
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cmpbuildstr
/*/
binary function cmpbuildstr(cleft, cright)
return


/*/{Protheus.doc} colortorgb
A partir do valor numérico que representa uma cor, retorna uma lista dos números que representam o RGB.

@type binary function
@sintax ColorToRGB(<nColor>) => array
@return array, Vetor com quatro posições indicando o vermelho, o verde, o azul e a transparência, sendo cada uma delas representadas por um valor numérico na escala de 0 a 255.

@param <ncolor>, numeric, Cor representada por um único valor numérico, por exemplo CLR_HRED definida no arquivo colors.ch.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/colortorgb
/*/
binary function colortorgb(ncolor)
return


/*/{Protheus.doc} compress
Compacta um buffer recebido através de algoritmo proprietário.

@type binary function
@sintax Compress(<@cBufferOut>, <@nLenghtOut>, <cBufferIn>, <nLenghtIn>) => logical
@return logical, Retorna verdadeiro \(.T.\), se o buffer for compactado com sucesso; caso contrário, falso \(.F.\).

@param <@cbufferout>, character, Retorna o buffer compactado, que contém os caracteres binários.
@param <@nlenghtout>, numeric, Retorna o tamanho do buffer compactado.
@param <cbufferin>, character, Indica o buffer que será compactado.
@param <nlenghtin>, numeric, Indica o tamanho do buffer informado que deverá ser considerado para compactação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/compress
/*/
binary function compress(cbufferout, nlenghtout, cbufferin, nlenghtin)
return


/*/{Protheus.doc} computername
Retorna o nome da máquina \(hostname\) onde o SmartClient está sendo executado.

@type binary function
@sintax ComputerName() => character
@return character, Nome da máquina.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/computername
/*/
binary function computername()
return


/*/{Protheus.doc} conout
Apresenta no console, do Application Server, uma mensagem.

@type binary function
@sintax Conout(<cMensagem>) => NIL
@param <cmensagem>, character, Indica a mensagem que será apresentada no console do Application Server.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/conout
/*/
binary function conout(cmensagem)
return


/*/{Protheus.doc} conttype
Retorna um array com o tipo da variável. Diferente do ValType, retorna o tipo original da variável. No caso de ADPL puro irá sempre retornar o ValType \(Variant\), porém se for chamada com uma variável que veio do 4GL \(interop\) retorna o tipo que ela foi criada.

@type binary function
@sintax ContType() => array
@return array, Retorna um array com duas posições, a primeira \(Caracter\) sempre é relativo ao Valor que a variável aceita \(valtype\), a segunda é o contentType \(Inteiro\) propriamente dito.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/conttype
/*/
binary function conttype()
return


/*/{Protheus.doc} cos
Calcula o valor do cosseno de um ângulo \(em radianos\).

@type binary function
@sintax Cos(<nAngle>) => numeric
@return numeric, Retorna o valor do cosseno de acordo com o ângulo informado.

@param <nangle>, numeric, Indica o valor do ângulo em radianos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cos
/*/
binary function cos(nangle)
return


/*/{Protheus.doc} countexecutablelines
descrição da funcao

@type binary function
@sintax CountExecutableLines([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/countexecutablelines
/*/
binary function countexecutablelines(tnomevar)
return


/*/{Protheus.doc} cpyf2web
A função copia um arquivo do ambiente do servidor \(a partir do rootpath\) ou do cliente \(WebAgent\), para o SmartClient HTML. Se o arquivo for copiado para a pasta temporária \( user \) no Servidor Web, esta pasta é deletada automaticamente quando a sessão é finalizada. Já se o arquivo for copiado para a pasta de persistência \(Cache\) do servidor Web, a pasta será mantida no servidor Web até que seja excluída manualmente pelo administrador do ambiente.

@type binary function
@sintax CpyF2Web(<cOrigem>, [lIsUserDiskDir], [lCompactCopy], [lChangeCase], [lUnZipFile]) => numeric
@return numeric, Retorna o caminho do servidor web onde o arquivo foi salvo com sucesso. Caso ocorra alguma falha na cópia, retorna um valor vazio.

@param <corigem>, character, Indica o arquivo a ser usado como origem da cópia.
@param [lisuserdiskdir], logical, Indica se o arquivo vai ser salvo na pasta temporária ou na pasta do Environment onde está o Servidor Web. Default = .T. \(verdadeiro\).
@param [lcompactcopy], logical, Indica se o arquivo deve ser internamente compactado antes de fazer a cópia. Default = .T. \(verdadeiro\).
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Default = .T. \(verdadeiro\). Veja maiores informações em Observações.
@param [lunzipfile], logical, Se verdadeiro \(.T.\), o arquivo será descompactado. caso contrário, falso \(.F.\), não faz nada. Default = .F. \(false\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cpyf2web
/*/
binary function cpyf2web(corigem, lisuserdiskdir, lcompactcopy, lchangecase, lunzipfile)
return


/*/{Protheus.doc} cpys2t
Copia um arquivo do ambiente do servidor, a partir do rootpath, para um diretório na máquina onde está sendo executado o SmartClient.

@type binary function
@sintax CpyS2T(<cFile>, <cFolder>, [lCompress], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o arquivo for copiado com sucesso; Retorna falso \(.F.\), em caso de falha na cópia.

@param <cfile>, character, Indica o arquivo no servidor que será copiado \(a partir do rootpath\).
@param <cfolder>, character, Indica a pasta de destino na máquina onde está o SmartClient.
@param [lcompress], logical, Indica se o arquivo deve ser internamente compactado antes de fazer a cópia. Default = .T. \(verdadeiro\)
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cpys2t
/*/
binary function cpys2t(cfile, cfolder, lcompress, lchangecase)
return


/*/{Protheus.doc} cpys2tex
Copia um arquivo de um path absoluto da máquina onde o Application Server está sendo executado, para um path absoluto na máquina onde o Smartclient está sendo executado, atualizando também o datetime do arquivo copiado, para ser igual ao arquivo de origem.

@type binary function
@sintax CpyS2TEx(<cServer>, <cClient>, [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\) se o arquivo for copiado com sucesso; retorna falso \(.F.\) em caso de falha na cópia.

@param <cserver>, character, Indica o caminho completo do arquivo na máquina do servidor que será copiado.
@param <cclient>, character, Indica o caminho completo do arquivo de destino na máquina onde está o SmartClient.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cpys2tex
/*/
binary function cpys2tex(cserver, cclient, lchangecase)
return


/*/{Protheus.doc} cpyt2s
Copia um arquivo da máquina onde está sendo executado o SmartClient, para um diretório no ambiente do servidor, a partir do rootpath.

@type binary function
@sintax CpyT2S(<cFile>, <cFolder>, [lCompress], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o arquivo for copiado com sucesso; Retorna falso \(.F.\), em caso de falha na cópia.

@param <cfile>, character, Indica o arquivo na máquina onde está o SmartClient que será copiado.
@param <cfolder>, character, Indica a pasta de destino no servidor \(a partir do rootpath\).
@param [lcompress], logical, Indica se o arquivo deve ser internamente compactado antes de fazer a cópia. Default = .T. \(verdadeiro\)
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cpyt2s
/*/
binary function cpyt2s(cfile, cfolder, lcompress, lchangecase)
return


/*/{Protheus.doc} crccalc
Calcula o CRC de um texto informado.

@type binary function
@sintax CRCCalc(<nAlgoritmo>, <cInput>, [@cRetHex]) => numeric
@return numeric, Retorna valor decimial do CRC calculado.

@param <nalgoritmo>, numeric, Algoritmo CRC que sera utilizado para o cálculo. Os algoritmos disponíveis ver Observações.
@param <cinput>, character, Texto que será utilizado para cálculo do CRC.
@param [@crethex], character, Variável que receberá o valor CRC no formato hexadecimal.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/crccalc
/*/
binary function crccalc(nalgoritmo, cinput, crethex)
return


/*/{Protheus.doc} ctod
Converte uma string formatada para o tipo data.

@type binary function
@sintax CToD(<cData>) => date
@return date, Retorna a data convertida.

@param <cdata>, character, Indica a string que contém uma data a ser convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctod
/*/
binary function ctod(cdata)
return


/*/{Protheus.doc} curdir
Exibe o diretório atual servidor.

@type binary function
@sintax curdir() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/curdir
/*/
binary function curdir()
return


/*/{Protheus.doc} cvaltochar
Converte uma informação do tipo caractere, data, lógico ou numérico para string, sem adição de espaços na informação.

@type binary function
@sintax cValToChar(<xParametro>) => character
@return character, Retorna uma string de acordo com o valor e tipo do parâmetro informado.

@param <xparametro>, variant, Indica um valor do tipo caractere, data, lógico ou numérico para converter em string.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cvaltochar
/*/
binary function cvaltochar(xparametro)
return


/*/{Protheus.doc} d2bin
Converte o número informado como parâmetro em uma string de 8 caracteres, correspondente à representação binária do número em ponto flutuante.

@type binary function
@sintax D2Bin(<nDouble>) => numeric
@return numeric, Retorna uma string de oito bytes que contém a representação binária do número em ponto flutuante.

@param <ndouble>, numeric, Indica o valor numérico em ponto flutuante que será convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/d2bin
/*/
binary function d2bin(ndouble)
return


/*/{Protheus.doc} date
Retorna a data do sistema como sendo um valor do tipo data.  
Essa função dispõe um meio de inicializar variáveis de memória com a data corrente, comparando outros valores do tipo data e realizando operações aritméticas relativas à data corrente.

@type binary function
@sintax Date() => date
@return date, Retorna a data do sistema como sendo um valor do tipo data.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/date
/*/
binary function date()
return


/*/{Protheus.doc} datetimeutc
Retorna uma string com informações de data e hora no formato UTC.

@type binary function
@sintax DateTimeUtc([aDate]) => character
@return character, Retorna uma string no formato UTC.

@param [adate], array, Quando informado por referência, o array será preenchido com data UTC onde a posição 1 será data e a posição 2 a hora.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/datetimeutc
/*/
binary function datetimeutc(adate)
return


/*/{Protheus.doc} day
Retorna o dia do mês de uma determinada data.

@type binary function
@sintax Day(<dData>) => numeric
@return numeric, Retorna um valor numérico inteiro \(dia do mês\) na faixa de zero a 31.

@param <ddata>, date, Indica a data que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/day
/*/
binary function day(ddata)
return


/*/{Protheus.doc} dbappend
Adiciona um novo registro vazio na tabela corrente.

@type binary function
@sintax DBAppend([lUnlock]) => Nil
@return Nil, Retorno sempre é nulo.

@param [lunlock], logical, Indica se, verdadeiro \(.T.\), libera todos os registros bloqueados anteriormente \(locks\); caso contrário, falso \(.F.\), todos os bloqueios anteriores são mantidos durante a inserção. O Valor padrão é verdadeiro \(.T.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbappend
/*/
binary function dbappend(lunlock)
return


/*/{Protheus.doc} dbchangealias
Muda o alias de uma área de trabalho aberta.

@type binary function
@sintax DBChangeAlias(<cOldAlias>, <cNewAlias>) => logical
@return logical, Retorna se o alias foi alterado ou não.

@param <coldalias>, character, Indica o alias aberto de uma tabela.
@param <cnewalias>, character, Indica o novo alias da tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbchangealias
/*/
binary function dbchangealias(coldalias, cnewalias)
return


/*/{Protheus.doc} dbclearallfilter
Limpa todas as condições de filtro de todas as tabelas abertas.

@type binary function
@sintax DBClearAllFilter() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbclearallfilter
/*/
binary function dbclearallfilter()
return


/*/{Protheus.doc} dbclearfilter
Limpa todas as condições de filtro.

@type binary function
@sintax DBClearFilter() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbclearfilter
/*/
binary function dbclearfilter()
return


/*/{Protheus.doc} dbclearindex
Fecha todos os índices da área de trabalho corrente.

@type binary function
@sintax DBClearIndex() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbclearindex
/*/
binary function dbclearindex()
return


/*/{Protheus.doc} dbcloseall
Fecha todas as áreas de trabalho em uso.

@type binary function
@sintax DBCloseAll() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbcloseall
/*/
binary function dbcloseall()
return


/*/{Protheus.doc} dbclosearea
Fecha a área de trabalho corrente.

@type binary function
@sintax DBCloseArea() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbclosearea
/*/
binary function dbclosearea()
return


/*/{Protheus.doc} dbcommit
Salva em disco todas as atualizações pendentes na área de trabalho corrente.

@type binary function
@sintax DBCommit() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbcommit
/*/
binary function dbcommit()
return


/*/{Protheus.doc} dbcommitall
Salva em disco todas as atualizações pendentes na área de trabalho corrente.

@type binary function
@sintax DBCommitAll() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbcommitall
/*/
binary function dbcommitall()
return


/*/{Protheus.doc} dbcreateindex
Cria um indice para Tabela/View

@type binary function
@sintax DBCreateIndex(<cName>, <cExprKey>, [bExprKey], [lUnique]) => Nil
@return Nil, Retorno sempre é nulo.

@param <cname>, character, Indica o nome do arquivo de índice que será criado
@param <cexprkey>, character, Expressão das chaves do índice que será criado na forma de string.
@param [bexprkey], codeblock, Expressão das chaves do índice que será criado na forma executável.
@param [lunique], logical, Valor lógico para especificar que o indice será unico.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbcreateindex
/*/
binary function dbcreateindex(cname, cexprkey, bexprkey, lunique)
return


/*/{Protheus.doc} dbdelete
Marca o registro atual para exclusão.

@type binary function
@sintax DBDelete() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbdelete
/*/
binary function dbdelete()
return


/*/{Protheus.doc} dbeval
Avalia um bloco de código para cada registro que atenda um escopo definido, através dos blocos da primeira e segunda condição.

@type binary function
@sintax DBEval(<bBlock>, [bFirstCondition], [bSecondCondition], [nCount], [nRecno], [lRest]) => Nil
@return Nil, Sempre retorna nulo.

@param <bblock>, codeblock, Indica o bloco de código que será executado para cada registro processado.
@param [bfirstcondition], codeblock, Primeiro Code Block com condição para inserir registro.
@param [bsecondcondition], codeblock, Segundo Code Block com condição para inserir registro.
@param [ncount], numeric, Numero maximo de registros a ser processado.
@param [nrecno], numeric, Unico registro a ser processado.
@param [lrest], logical, Indica que os demais registros serão processados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbeval
/*/
binary function dbeval(bblock, bfirstcondition, bsecondcondition, ncount, nrecno, lrest)
return


/*/{Protheus.doc} dbfieldinfo
Obtém informação de um determinado campo da tabela corrente.

@type binary function
@sintax DBFieldInfo(<nType>, <nField>) => variant
@return variant, Retorna a informação do campo.

@param <ntype>, numeric, Indica o tipo de informação que será verificada.
@param <nfield>, numeric, Indica a posição do campo que será verificado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbfieldinfo
/*/
binary function dbfieldinfo(ntype, nfield)
return


/*/{Protheus.doc} dbfilter
Retorna a expressão do filtro ativo na área de trabalho corrente.

@type binary function
@sintax DBFilter() => character
@return character, Retorna a expressão do filtro ativo na área de trabalho corrente. Caso não exista um filtro ativo, o retorno será uma string nula \(""\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbfilter
/*/
binary function dbfilter()
return


/*/{Protheus.doc} dbfiltercb
Retorna o codeblock do filtro ativo na área de trabalho corrente.

@type binary function
@sintax DBFilterCB() => codeblock
@return codeblock, Retorna o codeblock ativo na área de trabalho corrente.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbfiltercb
/*/
binary function dbfiltercb()
return


/*/{Protheus.doc} dbgetactfld
Retorna os campos visíveis de um alias.

@type binary function
@sintax dbGetActFld() => character
@return character, Retorna uma string separada por vírgulas \(","\) com todos os campos visíveis de um alias e cuja visibilidade lógica não foi desativada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbgetactfld
/*/
binary function dbgetactfld()
return


/*/{Protheus.doc} dbgobottom
Posiciona a tabela corrente no último registro lógico.

@type binary function
@sintax DBGoBottom() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbgobottom
/*/
binary function dbgobottom()
return


/*/{Protheus.doc} dbgoto
Posiciona a tabela corrente em um determinado registro, conforme a ordem física \(sequência sobre o recno\).

@type binary function
@sintax DBGoTo(<nPos>) => Nil
@return Nil, Retorno sempre é nulo.

@param <npos>, numeric, Indica a posição desejada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbgoto
/*/
binary function dbgoto(npos)
return


/*/{Protheus.doc} dbgotop
Posiciona a tabela corrente no primeiro registro lógico.

@type binary function
@sintax DBGoTop() => Nil
@return Nil, Retorno sempre é nulo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbgotop
/*/
binary function dbgotop()
return


/*/{Protheus.doc} dbinfo
Obtêm informações sobre a tabela corrente.

@type binary function
@sintax DBInfo(<nInfo>) => variant
@return variant, Retorna a informação da tabela, ou seja, a informação requisitada pelo usuário \(O tipo depende da informação requisitada\). Caso não tenha tabela corrente, o retorno será nulo.

@param <ninfo>, numeric, Indica o tipo de informação que será verificada. Para mais informações, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbinfo
/*/
binary function dbinfo(ninfo)
return


/*/{Protheus.doc} dbininsert
Retorna se a tabela está em modo de inserção de registros ou não.

@type binary function
@sintax DBInInsert() => logical
@return logical, Retorna **.T.** se estiver inserindo registros; caso contrário, **.F.**.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbininsert
/*/
binary function dbininsert()
return


/*/{Protheus.doc} dbl2dt
Converte uma Data em double \(decimal de ponto flutuante\) para data no formato "YYYYMMDD hh:mm:ss.fff"

@type binary function
@sintax Dbl2Dt(<nDt>) => character
@return character, Retorna a data no formato "YYYYMMDD hh:mm:ss.fff"

@param <ndt>, numeric, Número decimal de ponto flutuante onde a parte inteira é o numero de dias e a parte decimal é o número de milissegundos a partir das 00:00:00.000
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbl2dt
/*/
binary function dbl2dt(ndt)
return


/*/{Protheus.doc} dbnickindexkey
Retorna o IndexKey, ou seja, a expressão do índice identificado pelo apelido.

@type binary function
@sintax DBNickIndexKey(<cNick>) => character
@return character, Retorna a expressão do índice identificado pelo apelido. Caso não exista índice com o apelido especificado, o retorno será uma string nula \(""\).

@param <cnick>, character, Indica o apelido da ordem do índice.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbnickindexkey
/*/
binary function dbnickindexkey(cnick)
return


/*/{Protheus.doc} dborderinfo
Obtêm informações sobre determinada ordem de índice.

@type binary function
@sintax DBOrderInfo(<nTipoInfo>) => variant
@return variant, Retorna a informação requisitada pelo usuário para a ordem atual do alias corrente em uso. De acordo com o tipo de informação solicitado, o retorno pode ser "C" caractere ou "N" numérico.

@param <ntipoinfo>, numeric, Indica a informação desejada do índice corrente. Para mais informações, consulte a área de Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dborderinfo
/*/
binary function dborderinfo(ntipoinfo)
return


/*/{Protheus.doc} dbrecall
Desmarca o registro atual caso ele tenha sido marcado para exclusão.

@type binary function
@sintax DBRecall() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbrecall
/*/
binary function dbrecall()
return


/*/{Protheus.doc} dbrecordinfo
Obtêm informações sobre o registro atual da tabela corrente.

@type binary function
@sintax DBRecordInfo(<nInfoType>, [@nRecord]) => variant
@return variant, Retorna a informação do registro.

@param <ninfotype>, numeric, Indica o tipo de informação que será verificada.
@param [@nrecord], numeric, Indica o número do registro em que está posicionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbrecordinfo
/*/
binary function dbrecordinfo(ninfotype, nrecord)
return


/*/{Protheus.doc} dbrlock
Bloqueia o registro atual ou o especificado.

@type binary function
@sintax DBRLock([nRec]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o registro for bloqueado com sucesso; caso contrário, falso \(.F.\).

@param [nrec], numeric, Indica o número do registro que será bloqueado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbrlock
/*/
binary function dbrlock(nrec)
return


/*/{Protheus.doc} dbrlocklist
Retorna um array com o índice registros que estão bloqueados na tabela atual.

@type binary function
@sintax DBRLockList() => array
@return array, Retorna uma lista com os números dos registros bloqueados na tabela corrente.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbrlocklist
/*/
binary function dbrlocklist()
return


/*/{Protheus.doc} dbrunlock
Libera determinado registro bloqueado.

@type binary function
@sintax DBRUnlock([nRec]) => NIL
@param [nrec], numeric, Indica o número do registro que será desbloqueado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbrunlock
/*/
binary function dbrunlock(nrec)
return


/*/{Protheus.doc} dbseek
Localiza um registro com determinado valor da expressão de chave de índice.

@type binary function
@sintax DBSeek(<xExp>, [lSoftSeek], [lLast]) => logical
@return logical, Retorna verdadeiro \(.T.\), se encontrar um registro com o valor especificado; caso contrário, falso \(.F.\).

@param <xexp>, variant, Indica o valor da chave que será encontrada do tipo caracter.
@param [lsoftseek], logical, Indica se, verdadeiro \(.T.\), posiciona no primeiro registro com expressão de chave maior que o valor procurado; caso contrário, falso \(.F.\) \(Valor padrão\).
@param [llast], logical, Parâmetro de compatibilidade. Deve ser informado o valor nulo \( NIL \).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbseek
/*/
binary function dbseek(xexp, lsoftseek, llast)
return


/*/{Protheus.doc} dbselectarea
Define a área de trabalho especificada como ativa.

@type binary function
@sintax DBSelectArea(<xArea>) => NIL
@param <xarea>, variant, Indica a área de trabalho que ficará ativa.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbselectarea
/*/
binary function dbselectarea(xarea)
return


/*/{Protheus.doc} dbsetactfld
Altera a visibilidade lógica de um ou mais campos de um alias.

@type binary function
@sintax dbSetActFld() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbsetactfld
/*/
binary function dbsetactfld()
return


/*/{Protheus.doc} dbsetdriver
Retorna a RDD padrão que é utilizada, podendo alterá-la.

@type binary function
@sintax DBSetDriver([cRDD]) => character
@return character, Retorna o nome da RDD padrão.

@param [crdd], character, Indica a nova RDD padrão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbsetdriver
/*/
binary function dbsetdriver(crdd)
return


/*/{Protheus.doc} dbsetfilter
Define um filtro de visualização do alias corrente.

@type binary function
@sintax DBSetFilter(<bCond>, <cCond>) => Nil
@return Nil, Retorno sempre é nulo.

@param <bcond>, codeblock, Bloco de código AdvPL avaliado para determinar a visibilidade dos registros.
@param <ccond>, character, Condição de filtro expressada no bloco de código como string.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbsetfilter
/*/
binary function dbsetfilter(bcond, ccond)
return


/*/{Protheus.doc} dbsetnickname
Define um apelido para uma determinada ordem.

@type binary function
@sintax DBSetNickname(<cIndex>, [cNickname]) => character
@return character, Retorna o apelido corrente. Caso a ordem especificada não seja encontrada, não consiga setar o apelido ou não havia apelido, o retorno será uma string nula \(""\).

@param <cindex>, character, Indica o nome da ordem que receberá o apelido.
@param [cnickname], character, Indica o nome do apelido da ordem que será setada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbsetnickname
/*/
binary function dbsetnickname(cindex, cnickname)
return


/*/{Protheus.doc} dbstruct
Retorna um array contendo a estrutura da tabela aberta sob a Alias atual.

@type binary function
@sintax DBStruct() => array
@return array, Retorna um array com a estrutura dos campos. Cada elemento é um subarray contendo nome, tipo, tamanho e decimais.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbstruct
/*/
binary function dbstruct()
return


/*/{Protheus.doc} dbunlock
Retira todos os bloqueios de registros e de arquivos da tabela atual.

@type binary function
@sintax DBUnlock() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbunlock
/*/
binary function dbunlock()
return


/*/{Protheus.doc} dbunlockall
Retira o bloqueio de todos os registro e arquivos de todas as tabelas abertas em uma área de trabalho.

@type binary function
@sintax DBUnlockAll() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbunlockall
/*/
binary function dbunlockall()
return


/*/{Protheus.doc} dbusearea
Abre uma tabela de dados na área de trabalho atual ou na primeira área de trabalho disponível.

@type binary function
@sintax DBUseArea([lNewArea], [cDriver], <cFile>, <cAlias>, [lShared], [lReadOnly]) => Nil
@return Nil, Retorno sempre é nulo.

@param [lnewarea], logical, Caso verdadeiro, indica que a tabela deve ser aberta em uma nova workarea \(Default=.F.\)
@param [cdriver], character, Informa o Driver \(RDD\) a ser utilizada para a abertura da tabela. Caso não especificado \(NIL\), será usado o driver default de acesso a arquivos locais.
@param <cfile>, character, Nome da arquivo/tabela a ser aberta. Caso o driver utilizado acesse tabelas no sistema de arquivos, deve ser informado um path no servidor de aplicação. Não é possível abrir tabelas de dados no SmartClient.
@param <calias>, character, Nome dado ao ALIAS desta tabela, para ser referenciado no programa Advpl.
@param [lshared], logical, Caso verdadeiro, indica que a tabela deve ser aberta em modo compartilhado, isto é, outros processos também poderão abrir esta tabela.
@param [lreadonly], logical, Caso verdadeiro, indica que este alias será usado apenas para leitura de dados. Caso contrário, estas operações serão permitidas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dbusearea
/*/
binary function dbusearea(lnewarea, cdriver, cfile, calias, lshared, lreadonly)
return


/*/{Protheus.doc} dec_add
Realiza a soma dos decimais especificados, nos parâmetros <**dLeft**> e <**dRight**>, e retorna um novo decimal com o valor do resultado.

@type binary function
@sintax DEC_ADD(<dLeft>, <dRight>) => decimal
@return decimal, Retorna o resultado da soma dos dois valores \(<**dLeft**> + <**dRight**>\).

@param <dleft>, decimal, Indica o valor base.
@param <dright>, decimal, Indica o valor a ser somado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_add
/*/
binary function dec_add(dleft, dright)
return


/*/{Protheus.doc} dec_create
Esta função permite criar um decimal com valor inicial, precisão e escala especificados.

@type binary function
@sintax DEC_CREATE(<xValue>, <iPrecision>, <iScale>) => decimal
@return decimal, Retorna o novo decimal criado.

@param <xvalue>, variant, Indica o valor inicial do decimal. Somente caractere ou numérico.
@param <iprecision>, numeric, Indica a precisão do decimal. O valor deve ser maior que zero e menor que 64.
@param <iscale>, numeric, Indica a escala do decimal. Valor deve ser maior ou igual a zero e menor que o parâmetro <**iPrecision**>.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_create
/*/
binary function dec_create(xvalue, iprecision, iscale)
return


/*/{Protheus.doc} dec_div
Realiza a divisão de decimais de ponto fixo.

@type binary function
@sintax DEC_DIV(<dLeft>, <dRight>) => decimal
@return decimal, Retorna o resultado da divisão dos dois valores \(<**dLeft**> / <**dRight**>\).

@param <dleft>, decimal, Indica o dividendo da operação.
@param <dright>, decimal, Indica o divisor da operação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_div
/*/
binary function dec_div(dleft, dright)
return


/*/{Protheus.doc} dec_mod
Retorna o resto da divisão de decimais de ponto fixo.

@type binary function
@sintax DEC_MOD(<dLeft>, <dRight>) => decimal
@return decimal, Retorna o resto da divisão \(<**dLeft**> % <**dRight**>\).

@param <dleft>, decimal, Indica o dividendo da operação.
@param <dright>, decimal, Indica o divisor da operação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_mod
/*/
binary function dec_mod(dleft, dright)
return


/*/{Protheus.doc} dec_mul
Realiza a multiplicação de decimais de ponto fixo.

@type binary function
@sintax DEC_MUL(<dLeft>, <dRight>) => decimal
@return decimal, Retorna o resultado da multiplicação dos dois valores \(<**dLeft**> \* <**dRight**>\).

@param <dleft>, decimal, Indica o valor base.
@param <dright>, decimal, Indica o valor a ser multiplicado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_mul
/*/
binary function dec_mul(dleft, dright)
return


/*/{Protheus.doc} dec_pow
Retorna a potenciação de decimais de ponto fixo.

@type binary function
@sintax DEC_POW(<dLeft>, <dRight>) => decimal
@return decimal, Retorna a potenciação dos parâmetros \(<**dLeft**> ^ <**dRight**>\).

@param <dleft>, decimal, Indica a base da operação.
@param <dright>, decimal, Indica o expoente da operação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_pow
/*/
binary function dec_pow(dleft, dright)
return


/*/{Protheus.doc} dec_rescale
Realiza rescale de um decimal de ponto fixo

@type binary function
@sintax DEC_RESCALE(<dNum>, <nScale>, [nRound]) => decimal
@return decimal, Retorna o número reescalonado.

@param <dnum>, decimal, Indica o número que deve ser reescalonado.
@param <nscale>, numeric, Indica a nova escala do número.
@param [nround], numeric, Indica o tipo de rescale.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_rescale
/*/
binary function dec_rescale(dnum, nscale, nround)
return


/*/{Protheus.doc} dec_resize
Permite alterar a precisão e a escala de um decimal de ponto fixo.

@type binary function
@sintax DEC_RESIZE(<dNum>, <nPrecision>, <nScale>, [nRound]) => decimal
@return decimal, Retorna o decimal modificado de acordo com os parâmetros informados.

@param <dnum>, decimal, Indica o número que será alterado.
@param <nprecision>, numeric, Indica a quantidade de dígitos do decimal.
@param <nscale>, numeric, Indica a quantidade de casas decimais.
@param [nround], numeric, Indica o tipo de arredondamento das casas decimais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_resize
/*/
binary function dec_resize(dnum, nprecision, nscale, nround)
return


/*/{Protheus.doc} dec_round
Arredonda um decimal de ponto fixo sem alterar a quantidade de dígitos total ou a quantidade de casas decimais.

@type binary function
@sintax DEC_ROUND(<dNum>, <nRound>) => decimal
@return decimal, Retorna o decimal arredondado para a quantidade de casas decimais indicado em <**nRound**>.

@param <dnum>, decimal, Indica o número que será arredonado.
@param <nround>, numeric, Indica a quantidade de casas decimais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_round
/*/
binary function dec_round(dnum, nround)
return


/*/{Protheus.doc} dec_sub
Realiza a subtração de decimais de ponto fixo.

@type binary function
@sintax DEC_SUB(<dLeft>, <dRight>) => decimal
@return decimal, Retorna o resultado da subtração dos dois valores \(<**dLeft**> - <**dRight**>\).

@param <dleft>, decimal, Indica o valor base.
@param <dright>, decimal, Indica o valor a ser subtraído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_sub
/*/
binary function dec_sub(dleft, dright)
return


/*/{Protheus.doc} dec_to_dbl
Retorna o resultado da conversão de um tipo decimal de ponto fixo para numérico.

@type binary function
@sintax DEC_TO_DBL(<dVar>) => numeric
@return numeric, Resultado da conversão.

@param <dvar>, decimal, Indica o valor a ser convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dec_to_dbl
/*/
binary function dec_to_dbl(dvar)
return


/*/{Protheus.doc} decode64
Converte uma string contendo um buffer codificado em BASE64 para o seu formato original

@type binary function
@sintax Decode64(<cToConvert>, [cFilePath*], [lChangeCase*]) => character
@return character, Retorna uma string convertida para o formato original

@param <ctoconvert>, character, Indica uma string codificada em BASE64 que será decodificada.
@param [cfilepath*], character, Indica um arquivo para salvar o resultado da conversão
@param [lchangecase*], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/decode64
/*/
binary function decode64(ctoconvert, cfilepath*, lchangecase*)
return


/*/{Protheus.doc} decodeutf16
Converte uma string UTF-16 \(16-bit Unicode Transformation Format\) para a codificação CP1252. SetTitleMatchMode, 2 \* @advpl_param cText CR Indica a string UTF-16 que será convertida para o formato CP1252.

@type binary function
@sintax DecodeUTF16([nEndian]) => character
@return character, Retorna uma nova string no formato CP1252.

@param [nendian], numeric, Indica o endianness do texto de entrada, podendo ser: 0 - Auto-Select \(padrão\), 1 - Big-Endian e 2 - Little-Endian. Caso não seja especificado se é big-endian ou little-endian, a função verifica os primeiros bytes da sequência, procurando o Byte Order Mark  \(BOM\). Caso não seja encontrado o BOM, a string é tratada como utf-16be \( big-endian \)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/decodeutf16
/*/
binary function decodeutf16(nendian)
return


/*/{Protheus.doc} decodeutf8
Converte uma string UTF-8 \(8-bit Unicode Transformation Format\) para a codificação CP1252.

@type binary function
@sintax DecodeUTF8(<cText>) => character
@return character, Retorna uma nova string no formato CP1252.

@param <ctext>, character, Indica a string UTF-8 que será convertida para o formato CP1252.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/decodeutf8
/*/
binary function decodeutf8(ctext)
return


/*/{Protheus.doc} delclassintf
Exclui todas classes de interface da thread.

@type binary function
@sintax DelClassIntf() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delclassintf
/*/
binary function delclassintf()
return


/*/{Protheus.doc} deleted
Verifica se o registro atual está com marcado para exclusão.

@type binary function
@sintax Deleted() => logical
@return logical, Retorna verdadeiro \(**.T.**\), se o registro tem marca de excluído; caso contrário, falso \(**.F.**\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deleted
/*/
binary function deleted()
return


/*/{Protheus.doc} deletekeyini
Exclui a chave de uma determinada seção do arquivo de configuração \(\*.INI\).

@type binary function
@sintax DeleteKeyIni(<cSecao>, <cChave>, <cIniFile>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a chave for excluída com sucesso; caso contrário, falso \(.F.\).

@param <csecao>, character, Indica o nome da seção que a chave será excluída. Exemplo: Environment, Jobs, General, etc.
@param <cchave>, character, Indica o nome da chave, no arquivo de configuração \(\*.INI\), que será criada ou alterada na seção do ambiente em uso.
@param <cinifile>, character, Indica o nome do arquivo de configuração \(\*.INI\) do binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletekeyini
/*/
binary function deletekeyini(csecao, cchave, cinifile)
return


/*/{Protheus.doc} deletesectionini
Exclui uma determinada seção do arquivo de configuração \(\*.INI\).

@type binary function
@sintax DeleteSectionIni(<cSecao>, <cIniFile>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a chave for excluída; caso contrário, falso \(.F.\).

@param <csecao>, character, Indica a seção que será excluída.
@param <cinifile>, character, Indica o nome do arquivo de configuração \(.INI\) do binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletesectionini
/*/
binary function deletesectionini(csecao, cinifile)
return


/*/{Protheus.doc} delksyslog
Remove um identificador previamente adicionado utilizando a função SetKSysLog

@type binary function
@sintax DelKSysLog(<ckey>) => NIL
@param <ckey>, character, chave de identificação
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delksyslog
/*/
binary function delksyslog(ckey)
return


/*/{Protheus.doc} delnamedclassintf
descrição da funcao

@type binary function
@sintax DelNamedClassIntf([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delnamedclassintf
/*/
binary function delnamedclassintf(tnomevar)
return


/*/{Protheus.doc} delobjdata
descrição da funcao

@type binary function
@sintax DelObjData([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delobjdata
/*/
binary function delobjdata(tnomevar)
return


/*/{Protheus.doc} descend
Converte e retorna a forma complementada da expressão string especificada.

@type binary function
@sintax Descend(<cString>) => character
@return character, Retorna a string especificada como parâmetro de uma forma complementada. Um DESCEND\(\) de CHR\(0\) sempre retorna CHR\(0\).

@param <cstring>, character, Indica a seqüência de caracteres que será analisada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/descend
/*/
binary function descend(cstring)
return


/*/{Protheus.doc} directory
Cria um array bidimensional com o conteúdo de um diretório.   
Para isso, retorna informações a respeito dos arquivos no diretório corrente ou especificado. Essa função é semelhante a ADir\(\), porém, retorna um único array ao invés de adicionar valores a uma séria de arrays existentes passados por referência.

@type binary function
@sintax Directory(<cDirEsp>, [cAtributos], [uParam3], [lCaseSensitive], [nTypeOrder]) => array
@return array, Retorna um array de subarrays, sendo que cada subarray contém informações sobre cada arquivo que atenda o parâmetro \(<cDirSpec>\). Para mais detalhes, consulte a tabela B na área Observações.

@param <cdiresp>, character, Indica o diretório que será pesquisado e os arquivos que serão apresentados. Além disso, caracteres do tipo curinga são permitidos na especificação de arquivos. Caso esse parâmetro não seja especificado, o valor padrão é \*.\*.
@param [catributos], character, Indica quais arquivos com atributos especiais devem ser incluídos no array. Esse parâmetro consiste em uma string que contém um ou mais dos caracteres H, S, D e V. Para mais detalhes, consulte a tabela A na área Observações.
@param [uparam3], numeric, Compatibility parameter. Pass NIL.
@param [lcasesensitive], logical, Se verdadeiro \(.T.\), indica o nome do arquivo será transformado para letra maiúscula. Caso falso \(.F.\), o nome do arquivo será retornado conforme escrito no disco rígido.
@param [ntypeorder], numeric, Indica o tipo de ordenação do resultado da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/directory
/*/
binary function directory(cdiresp, catributos, uparam3, lcasesensitive, ntypeorder)
return


/*/{Protheus.doc} dirremove
Remove um diretório específico.

@type binary function
@sintax DirRemove(<cPath>, [uParam2], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o diretório for removido com sucesso; caso contrário, falso \(.F.\).

@param <cpath>, character, Indica o nome do diretório que será removido.
@param [uparam2], numeric, Compatibility parameter. Pass NIL.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dirremove
/*/
binary function dirremove(cpath, uparam2, lchangecase)
return


/*/{Protheus.doc} diskspace
Retorna o número de bytes que estão disponíveis em uma determinada unidade de disco da estação remota.

@type binary function
@sintax DiskSpace([nDrive]) => numeric
@return numeric, Retorna o número de bytes que estão disponíveis na unidade de disco.   
Em caso de erro, retorna -1.

@param [ndrive], numeric, Indica o número da unidade de disco \(drive\). Sendo: 0=Unidade de disco atual da estação \(Padrão\), 1=Drive A: da estação remota, 2=Drive B da estação remota, 3=Drive C: da estação remota, 4=Drive D: da estação remota e etc.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/diskspace
/*/
binary function diskspace(ndrive)
return


/*/{Protheus.doc} dow
Retorna o dia da semana no formato numérico.

@type binary function
@sintax Dow(<dData>) => numeric
@return numeric, Retorna o número \(entre 0 e 7\) do dia da semana. Sendo, Domingo=1 e Sábado=7. No entanto, se o parâmetro dData estiver vazio, a função retornará zero \(0\).

@param <ddata>, date, Indica o valor data que será considerado para obter o dia da semana.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dow
/*/
binary function dow(ddata)
return


/*/{Protheus.doc} dt2dbl
Converte uma Data no formato "YYYYMMDD hh:mm:ss.fff" para um double \(decimal de ponto flutuante\)

@type binary function
@sintax Dt2Dbl(<cExp>) => numeric
@return numeric, Retorna um número Double com a informação de data/hora.

@param <cexp>, character, Data a ser convertida, sempre deve ser informada no formato "YYYYMMDD hh:mm:ss.fff"
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dt2dbl
/*/
binary function dt2dbl(cexp)
return


/*/{Protheus.doc} dtoc
Converte um valor data para uma string com formato mês, dia e ano \(mm/dd/aa\).

@type binary function
@sintax DToC(<dData>) => character
@return character, Retorna a data convertida.

@param <ddata>, date, Indica a data que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dtoc
/*/
binary function dtoc(ddata)
return


/*/{Protheus.doc} dtos
Converte um valor data para uma string com formato ano, mês e dia \(aaaammdd\).

@type binary function
@sintax DToS(<dData>) => character
@return character, Retorna a data convertida para oito caracteres no formato aaaammdd.

@param <ddata>, date, Indica a data que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/dtos
/*/
binary function dtos(ddata)
return


/*/{Protheus.doc} elaptime
Retorna uma string, com o número de segundos decorridos entre dois horários \(hora inicial e final\) diferentes, no formato hh:mm:ss.

@type binary function
@sintax ElapTime(<cHoraInicial>, <cHoraFinal>) => character
@return character, Retorna a diferença do tempo no formato hh:mm:ss.

@param <chorainicial>, character, Indica a hora inicial no formato hh:mm:ss
@param <chorafinal>, character, Indica a hora final no formato hh:mm:ss
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/elaptime
/*/
binary function elaptime(chorainicial, chorafinal)
return


/*/{Protheus.doc} embaralha
Embaralha/Desembaralha uma string.

@type binary function
@sintax Embaralha(<cTexto>, <nTipo>) => character
@return character, Retorna string embaralhada/desembaralhada.

@param <ctexto>, character, Indica o texto que será embaralhado.
@param <ntipo>, numeric, Quando 0 embaralha String. Quando 1 desembaralha string.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/embaralha
/*/
binary function embaralha(ctexto, ntipo)
return


/*/{Protheus.doc} empty
Determina se o resultado de uma expressão é vazio.

@type binary function
@sintax Empty(<xExp>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a expressão resultar em um valor vazio; caso contrário, falso \(.F.\)

@param <xexp>, variant, Indica uma expressão ou variável de qualquer tipo de dado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/empty
/*/
binary function empty(xexp)
return


/*/{Protheus.doc} encode64
Converte uma string ou arquivo\* de texto ou binário para uma nova string codificada segundo o padrão BASE64

@type binary function
@sintax Encode64([cToConvert], [cFilePath*], [lZip*], [lChangeCase*]) => character
@return character, Retorna a string codificada em BASE64.

@param [ctoconvert], character, Indica a string ASCII que será convertida para BASE64
@param [cfilepath*], character, Caminho para arquivo\* que será convertido para BASE64
@param [lzip*], logical, Se verdadeiro\(.T.\), irá compactar o conteúdo do arquivo antes de transformar em BASE64; caso contrário \(.F.\) não compacta o conteúdo do arquivo. Valor padrão \(.F.\)
@param [lchangecase*], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/encode64
/*/
binary function encode64(ctoconvert, cfilepath*, lzip*, lchangecase*)
return


/*/{Protheus.doc} encodeutf16
Converte uma string de origem em CP1252 \( Windows 1252 code-page \) para a codificação UTF-16 \( 16-bit Unicode Transformation Format \).

@type binary function
@sintax EncodeUTF16(<cText>, [nEndian]) => character
@return character, Retorna uma nova string no formato UTF-16.

@param <ctext>, character, Indica a string que será convertida para o formato UTF-16. A string usada como parâmetro deve atender à codificação CP1252.
@param [nendian], numeric, Indica o endianness do texto de saída, podendo ser: 1 - Big-Endian \(padrão\) e 2 - Little-Endian.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/encodeutf16
/*/
binary function encodeutf16(ctext, nendian)
return


/*/{Protheus.doc} encodeutf8
Converte uma string de origem em CP1252 \( Windows 1252 code-page \) para a codificação UTF-8 \( 8-bit Unicode Transformation Format \).

@type binary function
@sintax EncodeUTF8(<cText>) => character
@return character, Retorna a string no formato UTF-8.

@param <ctext>, character, Indica a string que será convertida para o formato UTF-8. A string usada como parâmetro deve atender à codificação CP1252.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/encodeutf8
/*/
binary function encodeutf8(ctext)
return


/*/{Protheus.doc} encryptrsa
Realiza a criptografia de uma string utilizando o algoritmo RSA \(Ron Rivest, Adi Shamir e Len Adleman\).

@type binary function
@sintax EncryptRSA(<cKeyFile>, <cInfo>, [uParam3]) => character
@return character, Retorna a string <**cInfo**> criptografada com o algoritmo RSA, utilizando a chave pública apontada por <**cKeyFile**>.

@param <ckeyfile>, character, Indica o nome do arquivo que contém a chave pública que será usada para criptografar o dado.
@param <cinfo>, character, Indica a string que será criptografada.
@param [uparam3], logical, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/encryptrsa
/*/
binary function encryptrsa(ckeyfile, cinfo, uparam3)
return


/*/{Protheus.doc} eof
Informa se está no fim do Arquivo/Tabela.

@type binary function
@sintax Eof() => logical
@return logical, Retorna .T. \(Verdadeiro\) se estiver no fim do arquivo/tabela; Caso contrário, .F. \(Falso\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/eof
/*/
binary function eof()
return


/*/{Protheus.doc} errorblock
Recupera e/ou define um bloco de código para ser avaliado quando ocorrer um erro em tempo de execução.

@type binary function
@sintax ErrorBlock([bErrorHandler]) => codeblock
@return codeblock, Retorna o bloco de código de tratamento de erro corrente.

@param [berrorhandler], codeblock, Indica o bloco de código que será executado sempre que houver um erro em tempo de execução. Quando o bloco de código é avaliado, esse parâmetro é passado na forma de um objeto erro como argumento pelo sistema.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/errorblock
/*/
binary function errorblock(berrorhandler)
return


/*/{Protheus.doc} eval
Executa um bloco de código

@type binary function
@sintax Eval(<bBloco>, [xVariavel]) => variant
@return variant, Retorna o valor da última expressão do bloco de código.

@param <bbloco>, codeblock, Indica o bloco de código que será avaliado.
@param [xvariavel], variant, Indica o argumento que será avaliado no bloco de código.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/eval
/*/
binary function eval(bbloco, xvariavel)
return


/*/{Protheus.doc} evpdigest
Calcula o hash criptrográfico \(ou digest\) de um conteúdo do tipo "C" Caractere informado como parâmetro.

@type binary function
@sintax EVPDigest(<cContent>, <nType>) => character
@return character, Retorna o hash calculado a partir de **cContent** como uma string binária em AdvPL -- cada caractere representa um byte de retorno, com os valores de 0 a 255.

@param <ccontent>, character, Indica o conteúdo que será avaliado para calcular o hash.
@param <ntype>, numeric, Indica o tipo de algoritmo de hash criptográfico que será utilizado para o cálculo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/evpdigest
/*/
binary function evpdigest(ccontent, ntype)
return


/*/{Protheus.doc} evpprivsign
Assina usando algoritmo digest um determinado conteúdo usando uma chave privada.

@type binary function
@sintax EVPPrivSign([cPathKey], [cContent], [nType], [cSigned], [cPassword], [cErrStr]) => NIL
@param [cpathkey], character, Indica a string que contém o caminho para a chave privada formato .PEM .
@param [ccontent], character, Indica a string que será assinada.
@param [ntype], numeric, Indica o tipo do algortimo digest que será utilizado.
@param [csigned], character, Indica uma string que contém o valor assinado.
@param [cpassword], character, Indica a senha da chave privada apontada por cPathKey.
@param [cerrstr], character, Indica a variável para retornar as mensagens de erro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/evpprivsign
/*/
binary function evpprivsign(cpathkey, ccontent, ntype, csigned, cpassword, cerrstr)
return


/*/{Protheus.doc} evpprivvery
Verifica usando algoritmo digest um determinado conteúdo usando uma chave pública.

@type binary function
@sintax EVPPrivVery([cPathKey], [cContent], [nType], [cSigned], [cPassword], [cErrStr]) => NIL
@param [cpathkey], character, Indica o caminho path da chave pública que deve ser no formato do arquivo .PEM.
@param [ccontent], character, Indica o valor que será verificado, com um conteúdo já assinado.
@param [ntype], numeric, Indica o tipo de algoritmo digest que será utilizado para verificar a assinatura.
@param [csigned], character, Indica uma string que contém o valor assinado.
@param [cpassword], character, Indica a senha da chave pública apontada por cPathKey.
@param [cerrstr], character, Indica a variável para retornar as mensagens de erro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/evpprivvery
/*/
binary function evpprivvery(cpathkey, ccontent, ntype, csigned, cpassword, cerrstr)
return


/*/{Protheus.doc} execindllclose
Encerra a conexão com uma DLL \(*Dynamic-link library *, ou Biblioteca de vinculo dinâmica\).

@type binary function
@sintax ExecInDllClose(<nHandle>) => NIL
@param <nhandle>, numeric, Indica o handle da DLL obtida através da função ExecInDLLOpen\(\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/execindllclose
/*/
binary function execindllclose(nhandle)
return


/*/{Protheus.doc} execindllopen
Abre uma DLL \(*Dynamic-link library *, ou Biblioteca de vinculo dinâmica\) para executar functions ou procedures.

@type binary function
@sintax ExecInDllOpen(<cDLLName>) => numeric
@return numeric, Retorna o handle de abertura da DLL.

@param <cdllname>, character, Indica o nome e caminho da DLL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/execindllopen
/*/
binary function execindllopen(cdllname)
return


/*/{Protheus.doc} execindllrun
Executa funçÃµes ou procedures de uma DLL \(*Dynamic-link library *, ou Biblioteca de vinculo dinâmica\).

@type binary function
@sintax ExecInDllRun(<nHandle>, <nOpc>, <cBuffer>) => NIL
@param <nhandle>, character, Indica o handle da DLL obtida através da função ExecInDLLOpen\(\).
@param <nopc>, numeric, Indica a opção que será executada pela DLL.
@param <cbuffer>, character, Indica o buffer, no formato caracter, que será recebido pela DLL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/execindllrun
/*/
binary function execindllrun(nhandle, nopc, cbuffer)
return


/*/{Protheus.doc} exedllrun2
Executa funções ou procedures de uma DLL \(*Dynamic-link library *, ou Biblioteca de vinculo dinâmica\).

@type binary function
@sintax ExeDLLRun2(<nHandle>, <nOpc>, <cBuffer>) => NIL
@param <nhandle>, character, Indica o handle da DLL obtida através da função ExecInDLLOpen\(\).
@param <nopc>, numeric, Indica a opção que será executada pela DLL.
@param <cbuffer>, character, Indica o buffer, no formato caracter, que será recebido pela DLL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/exedllrun2
/*/
binary function exedllrun2(nhandle, nopc, cbuffer)
return


/*/{Protheus.doc} exedllrun3
Executa funções ou procedures de uma DLL \(*Dynamic-link library *, ou Biblioteca de vinculo dinâmica\).

@type binary function
@sintax ExeDLLRun3(<nHandle>, <nOpc>, <cBuffer>) => NIL
@param <nhandle>, character, Indica o handle da DLL obtida através da função ExecInDLLOpen\(\).
@param <nopc>, numeric, Indica a opção que será executada pela DLL.
@param <cbuffer>, character, Indica o buffer, no formato caracter, que será recebido pela DLL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/exedllrun3
/*/
binary function exedllrun3(nhandle, nopc, cbuffer)
return


/*/{Protheus.doc} existdir
Determina se um diretório existe e é válido.

@type binary function
@sintax ExistDir(<cPath>, [uParam2], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o diretório existir; caso contrário, falso \(.F.\).

@param <cpath>, character, Indica o nome do diretório que será verificado.
@param [uparam2], numeric, Compatibility parameter. Pass NIL.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/existdir
/*/
binary function existdir(cpath, uparam2, lchangecase)
return


/*/{Protheus.doc} exp
Calcula o valor do antilogaritmo de base 'e' \(base do logaritmo natural\) de um valor numérico.

@type binary function
@sintax Exp(<nExpoente>) => numeric
@return numeric, Retorna o valor do antilogaritmo de base 'e' do expoente informado.

@param <nexpoente>, numeric, Indica o expoente que será utilizado no cálculo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/exp
/*/
binary function exp(nexpoente)
return


/*/{Protheus.doc} len
Retorna o tamanho de uma variável.

@type binary function
@sintax Len(<xParam>) => numeric
@return numeric, Retorna o tamanho de **xParam**.

@param <xparam>, variant, Variável que será avaliada
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/len
/*/
binary function len(xparam)
return


/*/{Protheus.doc} lower
Converte o texto para letras minúsculas.

@type binary function
@sintax Lower(<cText>) => character
@return character, Retorna o texto com letras minúsculas.

@param <ctext>, character, Indica o texto que será convertido de letras maiúsculas para minúsculas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/lower
/*/
binary function lower(ctext)
return


/*/{Protheus.doc} ltrim
Remove os espaços em branco à esquerda de uma string.

@type binary function
@sintax LTrim(<cText>) => character
@return character, Retorna uma string com espaços em branco à esquerda removidos.

@param <ctext>, character, Indica o texto cujos espaços em branco serão removidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ltrim
/*/
binary function ltrim(ctext)
return


/*/{Protheus.doc} round
Arredonda um valor decimal para a quantidade especificada de dígitos.

@type binary function
@sintax Round(<nValue>, <nPoint>) => numeric
@return numeric, Retorna um valor numérico arredondado.

@param <nvalue>, numeric, Indica o valor que será arredondado.
@param <npoint>, numeric, Indica o número de casas decimais para arredondamento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/round
/*/
binary function round(nvalue, npoint)
return


/*/{Protheus.doc} rtrim
Remove os espaços em branco à direita de uma string.

@type binary function
@sintax RTrim(<cText>) => character
@return character, Retorna uma string com espaços em branco à direita removidos.

@param <ctext>, character, Indica o texto cujos espaços em branco serão removidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rtrim
/*/
binary function rtrim(ctext)
return


/*/{Protheus.doc} strzero
A partir de um numérico esta função retorna uma string formatada, inserindo zeros à esquerda e/ou o símbolo decimal \("."\) em suas casas, de acordo com as informações do parâmetro.

@type binary function
@sintax StrZero(<nValor>, <nTamanho>, [nDecimal]) => character
@return character, Retorna uma string a partir do valor numérico e do tamanho informado no parâmetro.

@param <nvalor>, numeric, Indica o valor numérico que será convertido para string.
@param <ntamanho>, numeric, Indica o tamanho da string será gerada.
@param [ndecimal], numeric, Indica o número de casas após o símbolo decimal.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/strzero
/*/
binary function strzero(nvalor, ntamanho, ndecimal)
return


/*/{Protheus.doc} substr
Retorna uma parte especifica da string.

@type binary function
@sintax SubStr(<cText>, <nIndex>, [nLen]) => logical
@return logical, Retorna a string após realizar o tratamento.

@param <ctext>, character, Indica a string que será tratada.
@param <nindex>, numeric, Indica o indice inicial da string <**cText**>.
@param [nlen], numeric, Indica o número de caracteres que retornará a partir de <**nIndex**>.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/substr
/*/
binary function substr(ctext, nindex, nlen)
return


/*/{Protheus.doc} upper
Converte o texto para letras maiúsculas.

@type binary function
@sintax Upper(<cText>) => character
@return character, Retorna o texto com letras maiúsculas.

@param <ctext>, character, Indica o texto que será convertido de letras minúsculas para maiúsculas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/upper
/*/
binary function upper(ctext)
return


/*/{Protheus.doc} exuserexception
Exibe a janela de registro de erros encontrados \(Error log\) com a mensagem desejada e abortar a aplicação.

@type binary function
@sintax ExUserException(<cTexto>) => NIL
@param <ctexto>, character, Indica o texto que será apresentado na janela de registros de erros encontrados \(Error log\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/exuserexception
/*/
binary function exuserexception(ctexto)
return


/*/{Protheus.doc} f2bin
Converte o número informado como parâmetro em uma string de 4 caracteres, correspondente à representação binária do número em ponto flutuante.

@type binary function
@sintax F2Bin(<nFloat>) => character
@return character, Retorna uma string de quatro bytes que contém a representação binária do número em ponto flutuante.

@param <nfloat>, numeric, Indica o valor numérico em ponto flutuante que será convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/f2bin
/*/
binary function f2bin(nfloat)
return


/*/{Protheus.doc} fclose
Fecha um arquivo binário aberto

@type binary function
@sintax FClose([nHandle]) => numeric
@return numeric, Retorna falso \(.F.\), se ocorrer ao fechar o arquivo; caso contrário, verdadeiro \(.T.\).

@param [nhandle], numeric, Indica handle do arquivo obtido, previamente, através da função FOpen\(\) ou FCreate\(\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fclose
/*/
binary function fclose(nhandle)
return


/*/{Protheus.doc} fcount
Retorna a quantidade de campos existentes na estrutura da área de trabalho ativa.

@type binary function
@sintax FCount() => numeric
@return numeric, Retorna a quantidade de campos existentes na estrutura da área de trabalho ativa.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fcount
/*/
binary function fcount()
return


/*/{Protheus.doc} fcreate
Cria um arquivo vazio no disco, para operação de escrita em modo exclusivo, com o tamanho de 0 \( zero \) bytes. Se o arquivo especificado já existe no disco, o arquivo é aberto em modo exclusivo, e seu conteúdo é eliminado \(  truncado em 0 bytes \). Caso a operação não seja completa com sucesso, a função retorna o handler -1, caso contrário é retornado o handler de acesso ao arquivo, para operações de escrita.

@type binary function
@sintax FCreate(<cArquivo>, [nAtributo], [xParam3], [lChangeCase]) => numeric
@return numeric, Retorna o handle do arquivo para ser usado nas demais funções de manutenção de arquivo. O handle será maior ou igual a zero. Caso não seja possível criar o arquivo, a função retornará o handle -1. Para obter mais detalhes da casua da ocorrência, utilize a função FError.

@param <carquivo>, character, Indica o nome do arquivo que será criado. Pode-se especificar um path absoluto ou relativo para criar arquivos no ambiente local \(SmartClient\) ou no servidor.
@param [natributo], numeric, Compatibilidade. Deve ser informado o valor nulo \( NIL \) ou 0 \(zero\), o arquivo sempre será criado com atributos default.
@param [xparam3], Nil, Compatibilidade. Deve ser informado o valor nulo \( NIL \)
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fcreate
/*/
binary function fcreate(carquivo, natributo, xparam3, lchangecase)
return


/*/{Protheus.doc} ferase
Exclui um arquivo do disco.

@type binary function
@sintax FErase(<cArquivo>, [xParam], [lChangeCase]) => numeric
@return numeric, Retorna 0 \(zero\), se o arquivo for apagado com sucesso, e -1, caso não seja possível. Se o retorno for -1, é possível utilizar a função FError\(\) para obter mais detalhes da ocorrência.

@param <carquivo>, character, Indica o nome do arquivo que será apagado. Além disso, pode-se especificar um path absoluto ou relativo para apagar arquivos na estação local ou no servidor.
@param [xparam], variant, Compatibilidade. Deve ser informado o valor nulo \( NIL \)
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ferase
/*/
binary function ferase(carquivo, xparam, lchangecase)
return


/*/{Protheus.doc} ferror
A função FError\(\) é utilizada para recuperar um código de erro após uma falha em operação com arquivos \( File I/O \). Quando utilizadas funções de manipulação de arquivo em baixo nível \( FCreate, FOpen, FSeek ... \), e uma operação desta natureza apresentou falha e/ou não foi realizada com sucesso, utilizamos a função FError\(\) para recuperar um código de ocorrência que aponta a condição de falha da última operação.

@type binary function
@sintax FError() => numeric
@return numeric, Retorna um código numérico de erro referente a última operação de arquivo realizada. Caso não haja nenhum erro, a função retorna 0 \(zero\). Na área Observações, consulte os códigos de retorno.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ferror
/*/
binary function ferror()
return


/*/{Protheus.doc} field
Retorna o nome de um campo de uma tabela aberta.

@type binary function
@sintax Field(<nPos>) => character
@return character, Retorna uma string contendo o nome do campo especificado.

@param <npos>, numeric, Indica a posição do campo na estrutura da tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/field
/*/
binary function field(npos)
return


/*/{Protheus.doc} fieldblock
Retorna um bloco de código para um determinado campo da tabela corrente.

@type binary function
@sintax FieldBlock(<cField>) => codeblock
@return codeblock, Retorna o bloco de código para o campo especificado no alias atual.

@param <cfield>, character, Indica o nome do campo que será retornado o bloco de código.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldblock
/*/
binary function fieldblock(cfield)
return


/*/{Protheus.doc} fieldget
Recupera o conteúdo de um campo do registro atualmente posicionado no alias selecionado, a partir da sua posição ordinal na estrutura da tabela.

@type binary function
@sintax FieldGet(<nPos>) => variant
@return variant, Retorna o conteúdo do campo informado no registrual atual do alias aberto.

@param <npos>, numeric, Número da posição ordinal do campo na tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldget
/*/
binary function fieldget(npos)
return


/*/{Protheus.doc} fieldname
Retorna o nome de um campo de uma tabela aberta.

@type binary function
@sintax FieldName(<nPos>) => character
@return character, Retorna uma string contendo o nome do campo especificado.

@param <npos>, numeric, Indica a posição do campo na estrutura da tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldname
/*/
binary function fieldname(npos)
return


/*/{Protheus.doc} fieldpos
Retorna a posição de um determinado campo dentro da área de trabalho corrente.

@type binary function
@sintax FieldPos(<cField>) => numeric
@return numeric, Retorno a posição do campo, caso não exista retorna 0.

@param <cfield>, character, Nome do campo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldpos
/*/
binary function fieldpos(cfield)
return


/*/{Protheus.doc} fieldput
Permite definir o valor de um campo em uma tabela utilizando a posição ordinal do campo na estrutura da tabela.

@type binary function
@sintax FieldPut(<nPos>, <xValue>) => variant
@return variant, Retorna o valor atribuido, caso o número do campo seja inválido retorna NIL.

@param <npos>, numeric, Posição do campo do alias/tabela atuais.
@param <xvalue>, variant, Valor atribuito ao campo especificado, esse valor deve ser do mesmo tipo do campo do alias/tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldput
/*/
binary function fieldput(npos, xvalue)
return


/*/{Protheus.doc} fieldwblock
Retorna um bloco de código para um campo de uma área de trabalho aberta.

@type binary function
@sintax FieldWBlock(<cField>, <nWokArea>) => codeblock
@return codeblock, Retorna o bloco de código para o campo da área de trabalho informada.

@param <cfield>, character, Indica o nome do campo que será retornado o bloco de código.
@param <nwokarea>, numeric, Indica o número da área de trabalho que será retornado o bloco de código.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fieldwblock
/*/
binary function fieldwblock(cfield, nwokarea)
return


/*/{Protheus.doc} file
Determina se existe arquivo no diretório ou path AdvPL padrão.

@type binary function
@sintax File(<cArquivo>, [nWhere], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o arquivo existir; caso contrário, falso \(.F.\).

@param <carquivo>, character, Indica o nome do arquivo ou diretório+arquivo que será procurado. Além disso, são aceitos os caracteres curingas \(\* e ?\) e diretórios absolutos e relativos.
@param [nwhere], numeric, Indica o local onde será realizada a procura do arquivo. Sendo: 0 = O acesso depende do path \(Quando for um path relativo a procura será no Application Server; caso seja um path absoluto, a procura será no Smart Client\). 1 = A procura será realizada no diretório de instalação do Application Server. 2 = A procura será realizada no diretório de instalação do Smart Client.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/file
/*/
binary function file(carquivo, nwhere, lchangecase)
return


/*/{Protheus.doc} findclass
Indica se uma classe, informada através de uma string por parâmetro existe no binário e/ou repositório do ambiente atua.

@type binary function
@sintax FindClass(<cClassName>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a classe for encontrada no RPO ou no binário; caso contrário, falso \(.F.\).

@param <cclassname>, character, Indica o nome da classe a ser verificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/findclass
/*/
binary function findclass(cclassname)
return


/*/{Protheus.doc} findfunction
Verifica se uma determinada função está disponível no repositório de objetos ou no binário, do Application Server, para ser executada.

@type binary function
@sintax Findfunction(<cFuncao>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a função estiver disponível, no repositório de objetos corrente, para ser executada; caso contrário, falso \(.F.\).

@param <cfuncao>, character, Indica o nome da função que será consultada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/findfunction
/*/
binary function findfunction(cfuncao)
return


/*/{Protheus.doc} flistzip
Lista os arquivos que estão dentro do arquivo compactado em formato Zip.

@type binary function
@sintax FListZip(<cArquivoZip>, [@nRet], [cSenha]) => array
@return array, Retorna uma lista com os nomes e tamanhos dos arquivos compactados.

@param <carquivozip>, character, Indica o nome do arquivo compactado zip.
@param [@nret], numeric, Retorno da função, se 0 retornou corretamente a lista de arquivos, diferente de 0 se aconteceu algum erro.
@param [csenha], character, Senha que foi utilizada na compactação
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/flistzip
/*/
binary function flistzip(carquivozip, nret, csenha)
return


/*/{Protheus.doc} flock
Bloqueia uma tabela ou arquivo.

@type binary function
@sintax FLock() => logical
@return logical, Retorna verdadeiro \(.T.\), se a tabela for bloqueada com sucesso; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/flock
/*/
binary function flock()
return


/*/{Protheus.doc} fopen
Abre um arquivo binário.  
É uma função de tratamento de arquivo de baixo nível que abre um arquivo binário existente para que possa ser lido e escrito, dependendo do argumento no parâmetro <nModo>.

@type binary function
@sintax FOpen(<cArq>, [nModo], [xParam3], [lChangeCase]) => numeric
@return numeric, Retorna o handle de arquivo aberto, na faixa de 0 a 65.535. Caso ocorra um erro, o retorno será -1.

@param <carq>, character, Indica o nome do arquivo que será aberto que inclui o path, caso haja um.
@param [nmodo], numeric, Indica o modo de acesso DOS solicitado que indicará como o arquivo aberto deve ser acessado. O acesso é uma das categorias relacionadas na tabela A e as retrições de compartilhamento estão na tabela B. O modo padrão é 0 \(zero\), aberto para leitura, com compartilhamento por compatibilidade. Ao definirmos o modo de acesso, deve-se somar um elemento da tabela A com a B.
@param [xparam3], variant, Compatibilidade. Deve ser informado o valor nulo \( NIL \)
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fopen
/*/
binary function fopen(carq, nmodo, xparam3, lchangecase)
return


/*/{Protheus.doc} fpprecise
Função de Ativar ou Desativar comportamento de Float Point Precise.

@type binary function
@sintax FPPrecise([lPrecise]) => NIL
@param [lprecise], logical, Verdadeiro \(.T.\) ativa e Falso\(.F.\) desativa \( Default = .F. \)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fpprecise
/*/
binary function fpprecise(lprecise)
return


/*/{Protheus.doc} fread
Lê caracteres de um arquivo binário para uma variável de buffer.

@type binary function
@sintax FRead(<nHandle>, <cBufferVar>, <nQtdBytes>) => numeric
@return numeric, Retorna a quantidade de bytes lidos na forma de um valor numérico inteiro. Um valor de retorno menor <nQtdBytes> ou 0 \(zero\) indica final de arquivo ou algum erro de leitura. Para obter mais detalhes, utilize a função FError\(\).

@param <nhandle>, numeric, Indica o handle do arquivo obtido pelas funções FOpen\(\) ou FCreate\(\).
@param <cbuffervar>, character, Indica o nome de uma variável do tipo caractere. Essa variável é utilizada como buffer de leitura, para que os dados lidos sejam armazenados. O tamanho desta variável deve ser maior ou igual ao tamanho informado no parâmetro .
@param <nqtdbytes>, numeric, Indica a quantidade de bytes que serão lidos do arquivo a partir do posicionamento do ponteiro atual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fread
/*/
binary function fread(nhandle, cbuffervar, nqtdbytes)
return


/*/{Protheus.doc} freadstr
Lê caracteres de um arquivo binário.

@type binary function
@sintax FReadStr(<nHandle>, <nQtdBytes>) => character
@return character, Retorna uma string contendo os caracteres lidos.

@param <nhandle>, numeric, Indica o handle do arquivo obtido pelas funções FOpen\(\), FCreate\(\).
@param <nqtdbytes>, numeric, Indica a quantidade de bytes que devem ser lidos do arquivo a partir do posicionamento do ponteiro atual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/freadstr
/*/
binary function freadstr(nhandle, nqtdbytes)
return


/*/{Protheus.doc} freeobj
Elimina da memória a instância do objeto informado como parâmetro.

@type binary function
@sintax FreeObj([oObj]) => NIL
@param [oobj], object, Indica o objeto AdvPL a ser eliminado da memória.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/freeobj
/*/
binary function freeobj(oobj)
return


/*/{Protheus.doc} frename
Renomeia um arquivo.

@type binary function
@sintax FRename(<cArquivo>, <cNovoArq>, [nParam3], [lChangeCase]) => numeric
@return numeric, Retorna 0 \(zero\), se a operação for realizada com sucesso; caso contrário, retornará -1 se falhar. Em caso de falha, utilize a função FError\(\) para obter mais detalhes.

@param <carquivo>, character, Indica o nome do arquivo que será renomeado, inclusive sua extensão. Também podem ser incluídos como parte do nome uma letra indicativa da unidade de disco e/ou nome do diretório. Caso não seja especificado nenhuma unidade de disco ou diretório, será considerado o diretório atual do servidor.
@param <cnovoarq>, character, Indica o novo nome do arquivo, incluindo a extensão. Também podem ser incluídos como parte do nome uma letra indicativa da unidade de disco e/ou nome do diretório.
@param [nparam3], Nil, Compatibilidade, informar sempre Nil.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/frename
/*/
binary function frename(carquivo, cnovoarq, nparam3, lchangecase)
return


/*/{Protheus.doc} frenameex
Renomeia um arquivo no Application Server e/ou Smart Client respeitando o case do nome do arquivo indicado no segundo parametro. \(Por default, primeiro parâmetro continua alterando o case\)

@type binary function
@sintax FRenameEx(<cArquivo>, <cNovoArq>, [nParam3]) => numeric
@return numeric, Retorna 0 \(zero\), se a operação for realizada com sucesso; caso contrário, retornará -1 se falhar. Em caso de falha, utilize a função FError\(\) para obter mais detalhes.

@param <carquivo>, character, Indica o nome do arquivo que será renomeado, inclusive sua extensão. Também podem ser incluídos como parte do nome uma letra indicativa da unidade de disco e/ou nome do diretório. Caso não seja especificado nenhuma unidade de disco ou diretório, será considerado o diretório atual do servidor.
@param <cnovoarq>, character, Indica o novo nome do arquivo, incluindo a extensão. Também podem ser incluídos como parte do nome uma letra indicativa da unidade de disco e/ou nome do diretório.
@param [nparam3], Nil, Compatibilidade, informar sempre Nil.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/frenameex
/*/
binary function frenameex(carquivo, cnovoarq, nparam3)
return


/*/{Protheus.doc} fseek
Posiciona o ponteiro do arquivo para as próximas operações de leitura ou gravação.

@type binary function
@sintax FSeek(<nHandle>, <nOffSet>, [nOrigem]) => numeric
@return numeric, Retorna a nova posição do ponteiro de arquivo, com relação ao início do arquivo \(posição 0\), na forma de um valor numérico inteiro. Este valor não considera a posição original do ponteiro de arquivos antes da execução da função FSeek\(\).

@param <nhandle>, numeric, Indica o manipulador do arquivo obtido através das funções FCreate\(\) e FOpen.
@param <noffset>, numeric, Indica o número de bytes que o ponteiro de arquivo será movido a partir da posição definida no parâmetro . Esse número pode ser positivo, negativo ou zero, dependendo da direção na qual se deseja que o ponteiro seja movido.
@param [norigem], numeric, Indica a partir de qual posição será iniciada a contagem do número de bytes a ser movido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fseek
/*/
binary function fseek(nhandle, noffset, norigem)
return


/*/{Protheus.doc} ft_feof
Indica se o ponteiro está posicionado no fim do arquivo texto.

@type binary function
@sintax FT_FEOF() => logical
@return logical, Retorna verdadeiro \(.T.\), se o ponteiro do arquivo texto \(aberto pela função FT_FUse\) estiver posicionado no final; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_feof
/*/
binary function ft_feof()
return


/*/{Protheus.doc} ft_fgoto
Move o ponteiro, que indica a leitura do arquivo texto, para a posição absoluta especificada no parâmetro <nPos>.

@type binary function
@sintax FT_FGoto(<nPos>) => NIL
@param <npos>, numeric, Indica a posição do ponteiro que realizará a leitura dos dados no arquivo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_fgoto
/*/
binary function ft_fgoto(npos)
return


/*/{Protheus.doc} ft_fgotop
Posiciona no início \(primeiro caracter da primeira linha\) do arquivo texto aberto pela função FT_FUse\(\).

@type binary function
@sintax FT_FGotop() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_fgotop
/*/
binary function ft_fgotop()
return


/*/{Protheus.doc} ft_flastrec
Lê e retorna o número total de linhas do arquivo texto aberto pela função FT_FUse\(\).

@type binary function
@sintax FT_FLastRec() => numeric
@return numeric, Retorna a quantidade de linhas existentes no arquivo. Caso o arquivo esteja vazio ou não exista arquivo aberto, a função retornará 0 \(zero\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_flastrec
/*/
binary function ft_flastrec()
return


/*/{Protheus.doc} ft_freadln
Lê e retorna uma linha de texto do arquivo aberto pela função FT_FUse\(\). As linhas do texto, são delimitadas pela sequência de caracteres CRLF \(chr\(13\)+chr\(10\)\) ou apenas LF \(chr\(10\)\), e o tamanho máximo de cada linha é 1022 bytes.

@type binary function
@sintax FT_FReadLn() => character
@return character, Retorna a linha inteira na qual está posicionado o ponteiro para leitura de dados.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_freadln
/*/
binary function ft_freadln()
return


/*/{Protheus.doc} ft_frecno
Lê e retorna a posição atual do ponteiro do arquivo texto aberto pela função FT_FUse\(\).

@type binary function
@sintax FT_FRecno() => character
@return character, Retorna a posição corrente do ponteiro do arquivo texto.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_frecno
/*/
binary function ft_frecno()
return


/*/{Protheus.doc} ft_fskip
Move o ponteiro, do arquivo texto aberto pela função FT_FUse\(\), para uma nova posição.

@type binary function
@sintax FT_FSkip(<nLinhas>) => NIL
@param <nlinhas>, numeric, Indica o número de linhas do arquivo texto \(\*.txt\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_fskip
/*/
binary function ft_fskip(nlinhas)
return


/*/{Protheus.doc} ft_fuse
Abre e fecha um arquivo texto para disponibilizar às funções FT_F\*.

@type binary function
@sintax FT_FUse(<cTXTFile>) => numeric
@return numeric, Retorna o handle de controle do arquivo. Em caso de falha na abertura, a função retornará -1.

@param <ctxtfile>, character, Indica o nome do arquivo \*.txt que será aberto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ft_fuse
/*/
binary function ft_fuse(ctxtfile)
return


/*/{Protheus.doc} funzip
Descompacta um arquivo no formato Zip.

@type binary function
@sintax FUnZip(<cArquivoZip>, <cPasta>, [cSenha]) => numeric
@return numeric, Retorna 0 zero se consegui descompactar ou diferente de 0 zero em caso de erro.

@param <carquivozip>, character, Indica o nome do arquivo que será descompactado zip.
@param <cpasta>, character, Pasta onde o arquivo será descompactado.
@param [csenha], character, Se o arquivo foi compactado com senha, informar essa senha
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/funzip
/*/
binary function funzip(carquivozip, cpasta, csenha)
return


/*/{Protheus.doc} fwrite
Escreve dados de um buffer de string em um arquivo binário. Para isso, pode-se escrever todo ou parte do conteúdo do buffer, limitando a quantidade de bytes.

@type binary function
@sintax FWrite(<nHandle>, <cBuffer>, [nQtdBytes]) => numeric
@return numeric, Retorna a quantidade de bytes escritos na forma de um valor numérico inteiro. Caso o valor seja igual ao parâmetro <nQtdBytes>, a operação foi realizada com sucesso; caso contrário, se o valor for menor ou zero, o disco rígido está cheio ou ocorreu erro.

@param <nhandle>, numeric, Indica o manipulador de arquivo obtido através das funções FCreate\(\) e FOpen\(\).
@param <cbuffer>, character, Indica a string que será escrita no arquivo especificado. O tamanho desta variável deve ser maior ou igual ao tamanho informado no parâmetro \(caso seja informado o tamanho\).
@param [nqtdbytes], numeric, Indica a quantidade de bytes que serão escritos a partir da posição atual do ponteiro de arquivos. Caso não seja informado, todo o conteúdo do parâmetro é escrito.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fwrite
/*/
binary function fwrite(nhandle, cbuffer, nqtdbytes)
return


/*/{Protheus.doc} fzip
Compacta uma lista de arquivos no formato Zip.

@type binary function
@sintax FZip(<cArquivoZip>, <aArquivos>, [cBaseDir], [cSenha]) => numeric
@return numeric, Retorna 0 zero se conseguir compactar ou diferente de 0 zero em caso de erro

@param <carquivozip>, character, Indica o nome do arquivo final compactado zip.
@param <aarquivos>, array, Lista de arquivos que serão compactados.
@param [cbasedir], character, Indica o diretório base para não incluir dentro do arquivo compactado.
@param [csenha], character, Informar uma senha para gerar um arquivo compactado criptografado
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fzip
/*/
binary function fzip(carquivozip, aarquivos, cbasedir, csenha)
return


/*/{Protheus.doc} gensql
descrição da funcao

@type binary function
@sintax GenSql([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gensql
/*/
binary function gensql(tnomevar)
return


/*/{Protheus.doc} get_sqlca
descrição da funcao

@type binary function
@sintax Get_Sqlca([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/get_sqlca
/*/
binary function get_sqlca(tnomevar)
return


/*/{Protheus.doc} getallrpoinfo
Retorna um array contendo TODOS - sem exceção -  os dados das funções contidas no RPO - Repositório Portável de Objetos.

@type binary function
@sintax GetAllRpoInfo() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getallrpoinfo
/*/
binary function getallrpoinfo()
return


/*/{Protheus.doc} getapoinfo
Retorna um array com informações \(nome, linguagem, modo de compilação, data da última modificação e hora/minuto/segundo\) de um determinado arquivo de código-fonte \(\*.PRW\).

@type binary function
@sintax GetApoInfo(<cFonte>) => array
@return array, Retorna um array com os dados do arquivo de código fonte. Para informações do formato do array, consulte a tabela Formato do array de retorno, na área Observações.

@param <cfonte>, character, Indica o nome do arquivo de código fonte \(.PRW\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getapoinfo
/*/
binary function getapoinfo(cfonte)
return


/*/{Protheus.doc} getapores
Retorna o conteúdo de um resource do repositório.

@type binary function
@sintax GetApoRes(<cRes>) => character
@return character, Conteúdo do resource

@param <cres>, character, Indica o nome do resource.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getapores
/*/
binary function getapores(cres)
return


/*/{Protheus.doc} getapppath
Recupera caminho no qual o Application Server está sendo executado.

@type binary function
@sintax getAppPath(<@cPath>) => numeric
@return numeric, Retorna 0 em caso de sucesso na obtenção do caminho ou valor maior que zero em caso de erro.

@param <@cpath>, character, Variável, por referência, que receberá o caminho onde o application server está sendo executado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getapppath
/*/
binary function getapppath(cpath)
return


/*/{Protheus.doc} getauthargs
Recupera os parametros utilizados para autenticação.

@type binary function
@sintax GetAuthArgs() => object
@return object, Retorna um THashMap com os parametros de autenticação.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getauthargs
/*/
binary function getauthargs()
return


/*/{Protheus.doc} getbuild
Retorna uma string com informações da build \(ID da compilação\) em uso pelo Application Server.

@type binary function
@sintax GetBuild([lType]) => character
@return character, Retorna uma string com os dados da build corrente.

@param [ltype], logical, Indica se deve retornar a versão do SmartClient \(**.T.**\) ou Application Server \(**.F.**\). Se não for informado, será atribuído **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getbuild
/*/
binary function getbuild(ltype)
return


/*/{Protheus.doc} getcbsource
Recupera o código-fonte de um bloco de código.

@type binary function
@sintax GetCBSource(<bBlocoDeCodigo>) => character
@return character, Retorna o código-fonte do bloco de código especificado. Veja detalhes adicionais no tópico de Observações.

@param <bblocodecodigo>, codeblock, Indica a variável que contém o bloco de código para recuperar o código-fonte.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcbsource
/*/
binary function getcbsource(bblocodecodigo)
return


/*/{Protheus.doc} getchildct
descrição da funcao

@type binary function
@sintax GetChildCt([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getchildct
/*/
binary function getchildct(tnomevar)
return


/*/{Protheus.doc} getclassname
Retorna o nome da classe.

@type binary function
@sintax GetClassName(<oObjeto>) => character
@return character, Retorna o nome da classe.

@param <oobjeto>, object, Indica o objeto que será utilizado para pesquisar o nome.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getclassname
/*/
binary function getclassname(oobjeto)
return


/*/{Protheus.doc} getclientdir
Retorna o caminho do diretório onde o Smart Client está instalado.

@type binary function
@sintax GetClientDir() => character
@return character, Retorna o caminho do diretório onde o Smart Client está instalado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getclientdir
/*/
binary function getclientdir()
return


/*/{Protheus.doc} getclientip
Retorna o número IP - Internet Protocol do servidor que o SmartClient está instalado.

@type binary function
@sintax GetClientIP() => character
@return character, Retorna o número IP do servidor que o Smart Client está instalado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getclientip
/*/
binary function getclientip()
return


/*/{Protheus.doc} getcodepage
Retorna o encode definido no .ini do Application Server.

@type binary function
@sintax GetCodePage() => character
@return character, encode atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcodepage
/*/
binary function getcodepage()
return


/*/{Protheus.doc} getcomputername
Retorna o nome da máquina \(Hostname\) onde o SmartClient está sendo executado.

@type binary function
@sintax GetComputerName() => character
@return character, Nome da máquina.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcomputername
/*/
binary function getcomputername()
return


/*/{Protheus.doc} getconnstatus
Informa se a conexão com o TOTVS Application Server foi encerrada.

@type binary function
@sintax GetConnStatus() => logical
@return logical, Retorna verdadeiro \(.T.\), se a conexão com o Application Server for encerrada com sucesso; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getconnstatus
/*/
binary function getconnstatus()
return


/*/{Protheus.doc} getcredential
Obtém a credencial do usuário, no sistema operacional, no qual está autenticado.

@type binary function
@sintax GetCredential() => character
@return character, Retorna uma string que corresponde a credencial do usuário.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcredential
/*/
binary function getcredential()
return


/*/{Protheus.doc} getdbextension
Retorna a extensão dos arquivos de banco de dados.

@type binary function
@sintax GetDBExtension() => character
@return character, Retorna a extensão dos arquivos de banco de dados.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getdbextension
/*/
binary function getdbextension()
return


/*/{Protheus.doc} getdependency
Retorna os fontes necessários para a\(s\) chamada\(s\) de classes ou funções de um determinado arquivo.

@type binary function
@sintax GetDependency(<sFonte>) => NIL
@param <sfonte>, character, String com o nome do fonte que deseja saber as dependências
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getdependency
/*/
binary function getdependency(sfonte)
return


/*/{Protheus.doc} getdtodate
Converte uma string para o tipo data.

@type binary function
@sintax GetDtoDate(<cData>) => date
@return date, Retorna a data convertida

@param <cdata>, character, Indica a string que contém uma data a ser convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getdtodate
/*/
binary function getdtodate(cdata)
return


/*/{Protheus.doc} getdtoval
Converte uma string que contém um valor numérico para um número formatado.

@type binary function
@sintax GetDtoVal(<cDtoVal>) => numeric
@return numeric, Retorna um dado numérico.

@param <cdtoval>, character, Indica a string \(com valor numérico\) que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getdtoval
/*/
binary function getdtoval(cdtoval)
return


/*/{Protheus.doc} getenv
Determina o conteúdo de uma variável de ambiente \(environment\) do sistema operacional em uso no Application Server.

@type binary function
@sintax GetEnv(<cVarEnv>) => character
@return character, Caso a variável de ambiente esteja definida, será retornada uma string correspondente ao conteúdo da variável. Caso a variável não esteja definida, é retornado uma string vazia \(''\)

@param <cvarenv>, character, Indica o nome da variável de ambiente do sistema operacional.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getenv
/*/
binary function getenv(cvarenv)
return


/*/{Protheus.doc} getenvhost
Retorna o host \(nome/endereço\), quando ambiente Web, da página chamada.

@type binary function
@sintax GetEnvHost() => character
@return character, exemplo: www.totvs.com.br

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getenvhost
/*/
binary function getenvhost()
return


/*/{Protheus.doc} getenvserver
Retorna uma string com o nome do ambiente \(environment\) em execução no Application Server.

@type binary function
@sintax GetEnvServer() => character
@return character, Retorna uma string com o nome do ambiente \(environment\) em execução no Application Server.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getenvserver
/*/
binary function getenvserver()
return


/*/{Protheus.doc} getfuncarray
Retorna um ou mais arrays contendo os dados das funções contidas no RPO - Repositório Portável de Objetos, a partir de uma máscara.

@type binary function
@sintax GetFuncArray(<cMascara>, [@aTipo], [@aArquivo], [@aLinha], [@aData], [@aHora]) => array
@return array, Retorna um array que contém os nomes das funções localizadas através da máscara, compiladas no repositório em uso pelo ambiente.

@param <cmascara>, character, Indica a máscara que será utilizada para realizar a busca. Observação: Podem ser utilizados caracteres do tipo curinga \("?" ou "\*"\).
@param [@atipo], array, Indica o array que será alimentado com o tipo da função encontrada.
@param [@aarquivo], array, Indica o array que será alimentado com o nome do arquivo que contém o código fonte.
@param [@alinha], array, Indica o array que será alimentado com o número da linha correspondente a declaração da função no arquivo do código fonte.
@param [@adata], array, Indica o array que será alimentado com a data da última modificação do arquivo que contém o código fonte.
@param [@ahora], array, Indica o array que será alimentado com a hora da última modificação do arquivo que contém o código fonte.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getfuncarray
/*/
binary function getfuncarray(cmascara, atipo, aarquivo, alinha, adata, ahora)
return


/*/{Protheus.doc} getglbvalue
Retorna a string armazenada em uma variável global.

@type binary function
@sintax GetGlbValue(<cGlbName>) => character
@return character, Retorna o valor da variável global especificada no parâmetro cGlbName. Caso a variável não seja encontrada, retorna um caracter vazio.

@param <cglbname>, character, Indica o nome da variável global.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getglbvalue
/*/
binary function getglbvalue(cglbname)
return


/*/{Protheus.doc} getglbvars
Retorna os valores armazenados em uma variável global.

@type binary function
@sintax GetGlbVars(<cGlbName>, <@xValue1...N>) => logical
@return logical, Retorna verdadeiro \(.T.\) caso o identificador seja encontrado e as variáveis sejam retornadas; caso contrário, retorna falso \(.F.\).

@param <cglbname>, character, Indica o nome da variável global.
@param <@xvalue1...n>, variant, Indica os nomes de uma ou mais variáveis, passadas por referência, que receberão os valores armazenados na variável global.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getglbvars
/*/
binary function getglbvars(cglbname, xvalue1n)
return


/*/{Protheus.doc} gethardwareid
Retorna o número de série do drive onde está sendo executado o TOTVS \| Application Server.

@type binary function
@sintax GetHardwareId() => character
@return character, Retorna o ID \(número de série\) do drive onde está sendo executado o TOTVS \| Application Server.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gethardwareid
/*/
binary function gethardwareid()
return


/*/{Protheus.doc} getimpwindows
Retorna um array com os nomes das impressoras disponíveis.

@type binary function
@sintax GetImpWindows(<lDirect>) => array
@return array, Retorna um array, no formato texto, com as impressoras instaladas. Sendo que, a primeira impressora da lista é a padrão.

@param <ldirect>, logical, Indica se, verdadeiro \(.T.\), retorna as impressoras do Application Server; caso contrário, falso \(.F.\), do Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getimpwindows
/*/
binary function getimpwindows(ldirect)
return


/*/{Protheus.doc} getinikeys
Retorna um array com o nome de todas as chaves de uma determinada sessão em um arquivo de configuração APPServer \(APPSERVER.INI\), como por exemplo, a sessão TCP retornaria as suas chaves\(TYPE, PORT\).

@type binary function
@sintax GetIniKeys(<cIni>, <cSessao>, [uParam3]) => array
@return array, Retorna um array com o nome de todas as chaves de uma determinada sessão em um arquivo de configuração \(.INI\). Porém, caso a sessão especificada não seja encontrada, o array retornará vazio.

@param <cini>, character, Indica o nome do arquivo de configuração do APPServer \(APPSERVER.INI\) que se deseja obter as seções.
@param <csessao>, character, Indica o nome da Sessão do arquivo de configuração que se deseja obter as chaves.
@param [uparam3], numeric, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getinikeys
/*/
binary function getinikeys(cini, csessao, uparam3)
return


/*/{Protheus.doc} getinisessions
Retorna um array com o nome de todas as seções de um determinado arquivo de configuração \(.INI\), como por exemplo, TCP, GENERAL e DRIVERS.

@type binary function
@sintax GetINISessions(<cIni>, [uParam2]) => array
@return array, Retorna um array com os nomes de todas as seções do arquivo de configuração \(.INI\). Porém, caso o arquivo especificado não seja encontrado, o array retornará vazio.

@param <cini>, character, Indica o nome do arquivo de configuração \(.INI\) que se deseja obter as seções.
@param [uparam2], numeric, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getinisessions
/*/
binary function getinisessions(cini, uparam2)
return


/*/{Protheus.doc} getlinesprog
Retorna o numero de linhas executáveis do fonte onde ela foi chamada, ou GetLinesProg\("fonte.extensao"\) para retornar de um outro fonte.

@type binary function
@sintax GetLinesProg(<cFile>) => numeric
@return numeric, Numero de linhas do fonte

@param <cfile>, character, Caso presente, procura o arquivo indicado no RPO atual e ve qual o numero de linhas dele.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getlinesprog
/*/
binary function getlinesprog(cfile)
return


/*/{Protheus.doc} getmailobj
Obtém o objeto de e-mail tMailManager, referente ao valor informado no parâmetro <cID>.

@type binary function
@sintax GetMailObj(<cID>) => object
@return object, Retorna um objeto tMailManager, caso tenha sido encontrado o identificador <cID>; caso contrário retorna Nil.

@param <cid>, character, Indica um identificador para recuperar o objeto armazenado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmailobj
/*/
binary function getmailobj(cid)
return


/*/{Protheus.doc} getmainsource
Retorna o nome do fonte onde foi iniciada a entrada no programa, sendo ele o primeiro fonte da pilha de execução.

@type binary function
@sintax GetMainSource() => character
@return character, Retorna o nome do fonte principal, onde foi feita a entrada no programa que criou a pilha de execução.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmainsource
/*/
binary function getmainsource()
return


/*/{Protheus.doc} getobjdetail
descrição da funcao

@type binary function
@sintax GetObjDetail([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getobjdetail
/*/
binary function getobjdetail(tnomevar)
return


/*/{Protheus.doc} getparenttree
Retorna um array com o nome da classe e das classes herdadas por ordem de herança.

@type binary function
@sintax GetParentTree(<oObjeto>) => array
@return array, Um array de caracteres com os nomes das classes herdadas

@param <oobjeto>, object, Indica o objeto o qual deseja saber o nome da classe e sua herança
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getparenttree
/*/
binary function getparenttree(oobjeto)
return


/*/{Protheus.doc} getport
Retorna o número da porta que o servidor de aplicação, license, http ou https está escutando.

@type binary function
@sintax GetPort(<nType>) => numeric
@return numeric, Retorna o número da porta em formato númerico, caso a porta não esteja habilitada ou o tipo da porta não esteja no intervalo de 1 a 4, retorna -1.

@param <ntype>, numeric, Indica o tipo da porta \(1 - Application, 2 - License, 3 - HTTP, 4 - HTTPS\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getport
/*/
binary function getport(ntype)
return


/*/{Protheus.doc} getportactive
Retorna um array com os nomes das portas disponíveis.

@type binary function
@sintax GetPortActive(<lDirect>) => array
@return array, Retorna um array, no formato texto, com as portas disponíveis.

@param <ldirect>, logical, Indica se, verdadeiro \(.T.\), retorna as portas do Application Server; caso contrário, falso \(.F.\), do Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getportactive
/*/
binary function getportactive(ldirect)
return


/*/{Protheus.doc} getpowersc
Retorna os elementos do plano de energia \(power scheme\) corrente do sistema operacional em um array de arrays.

@type binary function
@sintax GetPowerSC() => array
@return array, Array de arrays contendo os dados dos elementos do plano de energia corrente do sistema operacional.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getpowersc
/*/
binary function getpowersc()
return


/*/{Protheus.doc} getprgtag
descrição da funcao

@type binary function
@sintax GetPrgTag([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getprgtag
/*/
binary function getprgtag(tnomevar)
return


/*/{Protheus.doc} getprocinfoarray
Retorna uma lista com informações de todas as threads \(menos as threads de usuário/monitor\) que estão em execução no Application Server.

@type binary function
@sintax GetProcInfoArray() => array
@return array, Lista com informações das threads \(vide Obs.\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getprocinfoarray
/*/
binary function getprocinfoarray()
return


/*/{Protheus.doc} getprofint
Recupera o conteúdo numérico de uma chave do arquivo win.ini \(arquivo utilizado para armazenar configurações básicas de inicialização\) do sistema operacional

@type binary function
@sintax GetProfInt(<cSecao>, <cChave>, <nPadrao>) => numeric
@return numeric, Retorna o conteúdo da chave especificada ou o seu valor padrão.

@param <csecao>, character, Indica o nome da seção em que um valor será recuperado.
@param <cchave>, character, Indica o nome da chave em que um valor será recuperado.
@param <npadrao>, numeric, Indica o conteúdo padrão que será recuperado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getprofint
/*/
binary function getprofint(csecao, cchave, npadrao)
return


/*/{Protheus.doc} getprofstring
Recupera o conteúdo caractere de uma chave do arquivo win.ini \(arquivo utilizado para armazenar configurações básicas de inicialização\) do sistema operacional.

@type binary function
@sintax GetProfString(<cSecao>, <cChave>, <cPadrao>) => character
@return character, Retorna o conteúdo da chave especificada ou o seu valor padrão.

@param <csecao>, character, Indica o nome da seção em que um valor será recuperado.
@param <cchave>, character, Indica o nome da chave em que um valor será recuperado.
@param <cpadrao>, character, Indica o conteúdo padrão que será recuperado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getprofstring
/*/
binary function getprofstring(csecao, cchave, cpadrao)
return


/*/{Protheus.doc} getprograms
Retorna um array contendo o nome dos programas AdvPl carregados em memória.

@type binary function
@sintax GetPrograms() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getprograms
/*/
binary function getprograms()
return


/*/{Protheus.doc} getpvprofileint
Recupera o conteúdo numérico de uma chave, do arquivo de configuração \(\*.INI\), qualquer.

@type binary function
@sintax GetPvProfileInt(<cSecao>, <cChave>, <nPadrao>, <cNomeArqCfg>, [uParam5], [uParam6]) => numeric
@return numeric, Retorna o conteúdo da chave especificada, ou o seu valor padrão

@param <csecao>, character, Indica o nome da seção do arquivo a ser considerada.
@param <cchave>, character, Indica o nome da chave a ser considerada.
@param <npadrao>, numeric, Indica o conteúdo padrão \( default \) a ser retornado , caso a chave não seja encontrada no arquivo de configuração.
@param <cnomearqcfg>, character, Indica o nome do arquivo de configuração \(\*.INI\) a ser utilizado.
@param [uparam5], numeric, Compatibilidade
@param [uparam6], numeric, Compatibilidade
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getpvprofileint
/*/
binary function getpvprofileint(csecao, cchave, npadrao, cnomearqcfg, uparam5, uparam6)
return


/*/{Protheus.doc} getpvprofstring
Recupera o conteúdo caractere de uma chave de um arquivo de configuração \(\*.INI\) qualquer.

@type binary function
@sintax GetPvProfString(<cSecao>, <cChave>, <cPadrao>, <cNomeArqCfg>, [uParam5], [uParam6]) => character
@return character, Retorna o conteúdo da chave especificada, ou o seu valor padrão

@param <csecao>, character, Indica o nome da seção do arquivo a ser considerada.
@param <cchave>, character, Indica o nome da chave a ser considerada.
@param <cpadrao>, character, Indica o conteúdo padrão \( default \) a ser retornado , caso a chave não seja encontrada no arquivo de configuração.
@param <cnomearqcfg>, character, Indica o nome do arquivo de configuração \(\*.INI\) a ser utilizado.
@param [uparam5], numeric, Compatibilidade
@param [uparam6], numeric, Compatibilidade
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getpvprofstring
/*/
binary function getpvprofstring(csecao, cchave, cpadrao, cnomearqcfg, uparam5, uparam6)
return


/*/{Protheus.doc} getremoteininame
Retorna o caminho completo do arquivo de configuração \(\*.INI\) do SmartClient.

@type binary function
@sintax GetRemoteIniName() => character
@return character, Retorna o caminho completo do arquivo de configuração \(\*.INI\) do SmartClient.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getremoteininame
/*/
binary function getremoteininame()
return


/*/{Protheus.doc} getremotetype
Identifica a tipo e versão do Smart Client em execução.

@type binary function
@sintax GetRemoteType([@cLibVersion]) => numeric
@return numeric, Retorna o número correspondente ao sistema operacional, em uso, que o Smart Client está sendo executado. Sendo: -1 = Job, Web ou Working Thread \(Sem remote\); 1 = Ambiente Microsoft Windows ou 2 = Ambiente Linux/Unix.

@param [@clibversion], character, Indica a versão da biblioteca gráfica do Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getremotetype
/*/
binary function getremotetype(clibversion)
return


/*/{Protheus.doc} getresarray
Retorna um array com os resources do repositório baseado na pesquisa por nome ou máscara.

@type binary function
@sintax GetResArray(<cMask>, [nRPO]) => array
@return array, Resources do repositório

@param <cmask>, character, Indica o nome do resource ou máscara que será usada na pesquisa. Serão aceitos caracteres curingas '\*' e '?'.
@param [nrpo], numeric, Indica o nome do repositório que será feita a busca. Valores possíveis: 1 - RPO Padrão, 2 - RPO TLPP, 3 - RPO Custom. Caso o parâmetro não seja informado, a busca sera realizada em todos os repositórios citados. Este parâmetro é válido a partir a release 20.3.0.x \(Application Server Harpia\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getresarray
/*/
binary function getresarray(cmask, nrpo)
return


/*/{Protheus.doc} getrmtdate
Retorna a data atual do sistema definido na máquina onde o SmartClient está sendo executado.

@type binary function
@sintax GetRmtDate() => date
@return date, Data atual do sistema

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getrmtdate
/*/
binary function getrmtdate()
return


/*/{Protheus.doc} getrmtinfo
Retorna um array com as definições do computador que o SmartClient está sendo executado.

@type binary function
@sintax GetRmtInfo() => array
@return array, Retorna um array com as definições do computador que o SmartClient está sendo executado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getrmtinfo
/*/
binary function getrmtinfo()
return


/*/{Protheus.doc} getrmttime
Retorna a hora atual do sistema definido na máquina onde o SmartClient está sendo executado.

@type binary function
@sintax GetRmtTime() => character
@return character, Hora atual do sistema

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getrmttime
/*/
binary function getrmttime()
return


/*/{Protheus.doc} getrmtversion
Retorna um string com a versão atual do SmartClient

@type binary function
@sintax GetRmtVersion() => array
@return array, Retorna um string no formato YEAR.MAJOR.MINOR.VERSION \(exemplo 17.2.0.1\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getrmtversion
/*/
binary function getrmtversion()
return


/*/{Protheus.doc} getrpolog
Retorna um array com os dados de todos os patchs aplicados.

@type binary function
@sintax getRpoLog([nRPO]) => array
@return array, Retorna um array com os dados de todos os patchs aplicados. Para informações do formato do array, consulte a tabela Formato do array de retorno, na área Observações.

@param [nrpo], numeric, Indica o nome o repositório que será feita a busca. Valores possíveis: 1 - RPO Padrão, 3 - RPO Custom. Caso o parâmetro não seja informado o valor 1 é assumido como padrão. Este parâmetro é válido a partir a release 20.3.0.x \(Application Server Harpia\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getrpolog
/*/
binary function getrpolog(nrpo)
return


/*/{Protheus.doc} getscreenres
descrição da funcao

@type binary function
@sintax GetScreenRes([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getscreenres
/*/
binary function getscreenres(tnomevar)
return


/*/{Protheus.doc} getserverip
Retorna o número IP do servidor onde a aplicação Advpl está sendo executada.

@type binary function
@sintax GetServerIP([lGetAllAddress]) => array
@return array, Se lGetAllAddress for .T., retorna todos os endereços relacionados ao servidor em um array \(vide OBS para estrutura do array\).

@param [lgetalladdress], logical, Indica se deve ser retornado todos os endereços relacionados ao servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getserverip
/*/
binary function getserverip(lgetalladdress)
return


/*/{Protheus.doc} getservertype
Retorna um número inteiro que representa o tipo de execução do Application Server.

@type binary function
@sintax GetServerType() => numeric
@return numeric, Retorna o tipo de execução do Application Server. Sendo: 0=None, 1=Console \(texto\), 2=ISAPI \(Web\) e 3=FAT \(Gráfico\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getservertype
/*/
binary function getservertype()
return


/*/{Protheus.doc} getsrcarray
Retorna um array com o nome dos fontes compilados.

@type binary function
@sintax GetSrcArray(<cNome>, [nRPO]) => array
@return array, Retorna um array de strings, contendo o nome dos fontes compilados identificados no repositório.

@param <cnome>, character, Indica o nome do código fonte ou máscara. Observação: São aceitos os caracteres curingas \(\* e ?\).
@param [nrpo], numeric, Indica o nome do repositório que será feita a busca. Valores possíveis: 1 - RPO Padrão, 2 - RPO TLPP, 3 - RPO Custom. Caso o parâmetro não seja informado, a busca sera realizada em todos os repositórios citados. Este parâmetro é válido a partir a release 20.3.0.x \(Application Server Harpia\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrcarray
/*/
binary function getsrcarray(cnome, nrpo)
return


/*/{Protheus.doc} getsrvarch
Retorna a arquitetura do processador que está sendo executado o Application Server. Suporta os sistemas operacionais Windows e Linux.

@type binary function
@sintax GetSrvArch() => character
@return character, Retorna a arquitetura do processador no formato linux base. Valores possíveis: 32 bits - i686, 64 bits - x86_64, ARM - aarch32, ARM64 - aarch64, Deconhecido - unknown.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvarch
/*/
binary function getsrvarch()
return


/*/{Protheus.doc} getsrvbuildtype
Retorna a informação do tipo de geração do servidor. ex: release, debug ou relwithdebinfo

@type binary function
@sintax GetSrvBuildType() => character
@return character, Retorna o tipo de geração do servidor \(release, debug ou relwithdebinfo\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvbuildtype
/*/
binary function getsrvbuildtype()
return


/*/{Protheus.doc} getsrvglbinfo
Retorna uma string contendo um resumo do status atual do serviço do Application Server, incluindo detalhamento de processos internos, processos de usuário, memória do serviço, pools de memória do kernel do Application Server, memória do processo e acumuladores globais.

@type binary function
@sintax GetSrvGlbInfo() => character
@return character, Retorna uma string descrevendo o status atual do serviço

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvglbinfo
/*/
binary function getsrvglbinfo()
return


/*/{Protheus.doc} getsrvinfo
Retorna um array com as definições do servidor onde o TOTVS \| Application Server foi instanciado.

@type binary function
@sintax GetSrvInfo() => array
@return array, Retorna um array com informações do Totvs Application Server. Para o formato do array vide observação.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvinfo
/*/
binary function getsrvinfo()
return


/*/{Protheus.doc} getsrvininame
Retorna o nome do arquivo de configuração \(\*.INI\) do Application Server.

@type binary function
@sintax GetSrvIniName() => character
@return character, Retorna o nome do arquivo de configuração \(\*.INI\) do Application Server.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvininame
/*/
binary function getsrvininame()
return


/*/{Protheus.doc} getsrvmeminfo
Recupera o status de memória da máquina onde o Application Server está sendo executado.

@type binary function
@sintax GetSrvMemInfo() => character
@return character, Retorna uma string contendo o resumo das informações de memória da máquina onde o Application Server está sendo executado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvmeminfo
/*/
binary function getsrvmeminfo()
return


/*/{Protheus.doc} getsrvnickname
Retorna uma string com o apelido do Application Server.

@type binary function
@sintax GetSrvNickName() => character
@return character, String com o apelido do Application Server.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvnickname
/*/
binary function getsrvnickname()
return


/*/{Protheus.doc} getsrvosinfo
Retorna informações do sistema operacional onde o Application Server está sendo executado.

@type binary function
@sintax GetSrvOSInfo() => character
@return character, Retorna uma string contendo as informações do Sistema Operacional onde o Application Server está sendo executado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvosinfo
/*/
binary function getsrvosinfo()
return


/*/{Protheus.doc} getsrvprofstring
Recupera o conteúdo de uma chave de configuração, do ambiente em uso, no arquivo de configuração \(.INI\) do TOTVS Application Server.

@type binary function
@sintax GetSrvProfString(<cChave>, <cDefault>) => character
@return character, Retorna o conteúdo da chave especificada. Caso a chave não seja encontrada na seção de configuração do ambiente atual, a função retornará o conteúdo informado no parâmetro cDefault.

@param <cchave>, character, Indica a chave que deve ser lida do arquivo de configuração.
@param <cdefault>, character, Indica o conteúdo da chave a ser retornada, caso a chave não seja encontrada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvprofstring
/*/
binary function getsrvprofstring(cchave, cdefault)
return


/*/{Protheus.doc} getsrvversion
Retorna a versão do build do atual binario Appserver.

@type binary function
@sintax GetSrvVersion() => character
@return character, Retorna a versão no formato nn.n.n.n.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsrvversion
/*/
binary function getsrvversion()
return


/*/{Protheus.doc} getstringpixsize
Retorna uma matriz com a altura e a largura total em pixels de uma determinada string, dados uma fonte específica, tamanho e modificadores \(negrito, itálico, sublinhado\).

@type binary function
@sintax GetStringPixSize(<cString>, <cFontName>, <nTamanho>, [lBold], [lItalic], [lUnderline]) => array
@return array, Retorna a altura e a lagura total em pixels, dos caracteres fornecidos em cString.

@param <cstring>, character, String com o texto a ser contado \(altura e largura\).
@param <cfontname>, character, Indica o nome da fonte instalada no Smart Client.
@param <ntamanho>, numeric, Indica o tamanho da fonte.
@param [lbold], logical, Indica se a fonte está em negrito.
@param [litalic], logical, Indica se a fonte está em itálico.
@param [lunderline], logical, Indica se a fonte está sublinhada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getstringpixsize
/*/
binary function getstringpixsize(cstring, cfontname, ntamanho, lbold, litalic, lunderline)
return


/*/{Protheus.doc} gettcpobj
descrição da funcao

@type binary function
@sintax GetTcpObj([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettcpobj
/*/
binary function gettcpobj(tnomevar)
return


/*/{Protheus.doc} gettemppath
Retorna o caminho da pasta temporária do sistema atual.

@type binary function
@sintax GetTempPath([lLocal]) => character
@return character, Retorna o caminho da pasta temporária do sistema atual.

@param [llocal], logical, Indica se verdadeiro \(.T.\), é procurado o diretório temporário do Smart Client ou, falso \(.F.\), do Application Server. Valor padrão: .T.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettemppath
/*/
binary function gettemppath(llocal)
return


/*/{Protheus.doc} gettimestamp
Retorna uma string com informações de data e hora, no formato time stamp da a data infromada no parâmetro.

@type binary function
@sintax GetTimeStamp(<dDate>, [aDate]) => character
@return character, Retorna uma string no formato timestamp da data informada no parâmetro 1.

@param <ddate>, date, Indica a data que será utilizada para obter o timestamp.
@param [adate], array, Retorno do timestamp no array passado por referência, o formato do array será data posição 1 e hora posição 2.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettimestamp
/*/
binary function gettimestamp(ddate, adate)
return


/*/{Protheus.doc} getuserfromsid
Recupera o nome do domínio e nome do usuário a partir de um código no padrão SID \(Security Identifier\) da Microsoft que os representa.

@type binary function
@sintax GetUserFromSID(<cSID>, <@cDomainName>, <@cUserName>) => logical
@return logical, Caso a obtenção dos nomes de domínio e usuário foi realizada com sucesso retorna verdadeiro \(.T.\), caso contrário retorna falso \(.F.\).

@param <csid>, character, Código SID do usuário autenticado na estação. Pode ser obtido com a função GetCredential\(\).
@param <@cdomainname>, character, Será preenchido pela função após ser invocada. Conterá o nome do domínio extraído do código SID.
@param <@cusername>, character, Será preenchido pela função após ser invocada. Conterá o nome do usuário extraído do código SID.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getuserfromsid
/*/
binary function getuserfromsid(csid, cdomainname, cusername)
return


/*/{Protheus.doc} getuserinfoarray
Retorna um array multidimensional com as informações de cada um do processos em execução no Protheus 8 Server e/ou Application Server.

@type binary function
@sintax GetUserInfoArray([lShowMoreInfo*]) => array
@return array, Retorna um array multidimensional com os números e dados de cada uma das threads.

@param [lshowmoreinfo*], logical, Se informado verdadeiro \(.T.\), retorna mais informações por thread \(apenas 4GL/Telnet 4GL\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getuserinfoarray
/*/
binary function getuserinfoarray(lshowmoreinfo*)
return


/*/{Protheus.doc} getvarnamelen
Retorna o tamanho de uma variável AdvPL.

@type binary function
@sintax GetVarNameLen() => numeric
@return numeric, Retorna o tamanho definido atualmente para uma variável.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getvarnamelen
/*/
binary function getvarnamelen()
return


/*/{Protheus.doc} getvarsize
Retorna o tamanho em bytes que a variável ocupa em memória no Application Server.

@type binary function
@sintax GetVarSize(<xVar>) => numeric
@return numeric, Retorna o tamanho da variável em bytes.

@param <xvar>, variant, Variável que será analisada
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getvarsize
/*/
binary function getvarsize(xvar)
return


/*/{Protheus.doc} getvdrobj
descrição da funcao

@type binary function
@sintax GetVdrObj([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getvdrobj
/*/
binary function getvdrobj(tnomevar)
return


/*/{Protheus.doc} getwebjob
Retorna o nome de usuário da thread em que foi executada.

@type binary function
@sintax GetWebJob() => character
@return character, Retorna uma string com o nome do usuário da thread em que a chamada à função foi realizada. Como em AdvPL uma função pode ser iniciada de várias formas, esse nome de usuário tem uma semântica diferente dependendo de contexto em que foi iniciado: Via SmartClient \(Windows, Linux, Mac ou ActiveX\): representa o nome do usuário logado na máquina que executou o SmartClient. Via requisições WEB .apl: o retorno é a string HTTP:GENPROC. Via requisições WEBEX .apw: o retorno é o nome da seção \(definida em responsejob\) que foi configurada no totvsappserver.ini para atender a requisição. Via seção ONSTART do totvsappserver.ini: o retorno é o nome do job configurado para atender a requisição. Via função StartJob dentro de um programa AdvPL: nesse caso o retorno é o usuário da thread que executou StartJob seguido de um _ no final. Ex: username_. Via chamadas RPC: retorna uma string vazia.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getwebjob
/*/
binary function getwebjob()
return


/*/{Protheus.doc} glblock
Obtém um flag de bloqueio para serialização de operações, com escopo na instância atual do Protheus Server em execução, com liberação explícita através da função GlbUnlock\(\). Caso não haja uma liberação explícita, haverá uma liberação automática do bloqueio no término do processo \(Thread\) em execução que obteve o bloqueio.

@type binary function
@sintax GlbLock() => logical
@return logical, Retorna .T. caso o bloqueio tenha sido obtido para o processo atual. Caso a função retorne .F., já existe um outro processo \( Thread \) neste mesmo Protheus Server que possui um bloqueio.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/glblock
/*/
binary function glblock()
return


/*/{Protheus.doc} glbnmlock
Realiza o bloqueio de um identificador nomeado.

@type binary function
@sintax GlbNmLock(<cText>) => logical
@return logical, Retorna .T. caso o identificador de bloqueio tenha sido obtido com sucesso para o processo atual. Caso um identificador de bloqueio com este jone, já tenha sido retornado e não liberado para outro processo, a função retorna .F.

@param <ctext>, character, Indica o nome do identificador de bloqueio.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/glbnmlock
/*/
binary function glbnmlock(ctext)
return


/*/{Protheus.doc} glbnmunlock
Libera um bloqueio de um identificador nomeado obtido pela função GlbNmLock\(\).

@type binary function
@sintax GlbNmUnlock(<cText>) => logical
@return logical, Retorna .T. caso o identificador de bloqueio tenha sido liberado com sucesso para o processo atual. Para isso, o identificador precisa existir na lista de bloqueios, e o processo atual deve ter sido o responsavel por realizar o bloqueio. Caso contrário a função retorna .F.

@param <ctext>, character, Indica o nome do identificador de bloqueio.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/glbnmunlock
/*/
binary function glbnmunlock(ctext)
return


/*/{Protheus.doc} glbunlock
Libera explicitamente o flag de bloqueio para serialização de operações obtido pelo processo atual através da função GlbLock\(\)

@type binary function
@sintax GlbUnlock() => logical
@return logical, Retorna .T. caso o bloqueio tenta sido liberado. Caso não haja um bloqueio global a ser liberado, ou ele não tenha sido obtido pelo meu processo, ou já tenha sido liberado anteriormente, a função retorna .F.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/glbunlock
/*/
binary function glbunlock()
return


/*/{Protheus.doc} gzcompress
Compacta um arquivo do ambiente do servidor, a partir do rootpath, para um arquivo no formato gzip.

@type binary function
@sintax GzCompress(<cFile>, [cGzip], [lChangeCase]) => logical
@return logical, Retorna **.T.** se a compactação for realizada com sucesso; caso contrário, retorna **.F.**.

@param <cfile>, character, Indica o arquivo no servidor que será compactado.
@param [cgzip], character, Indica o nome do arquivo compactado.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gzcompress
/*/
binary function gzcompress(cfile, cgzip, lchangecase)
return


/*/{Protheus.doc} gzdecomp
Descompacta o conteúdo de um arquivo no formato gzip \(GNU zip\) do ambiente do servidor, a partir do rootpath, para um diretório no servidor.

@type binary function
@sintax GzDecomp(<cGzip>, <cOutDir>, [lChangeCase]) => logical
@return logical, Retorna **.T.** se a descompactação for realizada com sucesso; caso contrário, retorna **.F.**.

@param <cgzip>, character, Indica o nome do arquivo, no formato Gzip, cujo conteúdo será descompactado.
@param <coutdir>, character, Indica o diretório onde o arquivo será descompactado.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gzdecomp
/*/
binary function gzdecomp(cgzip, coutdir, lchangecase)
return


/*/{Protheus.doc} gzstrcomp
Compacta uma string no formato **gzip**.

@type binary function
@sintax GzStrComp(<cSource>, <@cTarget>, <@nTargetLen>) => logical
@return logical, Retorna **.T.** se a compactação for realizada com sucesso; caso contrário, retorna **.F.**.

@param <csource>, character, Indica a string que será compactada.
@param <@ctarget>, character, Indica a string compactada.
@param <@ntargetlen>, numeric, Indica o tamanho da string compactada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gzstrcomp
/*/
binary function gzstrcomp(csource, ctarget, ntargetlen)
return


/*/{Protheus.doc} gzstrdecomp
Descompacta uma string no formato **gzip**.

@type binary function
@sintax GzStrDecomp(<cSource>, <nSourceLen>, <@cTarget>) => logical
@return logical, Retorna **.T.** se a descompactação for realizada com sucesso; caso contrário, retorna **.F.**.

@param <csource>, character, Indica a string que está compactada.
@param <nsourcelen>, numeric, Indica o tamanho da string compactada.
@param <@ctarget>, character, Indica a string descompactada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gzstrdecomp
/*/
binary function gzstrdecomp(csource, nsourcelen, ctarget)
return


/*/{Protheus.doc} hasvvspeak
descrição da funcao

@type binary function
@sintax HasVVSpeak([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hasvvspeak
/*/
binary function hasvvspeak(tnomevar)
return


/*/{Protheus.doc} hmac
HMAC \(Hash-based Message Authentication Code\) gera o hash de autenticação de uma mensagem de entrada, em combinação com uma chave secreta. Essa implementação suporta os algoritmos SHA-1,SHA-256,SHA-512 e MD5.

@type binary function
@sintax HMAC(<cContent>, <cKey>, <nCryptoType>, [nRetType], [nContentType], [nKeyType]) => character
@return character, Retorna o hash \(Message Authentication Code\) do conteúdo de entrada informado, no formato especificado.

@param <ccontent>, character, Indica a string de entrada que contém os dados para os quais será gerado o hash.
@param <ckey>, character, Indica a chave que será utilizada para gerar o hash.
@param <ncryptotype>, numeric, Indica o tipo de algoritmo criptográfico que será utilizado para geração do Hash. Veja tabela nas observações.
@param [nrettype], numeric, Indica o tipo do formato de retorno do hash. Quando não informado valor padrão será **2 \(Hex Hash\)**. Veja tabela nas observações.
@param [ncontenttype], numeric, Indica o tipo do formato do conteúdo da variável cContent. Quando não informado o padrão será **1 \(Texto\)**. Veja tabela nas observações.
@param [nkeytype], numeric, Indica o tipo do formato da chave informada na variável cKey. Quando não informado o padrão será **1 \(Texto\)**. Veja tabela nas observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmac
/*/
binary function hmac(ccontent, ckey, ncryptotype, nrettype, ncontenttype, nkeytype)
return


/*/{Protheus.doc} hmadd
Adiciona um novo item ao objet tHashMap, indicando qual o campo da chave de procura.

@type binary function
@sintax HMAdd(<oHash>, <aVal>, [nColuna_1], [nTrim_1], [nColuna_N], [nTrim_N]) => logical
@return logical, Verdadeiro \(.T.\) se adicionou com sucesso e Falso \(.F\) se houve erro

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <aval>, array, Array com os valores que serão adicionados ao HashMap
@param [ncoluna_1], numeric, Indica o número da coluna que contem o valor da chave a ser inserida
@param [ntrim_1], numeric, Tipo de Trim para colunas de caractere
@param [ncoluna_n], numeric, Informar mais de uma coluna se necessário \(máximo 8\)
@param [ntrim_n], numeric, Tipo de Trim para as colunas do tipo caractere.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmadd
/*/
binary function hmadd(ohash, aval, ncoluna_1, ntrim_1, ncoluna_n, ntrim_n)
return


/*/{Protheus.doc} hmclean
Limpa todos os dados alocados em um objeto da classe tHashMap.

@type binary function
@sintax HMClean(<oHash>) => logical
@return logical, Verdadeiro \(.T.\) se limpou todos os dados ou falso \(.F.\) se houve algum erro

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmclean
/*/
binary function hmclean(ohash)
return


/*/{Protheus.doc} hmcount
Retorna a quantidade de elementos em um objeto do tipo HashMap

@type binary function
@sintax HmCount([oHashMap]) => numeric
@return numeric, Quantidade de elementos no objeto informado.

@param [ohashmap], object, Objeto do tipo Hashmap
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmcount
/*/
binary function hmcount(ohashmap)
return


/*/{Protheus.doc} hmdel
Remove o valor armazenado correspondente a chave em um objeto da classe tHashMap.

@type binary function
@sintax HMDel(<oHash>, <yKey>) => logical
@return logical, Verdadeiro \(.T.\) se deletou o valor e Falso \(.F\) se não encontrou

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <ykey>, variant, Chave de armazenamento do valor
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmdel
/*/
binary function hmdel(ohash, ykey)
return


/*/{Protheus.doc} hmget
Obtém o valor armazenado correspondente a chave em um objeto da classe tHashMap.

@type binary function
@sintax HMGet(<oHash>, <yKey>, <@aVal>) => logical
@return logical, Retorna verdadeiro \(.T.\) se achar a chave, ou falso \(.F.\) se não achar.

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <ykey>, variant, Chave de armazenamento do valor
@param <@aval>, array, Retorna o valor armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmget
/*/
binary function hmget(ohash, ykey, aval)
return


/*/{Protheus.doc} hmgetn
Obtém o valor armazenado correspondente a chave em um objeto da classe tHashMap.

@type binary function
@sintax HMGetN(<oHash>, <nKey>, <@aVal>) => logical
@return logical, Retorna verdadeiro \(.T.\) se achar a chave, ou falso \(.F.\) se não achar.

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <nkey>, numeric, Chave de armazenamento do valor
@param <@aval>, numeric, Retorna o valor armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmgetn
/*/
binary function hmgetn(ohash, nkey, aval)
return


/*/{Protheus.doc} hmkey
Obtem o valor de chave simples ou composta a partir das colunas eleitas de um array. A chave obtida poderá ser usada nas funções: HMGet, HMSet, HMDel.

@type binary function
@sintax HMKey(<aArray>, [nColuna_1], [n_Trim_1], [nColuna_N], [n_Trim_N]) => character
@return character, Palavra contendo a chave de busca referente às colunas

@param <aarray>, array, Linha com os elementos que participaram da chave de busca
@param [ncoluna_1], numeric, Indica o número da coluna que contem o valor da chave a ser inserida
@param [n_trim_1], numeric, Tipo de Trim para colunas de caractere
@param [ncoluna_n], numeric, Informar mais de uma coluna se necessário \(máximo 8\)
@param [n_trim_n], numeric, Tipo de Trim para as colunas do tipo caractere.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmkey
/*/
binary function hmkey(aarray, ncoluna_1, n_trim_1, ncoluna_n, n_trim_n)
return


/*/{Protheus.doc} hmlist
Lista todos os elementos do objeto HashMap em um array.

@type binary function
@sintax HMList(<oHash>, <@aElem>) => logical
@return logical, Verdadeiro \(.T.\) se conseguiu listar todos os elementos ou Falso \(.F.\) caso contrário

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <@aelem>, array, Array para retorno da lista dos elementos do HashMap
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmlist
/*/
binary function hmlist(ohash, aelem)
return


/*/{Protheus.doc} hmnew
Cria um objeto da classe tHashMap.

@type binary function
@sintax HMNew() => object
@return object, Objeto da classe HashMap \(tHashMap\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmnew
/*/
binary function hmnew()
return


/*/{Protheus.doc} hmset
Atualiza o valor correspondente a chave em um objeto da classe tHashMap.

@type binary function
@sintax HMSet(<oHash>, <yKey>, <xVal>) => logical
@return logical, Verdadeiro \(.T.\) se executou corretamente e Falso \(.F\) se houve erro

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <ykey>, variant, Chave de armazenamento do valor
@param <xval>, variant, Valor a ser armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmset
/*/
binary function hmset(ohash, ykey, xval)
return


/*/{Protheus.doc} hmsetn
Atualiza ou cria valor correspondente a chave em um objeto da classe tHashMap.

@type binary function
@sintax HMSetN(<oHash>, <nKey>, <nVal>) => logical
@return logical, Verdadeiro \(.T.\) se executou corretamente e Falso \(.F\) se houve erro

@param <ohash>, object, Objeto da classe HashMap \(tHashMap\)
@param <nkey>, numeric, Chave de armazenamento do valor
@param <nval>, numeric, Valor a ser armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hmsetn
/*/
binary function hmsetn(ohash, nkey, nval)
return


/*/{Protheus.doc} hsmexponent
Retorna o expoente \(exponent\) de uma chave privada no formato big-endian armazenada em um dispositivo HSM.

@type binary function
@sintax HSMExponent(<cKey>, [cPass], [lClient]) => character
@return character, Retorna o expoente de uma chave no formato big-endian; retorna **Nil** caso ocorra um erro no processamento.

@param <ckey>, character, Indica o caminho, no dispositivo HSM, para a chave privada.
@param [cpass], character, Indica a senha da chave, se existente.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmexponent
/*/
binary function hsmexponent(ckey, cpass, lclient)
return


/*/{Protheus.doc} hsmfinalize
Finaliza o uso de dispositivo HSM.

@type binary function
@sintax HSMFinalize([lClient]) => logical
@return logical, Retorna **1** caso consiga finalizar o HSM com sucesso; caso contrário, retorna **0**.

@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmfinalize
/*/
binary function hsmfinalize(lclient)
return


/*/{Protheus.doc} hsmgetcertfile
Extrai um certificado armazenado num dispositivo HSM para um arquivo.

@type binary function
@sintax HSMGetCertFile(<cHSMPath>, <cFile>, [cPass], [lClient]) => logical
@return logical, Retorna **.T.** caso consiga extrair o certificado do HSM; caso contrário, retorna **.F.**.

@param <chsmpath>, character, Indica o caminho no dispositivo HSM para o certificado.
@param <cfile>, character, Indica o caminho de destino do certificado, incluindo o nome do arquivo.
@param [cpass], character, Indica a senha do slot onde está armazenado o certificado apontado por **cHSMPath**.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmgetcertfile
/*/
binary function hsmgetcertfile(chsmpath, cfile, cpass, lclient)
return


/*/{Protheus.doc} hsmgetkeyfile
Extrai uma chave pública armazenada num dispositivo HSM para um arquivo.

@type binary function
@sintax HSMGetKeyFile(<cHSMPath>, <cFile>, [cPass], [lChangeCase], [lClient]) => logical
@return logical, Retorna **.T.** caso consiga extrair a chave pública do HSM; caso contrário, retorna **.F.**.

@param <chsmpath>, character, Indica o caminho no dispositivo HSM para o certificado de cliente.
@param <cfile>, character, Indica o caminho de destino da chave pública, incluindo o nome do arquivo.
@param [cpass], character, Indica a senha do slot onde está armazenado o certificado apontado por **cHSMPath**.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmgetkeyfile
/*/
binary function hsmgetkeyfile(chsmpath, cfile, cpass, lchangecase, lclient)
return


/*/{Protheus.doc} hsminitialize
Inicializa o dispositivo HSM.

@type binary function
@sintax HSMInitialize([cModule], [lClient]) => numeric
@return numeric, Retorna 1 caso consiga inicializar o dispositivo HSM; caso contrário, retorna 0.

@param [cmodule], character, Indica o caminho do módulo do dispositivo HSM que será inicializado.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsminitialize
/*/
binary function hsminitialize(cmodule, lclient)
return


/*/{Protheus.doc} hsmmodulus
Retorna o módulo público \(public modulus\) de uma chave privada no formato big-endian armazenada em um dispositivo HSM.

@type binary function
@sintax HSMModulus(<cKey>, [cPass], [lClient]) => character
@return character, Retorna o módulo público de uma chave no formato big-endian; retorna **Nil** caso ocorra um erro no processamento.

@param <ckey>, character, Indica o caminho, no dispositivo HSM, para a chave privada.
@param [cpass], character, Indica a senha da chave, se existente.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmmodulus
/*/
binary function hsmmodulus(ckey, cpass, lclient)
return


/*/{Protheus.doc} hsmobjlist
Lista os objetos contidos em um slot.

@type binary function
@sintax HSMObjList(<nSlot>, <cPass>, [lClient]) => array
@return array, Retorna um vetor com as informações dos objetos de um slot.

@param <nslot>, numeric, Indica o número do slot de HSM.
@param <cpass>, character, Indica a senha de acesso ao HSM.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmobjlist
/*/
binary function hsmobjlist(nslot, cpass, lclient)
return


/*/{Protheus.doc} hsmprivsign
Assina usando algoritmo digest um determinado conteúdo usando uma chave privada armazenada em dispositivo HSM.

@type binary function
@sintax HSMPrivSign(<cKey>, <cContent>, <nType>, <cPass>, [@cErrStr], [lClient]) => character
@return character, Retorna o valor do parâmetro **cContent**, assinado de acordo com o tipo **nType** e a chave privada informada **cKey**.

@param <ckey>, character, Indica o caminho no dispositivo HSM para a chave privada.
@param <ccontent>, character, Indica o valor que será assinado.
@param <ntype>, numeric, Indica o tipo do algoritmo digest que será utilizado.
@param <cpass>, character, Indica a senha do slot onde está armazenado a chave privada apontada por **cKey**.
@param [@cerrstr], character, Indica a variável para retornar as mensagens de erro.
@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmprivsign
/*/
binary function hsmprivsign(ckey, ccontent, ntype, cpass, cerrstr, lclient)
return


/*/{Protheus.doc} hsmprivvery
Verifica a assinatura digital utilizando o certificado/chave pública armazenada em dispositivo HSM.

@type binary function
@sintax HSMPrivVery(<cKey>, <cContent>, <nType>, <cPass>, [@cErrStr], <cAssinado>, [lClient]) => NIL
@param <ckey>, character, Indica a string que contém o caminho para o certificado no HSM. O caminho tem o o formato  slot_<N>-label_<NOME:ID Certificate>
@param <ccontent>, character, Indica a string que será utilizada na verificação da assinatura digital.
@param <ntype>, numeric, Indica o tipo de algoritmo que será utilizado para realizar a verificação da assinatura digital.
@param <cpass>, character, Indica a senha do slot onde está armazenado a chave privada apontada por **cKey**.
@param [@cerrstr], character, Indica a variável para retornar as mensagens de erro.
@param <cassinado>, character, Indica uma string que contém o valor assinado.
@param [lclient], logical, Indica uma string que contém o valor assinado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmprivvery
/*/
binary function hsmprivvery(ckey, ccontent, ntype, cpass, cerrstr, cassinado, lclient)
return


/*/{Protheus.doc} hsmslotlist
Lista os slots HSM disponíveis.

@type binary function
@sintax HSMSlotList([lClient]) => array
@return array, Retorna um vetor com as informações dos slots.

@param [lclient], logical, Indica se o dispositivo HSM está na máquina do SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hsmslotlist
/*/
binary function hsmslotlist(lclient)
return


/*/{Protheus.doc} httpcget
Permite emular um client HTTP - Hypertext Transfer Protocol diretamente da máquina onde o SmartClient está sendo executado, através de uma função da linguagem AdvPL, acessando um determinado documento HTML, publicado em um servidor Web, utilizando o método GET, permitindo a passagem de parâmetros via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HttpCGet(<cUrl>, [cGetParms], [nTimeOut], [aHeadStr], [@cHeaderGet]) => character
@return character, Retorna a string que corresponde a requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param [cgetparms], character, Indica uma string de parâmetros, do tipo GET, que serão enviados ao servidor HTTP através da URI. Caso não seja especificado, este parâmetro será considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada. Utilizar "\|" \(pipes\) para separação entre parâmetro e valor.
@param [@cheaderget], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpcget
/*/
binary function httpcget(curl, cgetparms, ntimeout, aheadstr, cheaderget)
return


/*/{Protheus.doc} httpcpost


@type binary function
@sintax HttpCPost(<cUrl>, [cPostParms], [nTimeOut], [aHeadStr], [@cHeaderGet]) => character
@return character, Retorna a string que corresponde a requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param [cpostparms], character, Indica uma string de parâmetros, do tipo POST, que serão enviados ao servidor HTTP através da URL. Caso não seja especificado, este parâmetro será considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada. Utilizar "\|" \(pipes\) para separação entre parâmetro e valor.
@param [@cheaderget], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpcpost
/*/
binary function httpcpost(curl, cpostparms, ntimeout, aheadstr, cheaderget)
return


/*/{Protheus.doc} httpget
Permite emular um client HTTP - Hypertext Transfer Protocol, através de uma função da linguagem AdvPL, acessando um determinado documento HTML, publicado em um servidor Web, utilizando o método GET, permitindo a passagem de parâmetros via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HttpGet(<cUrl>, [cGetParms], [nTimeOut], [aHeadStr], [@cHeaderGet]) => character
@return character, Retorna uma string HTML que corresponde ao documento solicitado.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param [cgetparms], character, Indica a lista de strings de parâmetros que serão enviadas ao servidor HTTP, através da URI. Caso este parâmetro não seja especificado, o mesmo será considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso este parâmetro não seja especificado, o valor padrão assumido será de 120 segundos \(2 minutos\).
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas ao header da requisição que será realizada. Utilizar "\|" \(pipes\) para separação entre parâmetro e valor.
@param [@cheaderget], character, Indica o retorno, através de referência, da header de resposta HTTP enviada pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpget
/*/
binary function httpget(curl, cgetparms, ntimeout, aheadstr, cheaderget)
return


/*/{Protheus.doc} httpgetstatus
Retorna o status da conexão HTTP - HyperText Transfer Protocol \(Protocolo de Transferência de Hipertexto\) requisitada.

@type binary function
@sintax HTTPGetStatus(<@cError>, [lClient]) => numeric
@return numeric, Retorna o status da conexão HTTP atual requerida.

@param <@cerror>, character, Indica a descrição do erro HTTP.
@param [lclient], logical, Indica se irá retornar o status da conexão feita pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpgetstatus
/*/
binary function httpgetstatus(cerror, lclient)
return


/*/{Protheus.doc} httppost
Permite emular um client HTTP - Hypertext Transfer Protocol, através de uma função AdvPL, postando um bloco de informações para uma determinada URL em um servidor Web, utilizando o método POST, permitindo a passagem de parâmetros adicionais via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HttpPost(<cUrl>, [cGetParms], [cPostParms], [nTimeOut], [aHeadStr], [@cHeaderGet]) => character
@return character, Retorna a string que corresponde a requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param [cgetparms], character, Indica uma string de parâmetros, do tipo GET, que serão enviados ao servidor HTTP através da URI. Caso não seja especificado,este parâmetro será considerado vazio \(""\).
@param [cpostparms], character, Indica uma string de parâmetros, do tipo POST, que serão enviados ao servidor HTTP através da URL. Caso não seja especificado, este parâmetro será considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada.
@param [@cheaderget], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httppost
/*/
binary function httppost(curl, cgetparms, cpostparms, ntimeout, aheadstr, cheaderget)
return


/*/{Protheus.doc} httpsetpass
Define o usuário e senha para autenticação HTTP.

@type binary function
@sintax HTTPSetPass(<cUser>, <cPass>, [lClient]) => NIL
@param <cuser>, character, Indica o usuário para autenticação HTTP.
@param <cpass>, character, Indica a senha para autenticação HTTP.
@param [lclient], logical, Indica se irá definir na conexão feita pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpsetpass
/*/
binary function httpsetpass(cuser, cpass, lclient)
return


/*/{Protheus.doc} httpsget
Permite emular um Client HTTP - Hypertext Transfer Protocol, utilizando protocolo HTTPS através de uma função AdvPL, postando um bloco de informações para um determinado documento publicado em um servidor Web, utilizando o método GET, permitindo a passagem de parâmetros adicionais via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HTTPSGet(<cURL>, <cCertificate>, <cPrivKey>, <cPassword>, [cGETParms], [nTimeOut], [aHeadStr], [@cHeaderRet], [lClient]) => character
@return character, Retorna a string que corresponde à requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param <ccertificate>, character, Indica o path do arquivo, em formato PEM \(modelo Apache\), do arquivo que contém o certificado digital.
@param <cprivkey>, character, Indica o path da chave privada, em formato PEM \(modelo Apache\), do arquivo que contém a chave privada, referente ao certificado digital.
@param <cpassword>, character, Indica a senha que será utilizada para a abertura da chave privada. Para uma chave privada que não possua senha deve ser informada uma string vazia.
@param [cgetparms], character, Indica uma string de parâmetros, do tipo GET, que serão enviados ao servidor HTTP através da URI. Caso não seja especificado, este parâmetro é considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada.
@param [@cheaderret], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@param [lclient], logical, Indica se o GET será feito pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpsget
/*/
binary function httpsget(curl, ccertificate, cprivkey, cpassword, cgetparms, ntimeout, aheadstr, cheaderret, lclient)
return


/*/{Protheus.doc} httpspost
Permite emular um Client HTTP - Hypertext Transfer Protocol, utilizando protocolo HTTPS através de uma função AdvPL, postando um bloco de informações para um determinado documento publicado em um servidor Web, utilizando o método POST, permitindo a passagem de parâmetros adicionais via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HTTPSPost(<cURL>, <cCertificate>, <cPrivKey>, <cPassword>, [cGETParms], [cPOSTParms], [nTimeOut], [aHeadStr], [@cHeaderRet], [lClient]) => character
@return character, Retorna a string que corresponde à requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param <ccertificate>, character, Indica o path do arquivo, em formato PEM \(modelo Apache\), do arquivo que contém o certificado digital.
@param <cprivkey>, character, Indica o path da chave privada, em formato PEM \(modelo Apache\), do arquivo que contém a chave privada, referente ao certificado digital.
@param <cpassword>, character, Indica a senha que será utilizada para a abertura da chave privada. Para uma chave privada que não possua senha deve ser informada uma string vazia.
@param [cgetparms], character, Indica uma string de parâmetros, do tipo GET, que serão enviados ao servidor HTTP através da URI. Caso não seja especificado, este parâmetro é considerado vazio \(""\).
@param [cpostparms], character, Indica uma string de parâmetros, do tipo POST, que serão enviados ao servidor HTTP através do pacote HTTP. Caso não seja especificado, este parâmetro é considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada.
@param [@cheaderret], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@param [lclient], logical, Indica se o POST será feito pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpspost
/*/
binary function httpspost(curl, ccertificate, cprivkey, cpassword, cgetparms, cpostparms, ntimeout, aheadstr, cheaderret, lclient)
return


/*/{Protheus.doc} httpsquote
Permite emular um Client HTTP \(Hypertext Transfer Protocol\) através de uma função AdvPL, utilizando protocolo HTTPS, no qual o método HTTP é informado para a função, postando um bloco de informações para um determinado documento publicado em um servidor Web, permitindo a passagem de parâmetros adicionais via URL e aguardando por um tempo determinado \(time-out\) pela resposta do servidor solicitado.

@type binary function
@sintax HTTPSQuote(<cURL>, <cCertificate>, <cPrivKey>, <cPassword>, <cMethod>, [cGETParms], [cPOSTParms], [nTimeOut], [aHeadStr], [@cHeaderRet], [lClient]) => character
@return character, Retorna a string que corresponde à requisição solicitada.

@param <curl>, character, Indica o endereço HTTP com a pasta e o documento solicitado.
@param <ccertificate>, character, Indica o path do arquivo, em formato PEM \(modelo Apache\), do arquivo que contém o certificado digital.
@param <cprivkey>, character, Indica o path da chave privada, em formato PEM \(modelo Apache\), do arquivo que contém a chave privada, referente ao certificado digital.
@param <cpassword>, character, Indica a senha que será utilizada para a abertura da chave privada. Para uma chave privada que não possua senha deve ser informada uma string vazia.
@param <cmethod>, character, Define o HTTP Method que será utilizado, permitindo outros além de POST/GET.
@param [cgetparms], character, Indica uma string de parâmetros, do tipo GET, que serão enviados ao servidor HTTP através da URI. Caso não seja especificado, este parâmetro é considerado vazio \(""\).
@param [cpostparms], character, Indica uma string de parâmetros, do tipo POST, que serão enviados ao servidor HTTP através do pacote HTTP. Caso não seja especificado, este parâmetro é considerado vazio \(""\).
@param [ntimeout], numeric, Indica o tempo, em segundos, máximo de inatividade permitido durante a recepção do documento. Caso não seja especificado, o valor assumido será de 120 segundos.
@param [aheadstr], array, Indica o array que contêm as strings que serão acrescentadas no header da requisição HTTP que será realizada.
@param [@cheaderret], character, Indica a string que conterá o header de resposta HTTP enviado pelo servidor requisitado. Observação: A variável deve ser declarada antes da chamada da função.
@param [lclient], logical, Indica se a operação será feita pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpsquote
/*/
binary function httpsquote(curl, ccertificate, cprivkey, cpassword, cmethod, cgetparms, cpostparms, ntimeout, aheadstr, cheaderret, lclient)
return


/*/{Protheus.doc} httpsslclient
Define em memória as configurações para conexão SSL.

@type binary function
@sintax HTTPSSLClient(<nSSL2>, <nSSL3>, <nTLS1>, <cPassword>, <cCertPath>, <cKeyPath>, [nHSM], [lClient], [nVerbose], [nBugs], [nState], [cCACertPath]) => NIL
@param <nssl2>, numeric, Habilita/Desabilita SSL2.
@param <nssl3>, numeric, Habilita/Desabilita SSL3.
@param <ntls1>, numeric, Habilita/Desabilita TLS1.
@param <cpassword>, character, Senha para a chave privada e/ou certificado.
@param <ccertpath>, character, Indica o caminho do certificado de cliente.
@param <ckeypath>, character, Indica o caminho da chave privada de cliente.
@param [nhsm], numeric, Define se utiliza HSM.
@param [lclient], logical, Indica se a definição será para conexão pelo SmartClient.
@param [nverbose], numeric, Habilita/Desabilita Verbose.
@param [nbugs], numeric, Habilita/Desabilita Bugs.
@param [nstate], numeric, Habilita/Desabilita State.
@param [ccacertpath], character, Indica o caminho do certificado de CA.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/httpsslclient
/*/
binary function httpsslclient(nssl2, nssl3, ntls1, cpassword, ccertpath, ckeypath, nhsm, lclient, nverbose, nbugs, nstate, ccacertpath)
return


/*/{Protheus.doc} i2bin
Converte um número inteiro em uma string formatada como um inteiro de 16 bits.

@type binary function
@sintax I2Bin(<nInt>) => character
@return character, Retorna uma string de dois bytes que contém um inteiro binário de 16 bits.

@param <nint>, numeric, Indica o valor numérico inteiro que será convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/i2bin
/*/
binary function i2bin(nint)
return


/*/{Protheus.doc} int
Retorna um valor numérico inteiro, a partir de um valor numérico com parte inteira e decimal informado como parâmetro, desconsiderando todos os dígitos à direta do ponto decimal.

@type binary function
@sintax Int(<nValue>) => numeric
@return numeric, Retorna a parte inteira do número informado como parâmetro.

@param <nvalue>, numeric, Indica o valor numérico a ser utilizado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/int
/*/
binary function int(nvalue)
return


/*/{Protheus.doc} ipccount
Obtém e retorna todas as threads livres que estão no ar de um determinado ambiente.

@type binary function
@sintax IPCCount(<cSemaforo>) => numeric
@return numeric, Retorna um número inteiro indicando o total de threads livres.

@param <csemaforo>, character, Indica o local ou semáforo em que as threads foram iniciadas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ipccount
/*/
binary function ipccount(csemaforo)
return


/*/{Protheus.doc} ipcgo
Envia uma chamada para uma thread, que não precisa ser necessariamente do mesmo ambiente, que está em espera.

@type binary function
@sintax IPCGo(<cSemaforo>) => Nil
@return Nil, Nulo

@param <csemaforo>, character, Indica o local ou semáforo em que as threads foram iniciadas. Observação: O semáforo especificado não deve conter letras minúsculas. Todas as letras informadas no semáforo devem ser maiúsculas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ipcgo
/*/
binary function ipcgo(csemaforo)
return


/*/{Protheus.doc} ipcwait
Coloca em modo de espera uma thread que foi carregada e aguarda uma chamada da função IPCGo\(\).

@type binary function
@sintax IPCWait(<nTimeOut>) => logical
@return logical, Retorna verdadeiro \(.T.\), se receber uma chamada da função IPCGo\(\); caso contrário, falso \(.F.\), se não receber chamada ou sair por time-out.

@param <ntimeout>, numeric, Indica o tempo de time-out em milisegundos para a thread sair do ar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ipcwait
/*/
binary function ipcwait(ntimeout)
return


/*/{Protheus.doc} ipcwaitex
Coloca em modo de espera a thread em execução, criando um semáforo nomeado, e aguarda por um determinado período pela liberação desse semáforo. A liberação do semáforo pode ocorrer por time-out, ou através da chamada da função IPCGo\(\) por outro processo, utilizando como parâmetro o nome do semáforo nomeado criado pela IPCWaitEx\(\). Além disso, a liberação semáforo pela função IPCGo\(\) pode enviar parâmetros adicionais, recuperados pela função IPCWaitEx\(\).

@type binary function
@sintax IPCWaitEx(<cSemaforo>, <nTimeOut>) => logical
@return logical, Retorna verdadeiro \(.T.\), se receber uma chamada da função IPCGo\(\); caso contrário, falso \(.F.\), se não receber chamada ou sair por time-out.

@param <csemaforo>, character, Indica o nome do semáforo que estamos trabalhando. Observação: O nome do semáforo não pode conter letras minúsculas. Todas as letras devem ser maiúsculas.
@param <ntimeout>, numeric, Indica o tempo de time-out em milisegundos para a thread sair do ar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ipcwaitex
/*/
binary function ipcwaitex(csemaforo, ntimeout)
return


/*/{Protheus.doc} is8859encode
descrição da funcao

@type binary function
@sintax Is8859Encode([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/is8859encode
/*/
binary function is8859encode(tnomevar)
return


/*/{Protheus.doc} isalpha
Determina se o caractere à esquerda de uma string é alfabético.

@type binary function
@sintax IsAlpha(<cString>) => logical
@return logical, Retorna verdadeiro \(.T.\) se o primeiro caractere da string for uma letra do alfabeto ou retorna falso \(.F.\) se a string começar com um dígito ou qualquer outro caractere.

@param <cstring>, character, Indica a string que será analisada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isalpha
/*/
binary function isalpha(cstring)
return


/*/{Protheus.doc} isbuildtrunk
descrição da funcao

@type binary function
@sintax IsBuildTrunk([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isbuildtrunk
/*/
binary function isbuildtrunk(tnomevar)
return


/*/{Protheus.doc} isdigit
Determina se o caractere mais à esquerda de uma string é um dígito.

@type binary function
@sintax IsDigit(<cString>) => logical
@return logical, Retorna verdadeiro \(.T.\) se o primeiro caractere da string for um dígito entre 0 e 9 ou retorna falso \(.F.\) caso não seja.

@param <cstring>, character, Indica a string que será analisada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isdigit
/*/
binary function isdigit(cstring)
return


/*/{Protheus.doc} islower
Determina se o caractere mais à esquerda de uma string é uma letra minúscula.

@type binary function
@sintax IsLower(<cString>) => logical
@return logical, Retorna verdadeiro \(.T.\) se o primeiro caractere da string for uma letra minúscula ou retorna falso \(.F.\) caso contrário.

@param <cstring>, character, Indica a string que será avaliada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/islower
/*/
binary function islower(cstring)
return


/*/{Protheus.doc} isplugin
Retorna se o Smart Client está sendo executado em um plug-in ActiveX.

@type binary function
@sintax IsPlugin() => logical
@return logical, Retorna verdadeiro \(.T.\), se o Smart Client estiver sendo executado em um plug-in ActiveX; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isplugin
/*/
binary function isplugin()
return


/*/{Protheus.doc} isprinter2
Indica o status de uma determinada porta de impressão.

@type binary function
@sintax IsPrinter2(<cString>, [lValue], [lValue]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a porta de impressão estiver OK; caso contrário, falso \(.F.\).

@param <cstring>, character, Indica a porta de impressão.
@param [lvalue], logical, Não utilizado. Parâmetro de compatibilidade.
@param [lvalue], numeric, Indica o direcionamento de impressão. Sendo: 1= PRT_CLIENT \(Smart Client\) E 2=PRT_SERVER \(Application Server\). Caso não seja informado, o valor padrão é PRT_CLIENT.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isprinter2
/*/
binary function isprinter2(cstring, lvalue, lvalue)
return


/*/{Protheus.doc} isrmt64
Retorna se o binário TOTVS \| SmartClient rodando na estação é de arquitetura 64-bit ou não.

@type binary function
@sintax IsRmt64() => logical
@return logical, Retorna verdadeiro \(.T.\) se o binário SmartClient é de arquitetura 64-bit, caso contrário retornará falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isrmt64
/*/
binary function isrmt64()
return


/*/{Protheus.doc} issecure
Retorna um valor booleano informando se a conexão é ou não segura.

@type binary function
@sintax IsSecure() => logical
@return logical, Retorna verdadeiro \(.T.\), se a conexão for segura \(SSL - Secure Sockets Layer\); caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/issecure
/*/
binary function issecure()
return


/*/{Protheus.doc} issrv64
Verifica se o Application Server está sendo executado em ambiente 64 bit,

@type binary function
@sintax isSrv64() => logical
@return logical, Retorna verdadeiro \(.T.\) se o Application Server estiver sendo executado em ambiente 64 bit. Caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/issrv64
/*/
binary function issrv64()
return


/*/{Protheus.doc} issrvbige
Verifica se o tipo de envio de dados do servidor é Big Endian

@type binary function
@sintax IsSrvBigE() => logical
@return logical, Retorna verdadeiro \(.T.\) caso o tipo de envio de dados do servidor seja Big Endian, do contrário retorna falso \(.F.\)

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/issrvbige
/*/
binary function issrvbige()
return


/*/{Protheus.doc} issrvunix
Informa se o Application Server está sendo executado em ambiente Unix, Linux ou Microsoft Windows.

@type binary function
@sintax IsSrvUnix() => logical
@return logical, Retorna verdadeiro \(.T.\), se o Application Server estiver sendo executado em Unix ou Linux; caso contrário, retornará falso \(.F.\), se estiver sendo executado em ambiente Microsoft Windows.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/issrvunix
/*/
binary function issrvunix()
return


/*/{Protheus.doc} isupper
Determina se o caractere mais à esquerda de uma string é uma letra maiúscula.

@type binary function
@sintax IsUpper(<cString>) => logical
@return logical, Retorna verdadeiro \(.T.\) se o primeiro caractere da string for uma letra maiúscula ou caso contrário, retorna falso \(.F.\).

@param <cstring>, character, Indica a string que será avaliada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isupper
/*/
binary function isupper(cstring)
return


/*/{Protheus.doc} jobinfo
Retorna informações sobre os Jobs atualmente executados.

@type binary function
@sintax JobInfo() => array
@return array, Array com n \(Quantidade de Jobs\) elementos sendo cada Array um outro array com 7 elementos descrevendo cada Job: JobName \(Caracter\) -> Nome do processo \(job\) Environment \(Caracter\) -> Nome do ambiente que está executando o processo Total \(Numérico\) -> Número total de instâncias \(threads\) que o processo está executando Starting \(Numérico\) -> Número de instâncias em processo de inicialização Started \(Numérico\) -> Número de instâncias iniciadas. Running \(Numérico\) -> Número de instâncias em execução Finishing \(Numérico\) -> Número de instâncias sendo finalizadas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/jobinfo
/*/
binary function jobinfo()
return


/*/{Protheus.doc} jpgtobmp
descrição da funcao

@type binary function
@sintax JpgToBmp([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/jpgtobmp
/*/
binary function jpgtobmp(tnomevar)
return


/*/{Protheus.doc} killapp
Caso a função seja chamada sem parâmetros ou com valor falso \(.F.\) retornará se a thread recebeu uma chamada para ser finalizada. Caso seja chamada com valor verdadeiro \(.T.\) irá finalizar a thread onde a função foi chamada.

@type binary function
@sintax KillApp([lKill]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a thread corrente recebeu uma chamada para ser finalizada, caso contrário retorna falso \(.F.\).

@param [lkill], logical, Caso verdadeiro finaliza a thread, caso falso apenas retorna se a thread recebeu uma chamada de finalização.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/killapp
/*/
binary function killapp(lkill)
return


/*/{Protheus.doc} killuser
Finaliza a conexão de um usuário do Smart Client.

@type binary function
@sintax KillUser() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/killuser
/*/
binary function killuser()
return


/*/{Protheus.doc} l2bin
Converte um número inteiro em uma string formatada como um inteiro de 32 bits.

@type binary function
@sintax L2Bin(<nInt>) => character
@return character, Retorna uma string de quatro bytes que contém um inteiro binário de 32 bits.

@param <nint>, numeric, Indica o valor numérico inteiro que será convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/l2bin
/*/
binary function l2bin(nint)
return


/*/{Protheus.doc} land
Realiza a operação lógica **E** entre 2 ou mais números.

@type binary function
@sintax LAnd(<nNum1>, <nNum2>, [nNum3], [nNum4], [nNum5], [nNum6], [nNum7], [nNum8], [nNum9], [nNum10], [nNum11], [nNum12], [nNum13], [nNum14]) => numeric
@return numeric, Retorna o valor do E lógico entre todos os parâmetros passados, sendo "**0**" como "**.F.**" e "**1**" como "**.T.**".

@param <nnum1>, numeric, 1º número a ser utlizado na operação de E lógico.
@param <nnum2>, numeric, 2º número a ser utlizado na operação de E lógico.
@param [nnum3], numeric, 3º número a ser utlizado na operação de E lógico.
@param [nnum4], numeric, 4º número a ser utlizado na operação de E lógico.
@param [nnum5], numeric, 5º número a ser utlizado na operação de E lógico.
@param [nnum6], numeric, 6º número a ser utlizado na operação de E lógico.
@param [nnum7], numeric, 7º número a ser utlizado na operação de E lógico.
@param [nnum8], numeric, 8º número a ser utlizado na operação de E lógico.
@param [nnum9], numeric, 9º número a ser utlizado na operação de E lógico.
@param [nnum10], numeric, 10º número a ser utlizado na operação de E lógico.
@param [nnum11], numeric, 11º número a ser utlizado na operação de E lógico.
@param [nnum12], numeric, 12º número a ser utlizado na operação de E lógico.
@param [nnum13], numeric, 13º número a ser utlizado na operação de E lógico.
@param [nnum14], numeric, 14º número a ser utlizado na operação de E lógico.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/land
/*/
binary function land(nnum1, nnum2, nnum3, nnum4, nnum5, nnum6, nnum7, nnum8, nnum9, nnum10, nnum11, nnum12, nnum13, nnum14)
return


/*/{Protheus.doc} lastrec
Retorna o número do último registro inserido na tabela atual.

@type binary function
@sintax LastRec() => numeric
@return numeric, Retorna o número do último registro inserido na tabela atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/lastrec
/*/
binary function lastrec()
return


/*/{Protheus.doc} listdrives
Retorna as unidades \(drives\), e/ou seus respectivos tipos, da máquina que está executando o TOTVS \| Application Server ou o TOTVS \| SmartClient.

@type binary function
@sintax ListDrives([@aUnits], [@aTypes], <nWhere>) => logical
@return logical, Retorna **.T.** se conseguiu listar o que foi solicitado; caso contrário, retorna **.F.**.

@param [@aunits], array, Retorna todas as unidades da máquina.
@param [@atypes], array, Retorna o tipo das unidades listadas.
@param <nwhere>, numeric, Indica se será listado da máquina do TOTVS \| Application Server ou do TOTVS \| SmartClient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/listdrives
/*/
binary function listdrives(aunits, atypes, nwhere)
return


/*/{Protheus.doc} localtoutc
Converte a data e hora local para UTC - Coordinated Universal Time.

@type binary function
@sintax LocalToUTC(<cDate>, <cTime>, [nDST]) => array
@return array, Retorna um array contendo a data \(yyyyMMdd\) e a hora \(hh:mm:ss\) no formato UTC.

@param <cdate>, date, Indica a data local no formato ano, mês e dia. Exemplo: yyyyMMdd.
@param <ctime>, date, Indica a hora local no formato hora, minuto e segundo. Exemplo: hh:mm:ss.
@param [ndst], numeric, Indica se a hora informada representa um horário solar \(0\) ou horário de verão \(1\). Caso não especificado, será considerado 0 \(standard time, ou horário solar\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/localtoutc
/*/
binary function localtoutc(cdate, ctime, ndst)
return


/*/{Protheus.doc} log
Calcula o logaritmo natural de um valor numérico.

@type binary function
@sintax Log(<nValue>) => numeric
@return numeric, Retorna o valor numérico do logaritmo natural.

@param <nvalue>, numeric, Indica o valor cujo logaritmo é calculado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/log
/*/
binary function log(nvalue)
return


/*/{Protheus.doc} log10
Calcula o logaritmo de um valor numérico.

@type binary function
@sintax Log10(<nValue>) => numeric
@return numeric, Retorna o valor numérico do logaritmo de **nValue**.

@param <nvalue>, numeric, Indica o valor cujo logaritmo é calculado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/log10
/*/
binary function log10(nvalue)
return


/*/{Protheus.doc} logmsg
Registra uma mensagem de log com as informações do sistema no formato SysLog \(RFC 5424\), e automaticamente insere informações como: data e hora da geração da mensagem, hostname e id da thread. O Log é expedido para o servidor de log \(LogServer\) de forma assíncrona, não gerando contenção no servidor de aplicação, podendo ser usado como trace sem grande prejuízo para a execução.

@type binary function
@sintax LogMsg(<cFunc>) => NIL
@param <cfunc>, character, Nome da função/aplicação onde o log está sendo gerado
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/logmsg
/*/
binary function logmsg(cfunc)
return


/*/{Protheus.doc} logusername
Obtém o nome do usuário logado no sistema operacional da estação em que está sendo executado o Smart Client.

@type binary function
@sintax LogUserName() => character
@return character, Retorna uma string que corresponde ao login de sistema do usuário.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/logusername
/*/
binary function logusername()
return


/*/{Protheus.doc} look4bit
Retorna a quantidade de bits com nível lógico igual a 1 em uma string.

@type binary function
@sintax Look4Bit(<cStr>, <nStart>, <nTest>, <nLength>) => numeric
@return numeric, Retorna a quantidade de bits 1 na string apontada por **cStr**.

@param <cstr>, character, Indica a string que será verificada.
@param <nstart>, numeric, Indica o índice do bit inicial.
@param <ntest>, numeric, Indica a quantidade de bits que serão verificados.
@param <nlength>, numeric, Indica o índice do último byte que será testado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/look4bit
/*/
binary function look4bit(cstr, nstart, ntest, nlength)
return


/*/{Protheus.doc} lor
Realiza a operação lógica **OU** entre 2 ou mais números.

@type binary function
@sintax LOr(<nNum1>, <nNum2>, [nNum3], [nNum4], [nNum5], [nNum6], [nNum7], [nNum8], [nNum9], [nNum10], [nNum11], [nNum12], [nNum13], [nNum14]) => numeric
@return numeric, Retorna o valor do OU lógico entre todos os parâmetros passados, sendo "**0**" como "**.F.**" e "**1**" como "**.T.**".

@param <nnum1>, numeric, 1º número a ser utlizado na operação de OU lógico.
@param <nnum2>, numeric, 2º número a ser utlizado na operação de OU lógico.
@param [nnum3], numeric, 3º número a ser utlizado na operação de OU lógico.
@param [nnum4], numeric, 4º número a ser utlizado na operação de OU lógico.
@param [nnum5], numeric, 5º número a ser utlizado na operação de OU lógico.
@param [nnum6], numeric, 6º número a ser utlizado na operação de OU lógico.
@param [nnum7], numeric, 7º número a ser utlizado na operação de OU lógico.
@param [nnum8], numeric, 8º número a ser utlizado na operação de OU lógico.
@param [nnum9], numeric, 9º número a ser utlizado na operação de OU lógico.
@param [nnum10], numeric, 10º número a ser utlizado na operação de OU lógico.
@param [nnum11], numeric, 11º número a ser utlizado na operação de OU lógico.
@param [nnum12], numeric, 12º número a ser utlizado na operação de OU lógico.
@param [nnum13], numeric, 13º número a ser utlizado na operação de OU lógico.
@param [nnum14], numeric, 14º número a ser utlizado na operação de OU lógico.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/lor
/*/
binary function lor(nnum1, nnum2, nnum3, nnum4, nnum5, nnum6, nnum7, nnum8, nnum9, nnum10, nnum11, nnum12, nnum13, nnum14)
return


/*/{Protheus.doc} makedir
Cria um diretório.

@type binary function
@sintax MakeDir(<cPath>, [uParam2], [lChangeCase]) => numeric
@return numeric, Retorna zero \(0\), se o diretório for criado com sucesso; caso contrário, retorna diferente de zero.

@param <cpath>, character, Indica o nome do diretório que será criado.
@param [uparam2], numeric, Compatibility parameter. Pass NIL.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso seja falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/makedir
/*/
binary function makedir(cpath, uparam2, lchangecase)
return


/*/{Protheus.doc} match
Valida se uma string está formatada conforme um determinado padrão.

@type binary function
@sintax Match(<cValue>, <cMask>) => logical
@return logical, Retorna **.T.** caso **cValue** seja validado pelo padrão indicado em **cMask**; caso contrário, retornará **.F.**.

@param <cvalue>, character, Indica o valor que será validado contra um padrão.
@param <cmask>, character, Indica a máscara com o padrão para validar **cValue**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/match
/*/
binary function match(cvalue, cmask)
return


/*/{Protheus.doc} mathc
Realiza operações matemáticas \(Soma, Subtração, Divisão, Multiplicação e Exponenciação\) com strings que contém um valor numérico.

@type binary function
@sintax MathC(<cNum1>, <cOperacao>, <cNum2>) => character
@return character, Retorna uma nova string com o resultado da operação matemática. Observação: O resultado terá até 18 casas de precisão.

@param <cnum1>, character, Realiza operações matemáticas \(Soma, Subtração, Divisão, Multiplicação e Exponenciação\) com strings que contém um valor numérico.
@param <coperacao>, character, Indica o operador/caracter \(/, +, \*, -, e\) da operação que será realizada.
@param <cnum2>, character, Indica a string que contém um valor numérico, representando o número no qual desejamos realizar uma operação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mathc
/*/
binary function mathc(cnum1, coperacao, cnum2)
return


/*/{Protheus.doc} max
Retorna o maior entre dois valores numéricos ou data.

@type binary function
@sintax Max(<xExp1>, <xExp2>) => variant
@return variant, Retorna o maior dos dois parâmetros. O valor retornado é do mesmo tipo de dado que os parâmetros.

@param <xexp1>, variant, Indica o valor que será comparado com o segundo parâmetro.
@param <xexp2>, variant, Indica a segunda expressão que será utilizada para comparação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/max
/*/
binary function max(xexp1, xexp2)
return


/*/{Protheus.doc} md5
Aplica a um conteúdo o algoritmo MD5 \(MessageDigest Algorithm 5\).

@type binary function
@sintax MD5(<cValor>, [nType]) => character
@return character, Retorna o hash do conteúdo.

@param <cvalor>, character, Indica o conteúdo no qual será aplicado o algoritmo.
@param [ntype], numeric, Indica se o hash retornado será binário \(1=RAW_DIGEST\) ou hexadecimal \(2=HEX_DIGEST\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/md5
/*/
binary function md5(cvalor, ntype)
return


/*/{Protheus.doc} md5file
Lê o conteúdo do arquivo especificado e, a partir deste arquivo, gera uma chave hash utilizando MD5 - Message Digest Algorithm 5.

@type binary function
@sintax MD5File(<cFile>, [nTipo], [nWhere]) => character
@return character, Retorna o hash MD5 do arquivo informado. Em caso de falha na abertura do arquivo, o retorno será uma string vazia \( '' \).

@param <cfile>, character, Indica o nome do arquivo a ser considerado para a geração do hash MD5.
@param [ntipo], numeric, Indica se o hash retornado será binário \(1=RAW_DIGEST\) ou hexadecimal \(2=HEX_DIGEST\).
@param [nwhere], numeric, Indica o local onde será realizada a procura do arquivo. Sendo: 0=O acesso depende do path \(Quando for um path relativo a procura será no TOTVS Application Server; caso seja um path absoluto, a procura será no TOTVS Smart Client\). 1 = A procura será realizada no diretório de instalação do TOTVS Application Server. 2 = A procura será realizada no diretório de instalação do TOTVS Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/md5file
/*/
binary function md5file(cfile, ntipo, nwhere)
return


/*/{Protheus.doc} memglbsize
Retorna a quantidade de memória, em bytes, sendo consumida pela lista de variáveis globais na memória.

@type binary function
@sintax MemGlbSize(<cGlbName>) => numeric
@return numeric, Retorna o número de bytes consumido por todas as variáveis globais na memória da instância atual do servidor de aplicação.

@param <cglbname>, character, Identificador da variável global.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/memglbsize
/*/
binary function memglbsize(cglbname)
return


/*/{Protheus.doc} memoline
Retorna o conteúdo de um campo, do tipo memo ou string com múltiplas linhas.

@type binary function
@sintax MemoLine(<cText>, [nLineLength], [nLineNumber], [nTabSize], [lWrapWord]) => character
@return character, Retorna o conteúdo desejado do texto.

@param <ctext>, character, Indica o texto com múltiplas linhas para filtro.
@param [nlinelength], numeric, Indica o tamanho máximo que será retornado da linha.
@param [nlinenumber], numeric, Indica o número da linha que será retornada.
@param [ntabsize], numeric, Indica o tamanho da tabulação que será usada
@param [lwrapword], logical, Indica se apenas palavras inteiras devem ser consideradas no tamanho do retorno
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/memoline
/*/
binary function memoline(ctext, nlinelength, nlinenumber, ntabsize, lwrapword)
return


/*/{Protheus.doc} memoread
Retorna o conteúdo de um arquivo do tipo texto.

@type binary function
@sintax MemoRead(<cFile>, [lChangeCase]) => logical
@return logical, Retorna o conteúdo do arquivo texto, ou uma string vazia \(""\) em caso de erro.

@param <cfile>, character, Indica o caminho do arquivo que será lido do tipo texto.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/memoread
/*/
binary function memoread(cfile, lchangecase)
return


/*/{Protheus.doc} memotran
descrição da funcao

@type binary function
@sintax MemoTran([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/memotran
/*/
binary function memotran(tnomevar)
return


/*/{Protheus.doc} memowrite
Permite escrever e salvar um arquivo texto.

@type binary function
@sintax MemoWrite(<cFile>, <cText>) => logical
@return logical, Retorna **.T.** se conseguiu criar o arquivo; caso contrário, retorna **.F.**.

@param <cfile>, character, Indica o caminho do arquivo que será criado do tipo texto. O tamanho máximo do caminho é de 256 bytes.
@param <ctext>, character, Indica o texto que será inserido no arquivo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/memowrite
/*/
binary function memowrite(cfile, ctext)
return


/*/{Protheus.doc} nome
descrição da funcao

@type binary function
@sintax nome([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nome
/*/
binary function nome(tnomevar)
return


/*/{Protheus.doc} methlsmemberof
Indica se o método informado através de uma string por parâmetro existe na classe

@type binary function
@sintax MethlsMemberOf(<oObj>, <cMethName>, [lRecursive]) => logical
@return logical, Retorna verdadeiro \(.T.\), se o método for encontrado; caso contrário, falso \(.F.\).

@param <oobj>, object, Indica o objeto que representa a instância da classe a ser pesquisada.
@param <cmethname>, character, Indica o nome do método declarado na classe a ser pesquisado.
@param [lrecursive], logical, \*Informa se a busca pelo método deve ser realizado nas classes pai, no caso de instância de classe com herança. \(Default = .F.\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/methlsmemberof
/*/
binary function methlsmemberof(oobj, cmethname, lrecursive)
return


/*/{Protheus.doc} metricsname
Retorna um Objeto no formato Json com os nomes de todas as métricas disponíveis para coleta e a versão da api quando solicitado.

@type binary function
@sintax MetricsName([WithVersion]) => character
@return character, Retorna um objeto json com os nomes de todas as métricas disponíveis para coleta.

@param [withversion], logical, Quando informado com valor verdadeiro, insere a versão da api na propriedade version.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/metricsname
/*/
binary function metricsname(withversion)
return


/*/{Protheus.doc} metricsread
Retorna um objeto Json com as métricas coletadas pelo sistema.

@type binary function
@sintax MetricsRead([Metric_Name]) => character
@return character, Retorna uma string, no formato json, com as métricas coletadas.

@param [metric_name], array, Quando informado, filtra objeto de saída inserindo apenas as métricas que contem os nomes informados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/metricsread
/*/
binary function metricsread(metric_name)
return


/*/{Protheus.doc} min
Retorna o menor entre dois valores numéricos ou data.

@type binary function
@sintax Min(<xExp1>, <xExp2>) => variant
@return variant, Retorna o menor dos dois parâmetros. O valor retornado é do mesmo tipo de dado que os parâmetros.

@param <xexp1>, variant, Indica o valor que será comparado com o segundo parâmetro.
@param <xexp2>, variant, Indica a segunda expressão que será utilizada para comparação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/min
/*/
binary function min(xexp1, xexp2)
return


/*/{Protheus.doc} mlcount
Conta a quantidade de linhas de um campo memo ou string com múltiplas linhas, considerando um numero máximo de letras por linha, tamanho estimado para caracteres de tabulação, e quebras de linhas CRLF \(pulo de linha\) dentro do texto.

@type binary function
@sintax MLCount(<cText>, [nLinLen], [nTabSize], [lQuebra]) => numeric
@return numeric, Retorna o número de linhas da string considerando os parâmetros de formatação informados.

@param <ctext>, character, Indica o texto com múltiplas linhas para verificar a quantidade de linhas.
@param [nlinlen], numeric, Especifica o número de caracteres por linha para que ocorra a quebra de linhas. \(Default: 79\)
@param [ntabsize], numeric, Define um tamanho para tabulação. \(Default: 4\)
@param [lquebra], logical, Especifica o comportamento de contagem de linhas quando a ultima palavra não cabe inteira na linha atual. .T. - Coloca a palavra na próxima linha \(Default\) .F. - Quebra a palavra no tamanho da linha e coloca o restante na próxima linha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mlcount
/*/
binary function mlcount(ctext, nlinlen, ntabsize, lquebra)
return


/*/{Protheus.doc} mod
Retorna um número que representa o resto da divisão do primeiro parâmetro \(nDividend\) pelo segundo \(nDivisor\). O operador módulo \(%\) do AdvPL têm a mesma funcionalidade da função Mod.

@type binary function
@sintax Mod(<nDividend>, <nDivisor>) => numeric
@return numeric, Retorna um número que representa o resto de <**nDividend**> dividido por <**nDivisor**>.

@param <ndividend>, numeric, Indica o dividendo da operação de divisão.
@param <ndivisor>, numeric, Indica o divisor da operação de divisão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mod
/*/
binary function mod(ndividend, ndivisor)
return


/*/{Protheus.doc} mscompress
Compacta um ou vários arquivos em um único arquivo no formato Microsiga Zip \(extensão .mzp\).

@type binary function
@sintax MsCompress(<xFile>, [cDest], [cPass], [lChangeCase]) => character
@return character, Em caso de sucesso, retorna uma string com o nome do arquivo gerado; caso contrário, retornará uma string em branco \(""\).

@param <xfile>, variant, Indica o arquivo ou lista de arquivos que serão compactados. Os tipos de dados válidos para este parâmetro são: Caracter, para especificar um único arquivo, ou Array de caracteres, para especificar um ou mais arquivos.
@param [cdest], character, Indica o caminho do arquivo de destino.
@param [cpass], character, Indica a senha que será utilizada para criptografar o arquivo compactado.
@param [lchangecase], logical, Indica se colocará o nome dos arquivos em letra minúscula.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mscompress
/*/
binary function mscompress(xfile, cdest, cpass, lchangecase)
return


/*/{Protheus.doc} mscrc32
Calcula um CRC - Cyclic Redundancy Code \(Código de Redundância Cíclica\) de uma string e retorna um número/resultado.

@type binary function
@sintax MsCRC32(<cString>) => numeric
@return numeric, Retorna um número inteiro, com até 10 dígitos, que corresponde ao CRC da string informada no parâmetro cString.

@param <cstring>, character, Indica a string da qual será calculado um CRC32. Observação: É garantido que, para a mesma string, sempre se obtenha um mesmo número, porém, não é garantido que para strings diferentes, os números sejam sempre diferentes.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mscrc32
/*/
binary function mscrc32(cstring)
return


/*/{Protheus.doc} mscrc32str
Calcula um CRC - Calcula um CRC - Cyclic Redundancy Code \(Código de Redundância Cíclica\) de uma string e retorna uma string com o resultado.

@type binary function
@sintax MsCRC32Str(<cString>) => character
@return character, Retorna uma string com o CRC da string informada no parâmetro cString.

@param <cstring>, character, Indica a string da qual será calculado um CRC32.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mscrc32str
/*/
binary function mscrc32str(cstring)
return


/*/{Protheus.doc} msdecomp
Descompacta um arquivo compactado, no formato Microsiga Zip \(extensão .mzp\), no diretório informado.

@type binary function
@sintax MsDecomp(<xFile>, [cDest], [cPass]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a descompactação for realizada com sucesso; caso contrário, falso \(.F.\).

@param <xfile>, variant, Indica o nome do arquivo, no formato MZP \(Microsiga Zip\), que será descompactado.
@param [cdest], character, Indica o endereço de destino onde será gravado o arquivo descompactado. Observação: Pode-se informar o caminho do servidor ou o diretório local.
@param [cpass], character, Indica a senha para descompactar o arquivo, caso tenha sido compactado com senha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msdecomp
/*/
binary function msdecomp(xfile, cdest, cpass)
return


/*/{Protheus.doc} msparse
descrição da funcao

@type binary function
@sintax msparse([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msparse
/*/
binary function msparse(tnomevar)
return


/*/{Protheus.doc} msparsererror
descrição da funcao

@type binary function
@sintax MSParserError([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msparsererror
/*/
binary function msparsererror(tnomevar)
return


/*/{Protheus.doc} msparsefull
descrição da funcao

@type binary function
@sintax msparsefull([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msparsefull
/*/
binary function msparsefull(tnomevar)
return


/*/{Protheus.doc} nand
Realiza a operação binária **E** entre 2 ou mais números.

@type binary function
@sintax NAnd(<nNum1>, <nNum2>, [nNum3], [nNum4], [nNum5], [nNum6], [nNum7], [nNum8], [nNum9], [nNum10], [nNum11], [nNum12], [nNum13], [nNum14]) => numeric
@return numeric, Retorna o valor do E binário entre todos os parâmetros passados.

@param <nnum1>, numeric, 1º número a ser utilizado na operação de E binário.
@param <nnum2>, numeric, 2º número a ser utilizado na operação de E binário.
@param [nnum3], numeric, 3º número a ser utilizado na operação de E binário.
@param [nnum4], numeric, 4º número a ser utilizado na operação de E binário.
@param [nnum5], numeric, 5º número a ser utilizado na operação de E binário.
@param [nnum6], numeric, 6º número a ser utilizado na operação de E binário.
@param [nnum7], numeric, 7º número a ser utilizado na operação de E binário.
@param [nnum8], numeric, 8º número a ser utilizado na operação de E binário.
@param [nnum9], numeric, 9º número a ser utilizado na operação de E binário.
@param [nnum10], numeric, 10º número a ser utilizado na operação de E binário.
@param [nnum11], numeric, 11º número a ser utilizado na operação de E binário.
@param [nnum12], numeric, 12º número a ser utilizado na operação de E binário.
@param [nnum13], numeric, 13º número a ser utilizado na operação de E binário.
@param [nnum14], numeric, 14º número a ser utilizado na operação de E binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nand
/*/
binary function nand(nnum1, nnum2, nnum3, nnum4, nnum5, nnum6, nnum7, nnum8, nnum9, nnum10, nnum11, nnum12, nnum13, nnum14)
return


/*/{Protheus.doc} newclassintf
descrição da funcao

@type binary function
@sintax NewClassIntf([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/newclassintf
/*/
binary function newclassintf(tnomevar)
return


/*/{Protheus.doc} newclassmethod
descrição da funcao

@type binary function
@sintax NewClassMethod([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/newclassmethod
/*/
binary function newclassmethod(tnomevar)
return


/*/{Protheus.doc} nor
Realiza a operação binária **OU** entre 2 ou mais números.

@type binary function
@sintax NOr(<nNum1>, <nNum2>, [nNum3], [nNum4], [nNum5], [nNum6], [nNum7], [nNum8], [nNum9], [nNum10], [nNum11], [nNum12], [nNum13], [nNum14]) => numeric
@return numeric, Retorna o valor do OU binário entre todos os parâmetros passados.

@param <nnum1>, numeric, 1º número a ser utilizado na operação de OU binário.
@param <nnum2>, numeric, 2º número a ser utilizado na operação de OU binário.
@param [nnum3], numeric, 3º número a ser utilizado na operação de OU binário.
@param [nnum4], numeric, 4º número a ser utilizado na operação de OU binário.
@param [nnum5], numeric, 5º número a ser utilizado na operação de OU binário.
@param [nnum6], numeric, 6º número a ser utilizado na operação de OU binário.
@param [nnum7], numeric, 7º número a ser utilizado na operação de OU binário.
@param [nnum8], numeric, 8º número a ser utilizado na operação de OU binário.
@param [nnum9], numeric, 9º número a ser utilizado na operação de OU binário.
@param [nnum10], numeric, 10º número a ser utilizado na operação de OU binário.
@param [nnum11], numeric, 11º número a ser utilizado na operação de OU binário.
@param [nnum12], numeric, 12º número a ser utilizado na operação de OU binário.
@param [nnum13], numeric, 13º número a ser utilizado na operação de OU binário.
@param [nnum14], numeric, 14º número a ser utilizado na operação de OU binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nor
/*/
binary function nor(nnum1, nnum2, nnum3, nnum4, nnum5, nnum6, nnum7, nnum8, nnum9, nnum10, nnum11, nnum12, nnum13, nnum14)
return


/*/{Protheus.doc} notbit
Inverte os bits dos caracteres de uma string.

@type binary function
@sintax NotBit(<@cStr>, <nLength>) => NIL
@param <@cstr>, character, Indica a string que será modificada.
@param <nlength>, numeric, Indica a quantidade de caracteres que terão seus bits invertidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/notbit
/*/
binary function notbit(cstr, nlength)
return


/*/{Protheus.doc} ntol
Converte um valor numérico em lógico.

@type binary function
@sintax NToL(<nValue>) => numeric
@return numeric, Retorna o valor lógico correspondente ao valor numérico passado por parâmetro.

@param <nvalue>, numeric, Indica o valor numérico que será convertido para lógico.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ntol
/*/
binary function ntol(nvalue)
return


/*/{Protheus.doc} nxor
Esta função pode ser usada no lugar da função obsoleta B_XOR\(\).

@type binary function
@sintax NXor(<nNum1>, <nNum2>, [nNum3], [nNum4], [nNum5], [nNum6], [nNum7], [nNum8], [nNum9], [nNum10], [nNum11], [nNum12], [nNum13], [nNum14]) => numeric
@return numeric, Retorna o valor do XOR binário entre todos os parâmetros passados.

@param <nnum1>, numeric, 1º número a ser utilizado na operação de XOR binário.
@param <nnum2>, numeric, 2º número a ser utilizado na operação de XOR binário.
@param [nnum3], numeric, 3º número a ser utilizado na operação de XOR binário.
@param [nnum4], numeric, 4º número a ser utilizado na operação de XOR binário.
@param [nnum5], numeric, 5º número a ser utilizado na operação de XOR binário.
@param [nnum6], numeric, 6º número a ser utilizado na operação de XOR binário.
@param [nnum7], numeric, 7º número a ser utilizado na operação de XOR binário.
@param [nnum8], numeric, 8º número a ser utilizado na operação de XOR binário.
@param [nnum9], numeric, 9º número a ser utilizado na operação de XOR binário.
@param [nnum10], numeric, 10º número a ser utilizado na operação de XOR binário.
@param [nnum11], numeric, 11º número a ser utilizado na operação de XOR binário.
@param [nnum12], numeric, 12º número a ser utilizado na operação de XOR binário.
@param [nnum13], numeric, 13º número a ser utilizado na operação de XOR binário.
@param [nnum14], numeric, 14º número a ser utilizado na operação de XOR binário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nxor
/*/
binary function nxor(nnum1, nnum2, nnum3, nnum4, nnum5, nnum6, nnum7, nnum8, nnum9, nnum10, nnum11, nnum12, nnum13, nnum14)
return


/*/{Protheus.doc} objecthandle
descrição da funcao

@type binary function
@sintax objecthandle([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/objecthandle
/*/
binary function objecthandle(tnomevar)
return


/*/{Protheus.doc} oemtoansi
Converte uma string do formato OEM/MS-DOS Text para ANSI Text \(formato do Microsoft Windows\).

@type binary function
@sintax OEMToANSI(<cStringOEM>) => character
@return character, Retorna a string convertida \(formato ANSI\) para ser exibida no Microsoft Windows

@param <cstringoem>, character, Indica a string \(formato OEM/MS-DOS\) que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/oemtoansi
/*/
binary function oemtoansi(cstringoem)
return


/*/{Protheus.doc} pad
Adiciona caracteres de preenchimento à direita do conteúdo de uma variável.

@type binary function
@sintax Pad(<xExp>, <nLen>, [cFill]) => character
@return character, Retorna uma string com o tamanho indicado em **nLen** contendo o valor indicado em **xExp** preenchido à direita com o caractere indicado em **cFill**.

@param <xexp>, variant, Indica um valor no qual serão inseridos caracteres de preenchimento.
@param <nlen>, numeric, Indica o tamanho da string que será retornada.
@param [cfill], character, Indica o caractere que será inserido no parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pad
/*/
binary function pad(xexp, nlen, cfill)
return


/*/{Protheus.doc} padc
Centraliza o conteúdo de uma variável adicionando caracteres de preenchimento à direita e à esquerda.

@type binary function
@sintax PadC(<xExp>, <nLen>, [cFill]) => character
@return character, Retorna uma string com o tamanho indicado em **nLen** contendo o valor indicado em **xExp** centralizado, preenchido com o caractere indicado em **cFill**.

@param <xexp>, variant, Indica um valor no qual serão inseridos caracteres de preenchimento.
@param <nlen>, numeric, Indica o tamanho da string que será retornada.
@param [cfill], character, Indica o caractere que será inserido no parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/padc
/*/
binary function padc(xexp, nlen, cfill)
return


/*/{Protheus.doc} padl
Adiciona caracteres de preenchimento à esquerda do conteúdo de uma variável.

@type binary function
@sintax PadL(<xExp>, <nLen>, [cFill]) => character
@return character, Retorna uma string com o tamanho indicado em **nLen** contendo o valor indicado em **xExp** preenchido à esquerda com o caractere indicado em **cFill**.

@param <xexp>, variant, Indica um valor no qual serão inseridos caracteres de preenchimento.
@param <nlen>, numeric, Indica o tamanho da string que será retornada.
@param [cfill], character, Indica o caractere que será inserido no parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/padl
/*/
binary function padl(xexp, nlen, cfill)
return


/*/{Protheus.doc} padr
Adiciona caracteres de preenchimento à direita do conteúdo de uma variável.

@type binary function
@sintax PadR(<xExp>, <nLen>, [cFill]) => character
@return character, Retorna uma string com o tamanho indicado em **nLen** contendo o valor indicado em **xExp** preenchido à direita com o caractere indicado em **cFill**.

@param <xexp>, variant, Indica um valor no qual serão inseridos caracteres de preenchimento.
@param <nlen>, numeric, Indica o tamanho da string que será retornada.
@param [cfill], character, Indica o caractere que será inserido no parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/padr
/*/
binary function padr(xexp, nlen, cfill)
return


/*/{Protheus.doc} pcount
Retorna o número de parâmetros passados para uma função AdvPL.

@type binary function
@sintax PCount() => numeric
@return numeric, Retorna o número de parâmetros passados para uma função AdvPL.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pcount
/*/
binary function pcount()
return


/*/{Protheus.doc} pemcertpub
Retorna o conteúdo público do certificado digital no formato PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PemCertPub(<cCertData>, [cPassword]) => character
@return character, Conteúdo do certificado no formato PEM.

@param <ccertdata>, variant, Dados do certificado. Pode ser caractere, json ou hashmap. Mais informações no campo Observações.
@param [cpassword], character, Senha do certificado, caso haja e a variável cCertData seja passada em caractere.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pemcertpub
/*/
binary function pemcertpub(ccertdata, cpassword)
return


/*/{Protheus.doc} peminfo
Extrai as informações referentes a um arquivo de certificados no formato .PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PEMInfo(<cFile>, [cPassword], [nHashAlgorithm]) => array
@return array, Retorna um vetor com as informações referente aos certificados existentes no arquivo PEM.

@param <cfile>, character, Indica o caminho do arquivo .PEM, a partir do diretório raiz \(RootPath\) do TOTVS Application Server.
@param [cpassword], character, Indica a senha para extrair os dados do arquivo PEM.
@param [nhashalgorithm], numeric, Indica o algoritmo de hash que deverá ser usado para o cálculo do Fingerprint/Thumbprint do certificado. Default: 3 \(SHA1\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/peminfo
/*/
binary function peminfo(cfile, cpassword, nhashalgorithm)
return


/*/{Protheus.doc} pfx2pem
Extrai o certificado de cliente e o certificado de autorizaÃ§Ã£o \(Certificate Authorith\) de um arquivo com extensÃ£o .PFX \(formato padrÃ£o do IIS - Internet Information Services\), e gera como saÃ­da um arquivo no formato .PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PFX2PEM(<cPFXFile>, <cPEMFile>, <@cError>, [cPassword]) => logical
@return logical, Retorna **.T.** quando o PEM Ã© gerado com sucesso; caso contrÃ¡rio, **.F.**.

@param <cpfxfile>, character, Indica o caminho do arquivo .PFX, a partir da raiz do diretÃ³rio \(RootPath\) do TOTVS Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir da raiz do diretÃ³rio \(RootPath\) do TOTVS Application Server, com as informaÃ§Ãµes de certificado de cliente.
@param <@cerror>, character, Indica a saÃ­da da mensagem de erro, em caso de falha.
@param [cpassword], character, Indica a senha para extrair os dados do arquivo PFX.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pfx2pem
/*/
binary function pfx2pem(cpfxfile, cpemfile, cerror, cpassword)
return


/*/{Protheus.doc} pfxca2pem
Extrai o certificado de autorização \(Certificate Authorith\) de um arquivo com extensão .PFX \(formato padrão do IIS - Internet Information Services\), e gera como saída um arquivo no formato .PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PFXCA2PEM(<cPFXFile>, <cPEMFile>, <@cError>, [cPassword]) => logical
@return logical, Retorna **.T.** se conseguiu extrair os certificados de autorização do arquivo .PFX; caso contrário, **.F.**.

@param <cpfxfile>, character, Indica o caminho do arquivo .PFX, a partir da raiz do diretório \(RootPath\) do TOTVS \| Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir da raiz do diretório \(RootPath\) do TOTVS \| Application Server, com as informações dos certificados de autorização.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@param [cpassword], character, Indica a senha para exportar os dados do certificado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pfxca2pem
/*/
binary function pfxca2pem(cpfxfile, cpemfile, cerror, cpassword)
return


/*/{Protheus.doc} pfxcert2pem
Extrai o certificado de cliente de um arquivo com extensão .PFX \(formato padrão do IIS - Internet Information Services\), e gera como saída um arquivo no formato .PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PFXCert2PEM(<cPFXFile>, <cPEMFile>, <@cError>, [cPassword]) => logical
@return logical, Retorna **.T.** quando o PEM é gerado com sucesso; caso contrário, **.F.**.

@param <cpfxfile>, character, Indica o caminho do arquivo .PFX, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server, com as informações de certificado de cliente.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@param [cpassword], character, Indica a senha para extrair os dados do arquivo PFX.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pfxcert2pem
/*/
binary function pfxcert2pem(cpfxfile, cpemfile, cerror, cpassword)
return


/*/{Protheus.doc} pfxinfo
Extrai de um arquivo com extensão .PFX \(formato padrão do IIS - Internet Information Services\) as informações referentes a certificado de cliente e certificados de CA \(Certificate Authority\).

@type binary function
@sintax PFXInfo(<cFile>, [cPassword]) => array
@return array, Retorna um vetor com as informações referentes a certificado de cliente e certificados de CA.

@param <cfile>, character, Indica o caminho do arquivo .PFX, a partir do diretório raiz \(RootPath\) do TOTVS \| Application Server.
@param [cpassword], character, Indica a senha para extrair os dados do arquivo PFX.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pfxinfo
/*/
binary function pfxinfo(cfile, cpassword)
return


/*/{Protheus.doc} pfxkey2pem
Extrai a chave privada de um arquivo com extensão .PFX \(formato padrão do IIS - Internet Information Services\), e gera como saída um arquivo no formato .PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PFXKey2PEM(<cPFXFile>, <cPEMFile>, <@cError>, [cPassword]) => logical
@return logical, Retorna **.T.** se conseguiu extrair a chave privada do arquivo .PFX; caso contrário, **.F.**.

@param <cpfxfile>, character, Indica o caminho do arquivo .PFX, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server, com as informações de chave privada.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@param [cpassword], character, Indica a senha para extrair os dados do arquivo PFX.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pfxkey2pem
/*/
binary function pfxkey2pem(cpfxfile, cpemfile, cerror, cpassword)
return


/*/{Protheus.doc} ping
A função Ping\(\) retorna a latência entre o AppServer e SmartClient, resultado será a média do tempo das requisições.

@type binary function
@sintax Ping() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ping
/*/
binary function ping()
return


/*/{Protheus.doc} pk7key2pem
Extrai todos os certificado de um arquivo PKCS#7 em formato DER \(Distinguished Encoding Rules\) para o formato PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PK7Key2PEM(<cPK7File>, <cPEMFile>, <@cError>) => logical
@return logical, Retorna **.T.** se conseguiu converter o arquivo .PK7; caso contrário, **.F.**.

@param <cpk7file>, character, Indica o caminho do arquivo .PK7, a partir do RootPath do TOTVS Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir do RootPath do TOTVS Application Server.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pk7key2pem
/*/
binary function pk7key2pem(cpk7file, cpemfile, cerror)
return


/*/{Protheus.doc} pk8key2pem
Converte uma chave privada PKCS#8 em formato DER \(Distinguished Encoding Rules\) para o formato PEM \(Privacy Enhanced Mail\).

@type binary function
@sintax PK8Key2PEM(<cPK8File>, <cPEMFile>, <@cError>, [cPassword]) => logical
@return logical, Retorna **.T.** se conseguiu converter o arquivo .PK8; caso contrário, **.F.**.

@param <cpk8file>, character, Indica o caminho do arquivo .PK8, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server.
@param <cpemfile>, character, Indica o caminho do arquivo .PEM, a partir da raiz do diretório \(RootPath\) do TOTVS Application Server, com as informações de chave privada.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@param [cpassword], character, Indica a senha que será usada no arquivo .PEM.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pk8key2pem
/*/
binary function pk8key2pem(cpk8file, cpemfile, cerror, cpassword)
return


/*/{Protheus.doc} privsignrsa
Assina um determinado conteúdo usando chave privada.

@type binary function
@sintax PrivSignRSA(<cKeyOrPathKey>, <cContent>, <nTipo>, <cSenha>, [@cErrStr], [nPad]) => character
@return character, Retorna o valor do parâmetro cContent, assinado, de acordo com o tipo nTipo e a chave privada informada cPathKey.

@param <ckeyorpathkey>, character, Indica a string que contém o caminho para a chave privada \(formato .PEM\) ou o conteúdo do arquivo.
@param <ccontent>, character, Indica a string que será assinada.
@param <ntipo>, numeric, Indica o tipo de algoritmo que será utilizado para realizar a assinatura da chave.
@param <csenha>, character, Indica uma string que contém o valor da senha usada na geração da chave privada criptografada.
@param [@cerrstr], character, Indica a variável para retornar as mensagens de erro.
@param [npad], numeric, Indica o tipo de schema de criptografia que será utilizado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/privsignrsa
/*/
binary function privsignrsa(ckeyorpathkey, ccontent, ntipo, csenha, cerrstr, npad)
return


/*/{Protheus.doc} privveryrsa
Verifica um determinado conteúdo assinado, usando a chave pública.

@type binary function
@sintax PrivVeryRSA(<cKeyOrPathKey>, <cContent>, <nTipo>, <cAssinatura>, [@cErrStr], [nPad]) => codeblock
@return codeblock, Retorna verdadeiro \(.T.\) se o valor informado no parâmetro cContent está de acordo com o valor enviado que foi assinado pelo tipo nTipo e a chave informada cPathKey. Caso contrário, falso \(.F.\).

@param <ckeyorpathkey>, character, Indica a string que contém o caminho para a chave privada \(formato .PEM\) ou o conteúdo do arquivo.
@param <ccontent>, character, Indica o valor que será verificado, com um conteúdo já assinado.
@param <ntipo>, numeric, Indica o tipo de algoritmo que será utilizado para verificar a assinatura.
@param <cassinatura>, character, Indica uma string que contém o valor da assinatura gerada mediante a aplicação da chave privada criptografada.
@param [@cerrstr], character, Indica a variável para retornar as mensagens de erro.
@param [npad], numeric, Indica o tipo de schema de criptografia que será utilizado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/privveryrsa
/*/
binary function privveryrsa(ckeyorpathkey, ccontent, ntipo, cassinatura, cerrstr, npad)
return


/*/{Protheus.doc} procsource
descrição da funcao

@type binary function
@sintax procSource([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/procsource
/*/
binary function procsource(tnomevar)
return


/*/{Protheus.doc} propref
descrição da funcao

@type binary function
@sintax PropRef([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/propref
/*/
binary function propref(tnomevar)
return


/*/{Protheus.doc} propsetget
descrição da funcao

@type binary function
@sintax PropSetGet([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/propsetget
/*/
binary function propsetget(tnomevar)
return


/*/{Protheus.doc} putglbvalue
Cria uma variável global para armazenar um único valor do tipo string e armazena a string de conteúdo fornecida.

@type binary function
@sintax PutGlbValue(<cGlbName>, <cValue>) => NIL
@param <cglbname>, character, Indica o nome da variável global a ser criada.
@param <cvalue>, character, Indica a string de conteúdo a ser armazenado na variável global.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/putglbvalue
/*/
binary function putglbvalue(cglbname, cvalue)
return


/*/{Protheus.doc} putglbvars
Cria uma variável global para armazenar múltiplos valores de tipos diversos e armazena os valores fornecidos.

@type binary function
@sintax PutGlbVars(<cGlbName>, <xValue1...N>) => NIL
@param <cglbname>, character, Indica o nome da variável global a ser criada.
@param <xvalue1...n>, variant, Indica um ou mais valores a serem armazenados na variável global. Ver Observações para os tipos suportados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/putglbvars
/*/
binary function putglbvars(cglbname, xvalue1n)
return


/*/{Protheus.doc} qout
Apresenta uma mensagem no consolte do Application Server.

@type binary function
@sintax QOut(<cText>) => NIL
@param <ctext>, character, Indica o texto que será apresentado no console do Application Server.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/qout
/*/
binary function qout(ctext)
return


/*/{Protheus.doc} qqout
Apresenta uma mensagem no consolte do Application Server.

@type binary function
@sintax QQOut(<cText>) => NIL
@param <ctext>, character, Indica o texto que será apresentado no console do Application Server.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/qqout
/*/
binary function qqout(ctext)
return


/*/{Protheus.doc} randomize
Gera um número inteiro aleatório entre a faixa, inferior e superior, recebida através dos parâmetros \(nMinimo e nMaximo\).

@type binary function
@sintax Randomize(<nMinimo>, <nMaximo>) => numeric
@return numeric, Retorna um número randômico, no intervalo entre os parâmetros nMinimo e nMaximo. O número gerado pode ser maior ou igual a nMinimo e menor ou igual a nMaximo -1.

@param <nminimo>, numeric, Indica o menor número que será gerado.
@param <nmaximo>, numeric, Indica o maior número \(menos um\) que será gerado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/randomize
/*/
binary function randomize(nminimo, nmaximo)
return


/*/{Protheus.doc} rat
Retorna a posição da última ocorrência de uma substring em uma string. Para isso, a função pesquisa a string destino a partir da direita.

@type binary function
@sintax RAt(<cSearch>, <cSource>) => numeric
@return numeric, Retorna o índice em que <**cSearch**> foi encontrada.

@param <csearch>, character, Indica a string que será localizada.
@param <csource>, character, Indica a string onde <**cSearch**> será procurada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rat
/*/
binary function rat(csearch, csource)
return


/*/{Protheus.doc} rc4crypt
Encripta e decripta uma determinada cadeia de caracteres usando o algoritmo RC4.

@type binary function
@sintax RC4Crypt(<cInput>, <cKey>, [lIsReturnASCII], [lIsInputASCII]) => character
@return character, Retorna uma cadeia de caracteres criptografada.

@param <cinput>, character, Indica a sequência de caracteres que serão criptografados.
@param <ckey>, character, Indica a sequência de caracteres a serem utilizados como chave para o algoritmo de criptografia.
@param [lisreturnascii], logical, Formato do retorno. Se **.T.**, indica que o retorno será em código ASCII hexadecimal, onde cada código corresponde a dois caracteres, sem "0x" inicial; caso contrário, se **.F.**, o retorno será em texto plano. Por padrão é assumido **.T.**.
@param [lisinputascii], logical, Formato da entrada. Se **.T.**, indica que a entrada está em código ASCII hexadecimal, onde cada código corresponde a dois caracteres, sem "0x" inicial; caso contrário, se **.F.**, a entrada está em texto plano. Por padrão é assumido **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rc4crypt
/*/
binary function rc4crypt(cinput, ckey, lisreturnascii, lisinputascii)
return


/*/{Protheus.doc} rddname
Retorna o nome da RDD utilizada.

@type binary function
@sintax RDDName() => character
@return character, Retorna o nome da RDD utilizada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rddname
/*/
binary function rddname()
return


/*/{Protheus.doc} rddsetdefault
Retorna a RDD padrão que é utilizada, podendo alterá-la.

@type binary function
@sintax RDDSetDefault([cRDD]) => character
@return character, Retorna o nome da RDD padrão.

@param [crdd], character, Indica a nova RDD padrão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rddsetdefault
/*/
binary function rddsetdefault(crdd)
return


/*/{Protheus.doc} recno
Retorna o número do registro atualmente posicionado na área de trabalho ativa.

@type binary function
@sintax Recno() => numeric
@return numeric, Retorna o identificador numérico do registro atualmente posicionado na área de trabalho ativa.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/recno
/*/
binary function recno()
return


/*/{Protheus.doc} recsize
Retorna o tamanho de um registro da tabela aberta.

@type binary function
@sintax RecSize() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/recsize
/*/
binary function recsize()
return


/*/{Protheus.doc} releaseprogs
Encerra imediatamente o contexto dos programas do processo AdvPL atual, sem finalizar o processo. Entende-se por encerramento de contexto a limpeza dos conteúdos das variáveis estáticas alocadas após a primeira execução da função na conexão e a limpeza da interface de classes dinâmicas alocadas pelo processo atual.

@type binary function
@sintax ReleaseProgs() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/releaseprogs
/*/
binary function releaseprogs()
return


/*/{Protheus.doc} remotexclsid
descrição da funcao

@type binary function
@sintax RemoteXCLSID([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/remotexclsid
/*/
binary function remotexclsid(tnomevar)
return


/*/{Protheus.doc} remotexversion
Retorna a build do Smart Client ActiveX.

@type binary function
@sintax RemoteXVersion() => character
@return character, Retorna a build do Smart Client ActiveX.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/remotexversion
/*/
binary function remotexversion()
return


/*/{Protheus.doc} replicate
Gera uma string repetida a partir de outra.

@type binary function
@sintax Replicate(<cString>, <nCount>) => character
@return character, Retorna a string <**cString**> repetida <**nCount**> vezes.

@param <cstring>, character, Indica a string que será repetida.
@param <ncount>, numeric, Indica a quantidade de vezes que a string será repetida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/replicate
/*/
binary function replicate(cstring, ncount)
return


/*/{Protheus.doc} resource2file
Salva o conteúdo de um recurso do repositório em um arquivo.

@type binary function
@sintax Resource2File([cResource], [cFile]) => logical
@return logical, Se o recurso foi copiado no disco com sucesso retorna verdadeiro \(.T.\), caso contrário retorna falso \(.F.\).

@param [cresource], character, Indica o nome e extensão do recurso no repositório a ser salvo em disco.
@param [cfile], character, Indica o diretório e nome do arquivo onde o recurso será salvo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/resource2file
/*/
binary function resource2file(cresource, cfile)
return


/*/{Protheus.doc} retimgtype
Retorna o tipo de imagem \( BMP ou JPG \) a partir de um path informado por parâmetro.

@type binary function
@sintax RetImgType(<cPath>) => numeric
@return numeric, Tipo da imagem, onde: 1 = Bitmap e 2 = JPG

@param <cpath>, character, Indica o path completo da imagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/retimgtype
/*/
binary function retimgtype(cpath)
return


/*/{Protheus.doc} right
Retorna um determinado número da caracteres à direita de uma string.

@type binary function
@sintax Right(<cText>, <nCount>) => character
@return character, Retorna uma cópia da string, iniciando a partir do caractere final da string \(último caractere da direita\), considerando o número de caracteres especificado no segundo parâmetro.

@param <ctext>, character, Indica o texto que será tratado.
@param <ncount>, numeric, Indica o número de caracteres à direita a serem retornados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/right
/*/
binary function right(ctext, ncount)
return


/*/{Protheus.doc} rlock
Bloqueia somente o registro atual.

@type binary function
@sintax RLock() => logical
@return logical, Retorna verdadeiro \(.T.\), se o registro for bloqueado com sucesso; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rlock
/*/
binary function rlock()
return


/*/{Protheus.doc} rsaexponent
Retorna o expoente \(exponent\) de uma chave no formato big-endian.

@type binary function
@sintax RSAExponent(<cKey>, <lPublic>, [cPassword]) => character
@return character, Retorna o expoente de uma chave no formato big-endian ou **Nil** \(caso ocorra um erro no processamento\).

@param <ckey>, character, Indica o caminho relativo \(ao RootPath\) para a chave.
@param <lpublic>, logical, Indica se está sendo utilizada uma chave pública.
@param [cpassword], character, Indica a senha da chave RSA.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rsaexponent
/*/
binary function rsaexponent(ckey, lpublic, cpassword)
return


/*/{Protheus.doc} rsamodulus
Retorna o módulo público \(public modulus\) de uma chave no formato PEM.

@type binary function
@sintax RSAModulus(<cKey>, <lPublic>, [cPassword]) => character
@return character, Retorna o módulo público da chave em uma string binária em AdvPL - com bytes de 0 a 255 - ou **Nil** \(caso ocorra um erro no processamento\).

@param <ckey>, character, Indica o caminho relativo \(ao RootPath\) para a chave.
@param <lpublic>, logical, Indica se está sendo utilizada uma chave pública.
@param [cpassword], character, Indica a senha da chave \(se existente\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rsamodulus
/*/
binary function rsamodulus(ckey, lpublic, cpassword)
return


/*/{Protheus.doc} runcommand
Executa um comando no sistema operacional e retorna o resultado apresentado no stdout \(console\).

@type binary function
@sintax RunCommand(<nExp>) => character
@return character, Retorna o resultado do comando exibido no console.

@param <nexp>, character, Texto com o comando a ser executado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/runcommand
/*/
binary function runcommand(nexp)
return


/*/{Protheus.doc} seconds
Retorna a hora do sistema em segundos.

@type binary function
@sintax Seconds() => numeric
@return numeric, Retorna um valor que representa o número de segundos, decorridos desde a meia-noite, conforme a hora atual do sistema.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/seconds
/*/
binary function seconds()
return


/*/{Protheus.doc} select
Retorna o número da área de trabalho de um alias especificado.

@type binary function
@sintax Select([cAlias]) => numeric
@return numeric, Retorna o número da área de trabalho do alias especificado.

@param [calias], character, Indica o alias que será pesquisado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/select
/*/
binary function select(calias)
return


/*/{Protheus.doc} serialnumber
Retorna o número de série de um drive Windows da máquina onde está sendo executado o TOTVS \| Application Server.

@type binary function
@sintax SerialNumber([cDrive]) => character
@return character, Retorna o número de série do drive especificado.

@param [cdrive], character, Indica a letra do drive que será consultado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/serialnumber
/*/
binary function serialnumber(cdrive)
return


/*/{Protheus.doc} set
Realiza a definição de alguns parâmetros do sistema, permite também retornar o valor previamente definido.

@type binary function
@sintax Set(<nParam>, [xValue]) => variant
@return variant, Retorna o valor previamente definido para o parâmetro.

@param <nparam>, numeric, Parâmetro a ser definido ou consultado
@param [xvalue], variant, Valor a ser definido para o parâmetro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/set
/*/
binary function set(nparam, xvalue)
return


/*/{Protheus.doc} set4gllineclr
descrição da funcao

@type binary function
@sintax set4gllineclr([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/set4gllineclr
/*/
binary function set4gllineclr(tnomevar)
return


/*/{Protheus.doc} setcss
Define um CSS \(Cascading Style Sheet\) padrão que será utilizado na criação de componentes visuais.

@type binary function
@sintax SetCSS(<cCSS>) => codeblock
@return codeblock, Nulo

@param <ccss>, character, Indica o CSS que será aplicado nos componentes visuais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcss
/*/
binary function setcss(ccss)
return


/*/{Protheus.doc} setkeyblock
Define um bloco de código que será executado sempre que a função SetKey\(\) for chamada.

@type binary function
@sintax SetKeyBlock(<bBloco>) => NIL
@param <bbloco>, codeblock, Bloco de código que será executado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setkeyblock
/*/
binary function setkeyblock(bbloco)
return


/*/{Protheus.doc} setksyslog
Adiciona um identificador no formato \[chave valor\] a todas mensagens enviadas ao syslog, através das funções Conout e LogMsg.

@type binary function
@sintax SetKSysLog(<ckey>, <cValor>) => NIL
@param <ckey>, character, chave de identificação
@param <cvalor>, character, valor, da chave de identificação
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setksyslog
/*/
binary function setksyslog(ckey, cvalor)
return


/*/{Protheus.doc} setmailobj
Armazena ou apaga um objeto TMailManager na lista de objetos do servidor.

@type binary function
@sintax SetMailObj(<cID>, <oMailObj>) => NIL
@param <cid>, character, Indica um identificador, usado para recuperar o objeto armazenado posteriormente.
@param <omailobj>, variant, Indica um objeto do tipo TMailManager ou nulo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmailobj
/*/
binary function setmailobj(cid, omailobj)
return


/*/{Protheus.doc} setnoproxyfor
Configura uma lista de domínios ou IPs que não devem utilizar proxy.

@type binary function
@sintax SetNoProxyFor(<cDomainList>, [lClient]) => NIL
@param <cdomainlist>, character, Indica a lista de domínios ou IP que não irão usar proxy.
@param [lclient], logical, Indica se irá definir na conexão feita pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setnoproxyfor
/*/
binary function setnoproxyfor(cdomainlist, lclient)
return


/*/{Protheus.doc} setproxy
Define as configurações para utilizar proxy HTTP.

@type binary function
@sintax SetProxy(<cServer>, <nPort>, [cUser], [cPass], [lClient]) => NIL
@param <cserver>, character, Indica o endereço do servidor de proxy HTTP.
@param <nport>, numeric, Indica a porta do servidor de proxy HTTP.
@param [cuser], character, Indica o usuário para proxy HTTP.
@param [cpass], character, Indica a senha para proxy HTTP.
@param [lclient], logical, Indica se irá definir na conexão feita pelo SmartClient \(.T.\) ou pelo AppServer \(.F.\). Valor padrão: **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setproxy
/*/
binary function setproxy(cserver, nport, cuser, cpass, lclient)
return


/*/{Protheus.doc} setrmtdate
Define e data corrente do Smart Client.

@type binary function
@sintax SetRmtDate(<dData>) => NIL
@param <ddata>, date, Indica a data que será definida para o Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrmtdate
/*/
binary function setrmtdate(ddata)
return


/*/{Protheus.doc} settransparentcolor
descrição da funcao

@type binary function
@sintax SetTransparentColor([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settransparentcolor
/*/
binary function settransparentcolor(tnomevar)
return


/*/{Protheus.doc} setvarnamelen
Define o tamanho de uma variável AdvPL.

@type binary function
@sintax SetVarNameLen([nValue]) => numeric
@return numeric, Retorna o tamanho definido anteriormente para uma variável.

@param [nvalue], numeric, Indica o tamanho da variável.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvarnamelen
/*/
binary function setvarnamelen(nvalue)
return


/*/{Protheus.doc} setvdrobj
descrição da funcao

@type binary function
@sintax SetVdrObj([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvdrobj
/*/
binary function setvdrobj(tnomevar)
return


/*/{Protheus.doc} sha1
SHA1 \(Secure Hash Algorithm\) gera o hash \(ou digest\) de um conteúdo, com base no algoritmo definido em FIPS PUB 180-1 published April 17, 1995.

@type binary function
@sintax SHA1(<cContent>, [nRetType]) => character
@return character, Retorna o hash \(ou digest\) do conteúdo informado.

@param <ccontent>, character, Indica a string que contém os dados no qual será gerado o hash.
@param [nrettype], numeric, Indica o tipo de retorno do digest. Quando informado 1 \(um\) retorna uma string no formato RAW_DIGEST \(sequência de 20 bytes ASCII\); quando informado 2 \(dois\) retorna uma string no formato HEX_DIGEST \(sequência hexadecimal de 40 caracteres em hexadecimal\). Caso não informado, o valor padrão é 2 \(dois\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sha1
/*/
binary function sha1(ccontent, nrettype)
return


/*/{Protheus.doc} sha256
SHA256 gera o hash \(message digest\) de uma mensagem de entrada, com base no algoritmo SHA-256 da família SHA-2, definido em FIPS PUB 180-4 e publicado em 2001 pelo NIST.

@type binary function
@sintax SHA256(<cContent>, [nRetType]) => character
@return character, Retorna o hash \(message digest\) do conteúdo de entrada informado, no formato especificado.

@param <ccontent>, character, Indica a string de entrada que contém os dados para os quais será gerado o hash.
@param [nrettype], numeric, Indica o tipo do formato de retorno do hash. Quando informado **1 \(um\)** retorna uma string no formato **RAW_DIGEST** \(sequência de 32 bytes ASCII\); quando informado **2 \(dois\)** ou **qualquer outro valor inteiro diferente de 1 \(um\)** retorna uma string no formato **HEX_DIGEST** \(sequência hexadecimal de 64 bytes\). Caso não informado, o valor padrão é **2 \(dois\)**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sha256
/*/
binary function sha256(ccontent, nrettype)
return


/*/{Protheus.doc} sha384
SHA384 gera o hash \(message digest\) de uma mensagem de entrada, com base no algoritmo SHA-384 da família SHA-2, definido em FIPS PUB 180-4 e publicado em 2001 pelo NIST.

@type binary function
@sintax SHA384(<cContent>, [nRetType]) => character
@return character, Retorna o hash \(Message Authentication Code\) do conteúdo de entrada informado, no formato especificado.

@param <ccontent>, character, Indica a string de entrada que contém os dados para os quais será gerado o hash.
@param [nrettype], numeric, Indica o tipo do formato de retorno do hash. Quando não informado valor padrão será **2 \(Hex Hash\)**. Veja tabela nas observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sha384
/*/
binary function sha384(ccontent, nrettype)
return


/*/{Protheus.doc} sha512
SHA512 gera o hash \(message digest\) de uma mensagem de entrada, com base no algoritmo SHA-512 da família SHA-2, definido em FIPS PUB 180-4 e publicado em 2001 pelo NIST.

@type binary function
@sintax SHA512(<cContent>, [nRetType]) => character
@return character, Retorna o hash \(message digest\) do conteúdo de entrada informado, no formato especificado.

@param <ccontent>, character, Indica a string de entrada que contém os dados para os quais será gerado o hash.
@param [nrettype], numeric, Indica o tipo do formato de retorno do hash. Quando informado **1 \(um\)** retorna uma string no formato **RAW_DIGEST** \(sequência de 64 bytes ASCII\); quando informado **2 \(dois\)** ou **qualquer outro valor inteiro diferente de 1 \(um\)** retorna uma string no formato **HEX_DIGEST** \(sequência hexadecimal de 128 bytes\). Caso não informado, o valor padrão é **2 \(dois\)**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sha512
/*/
binary function sha512(ccontent, nrettype)
return


/*/{Protheus.doc} shellexecute
Executa uma função, um arquivo ou qualquer execução em linha de comando no S.O. na estação onde o Smartclient está em execução. Esta função encontra-se disponível para Windows e Linux.

@type binary function
@sintax ShellExecute(<cAcao>, <cArquivo>, <cParam>, <cDirTrabalho>, [nOpc]) => character
@return character, Retorna 0 \(zero\) em caso de sucesso da execução do processo e diferente de zero para erros.

@param <cacao>, character, Indica o nome da ação que será executada.
@param <carquivo>, character, Indica o caminho e diretório do arquivo que será executado.
@param <cparam>, character, Indica o parâmetro de linha que será repassado para o executável.
@param <cdirtrabalho>, character, Indica o diretório de trabalho onde o arquivo será executa.
@param [nopc], numeric, Indica o modo de interface a ser criado para a execução do programa. Para mais informações consulte observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/shellexecute
/*/
binary function shellexecute(cacao, carquivo, cparam, cdirtrabalho, nopc)
return


/*/{Protheus.doc} showinfmem
descrição da funcao

@type binary function
@sintax ShowInfMem([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/showinfmem
/*/
binary function showinfmem(tnomevar)
return


/*/{Protheus.doc} sin
Calcula o valor do seno de um ângulo \(em radianos\).

@type binary function
@sintax Sin(<nAngle>) => numeric
@return numeric, Retorna o valor do seno de acordo com o ângulo informado.

@param <nangle>, numeric, Indica o valor do ângulo em radianos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sin
/*/
binary function sin(nangle)
return


/*/{Protheus.doc} sleep
Tem o objetivo de fazer com que a thread corrente deixe de ser executada de acordo com o valor informado como parâmetro.

@type binary function
@sintax Sleep(<nSleep>) => NIL
@param <nsleep>, numeric, Representa um total de tempo no qual a thread irá ficar sem executar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sleep
/*/
binary function sleep(nsleep)
return


/*/{Protheus.doc} smartjob
descrição da funcao

@type binary function
@sintax SmartJob([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smartjob
/*/
binary function smartjob(tnomevar)
return


/*/{Protheus.doc} smimesign
descrição da funcao

@type binary function
@sintax SMIMESign([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smimesign
/*/
binary function smimesign(tnomevar)
return


/*/{Protheus.doc} socketconn
Cria um conexão TCP com uma aplicação de destino, através do uso de um Socket do sistema operacional.

@type binary function
@sintax SocketConn(<cIP>, <nPort>, <cReq>, [nTimeOut]) => character
@return character, String de bytes retornados pelo serviço chamado. Cada serviço pode retornar um buffer composto de uma string de bytes / caracteres, a ordem e interpretação deste retorno deve ser conhecida pela aplicação que o utiliza.

@param <cip>, character, Indica a string com o endereço IP ou nome da máquina de destino desejado.
@param <nport>, numeric, Indica o número da porta de comunicação que será utilizada para realizar a conexão.
@param <creq>, character, String a ser enviada para a conexão de destino, caso ela seja estabelecida com sucesso.
@param [ntimeout], numeric, Informa o tempo, em segundos, de espera por um retorno \( time-out \).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/socketconn
/*/
binary function socketconn(cip, nport, creq, ntimeout)
return


/*/{Protheus.doc} splitpath
Divide um caminho de disco completo em todas as suas subpartes \(drive, diretório, nome e extensão\).

@type binary function
@sintax SplitPath(<cArquivo>, <cDrive>, <cDiretorio>, <cNome>, <cExtensao>) => NIL
@param <carquivo>, character, Indica o nome do arquivo que será quebrado. Além disso, opcionalmente, pode-se incluir o diretório e unidade do disco.
@param <cdrive>, character, Indica o nome da unidade do disco \(exemplo: C:\\\). Caso o arquivo informando não possua a unidade de disco ou o diretório refira-se ao servidor, a função retornará uma string em branco.
@param <cdiretorio>, character, Indica o nome do diretório. Caso o arquivo informado não possua diretório, a função retornará uma string em branco.
@param <cnome>, character, Indica o nome do arquivo sem extensão. Caso o parâmetro cArquivo não seja informado, a função retornará uma string em branco.
@param <cextensao>, character, Indica a extensão do arquivo informado, no parâmetro cArquivo, pré-fixada com um ponto ".". Caso a extensão, no parâmetro cArquivo, não seja especificada, a função retornará uma string em branco.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/splitpath
/*/
binary function splitpath(carquivo, cdrive, cdiretorio, cnome, cextensao)
return


/*/{Protheus.doc} sqrt
Calcula o valor da raiz quadrada de um número positivo.

@type binary function
@sintax Sqrt(<nRadicand>) => numeric
@return numeric, Retorna a raiz quadrada.

@param <nradicand>, numeric, Indica o valor do radicando.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sqrt
/*/
binary function sqrt(nradicand)
return


/*/{Protheus.doc} svrdisplay
Função para verificar se o Application Server esta sendo executado em uma sessão com interface gráfica.

@type binary function
@sintax SvrDisplay() => logical
@return logical, Retorna verdadeiro \(.T.\), se o TOTVS \| Application Server está sendo executado em uma sessão com interface gráfica, caso contrário, retorna falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/svrdisplay
/*/
binary function svrdisplay()
return


/*/{Protheus.doc} startjob
Executa uma rotina em uma segunda thread sem interface.

@type binary function
@sintax StartJob(<cName>, <cEnv>, <lWait>, [parm1,parm2,...parm25]) => NIL
@param <cname>, character, Indica o nome do Job que será executado.
@param <cenv>, character, Indica o nome do ambiente em que o Job será executado.
@param <lwait>, logical, Indica se, verdadeiro \(.T.\), o processo será finalizado; caso contrário, falso \(.F.\).
@param [parm1,parm2,...parm25], variant, Os parâmetros \(máximo 25 parâmetros\) informados a partir deste ponto serão repassados para a função especificada no parâmetro cName. Caso informados parâmetros do tipo B \(Code-Block\) ou O \(Object\), no processo de destino receberá NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/startjob
/*/
binary function startjob(cname, cenv, lwait, parm1,parm2,parm25)
return


/*/{Protheus.doc} str
A partir de um numérico esta função retorna uma string formatada, inserindo espaços \(" "\) à esquerda e/ou o símbolo decimal \("."\) em suas casas, de acordo com a informação do parâmetro.

@type binary function
@sintax Str(<nNumero>, [nTamanho], [nDecimais]) => character
@return character, Retorna uma string a partir do valor numérico e do tamanho informado no parâmetro.

@param <nnumero>, numeric, Indica o valor numérico que será convertido para string.
@param [ntamanho], numeric, Indica o tamanho da string será gerada.
@param [ndecimais], numeric, Indica o número de casas após o símbolo decimal.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/str
/*/
binary function str(nnumero, ntamanho, ndecimais)
return


/*/{Protheus.doc} striconv
Converte uma string de um codepage para outro.

@type binary function
@sintax StrIConv(<cText>, <cFromCodePage>, <cToCodePage>) => character
@return character, Retorna a string convertida

@param <ctext>, character, Indica o texto que será convertido
@param <cfromcodepage>, character, Indica o codepage de origem
@param <ctocodepage>, character, Indica o codepage de destino
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/striconv
/*/
binary function striconv(ctext, cfromcodepage, ctocodepage)
return


/*/{Protheus.doc} strtokarr
Fatia a string cValue de acordo com o separador cToken informado e retorna um vetor com todas as partes.

@type binary function
@sintax StrTokArr(<cValue>, <cToken>) => array
@return array, Retorna um array de caracteres contendo a string separada.

@param <cvalue>, character, Indica a string que será fatiada.
@param <ctoken>, character, Indica um ou mais caracteres \(*Token*\) que serão utilizados como separadores.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/strtokarr
/*/
binary function strtokarr(cvalue, ctoken)
return


/*/{Protheus.doc} strtokarr2
Fatia a string cValue de acordo com o separador cToken e retorna um vetor com todas as partes.

@type binary function
@sintax StrTokArr2(<cValue>, <cToken>, [lEmptyStr]) => array
@return array, Retorna um array de caracteres contendo a string separada.

@param <cvalue>, character, Indica a string que será fatiada.
@param <ctoken>, character, Indica um ou mais caracteres \(*Token*\) que serão utilizados como separadores.
@param [lemptystr], logical, Indica se elementos vazios também devem ser retornados. Valor default = **.F.**
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/strtokarr2
/*/
binary function strtokarr2(cvalue, ctoken, lemptystr)
return


/*/{Protheus.doc} strtran
Pesquisa e substitui um conjunto de caracteres de uma string.

@type binary function
@sintax StrTran(<cString>, <cSearch>, [cReplace], [nStart], [nCount]) => character
@return character, Retorna uma nova string com as ocorrências de **cSearch** substituídas por **cReplace**.

@param <cstring>, character, Indica a sequência de caracteres ou campo memo onde será realizado a pesquisa.
@param <csearch>, character, Indica a sequência de caracteres que será pesquisada.
@param [creplace], character, Indica a sequência de caracteres que deve substituir a expressão localizada.
@param [nstart], numeric, Indica a primeira ocorrência a ser substituída.
@param [ncount], numeric, Indica o número de substituições que devem ser realizadas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/strtran
/*/
binary function strtran(cstring, csearch, creplace, nstart, ncount)
return


/*/{Protheus.doc} stuff
Elimina e insere caracteres em uma string. Para isso, a função elimina <nElimina> caracteres a partir da posição inicial <nInicio>. Depois, insere <cInsere> na string resultante a partir do início <nInicio>, para formar a string que será retornada.

@type binary function
@sintax Stuff(<cString>, <nInicio>, <nElimina>, <cInsere>) => character
@return character, Retorna uma nova string \(cópia de cString\), sendo que os caracteres especificados foram eliminados e <cInsere> inserida.

@param <cstring>, character, Indica a string destino na qual serão eliminados e inseridos caracteres.
@param <ninicio>, numeric, Indica a posição inicial na string destino em que ocorre a inserção/eliminação.
@param <nelimina>, numeric, Indica a quantidade de caracteres que serão eliminados.
@param <cinsere>, character, Indica a string que será inserida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/stuff
/*/
binary function stuff(cstring, ninicio, nelimina, cinsere)
return


/*/{Protheus.doc} stuffbit
Altera uma sequencia de bits de uma string para 1.

@type binary function
@sintax StuffBit(<@cStr>, <nStart>, <nTest>, <nLength>) => NIL
@param <@cstr>, character, Indica a string que será modificada.
@param <nstart>, numeric, Indica o índice do bit inicial.
@param <ntest>, numeric, Indica a quantidade de bits que serão colocados em 1.
@param <nlength>, numeric, Indica o índice do último byte que será modificado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/stuffbit
/*/
binary function stuffbit(cstr, nstart, ntest, nlength)
return


/*/{Protheus.doc} syserrorblock
Define o bloco de código que será executado quando ocorrer um erro irreparável no Smart Client.

@type binary function
@sintax SysErrorBlock([bError]) => NIL
@param [berror], codeblock, Indica o bloco de código que será executado quando ocorrer um erro no Smart Client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/syserrorblock
/*/
binary function syserrorblock(berror)
return


/*/{Protheus.doc} sysrefresh
Atualiza todas as mensagens pendentes da conexão.

@type binary function
@sintax SysRefresh() => logical
@return logical, Retorna verdadeiro \(.T.\), se o processo for realizado com sucesso; caso contrário retorna falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sysrefresh
/*/
binary function sysrefresh()
return


/*/{Protheus.doc} tan
Calcula o valor da tangente de um ângulo \(em radianos\).

@type binary function
@sintax Tan(<nAngle>) => numeric
@return numeric, Retorna o valor da tangente de acordo com o ângulo informado.

@param <nangle>, numeric, Indica o valor do ângulo em radianos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tan
/*/
binary function tan(nangle)
return


/*/{Protheus.doc} tarcompress
Armazena arquivos e diretórios em um único arquivo no formato TAR \(Tape ARchive\).

@type binary function
@sintax TarCompress(<aItens>, <cDest>, [lChangeCase]) => character
@return character, Em caso de sucesso, retorna o nome do arquivo criado, incluindo o rootpath onde o arquivo no formato TAR foi criado; caso dê erro, retorna uma string em branco \(""\).

@param <aitens>, array, Indica os arquivos e diretórios que serão armazenados.
@param <cdest>, character, Indica o nome do arquivo que será gerado com a extensão ".tar".
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tarcompress
/*/
binary function tarcompress(aitens, cdest, lchangecase)
return


/*/{Protheus.doc} tardecomp
Restaura os arquivos e diretórios contidos em um arquivo no formato TAR \(Tape ARchive\)

@type binary function
@sintax TarDecomp(<cTarFile>, <cOutDir>, [@nFilesOut], [lChangeCase]) => logical
@return logical, Retorna verdadeiro \(**.T.**\), se a descompactação for realizada com sucesso; caso contrário, retorna falso \(**.F.**\).

@param <ctarfile>, character, Indica o nome do arquivo \( com formato TAR \) cujo conteúdo será restaurado.
@param <coutdir>, character, Indica o diretório onde os arquivos, contidos no arquivo TAR, serão restaurados.
@param [@nfilesout], numeric, Retorna o número de arquivos extraídos na operação.
@param [lchangecase], logical, Se verdadeiro \(.T.\), nomes de arquivos e pastas serão convertidos para letras minúsculas; caso contrário, falso \(.F.\), não será feito nenhum ajuste no nome do arquivo informado. Valor padrão \(.T.\). Veja maiores informações em Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tardecomp
/*/
binary function tardecomp(ctarfile, coutdir, nfilesout, lchangecase)
return


/*/{Protheus.doc} tcalter
Altera a estrutura de uma tabela.

@type binary function
@sintax TCAlter(<cTable>, <aEstruturaAtual>, <aEstruturaNova>, [@nErro]) => logical
@return logical, Retorna **.T.** se a alterção for realizada com sucesso, caso contrário, retorna **.F.**

@param <ctable>, character, Indica o nome da tabela que será alterada.
@param <aestruturaatual>, array, Indica o array que contém as informações dos campos atuais da tabela.
@param <aestruturanova>, array, Indica o array que contém a nova estrutura desejada para a tabela.
@param [@nerro], numeric, Caso ocorra algum erro na alteração da estrutura, o número do erro do DBAccess será retornado através desta variável.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcalter
/*/
binary function tcalter(ctable, aestruturaatual, aestruturanova, nerro)
return


/*/{Protheus.doc} tcapibuild
Retorna a build do biblioteca client do DBAccess, a DBAPI.

@type binary function
@sintax TCAPIBuild() => character
@return character, Retorna uma string contendo a build e a data de geração da DBAPI.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcapibuild
/*/
binary function tcapibuild()
return


/*/{Protheus.doc} tccanopen
Verifica se uma tabela e/ou índice existe.

@type binary function
@sintax TCCanOpen(<cTable>, [cIndex]) => logical
@return logical, Retorna **.T.** se a tabela e/ou índice existir, caso contrário, retorna **.F.**

@param <ctable>, character, Nome da tabela.
@param [cindex], character, Nome do índice.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tccanopen
/*/
binary function tccanopen(ctable, cindex)
return


/*/{Protheus.doc} tccommit
Realiza o controle de transação no DBAccess

@type binary function
@sintax TCCommit(<nOption>, [xParam]) => Nil
@return Nil, Sempre retorna nulo.

@param <noption>, numeric, Numero relacionado a ação do TCCommit
@param [xparam], variant, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tccommit
/*/
binary function tccommit(noption, xparam)
return


/*/{Protheus.doc} tcdelfile
Exclui uma tabela ou view de um banco relacional, através do DBAccess.

@type binary function
@sintax TCDelFile(<cName>) => logical
@return logical, Retorna **.T.** se excluiu com sucesso, caso contrário, retorna **.F.**

@param <cname>, character, Nome da Tabela/View a ser excluida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcdelfile
/*/
binary function tcdelfile(cname)
return


/*/{Protheus.doc} tcdelindex
Exclui um índice de um arquivo do banco de dados relacional, através do DBAccess.

@type binary function
@sintax TCDelIndex(<cTable>, <cIndex>) => logical
@return logical, Retorna verdadeiro \(.T.\), se o índice da tabela for excluída com sucesso; caso contrário, falso \(.F.\).

@param <ctable>, character, Indica o nome da tabela a qual o índice pertence.
@param <cindex>, character, Indica o nome do índice a ser excluído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcdelindex
/*/
binary function tcdelindex(ctable, cindex)
return


/*/{Protheus.doc} tcfilterex
Define um filtro de visualização do alias corrente.

@type binary function
@sintax TCFilterEx(<cQuery>, <nSlot>) => logical
@return logical, Retorna .T. \(Verdadeiro\) no caso de sucesso. No caso de erro retorna .F. \(Falso\).

@param <cquery>, character, Condição de filtro expressada em uma string.
@param <nslot>, numeric, Slot do filtro, deve ser maior que 0 \(Zero\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcfilterex
/*/
binary function tcfilterex(cquery, nslot)
return


/*/{Protheus.doc} tcgenqry
Permite a abertuda de uma query diretamente no banco de dados utilizado na conexão atual, mediante uso da RDD TOPCONN. O retorno desta função deve ser passado como 3º parâmetro da função **DbUseArea**, conforme exemplo abaixo.

@type binary function
@sintax TCGenQry(<xPar1>, <xPar2>, <cQuery>) => character
@return character, Retorna sempre uma string vazia.

@param <xpar1>, Nil, Compatibilidade.
@param <xpar2>, Nil, Compatibilidade.
@param <cquery>, character, Indica a expressão da query que será aberta.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgenqry
/*/
binary function tcgenqry(xpar1, xpar2, cquery)
return


/*/{Protheus.doc} tcgetbuild
Retorna a build do DBAccess em que está conectado.

@type binary function
@sintax TCGetBuild([lDate]) => character
@return character, Retorna uma string contendo a build do DBAccess em que está conectado.

@param [ldate], logical, Indica se incluirá ou não a data de geração da build no valor que será retornado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetbuild
/*/
binary function tcgetbuild(ldate)
return


/*/{Protheus.doc} tcgetconn
Recupera o número da conexão ativa com o DBAccess.

@type binary function
@sintax TCGetConn() => numeric
@return numeric, Retorna o número da conexão ativa.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetconn
/*/
binary function tcgetconn()
return


/*/{Protheus.doc} tcgetdb
Recupera o tipo do banco de dados relacional, em uso, pela conexão atual com o DBAccess.

@type binary function
@sintax TCGetDB() => character
@return character, Retorna uma string contendo um identificador do banco de dados em uso pela conexão atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetdb
/*/
binary function tcgetdb()
return


/*/{Protheus.doc} tcgetdbsid
Retorna uma string que identifica a conexão atualmente em uso no SGDB utilizado.

@type binary function
@sintax TCGetDBSID() => character
@return character, Retorna um identificador string único, que identifica a conexão atual no SGDB.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetdbsid
/*/
binary function tcgetdbsid()
return


/*/{Protheus.doc} tcgetinfo
Retorna informações sobre o DBAccess conectado atualmente

@type binary function
@sintax TCGetInfo([nInfo], [cParam]) => character
@return character, Retorna uma string AdvPL com a informação desejada.

@param [ninfo], numeric, Indica o número da informação a ser recuperada.
@param [cparam], character, Para alguns tipos de informação, permite informar um parâmetro adicional ou critério de informação de retorno.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetinfo
/*/
binary function tcgetinfo(ninfo, cparam)
return


/*/{Protheus.doc} tcgetio
Retorna um array de rotinas e IOs/segundos do DBAccess.

@type binary function
@sintax TCGetIO(<nThreshold>) => array
@return array, Retorna um array com a seguinte estrutura: Coluna 1: Rotina - Coluna 2: IOs/Segundo.

@param <nthreshold>, numeric, Indica o limite de IOs/segundos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetio
/*/
binary function tcgetio(nthreshold)
return


/*/{Protheus.doc} tcgetsid
Retorna o número do processo em uso no TOTVS \| DBAccess para a conexão atual.

@type binary function
@sintax TCGetSID() => numeric
@return numeric, Retorna o número da thread da conexão atual com o DBAccess.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcgetsid
/*/
binary function tcgetsid()
return


/*/{Protheus.doc} tcisconnected
Função para verificar se está conectado no banco de dados.

@type binary function
@sintax TCIsConnected([nHwnd]) => logical
@return logical, Retorna **.T.** se está conectado, caso contrário, retorna **.F.**

@param [nhwnd], numeric, Número da conexão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcisconnected
/*/
binary function tcisconnected(nhwnd)
return


/*/{Protheus.doc} tcisview
Função para verificar por nome se um objeto é uma view.

@type binary function
@sintax TCIsView(<cName>) => logical
@return logical, Retorna **.T.** se o nome informado pertece a uma view, caso contrário, retorna **.F.**

@param <cname>, character, Nome da tabela/view a ser verificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcisview
/*/
binary function tcisview(cname)
return


/*/{Protheus.doc} tcisvlock
Indica se está o DBAccess possui o recurso de Virtual Locks.

@type binary function
@sintax TCIsVLock() => logical
@return logical, Retorna verdadeiro \(.T.\) se o DBAccess tiver o recurso de Virtual Locks; caso contrário, retorna falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcisvlock
/*/
binary function tcisvlock()
return


/*/{Protheus.doc} tclink
Cria uma nova conexão com um banco de dados SGBD através do DBAccess.

@type binary function
@sintax TCLink([cConn], [cServerAddr], [nPort]) => numeric
@return numeric, Retorna um identificador numérico igual ou maior que zero para a conexão em caso de sucesso. Em caso de falha, será retornado um número negativo, indicando uma ocorrência de falha na conexão.

@param [cconn], character, Indica a string de conexão do DBAccess, composta por um identificador do tipo da conexão mais o nome do **"alias/environment"** da conexão. \(Padrão = DBDatabase e DBAlias configurado no appserver.ini\)
@param [cserveraddr], character, Indica o nome ou endereço IP do servidor onde está o DBAccess onde a conexão deve ser realizada. \(Padrão = DBServer configurado no appserver.ini\)
@param [nport], numeric, Indica o número da porta TCP que o DBAccess está configurado aguardando por novas conexões. \(Padrão = 7890\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tclink
/*/
binary function tclink(cconn, cserveraddr, nport)
return


/*/{Protheus.doc} tcmaxmap
Altera o valor minimo de campos da tabela para realizar o **TCSrvMap**

@type binary function
@sintax TCMaxMap(<cNum>) => Nil
@return Nil, Sempre retorna nulo.

@param <cnum>, numeric, Numero de colunas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcmaxmap
/*/
binary function tcmaxmap(cnum)
return


/*/{Protheus.doc} tcobject
Informa se um objeto existe no SGBD conectado.

@type binary function
@sintax TCObject(<cObject>, [@cType]) => logical
@return logical, Retorna verdadeiro \(.T.\) se o objeto existir no SGBD em que está conectado; caso contrário, falso \(.F.\).

@param <cobject>, character, Indica o nome do objeto que será procurado.
@param [@ctype], character, Indica o tipo do objeto procurado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcobject
/*/
binary function tcobject(cobject, ctype)
return


/*/{Protheus.doc} tcping
Recupera a latência entre o DBAccess e o SGDB

@type binary function
@sintax TCPing(<nCount>) => numeric
@return numeric, média da latência em segundos com precisão em milissegundos.

@param <ncount>, numeric, Quantidade de pacotes enviados, deve ser maior que 0 \(Zero\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcping
/*/
binary function tcping(ncount)
return


/*/{Protheus.doc} tcquit
Finaliza todas as conexões ativas.

@type binary function
@sintax TCQuit() => logical
@return logical, Retorna .T. quando a função finalizou todas as conexões ativas com sucesso, se não retorna .F.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcquit
/*/
binary function tcquit()
return


/*/{Protheus.doc} tcrefresh
Atualiza as definições globais de uma tabela no cache de definições do DBAccess.

@type binary function
@sintax TCRefresh(<cTable>) => Nil
@return Nil, Esta função sempre retorna nulo.

@param <ctable>, character, Indica o nome da tabela para atualizar o cache de definições do DBAccess.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcrefresh
/*/
binary function tcrefresh(ctable)
return


/*/{Protheus.doc} tcsetconn
Permite alternar entre as conexões ativas com o DBAccess.

@type binary function
@sintax TCSetConn(<nHandle>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a conexão corrente for trocada com sucesso. Se a conexão informada não existir ou já estiver sido fechada, a conexão atual é mantida e a função retorna falso \(.F.\).

@param <nhandle>, numeric, Indica o número da conexão que deve ser tornar a corrente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsetconn
/*/
binary function tcsetconn(nhandle)
return


/*/{Protheus.doc} tcsetfield
Altera o tratamento, do tipo de dado ou precisão, para um campo/coluna retornada através de uma query.

@type binary function
@sintax TCSetField(<cAlias>, <cField>, <cType>, [nSize], [nPrecision]) => NIL
@param <calias>, character, Indica o alias da query.
@param <cfield>, character, Indica o nome do campo/coluna de retorno.
@param <ctype>, character, Indica o tipo de dado a ser retornado através deste campo/coluna, que pode ser: D \(Data\), N \(Numérico\) ou L \(Lógico\).
@param [nsize], numeric, Indica o tamanho do campo. Valor padrão: 0 \(zero\).
@param [nprecision], numeric, Indica a quantidade de decimais do campo. Valor padrão: 0 \(zero\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsetfield
/*/
binary function tcsetfield(calias, cfield, ctype, nsize, nprecision)
return


/*/{Protheus.doc} tcsetparam
Insere ou atualiza um parâmetro na TOP_PARAM.

@type binary function
@sintax TCSetParam(<cParam>, <cValue>) => numeric
@return numeric, Retorna 0 \(zero\) se a operação foi completada com sucesso ou diferente em caso de erro.

@param <cparam>, character, Indica o nome do parâmetro que será criado ou atualizado.
@param <cvalue>, character, Indica o valor do parâmetro indicado em **cParam**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsetparam
/*/
binary function tcsetparam(cparam, cvalue)
return


/*/{Protheus.doc} tcsetvidx
Liga ou desliga o modo de virtualização automática de índices em tempo de execução.

@type binary function
@sintax TCSetVIdx(<lSet>) => logical
@return logical, Retorna o valor definido para a virtualização automática.

@param <lset>, logical, Indica se a virtualização automática deve ser ativada \(**.T.**\) ou desativada \(**.F.**\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsetvidx
/*/
binary function tcsetvidx(lset)
return


/*/{Protheus.doc} tcspexec
Função que executa uma stored procedure no banco de dados atual.

@type binary function
@sintax TCSPExec(<cStoredProcedure>, [xParam]) => array
@return array, Retorna um array que contêm os valores de retorno da stored procedure. O retorno será nulo se nenhum valor for retornado pela stored procedure ou ocorrer algum erro na chamada da procedure.

@param <cstoredprocedure>, character, Nome da stored procedure a ser executada.
@param [xparam], character, Indica uma ou mais expressões, separadas por vírgula, indicando os parâmetros necessários para a execução da stored procedure.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcspexec
/*/
binary function tcspexec(cstoredprocedure, xparam)
return


/*/{Protheus.doc} tcspexist
Função verifica a existência de uma stored procedure no banco de dados atual.

@type binary function
@sintax TCSPExist(<cStoredProc>) => logical
@return logical, Retorna **.T.** se a stored procedure existir, caso contrário, retorna **.F.**

@param <cstoredproc>, character, Nome da stored procedure a ser verificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcspexist
/*/
binary function tcspexist(cstoredproc)
return


/*/{Protheus.doc} tcsqlerror
Recupera uma string contendo a última ocorrência de erro de execução de statement e/ou operação.

@type binary function
@sintax TCSqlError() => numeric
@return numeric, Retorna uma string contendo a última mensagem e/ou ocorrênca de erro da conexão atual do DBAccess, registrada após o último statement executado. Caso o último statement executado não apresente erro, ou ainda o processo atual não possua nenhuma conexão ativa com o DBAccess, a função retornará uma string vazia \(""\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsqlerror
/*/
binary function tcsqlerror()
return


/*/{Protheus.doc} tcsqlexec
Executa uma sentença de sintaxe SQL \(Structured Query Language\).

@type binary function
@sintax TCSqlExec(<cStatement>) => numeric
@return numeric, Retorna o status da execução. Se menor que 0 indica que a sentença não foi executada com sucesso.

@param <cstatement>, character, Indica a string que contém a sentença que será informada à função e executada no banco de dados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsqlexec
/*/
binary function tcsqlexec(cstatement)
return


/*/{Protheus.doc} tcsqlreplay
Permite habilitar e desabilitar a coleta de logs de trace de execuções do DBaccess via TOTVS \| Application Server das conexões ativas do processo atual.

@type binary function
@sintax TCSQLReplay(<nOption>, <@cMessage>) => logical
@return logical, Retorna **.T.** se a stored procedure existir, caso contrário, retorna **.F.**

@param <noption>, numeric, Opção desejada detalhada nas observações.
@param <@cmessage>, character, Parametro de entrada e/ou Mensagem de retorno
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsqlreplay
/*/
binary function tcsqlreplay(noption, cmessage)
return


/*/{Protheus.doc} tcsrvmap
Mapeia os campos de seleção no banco de dados.

@type binary function
@sintax TCSrvMap(<cAlias>, [cMap], [bRefresh]) => logical
@return logical, .T. \(Verdadeiro\) caso de sucesso, caso contrário, .F. \(Falso\).

@param <calias>, character, Alias da área de trabalho.
@param [cmap], character, Campos da tabela separado por virgula.
@param [brefresh], logical, Flag para realizar um refresh após o mapeamento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsrvmap
/*/
binary function tcsrvmap(calias, cmap, brefresh)
return


/*/{Protheus.doc} tcsrvtype
Retorna uma string que identifica o tipo da plataforma da conexão ativa/atual do DBAccess.

@type binary function
@sintax TCSrvType() => character
@return character, Retorna uma string contendo o tipo da plataforma do DBAccess em uso pela conexão atual. Caso não haja conexão ativa, será retornada uma string em branco.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcsrvtype
/*/
binary function tcsrvtype()
return


/*/{Protheus.doc} tcstruct
Retorna um array contendo a estrutura da tabela ou view no SGBD.

@type binary function
@sintax TCStruct(<cName>) => array
@return array, Retorna um array contendo a estrutura de **cName** no SGBD.

@param <cname>, character, Indica o nome da tabela ou view no SGBD.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcstruct
/*/
binary function tcstruct(cname)
return


/*/{Protheus.doc} tcunique
Cria uma chave unica para a tabela corrente.

@type binary function
@sintax TCUnique(<cAlias>, [cColumn]) => numeric
@return numeric, 0 no caso de sucesso. No caso de erro retorna os numeros de erros.

@param <calias>, character, Alias da tabela corrente.
@param [ccolumn], character, Nome das coluna da tabela.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcunique
/*/
binary function tcunique(calias, ccolumn)
return


/*/{Protheus.doc} tcunlink
Encerra a conexão especificada com o DBAccess.

@type binary function
@sintax TCUnlink([nHandle], [lVerbose]) => logical
@return logical, Retorna verdadeiro \(.T.\), se a conexão for encerrada com sucesso; caso contrário, falso \(.F.\), se houver falha de execução.

@param [nhandle], numeric, Indica o número da conexão que será finalizada.
@param [lverbose], logical, Caso especificado **.T.**, mostra mensagens de advertência do log de console, como por exemplo fechamento automático de alias da conexão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcunlink
/*/
binary function tcunlink(nhandle, lverbose)
return


/*/{Protheus.doc} tcview2db
Função para materializar uma view e seus dados em uma tabela física.

@type binary function
@sintax TCView2DB(<cView>, <cTable>) => logical
@return logical, Retorna **.T.** se tabela cTable foi criada, caso contrário, retorna **.F.** e o motivo do erro pode ser verificado com a função [TCSQLError](TCSQLError).

@param <cview>, character, Nome da view a ser materializada.
@param <ctable>, character, Nome da tabela a ser criada no SGBD.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcview2db
/*/
binary function tcview2db(cview, ctable)
return


/*/{Protheus.doc} tcviewmulti
Cria uma view para multiplas tabelas, sendo possível, mapear somente os campos que são relevantes a regra de negócio.

@type binary function
@sintax TCViewMulti(<cView>, <cTable>, <cStruct>) => logical
@return logical, Retorna **.T.** se a view foi criada, caso contrário, retorna **.F.** e o motivo do erro pode ser verificado com a função [TCSQLError](TCSQLError).

@param <cview>, character, Nome da view a ser criada.
@param <ctable>, character, Nome da tabela master da view.
@param <cstruct>, character, Estrutura da view a ser criada, que consiste de uma lista de valores separados por virgula, onde é necessário informar a tabela e o campo da tabela que será mapeada na view, veja o exemplo abaixo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcviewmulti
/*/
binary function tcviewmulti(cview, ctable, cstruct)
return


/*/{Protheus.doc} tcviewone
Cria uma view para uma tabela no modelo 1 para 1, ou seja, todos os campos da tabela serão mapeados na view.

@type binary function
@sintax TCViewOne(<cView>, <cTable>) => logical
@return logical, Retorna **.T.** se a view foi criada, caso contrário, retorna **.F.** e o motivo do erro pode ser verificado com a função [TCSQLError](TCSQLError).

@param <cview>, character, Nome da view a ser criada.
@param <ctable>, character, Nome da tabela master da view.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcviewone
/*/
binary function tcviewone(cview, ctable)
return


/*/{Protheus.doc} tcviewren
Permite renomear uma View do SGBD, criada através das funções TCViewOne\(\) e/ou TCViewMulti\(\).

@type binary function
@sintax TCViewRen(<cViewName>, <cViewNewName>) => logical
@return logical, Retorna .T. em caso de sucesso na operação de renomear a View. Caso contrário retorna .F., e maiores informações sobre a falha na operação podem ser obtidas através da função TCSqlError\(\)

@param <cviewname>, character, Indica o nome da View existente a ser renomeada.
@param <cviewnewname>, character, Indica o novo nome da View a ser renomeada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcviewren
/*/
binary function tcviewren(cviewname, cviewnewname)
return


/*/{Protheus.doc} tcviewstruct
Função que recebe o nome da view como parâmetro e retorna o nome da tabela master e a estrutura da view, no formato \(table,field,table,field,...\)

@type binary function
@sintax TCViewStruct(<cView>, <@cTable>, <@cStruct>) => logical
@return logical, Retorna **.T.** em caso de sucesso, caso contrário, retorna **.F.** e o motivo do erro pode ser verificado com a função [TCSQLError](TCSQLError).

@param <cview>, character, Nome da view.
@param <@ctable>, character, Variável que será preenchida com nome da tabela master.
@param <@cstruct>, character, Variável que será preenchida com a estrutura da view informada em cView.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcviewstruct
/*/
binary function tcviewstruct(cview, ctable, cstruct)
return


/*/{Protheus.doc} tcvlock
Faz lock virtual nomeado no DBAccess.

@type binary function
@sintax TCVLock(<cName>) => logical
@return logical, Retorna se o lock virtual foi feito com sucesso ou não.

@param <cname>, character, Indica o nome do lock virtual que será feito no DBAccess.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcvlock
/*/
binary function tcvlock(cname)
return


/*/{Protheus.doc} tcvunlock
Realiza unlock de um ou mais locks virtuais no DBAccess.

@type binary function
@sintax TCVUnlock([cName]) => logical
@return logical, Retorna .T. se o unlock foi feito com sucesso se não retorna .F.

@param [cname], character, Indica o nome do lock virtual a realizar unlock.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcvunlock
/*/
binary function tcvunlock(cname)
return


/*/{Protheus.doc} tdsvarinfo
Retorna um texto contendo o nome, tipo e o conteúdo da váriavel informada.

@type binary function
@sintax TDSVarinfo(<cNomeVar>, <Var>) => character
@return character, Informações da variável.

@param <cnomevar>, character, Nome da variável que será analisada.
@param <var>, variant, Variável que será analisada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tdsvarinfo
/*/
binary function tdsvarinfo(cnomevar, var)
return


/*/{Protheus.doc} tfiledialog
Apresenta uma janela nativa com a estrutura de arquivos do lado do SmartClient.

@type binary function
@sintax tFileDialog(<cMensagem>) => character
@return character, Retorna o nome do item. Caso nenhum item tenha sido selecionado, o retorna será uma string vazia.

@param <cmensagem>, character, Indica a mensagem que será apresentada no console do Application Server.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tfiledialog
/*/
binary function tfiledialog(cmensagem)
return


/*/{Protheus.doc} threadcount
Retorna o número de threads/processos ativos no serviço do Application Server onde a função foi executada.

@type binary function
@sintax ThreadCount() => numeric
@return numeric, Retorna o número de threads/processos ativos.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/threadcount
/*/
binary function threadcount()
return


/*/{Protheus.doc} threadid
Retorna o ID \(número de identificação\) da thread em que a chamada da função foi realizada.

@type binary function
@sintax ThreadId() => numeric
@return numeric, Retorna um numérico com o ID da thread.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/threadid
/*/
binary function threadid()
return


/*/{Protheus.doc} threadtimeout
Ligar ou desligar o InactiveTimeout na thread corrente

@type binary function
@sintax ThreadTimeout([Segundos]) => numeric
@return numeric, O InactiveTimeout corrente da thread

@param [segundos], numeric, Quantidade de segundos para ativar o timeout da thread
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/threadtimeout
/*/
binary function threadtimeout(segundos)
return


/*/{Protheus.doc} time
Retorna a hora do sistema operacional. Essa função é utilizada para apresentar ou imprimir a hora do sistema operacional em um relatório ou tela.

@type binary function
@sintax Time() => character
@return character, Retorna a hora do sistema operacional como string na forma **hh:mm:ss**.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/time
/*/
binary function time()
return


/*/{Protheus.doc} timecounter
Recupera o valor do contador de desempenho, pode ser usado para medições de intervalo de tempo.

@type binary function
@sintax timecounter() => numeric
@return numeric, Retorna um intervalo de tempo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/timecounter
/*/
binary function timecounter()
return


/*/{Protheus.doc} timefull
Retorna a hora atual completa, contendo hora, minuto, segundo e milésimo de segundo

@type binary function
@sintax TimeFull() => numeric
@return numeric, Retorna a hora atual

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/timefull
/*/
binary function timefull()
return


/*/{Protheus.doc} timeglbvalue
Retorna a quantidade de segundos decorrida desde o último acesso \( criação, atualização ou leitura \) de uma variável global.

@type binary function
@sintax TimeGlbValue(<cGlbName>) => numeric
@return numeric, Retorna tempo \( em segundos \) decorrido desde o último acesso à variável global. Caso não exista na memória identificador global com o nome informado, a função retorna -1

@param <cglbname>, character, Indica o nome da variável global.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/timeglbvalue
/*/
binary function timeglbvalue(cglbname)
return


/*/{Protheus.doc} tran
Define uma expressão que resulta num valor do tipo caracter, data, numérico ou lógico e que será convertido para caracter e formatado.

@type binary function
@sintax TRAN() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tran
/*/
binary function tran()
return


/*/{Protheus.doc} trans
Define uma expressão que resulta num valor do tipo caracter, data, numérico ou lógico e que será convertido para caracter e formatado.

@type binary function
@sintax TRANS() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/trans
/*/
binary function trans()
return


/*/{Protheus.doc} transf
Define uma expressão que resulta num valor do tipo caracter, data, numérico ou lógico e que será convertido para caracter e formatado.

@type binary function
@sintax TRANSF() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/transf
/*/
binary function transf()
return


/*/{Protheus.doc} transfo
Define uma expressão que resulta num valor do tipo caracter, data, numérico ou lógico e que será convertido para caracter e formatado.

@type binary function
@sintax TRANSFO() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/transfo
/*/
binary function transfo()
return


/*/{Protheus.doc} transfor
Define uma expressão que resulta num valor do tipo caracter, data, numérico ou lógico e que será convertido para caracter e formatado.

@type binary function
@sintax TRANSFOR() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/transfor
/*/
binary function transfor()
return


/*/{Protheus.doc} transform
Define uma expressão que resulta num valor do tipo caractere, data, numérico ou lógico e que será convertido para caractere e formatado.

@type binary function
@sintax TRANSFORM() => NIL
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/transform
/*/
binary function transform()
return


/*/{Protheus.doc} left
Retorna um determinado número da caracteres à esquerda de uma string.

@type binary function
@sintax Left(<cText>, <nCount>) => character
@return character, Retorna uma cópia da string, iniciando a partir do caractere final da string \(último caractere da esquerda\), considerando o número de caracteres especificado no segundo parâmetro.

@param <ctext>, character, Indica o texto que será tratado.
@param <ncount>, numeric, Indica o número de caracteres à esquerda a serem retornados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/left
/*/
binary function left(ctext, ncount)
return


/*/{Protheus.doc} space
Retorna uma string com uma quantidade especificada de espaços.

@type binary function
@sintax Space(<nCount>) => character
@return character, Retorna uma string com espaços.

@param <ncount>, numeric, Indica a quantidade de espaços que serão retornados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/space
/*/
binary function space(ncount)
return


/*/{Protheus.doc} val
Converte uma sequência de caracteres que contêm dígitos em um valor numérico.

@type binary function
@sintax Val(<cString>) => numeric
@return numeric, Retorna um valor numérico.

@param <cstring>, character, Indica uma string que contém uma sequência de números a serem convertidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/val
/*/
binary function val(cstring)
return


/*/{Protheus.doc} ttcloudenv
Retorna um número definido na chave TOTVSCLOUD no arquivo de configuração do Application Server.

@type binary function
@sintax TTCloudEnv([nEnv]) => numeric
@return numeric, Retorna o número definido no arquivo de configurações ou o passado pelo parâmetro nEnv.

@param [nenv], numeric, Indica o número correspondente ao ambiente cloud que o Application Server está sendo utilizado. **.F.**.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ttcloudenv
/*/
binary function ttcloudenv(nenv)
return


/*/{Protheus.doc} type
Retorna o tipo de dado de uma expressão ou variável.

@type binary function
@sintax Type(<cExpr>) => character
@return character, Retorna o tipo de dado da expressão informada.

@param <cexpr>, character, Indica a expressão e/ou o nome da variável a ser verificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/type
/*/
binary function type(cexpr)
return


/*/{Protheus.doc} uncompress
Descompacta um buffer \(gerado pela função **Compress**\) recebido através do algoritmo proprietário.

@type binary function
@sintax UnCompress(<@cBufferOut>, <@nLenghtOut>, <cBufferIn>, <nLenghtIn>) => logical
@return logical, Retorna verdadeiro \(.T.\), se o buffer for descompactado com sucesso; caso contrário, falso \(.F.\).

@param <@cbufferout>, character, Indica a variável string que receberá o buffer descompactado.
@param <@nlenghtout>, numeric, Indica o tamanho do buffer descompactado.
@param <cbufferin>, character, Indica o buffer que será descompactado.
@param <nlenghtin>, numeric, Indica o tamanho do buffer compactado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/uncompress
/*/
binary function uncompress(cbufferout, nlenghtout, cbufferin, nlenghtin)
return


/*/{Protheus.doc} unstuff
Altera uma sequência de bits de uma string para 0.

@type binary function
@sintax UnStuff(<@cStr>, <nStart>, <nTest>, <nLength>) => NIL
@param <@cstr>, character, Indica a string que será modificada.
@param <nstart>, numeric, Indica o índice do bit inicial.
@param <ntest>, numeric, Indica a quantidade de bits que serão colocados em 0.
@param <nlength>, numeric, Indica o índice do último byte que será modificado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/unstuff
/*/
binary function unstuff(cstr, nstart, ntest, nlength)
return


/*/{Protheus.doc} used
Determina se há um arquivo de banco de dados em uso na área de trabalho especificada.

@type binary function
@sintax Used() => logical
@return logical, Retorna verdadeiro \(.T.\), se existir um arquivo de banco de dados em uso; caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/used
/*/
binary function used()
return


/*/{Protheus.doc} userexception
Força um erro, na linguagem AdvPL, para que possa ser tratado posteriormente. Para isso, esta função recebe uma string com a descrição do erro que será apresentada de acordo com o ambiente que está executando.

@type binary function
@sintax UserException([cDescricao]) => numeric
@return numeric, \(Nulo\)

@param [cdescricao], character, Indica a string que contém a descrição do erro forçado através da função.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/userexception
/*/
binary function userexception(cdescricao)
return


/*/{Protheus.doc} utctolocal
Converte data e hora UTC para data e hora local.

@type binary function
@sintax UTCToLocal(<cDate>, <cTime>, [nDST]) => array
@return array, Retorna um array contendo a data \(yyyyMMdd\) e a hora \(hh:mm:ss\).

@param <cdate>, character, Indica a data UTC no formato ano, mês e dia. Exemplo: yyyyMMdd.
@param <ctime>, character, Indica a hora UTC no formato hora, minuto e segundo. Exemplo: hh:mm:ss.
@param [ndst], numeric, Caso seja informado o valor 0 \(Default\), indica que o resultado deve representar o horário solar \(ou standard time\). Caso seja informado o valor 1, a data e horário serão a representação de tempo em horário de verão \(Daylight Savings Time\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/utctolocal
/*/
binary function utctolocal(cdate, ctime, ndst)
return


/*/{Protheus.doc} uuidrandom
Cria um identificador UUID \(do inglês Universally Unique IDentifier\) exclusivo

@type binary function
@sintax UUIDRandom() => character
@return character, Identificador exclusivo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/uuidrandom
/*/
binary function uuidrandom()
return


/*/{Protheus.doc} uuidrandomseq
Cria um identificador UUID \(do inglês Universally Unique IDentifier\) exclusivo sequencial.

@type binary function
@sintax UUIDRandomSeq() => character
@return character, Identificador exclusivo.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/uuidrandomseq
/*/
binary function uuidrandomseq()
return


/*/{Protheus.doc} valtype
Retorna um caractere que identifica o tipo de dado da variável informada através do parâmetro.

@type binary function
@sintax ValType(<xParam>) => character
@return character, Retorna um caractere que identifica o tipo de dado informado.

@param <xparam>, variant, Indica o dado ou a variável que se deseja identificar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/valtype
/*/
binary function valtype(xparam)
return


/*/{Protheus.doc} varbegint
Inicia a transação em uma "chave", bloqueando o acesso aos seus valores nas tabelas "Tabela X" e "Tabela A".

@type binary function
@sintax VarBeginT([cUID], [cKeyWrk]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [ckeywrk], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varbegint
/*/
binary function varbegint(cuid, ckeywrk)
return


/*/{Protheus.doc} varclean
Remove todos os dados das "Tabela X" e "Tabela A" de uma sessão <cUID>, assim como todas as transações de chaves.

@type binary function
@sintax VarClean([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varclean
/*/
binary function varclean(cuid)
return


/*/{Protheus.doc} varcleana
Remove os valores de todas as chaves da "Tabela A"

@type binary function
@sintax VarCleanA([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varcleana
/*/
binary function varcleana(cuid)
return


/*/{Protheus.doc} varcleanx
Remove os valores de todas as chaves da "Tabela X"

@type binary function
@sintax VarCleanX([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varcleanx
/*/
binary function varcleanx(cuid)
return


/*/{Protheus.doc} vardel
Remove o valor de uma chave na "Tabela X" e na "Tabela A".

@type binary function
@sintax VarDel([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vardel
/*/
binary function vardel(cuid, cchave)
return


/*/{Protheus.doc} vardela
Remove o valor de uma chave na "Tabela A"

@type binary function
@sintax VarDelA([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vardela
/*/
binary function vardela(cuid, cchave)
return


/*/{Protheus.doc} vardelx
Remove o valor de uma chave na "Tabela X"

@type binary function
@sintax VarDelX([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vardelx
/*/
binary function vardelx(cuid, cchave)
return


/*/{Protheus.doc} varendt
Finaliza a transação em uma "chave", liberando novamente o acesso aos valores desta "chave" nas tabelas "Tabela X" e "Tabela A".

@type binary function
@sintax VarEndT([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varendt
/*/
binary function varendt(cuid, cchave)
return


/*/{Protheus.doc} varget
Recupera o valor de uma "chave" de forma transacionada/síncrona na "Tabela X" e na "Tabela A" de uma determinada sessão, pois faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarGet([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, dentificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varget
/*/
binary function varget(cuid, cchave)
return


/*/{Protheus.doc} varget_a
Obtém uma lista com todas as chaves e seus respectivos valores das tabelas "Tabela X" e "Tabela A".

@type binary function
@sintax VarGet_A([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varget_a
/*/
binary function varget_a(cuid)
return


/*/{Protheus.doc} vargeta
Recupera o valor de uma "chave" na "Tabela A" de uma determinada sessão, e faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarGetA([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargeta
/*/
binary function vargeta(cuid)
return


/*/{Protheus.doc} vargetaa
Obtém uma lista com todas as chaves e seus respectivos valores da "Tabela A".

@type binary function
@sintax VarGetAA([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetaa
/*/
binary function vargetaa(cuid)
return


/*/{Protheus.doc} vargetad
Recupera o valor de uma "chave" na "Tabela A" de uma determinada sessão, sem fazer bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarGetAD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetad
/*/
binary function vargetad(cuid, cchave)
return


/*/{Protheus.doc} vargetd
Recupera o valor de uma "chave" tanto da "Tabela X" quanto da "Tabela A" de uma determinada sessão, mas não faz bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarGetD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetd
/*/
binary function vargetd(cuid, cchave)
return


/*/{Protheus.doc} vargetx
Recupera o valor de uma "chave" na "Tabela X" de uma determinada sessão, e faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarGetX([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetx
/*/
binary function vargetx(cuid, cchave)
return


/*/{Protheus.doc} vargetxa
Obtém uma lista com todas as chaves e seus respectivos valores da "Tabela X".

@type binary function
@sintax VarGetXA([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetxa
/*/
binary function vargetxa(cuid)
return


/*/{Protheus.doc} vargetxd
Recupera o valor de uma "chave" na "Tabela X" de uma determinada sessão, sem fazer bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarGetXD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vargetxd
/*/
binary function vargetxd(cuid, cchave)
return


/*/{Protheus.doc} varisuid
Verifica se o identificador da sessão de variáveis globais fornecido está associado a um HashMap global.

@type binary function
@sintax VarIsUID([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varisuid
/*/
binary function varisuid(cuid)
return


/*/{Protheus.doc} varprint
descrição da funcao

@type binary function
@sintax VarPrint([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varprint
/*/
binary function varprint(tnomevar)
return


/*/{Protheus.doc} varprinta
descrição da funcao

@type binary function
@sintax VarPrintA([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varprinta
/*/
binary function varprinta(tnomevar)
return


/*/{Protheus.doc} varprintx
descrição da funcao

@type binary function
@sintax VarPrintX([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varprintx
/*/
binary function varprintx(tnomevar)
return


/*/{Protheus.doc} varref
Cria referência entre duas variáveis.

@type binary function
@sintax VarRef(<cVarRefencia>, <cVarRefencia>) => logical
@return logical, Retorna, verdadeiro \(.T.\), se a referência foi estabelecida com sucesso; caso contrário, falso \(.F.\).

@param <cvarrefencia>, character, Indica o nome da variável que será referência.
@param <cvarrefencia>, character, cVarRefenciada Caracter Indica o nome da variável que será referenciada. Desta forma, toda vez que esta variável for alterada, sua referência também será.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varref
/*/
binary function varref(cvarrefencia, cvarrefencia)
return


/*/{Protheus.doc} varsclean
descrição da funcao

@type binary function
@sintax VarsClean([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsclean
/*/
binary function varsclean(tnomevar)
return


/*/{Protheus.doc} varset
Insere ou Atualiza o valor de uma "chave" na "Tabela X" de uma determinada sessão, e faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarSet([cUID], [cKeyWrk]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [ckeywrk], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varset
/*/
binary function varset(cuid, ckeywrk)
return


/*/{Protheus.doc} varseta
Insere ou Atualiza o valor de uma "chave" na "Tabela A" de uma determinada sessão, e faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarSetA([cUID]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varseta
/*/
binary function varseta(cuid)
return


/*/{Protheus.doc} varsetad
Insere ou Atualiza o valor de uma "chave" na "Tabela A" de uma determinada sessão, sem fazer bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarSetAD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsetad
/*/
binary function varsetad(cuid, cchave)
return


/*/{Protheus.doc} varsetd
Insere ou Atualiza o valor de uma "chave" tanto na "Tabela X" quanto na "Tabela A" de uma determinada sessão, mas não faz bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarSetD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsetd
/*/
binary function varsetd(cuid, cchave)
return


/*/{Protheus.doc} varsetget
Permite associar um bloco de código a uma variável de programa do Advpl, onde o bloco de código será chamado quando a variável for acessada.

@type binary function
@sintax VarSetGet(<cVariavel>, <bBloco>, [lApenasUpdate]) => logical
@return logical, Retorna .T. caso a variável especificada como primeiro parâmetro exista na lista de variávels do programa em execução.

@param <cvariavel>, character, Indica o nome da variável a ser associada com o bloco de código.
@param <bbloco>, codeblock, Indica o bloco de código que será executado quando a variável for acessada.
@param [lapenasupdate], logical, Caso especificado .T., ondica se apenas operação de atribuição \( assign \) deve disparar o bloco de código. Caso informado o valor .F. \( default \), o bloco de código será chamado quando da leitura e/ou atribuição de conteúdo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsetget
/*/
binary function varsetget(cvariavel, bbloco, lapenasupdate)
return


/*/{Protheus.doc} varsetx
Insere ou Atualiza o valor de uma "chave" na "Tabela X" de uma determinada sessão, e faz bloqueio da "chave" <cChave>.

@type binary function
@sintax VarSetX([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsetx
/*/
binary function varsetx(cuid, cchave)
return


/*/{Protheus.doc} varsetxd
Insere ou Atualiza o valor de uma "chave" na "Tabela X" de uma determinada sessão, sem fazer bloqueio da "chave" <cChave> \(Dirty\).

@type binary function
@sintax VarSetXD([cUID], [cChave]) => NIL
@param [cuid], character, Identificador da sessão de Variáveis Globais.
@param [cchave], character, Identificador da chave.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsetxd
/*/
binary function varsetxd(cuid, cchave)
return


/*/{Protheus.doc} varsprint
descrição da funcao

@type binary function
@sintax VarsPrint([@tNomeVar]) => codeblock
@return codeblock, descrição do retorno

@param [@tnomevar], codeblock, descrição do parametro
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varsprint
/*/
binary function varsprint(tnomevar)
return


/*/{Protheus.doc} varunref
Cancela a referência entre duas variáveis.

@type binary function
@sintax VarUnref(<cVarRefencia>) => logical
@return logical, Retorna, verdadeiro \(.T.\), se a referência foi cancelada com sucesso; caso contrário, falso \(.F.\).

@param <cvarrefencia>, character, Nome da variável que é referência.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varunref
/*/
binary function varunref(cvarrefencia)
return


/*/{Protheus.doc} w2bin
Converte um número inteiro em uma string formatada como um inteiro de 16 bits não sinalizado.

@type binary function
@sintax W2Bin(<nInt>) => character
@return character, Retorna uma string de dois bytes que contém um inteiro binário de 16 bits.

@param <nint>, numeric, Indica o valor numérico inteiro que será convertido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/w2bin
/*/
binary function w2bin(nint)
return


/*/{Protheus.doc} waitrun
Executa e aguarda pelo término de um programa externo \(arquivo executável\) através do sistema operacional da estação onde o SmartClient está sendo executado.

@type binary function
@sintax WaitRun(<cExeName>, [nOpc]) => character
@return character, Retorna 0 \(zero\) em caso de sucesso da execução do processo e diferente de zero para erros.

@param <cexename>, character, Indica o nome e extensão do arquivo executável.
@param [nopc], numeric, Indica o modo de interface a ser criado para a execução do programa. Para mais informações consulte observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/waitrun
/*/
binary function waitrun(cexename, nopc)
return


/*/{Protheus.doc} waitrunsrv
Executa um programa externo \(arquivo executável\) no ambiente onde o servidor esta sendo executado.

@type binary function
@sintax WaitRunSrv(<cExeName>, [lWait], [nPath]) => character
@return character, Retorna 0 \(zero\) em caso de sucesso da execução do processo e diferente de zero para erros.

@param <cexename>, character, Indica o nome e extensão do arquivo executável.
@param [lwait], logical, Verdadeiro para a execução aguardar o termino do programa externo, ou falso para não aguardar o termino e continuar a execução do programa.
@param [npath], character, Indica o path de execução onde o programa irá rodar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/waitrunsrv
/*/
binary function waitrunsrv(cexename, lwait, npath)
return


/*/{Protheus.doc} webencript
Realiza a criptografia ou decriptografia de um conteúdo

@type binary function
@sintax WebEncript(<cContent>, [lDecript], [lUseinjava]) => character
@return character, Retorna uma string com o conteúdo encriptado ou decriptado

@param <ccontent>, character, Conteudo que será encriptado ou decriptado.
@param [ldecript], logical, Quando informado verdadeiro \(.T.\) irá decriptar ; quando informado falso \(.F.\) irá encriptar . Quando não informado é encriptado .
@param [luseinjava], logical, Usar .T. quando função for usada com validação em Java.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/webencript
/*/
binary function webencript(ccontent, ldecript, luseinjava)
return


/*/{Protheus.doc} winexec
Executa uma aplicação externa na estação onde o SmartClient está em execução.

@type binary function
@sintax WinExec(<cExec>) => character
@return character, Retorna 0 \(zero\) em caso de sucesso da execução do processo e diferente de zero para erros.

@param <cexec>, character, Indica o o caminho e nome do programa que será executado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/winexec
/*/
binary function winexec(cexec)
return


/*/{Protheus.doc} word
Retorna a parte inteira de uma variável numérica AdvPL.

@type binary function
@sintax Word(<nValue>) => numeric
@return numeric, Retorna a parte inteira do número informado, ignorando qualquer valor decimal.

@param <nvalue>, numeric, Valor numérico a ser considerado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/word
/*/
binary function word(nvalue)
return


/*/{Protheus.doc} writepprostring
Permite criar e/ou alterar um seção/chave de configuração no arquivo de configuração \(.INI\). No entanto, caso o arquivo não exista ele será criado. Pode-se, opcionalmente, definir um path absoluto, com unidade de disco, de modo que o arquivo de configuração \(.INI\) será atualizado na estação onde o TOTVS Smart Client está sendo executado.

@type binary function
@sintax WritePProString(<cSecao>, <cChave>, <cConteudo>, <cArqIni>) => logical
@return logical, Retorna verdadeiro \(.T.\) se a chave for incluída e/ou alterada com sucesso ou falso \(.F.\) caso ocorra alguma falha ou impossibilidade de acesso no arquivo de configuração \(.INI\).

@param <csecao>, character, Indica o nome da seção, no arquivo de configuração \(.INI\), que será utilizada. Porém, caso a seção não exista, a mesma será criada.
@param <cchave>, character, ndica o nome da chave da seção, do arquivo de configuração \(.INI\), que terá seu conteúdo alterado. Porém, caso a chave não exista na seção especificada, a mesma será criada.
@param <cconteudo>, character, Indica o conteúdo da chave que será atualizado.
@param <carqini>, character, Indica o nome do arquivo de configuração \(\*.INI\) que será alterado. Porém, é importante observar os seguintes casos: Se o arquivo de configuração \(.INI\) não existir, o mesmo será criado; Se o path do arquivo de configuração \(\*.INI\) não for informado, o mesmo será criado/atualizado no diretório onde está instalado TOTVS Application Server, no servidor; Se especificado um path absoluto, com unidade de disco, o arquivo de configuração \(.INI\) será criado e/ou atualizado na estação remota, no path informado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/writepprostring
/*/
binary function writepprostring(csecao, cchave, cconteudo, carqini)
return


/*/{Protheus.doc} writeprofstring
Cria ou altera o conteúdo de uma chave no arquivo win.ini \(arquivo utilizado para armazenar configurações básicas de inicialização\) do sistema operacional.

@type binary function
@sintax WriteProfString(<cSecao>, <cChave>, <cPadrao>) => logical
@return logical, Retorna verdadeiro \(.T.\), se a chave for incluída ou alterada com sucesso, ou falso \(.F.\), caso ocorra alguma falha ou impossibilidade de acesso no arquivo de configuração.

@param <csecao>, character, Indica o nome da seção em que um valor será recuperado.
@param <cchave>, character, Indica o nome da chave em que um valor será recuperado.
@param <cpadrao>, character, Indica o conteúdo padrão que será recuperado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/writeprofstring
/*/
binary function writeprofstring(csecao, cchave, cpadrao)
return


/*/{Protheus.doc} writersapk
Converte uma chave privada no formato DER \(Distinguished Encoding Rules\) para o formato PEM \(Privacy Enhanced Mail\) criptografando com o algoritmo RSA.

@type binary function
@sintax WriteRSAPK(<cDERFile>, <cRSAFile>, <@cError>) => logical
@return logical, Retorna **.T.** se conseguiu converter o arquivo; caso contrário, **.F.**.

@param <cderfile>, character, Indica o caminho do arquivo origem \(formato DER\), a partir da raiz do diretório \(RootPath\) do TOTVS Application Server.
@param <crsafile>, character, Indica o caminho do arquivo destino \(formato PEM\), a partir da raiz do diretório \(RootPath\) do TOTVS Application Server, com as informações de chave privada.
@param <@cerror>, character, Indica a saída da mensagem de erro, em caso de falha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/writersapk
/*/
binary function writersapk(cderfile, crsafile, cerror)
return


/*/{Protheus.doc} writesrvprofstring
Cria ou altera um chave, no arquivo de configuração \(\*.INI\), na seção do ambiente em uso.

@type binary function
@sintax WriteSrvProfString(<cChave>, <cValor>) => logical
@return logical, Retorna verdadeiro \(.T.\) se a chave for incluída ou alterada com sucesso ou falso \(.F.\) caso ocorra alguma falha ou impossibilidade de acesso no arquivo de configuração \(\*.INI\).

@param <cchave>, character, Indica o nome da chave, no arquivo de configuração \(\*.INI\), que será criada ou alterada na seção do ambiente em uso.
@param <cvalor>, character, Indica o conteúdo que será definido ou atualizado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/writesrvprofstring
/*/
binary function writesrvprofstring(cchave, cvalor)
return


/*/{Protheus.doc} wsclassnew
Cria uma nova instância de uma estrutura de Web Services.

@type binary function
@sintax WSClassNew(<cSrvStruct>) => object
@return object, Retorna uma referência para a nova instância da estrutura passada como parâmetro. Caso a estrutura não exista, o retorno será nulo.

@param <csrvstruct>, character, Indica o nome da estrutura \(Server\), de Web Services, para criar o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/wsclassnew
/*/
binary function wsclassnew(csrvstruct)
return


/*/{Protheus.doc} wsdescdata
Obtém todas as propriedades de uma classe de Web Services.

@type binary function
@sintax WSDescData(<cClassName>, [lIncluiDoc]) => array
@return array, Retorna um array com as informações das propriedades contidas na classe. Caso não encontre a classe especificada, o retorno será um array vazio.

@param <cclassname>, character, Indica o nome da classe \(Server\), de Web Services, para a obtenção das propriedades.
@param [lincluidoc], logical, Indica que, se verdadeiro \(.T.\), o valor inicial da propriedade será incluído no array de retorno; caso contrário, falso \(.F.\), o valor não será incluso.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/wsdescdata
/*/
binary function wsdescdata(cclassname, lincluidoc)
return


/*/{Protheus.doc} wsdescmeth
Obtém todos os métodos \(incluindo os parâmetros de send e receive\) de uma classe de Web Services.

@type binary function
@sintax WSDescMeth(<cClassName>) => array
@return array, Retorna um array com a lista de métodos contidos na classe. Caso não encontre a classe especificada, o array retornará vazio.

@param <cclassname>, character, Indica o nome da classe \(Server\), de Web Services, para a obtenção das propriedades.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/wsdescmeth
/*/
binary function wsdescmeth(cclassname)
return


/*/{Protheus.doc} wsdl2parser
Realiza o parser de um conteudo importado de um WSDL Passado no primeiro parametro da função, como tipo Caracter

@type binary function
@sintax WSDL2Parser(<cWSDL>, <@aLocalType>, <@aLocalName>, <@aLocalImport>, <@cError>, <@cWarning>) => numeric
@return numeric, \(Nulo\)

@param <cwsdl>, character, String contendo um WSDL para o parser.
@param <@alocaltype>, array, Array com os tipo de dados fornece definições usadas para descrever as mensagens trocadas.
@param <@alocalname>, array, Array com os dados que especifica um endereço para uma ligação, definindo assim uma única comunicação final.
@param <@alocalimport>, array, Array com os Endereços para importar outras definições.
@param <@cerror>, character, Caso ocorra algum erro na execução da função, a variável será preenchida com sua descrição.
@param <@cwarning>, character, Caso ocorra algum alerta \(warning\) durante a execução da função, a variável será preenchida com sua descrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/wsdl2parser
/*/
binary function wsdl2parser(cwsdl, alocaltype, alocalname, alocalimport, cerror, cwarning)
return


/*/{Protheus.doc} wsdlparser
Realiza o parser de um conteudo importado de um WSDL.

@type binary function
@sintax WSDLParser(<cWSDL>, <@aLocalType>, <@aLocalMsg>, <@aLocalPort>, <@aLocalBind>, <@aLocalServ>, <@aLocalName>, <@aLocalImport>, <@cError>, <@cWarning>) => numeric
@return numeric, \(Nulo\)

@param <cwsdl>, character, Indica a string que contém um WSDL para realizar o parser.
@param <@alocaltype>, array, Indica um array, por referência, que fornecerá definições que serão utilizadas para descrever as mensagens trocadas.
@param <@alocalmsg>, array, Indica um array que contém os dados que representam uma definição abstrata dos dados que serão transmitidos. Uma mensagem consiste de parte lógica, cada uma das quais está associada a uma definição dentro de algum tipo de sistema.
@param <@alocalport>, array, Indica um array com os dados que são um conjunto de resumo de operações. Cada operação, refere-se a uma mensagem de entrada e saída.
@param <@alocalbind>, array, Indica um array que contém os dados que especifica os dados concretos do protocolo de formato das especificações para operações e mensagens definidas por um determinado portType.
@param <@alocalserv>, array, Indica um array com os dados que contêm os serviços que serão utilizados para agregar um conjunto de portas.
@param <@alocalname>, array, Indica um array com os dados que especifica o endereço que será utilizado para realizar uma ligação. Desta forma, será definida uma única comunicação final.
@param <@alocalimport>, array, Indica um array com os endereços que serão utilizados para importar outras definições.
@param <@cerror>, character, Caso ocorra algum erro na execução da função, a variável será preenchida com sua descrição.
@param <@cwarning>, character, Caso ocorra algum alerta \(warning\) durante a execução da função, a variável será preenchida com sua descrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/wsdlparser
/*/
binary function wsdlparser(cwsdl, alocaltype, alocalmsg, alocalport, alocalbind, alocalserv, alocalname, alocalimport, cerror, cwarning)
return


/*/{Protheus.doc} xmlc14n
Esta função permite aplicar o algoritmo canonicalization C14N na string que contém um XML.

@type binary function
@sintax XmlC14N(<cXML>, <cOption>, <@cError>, <@cWarning>) => character
@return character, Retorna o XML recodificado na forma canonical.

@param <cxml>, character, Indica o conteúdo XML que assumirá a formato canonical.
@param <coption>, character, Reservado para implementação futura. Deve ser informada uma string em branco.
@param <@cerror>, character, Retorna uma descrição de erro, em caso de falha no Parser.
@param <@cwarning>, character, Retorna uma descrição de advertência emitida pelo Parser.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlc14n
/*/
binary function xmlc14n(cxml, coption, cerror, cwarning)
return


/*/{Protheus.doc} xmlc14nfile
Esta função permite aplicar o algoritmo canonicalization C14N em um arquivo que contém um XML.

@type binary function
@sintax XmlC14NFile(<cFile>, <cOption>, <@cError>, <@cWarning>) => character
@return character, Retorna o XML recodificado na forma canonical.

@param <cfile>, character, Indica caminho do arquivo XML que assumirá a formato canonical.
@param <coption>, character, Reservado para implementação futura. Deve ser informada uma string em branco.
@param <@cerror>, character, Retorna uma descrição de erro, em caso de falha no Parser.
@param <@cwarning>, character, Retorna uma descrição de advertência emitida pelo Parser.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlc14nfile
/*/
binary function xmlc14nfile(cfile, coption, cerror, cwarning)
return


/*/{Protheus.doc} xmlchildcount
Retorna a quantidade de nós existentes, a partir de um elemento\(nó\) pai informado como parâmetro. Sintaxe \[code\] XmlChildCount \( < oParent> \) --> nChild \[code\]

@type binary function
@sintax XmlChildCount(<oParent>) => numeric
@return numeric, Retorna o número de elementos encontrados.

@param <oparent>, object, Indica o elemento XML que realizará a contagem dos elementos filhos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlchildcount
/*/
binary function xmlchildcount(oparent)
return


/*/{Protheus.doc} xmlchildex
Retorna um ou mais nós da estrutura, de acordo com o nome do elemento procurado.

@type binary function
@sintax XmlChildEx(<oParent>, <cProcura>) => variant
@return variant, Retorna o objeto do nó, se a função encontrar apenas um elemento, ou um array de nós, se possuir mais de um elemento do mesmo nome; caso contrário, o retorno será nulo.

@param <oparent>, object, Indica o nó que será utilizado para iniciar a procura do elemento procurado.
@param <cprocura>, character, Indica o nome do elemento que será procurado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlchildex
/*/
binary function xmlchildex(oparent, cprocura)
return


/*/{Protheus.doc} xmlclonenode
Clonar um node do XML.

@type binary function
@sintax XmlCloneNode(<@oParent>, <cElement>) => logical
@return logical, quando for possivel realizar a operação de clonar Retorna Verdadeiro\(.T.\), quando não for possivel retorna Falso\(.F.\)

@param <@oparent>, object, Indica o nó que recebera o clone
@param <celement>, character, Indica o elemento que sera clonado
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlclonenode
/*/
binary function xmlclonenode(oparent, celement)
return


/*/{Protheus.doc} xmldelnode
Exclui um nó de um objeto XML - eXtensible Markup Language \(Linguagem extensível de formatação\).

@type binary function
@sintax XmlDelNode(<@oParent>, <@oParent>) => logical
@return logical, Retorna verdadeiro \(.T.\), se encontrar um elemento e excluí-lo; caso contrário, falso \(.F.\).

@param <@oparent>, object, Indica o nó pai do elemento que será excluído.
@param <@oparent>, character, Indica o Nome do elemento que sera excluido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmldelnode
/*/
binary function xmldelnode(oparent, oparent)
return


/*/{Protheus.doc} xmlfvldsch
Realiza a validação de um arquivo XML utilizando um XSD \(XML Schema Definition\).

@type binary function
@sintax XmlFVldSch(<cXML>, <cXSD>, <@cError>, <@cWarning>) => logical
@return logical, Retorna verdadeiro \(.T.\) caso o arquivo XML for validado a partir do XSD e, caso contrário, retorna falso \(.F.\)

@param <cxml>, character, Indica o arquivo XML que será validado
@param <cxsd>, character, Indica o arquivo XSD utilizado na validação do XML
@param <@cerror>, character, Indica a variável que será preenchida com a descrição do erro observado durante a validação do XML
@param <@cwarning>, character, Indica a variável que será preenchida com a descrição do alerta observado durante a validação do XML
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlfvldsch
/*/
binary function xmlfvldsch(cxml, cxsd, cerror, cwarning)
return


/*/{Protheus.doc} xmlgetchild
Retorna um elemento filho da estrutura.

@type binary function
@sintax XmlGetChild(<oParent>, <nChild>) => object
@return object, Retorna o objeto que representa o filho da estrutura, de acordo com o índice passado no parâmetro <nChild>

@param <oparent>, object, Indica o nó no qual será utilizado como base para obter um nó filho.
@param <nchild>, numeric, Indica o índice do nó que desejamos obter.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlgetchild
/*/
binary function xmlgetchild(oparent, nchild)
return


/*/{Protheus.doc} xmlgetparent
Retorna um nó que representa o nó pai do elemento especificado por parâmetro.

@type binary function
@sintax XmlGetParent([oNode]) => object
@return object, Retorna um objeto posicionado no nó, de acordo com o parâmetro <oNode>.

@param [onode], codeblock, Indica o nó no qual será utilizado como referência para o retorno do nó pai.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlgetparent
/*/
binary function xmlgetparent(onode)
return


/*/{Protheus.doc} xmlnewnode
Cria um novo nó a partir de um ponto qualquer no XML -  EXtensible Markup Language \(Linguagem extensível de formatação\). Sintaxe \[code\] XmlNewNode \( <oParent>, <cElementName>, <cRealName>, <cType> \) --> Nil \[code\]

@type binary function
@sintax XmlNewNode(<oParent>, <cElementName>, <cRealName>, <cType>) => NIL
@param <oparent>, object, Indica o local onde será inserido o novo nó XML.
@param <celementname>, character, Indica o nome do elemento \(nó\) no XML.
@param <crealname>, character, Indica o nome real do nó XML.
@param <ctype>, character, Indica o tipo de nó XML que será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlnewnode
/*/
binary function xmlnewnode(oparent, celementname, crealname, ctype)
return


/*/{Protheus.doc} xmlnode2arr
Transforma em array um objeto \(nó\) da estrutura do XML - eXtensible Markup Language \(Linguagem extensível de formatação\). Sintaxe \[code\] XmlNode2Arr \( < oRoot>, < cNode> \) --> lRet \[code\]

@type binary function
@sintax XmlNode2Arr(<oRoot>, <cNode>) => NIL
@param <oroot>, object, Indica o elemento \(nó\) que será utilizado como raiz para iniciar a busca do elemento a ser transformado em array.
@param <cnode>, character, Indica o elemento procurado que será transformado em array na estrutura.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlnode2arr
/*/
binary function xmlnode2arr(oroot, cnode)
return


/*/{Protheus.doc} xmlparser
Retorna um objeto, que possui uma estrutura XML, passado por parâmetro. Sintaxe \[code\] XmlParser\( \[ cXml \], \[ cReplace \], \[ cError \], \[ cWarning \] \) \[code\]

@type binary function
@sintax XmlParser(<cXml>, <cReplace>, <cError>, <cWarning>) => object
@return object, Retorna um objeto com a estrutura de acordo com o XML.

@param <cxml>, character, Indica uma string que contém o código XML.
@param <creplace>, character, Indica o valor que será atribuído como prefixo para a nomenclatura das propriedades do objeto XML em Advpl a partir dos nomes dos nodes do documento XML. Será usando também na substituição de qualquer caractere usado no nome do node XML que não faça parte da nomenclatura de uma variável Adppl, como espaços em branco por exemplo.
@param <cerror>, character, Caso ocorra algum erro durante execução da função, a variável será preenchida com a descrição do erro ocorrido.
@param <cwarning>, character, Caso ocorra alguma advertência durante execução da função, a variável será preenchida com a descrição da advertência ocorrida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlparser
/*/
binary function xmlparser(cxml, creplace, cerror, cwarning)
return


/*/{Protheus.doc} xmlparserfile
Esta função permite retornar um objeto, que possui uma estrutura XML, recebido de um arquivo por parâmetro. Sintaxe \[code\] XmlParserFileFile \( <cFile>, <cReplace>, <@cError>, <@cWarning> \) --> oXML \[code\]

@type binary function
@sintax XmlParserFile(<cFile>, <cReplace>, <cError>, <cWarning>) => object
@return object, Um objeto com a estrutura de acordo com o XML.

@param <cfile>, character, Representa o dir etório \(a partir do rootpath\) e o nome de um arquivo \*.xml.
@param <creplace>, character, Representa o valor que será substituído, pelos caracteres de espaço em branco, na especificação do nó XML.
@param <cerror>, character, Caso ocorra algum erro na execução da função, a variável será preenchida com sua descrição.
@param <cwarning>, character, Caso ocorra algum alerta \(warning\) durante a execução da função, a variável será preenchida com sua descrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlparserfile
/*/
binary function xmlparserfile(cfile, creplace, cerror, cwarning)
return


/*/{Protheus.doc} xmlsvldsch
Executa a validação de um XML como string com relação a um arquivo XSD \(Schema\).

@type binary function
@sintax XmlSVldSch(<cXML>, <cSchemaPath>, <@cError>, <@cWarning>) => logical
@return logical, Retorna verdadeiro \(.T.\), se o XML for válido, caso contrário, retorna falso \(.F.\).

@param <cxml>, character, Indica o valor XML como string que será validado, pode ser passado uma variável string com conteúdo XML.
@param <cschemapath>, character, Indica o arquivo XSD com path para validação do arquivo XML.
@param <@cerror>, character, Caso ocorra algum erro durante a validação do arquivo XML, a variável será preenchida com a descrição do erro ocorrido.
@param <@cwarning>, character, Caso ocorra algum alerta 'Warning' durante validação do arquivo XML, a variável será preenchida com a descrição do 'Warning' ocorrido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/xmlsvldsch
/*/
binary function xmlsvldsch(cxml, cschemapath, cerror, cwarning)
return


/*/{Protheus.doc} year
Retorna o ano correspondente a uma data.

@type binary function
@sintax year(<dDate>) => numeric
@return numeric, Retorna o ano correspondente a data informada, inclusive os dígitos referente ao século, na forma de um valor numérico de quatro dígitos.

@param <ddate>, date, Indica a data que será convertida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/year
/*/
binary function year(ddate)
return


