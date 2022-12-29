#include 'protheus.ch' 

//#include "fwadvplexpression.ch"
#define E_COMERCIAL '&'
#define PLUS '+'
#define PLUS_PLUS '++'
#define MINOR '-'
#define MINOR_MINOR '--'
#define MULT '*'
#define DIV '/'
#define LPARAN '('
#define RPARAN ')'
#define DOT    '.'
#define COMMA ','
#define SEMICOLON  ';'
#define COLON  ':'
#define MENOR  '<'
#define MAIOR  '>'
#define POW '^'
#define EXCLAMACAO '!'
#define MENOR_IGUAL "<="
#define MAIOR_IGUAL ">="
#define ATTRIBUICAO ":="
#define LOGICAL_AND ".AND."
#define LOGICAL_OR 	".OR."
#define LOGICAL_NOT	".NOT."
#define LOGICAL_IGUAL "="
#define LOGICAL_EXACT_IGUAL "=="
#define LOGICAL_DIFF1 "<>"
#define LOGICAL_DIFF2 "!="
#define ALIAS_ACCESS '->'
#define LBRACK '['
#define RBRACK ']'
#define SHARP '#'
#define PERCENT '%'
//-------------------------------------------------------------------
/*/{Protheus.doc} FWAdvplParser
Fornece um objeto de um parser advpl minimo.
@author Rodrigo Antonio
@since 23/08/2017
@version P10                         
/*/
//-------------------------------------------------------------------
Class FWAdvplParser From FWLexer 
    Data lInObjectAccess
	Data lFilterSupport
	Data oStack
	Data oFactory
	Data cErrorCode
	Method New()
	Method Start()	
	Method Parser()
	Method Destroy()
	Method Reset()
	Method SetError()
	Method GetError()
	Method LogicValue()	
	//Method Macro()	
	
	
	Method Expression()
	Method OrExpression()	
	Method AndExpression()
	Method equalityExpression()
	Method relationalExpression()
	Method additiveExpression()
	Method multiplicativeExpression()
	Method unaryExpression()
	Method primary()
	Method Atom()
	Method Numbers()
	Method Digit()
	Method identifier()   	
	Method Args()
	Method ExpresList()
	Method Char()	
	Method StringD()
	Method StringSimple()
	Method FilterSupport()
	Method ArrayAccess()
	Method GetRealName()	
	//Method negativeExp()
	//Method AliasAccess()	
	Method NilValue()
	Method getAST()
	Method communExitBinaryExpression()
EndClass
//-------------------------------------------------------------------
/*/{Protheus.doc} New
Construtor
@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method New(lFilter) Class FWAdvplParser
	Default lFilter := .F.
    _Super:New()       
	self:grammar := {LBRACK,RBRACK,E_COMERCIAL,COLON,SEMICOLON,PLUS,MINOR,MULT,DIV,POW,LPARAN,RPARAN,DOT,COMMA,MENOR,MAIOR,'=',EXCLAMACAO,'1','2','3','4','5','6','7','8','9','0',' ','"',"'","$" ,'_',SHARP,PERCENT}
    self:lInObjectAccess := .F.     
	self:oStack := FWStack():New() 
	self:oFactory := FWAdvplExpressionFactory():New()
	self:lFilterSupport := lFilter
	::cErrorCode := ""    
	aAdd(self:grammar, E_COMERCIAL)
Return
//-------------------------------------------------------------------
/*/{Protheus.doc} getAST

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method getAST() Class FWAdvplParser
Local oAST
oAST := self:oStack:Pop()
Return oAST
//-------------------------------------------------------------------
/*/{Protheus.doc} Reset

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method Reset() Class FWAdvplParser
self:oStack:Destroy()
self:setError("","")
Return

Method Destroy() Class FWAdvplParser
self:oStack:Destroy()
Return
//-------------------------------------------------------------------
/*/{Protheus.doc} SetError

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method SetError(cMsg,cCode) Class FWAdvplParser
_Super:setError(cMsg)
self:cErrorCode := cCode
Return
Method GetError() Class FWAdvplParser
Return self:cErrorCode +  "-" + self:Error
//-------------------------------------------------------------------
/*/{Protheus.doc} Parser

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method Parser(cInput) Class FWAdvplParser
self:SetInput(cInput)
self:Error		 	:= ""
self:cParsedInput 	:= ""
self:getnextToken(.F.)
Return self:Start()
//-------------------------------------------------------------------
/*/{Protheus.doc} Start

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method Start()  Class FWAdvplParser
Local lOk AS LOGICAL
Local lContinua AS LOGICAL
Local oRootElement AS OBJECT
Local oExp AS OBJECT

lOk := .t.
lContinua := .T.
oRootElement := self:oFactory:createRootElement()

While(lContinua)	
	lOk := self:expression()
	If !Empty(self:Error) .Or. !lOk
		lOk := .F.
		lContinua := .F.
		If Empty(self:Error)
			
		Endif
	Else
		oExp := self:oStack:Pop()	
		oRootElement:addExpression(oExp)
	Endif
	If !self:isEndInput()
		If Empty(self:Error)
			If self:Token == COMMA 							
				self:getnextToken()
				Loop
			Else
				self:setError("Recognition error","C8001")
				lOk := .F.
				lContinua := .F.
			Endif
		Else
			self:setError("Recognition error","C8001")
			lOk := .F.
			lContinua := .F.
		Endif
	Else			
		lContinua := .F.
	Endif
End
self:oStack:Push(oRootElement)
return lOk
//--------------------------------------------------------
//Expression -> OrExpression (':=' Expression)?
//--------------------------------------------------------
Method Expression() Class FWAdvplParser
Local oExp
If self:OrExpression()
	while (self:match(ATTRIBUICAO))	
	 	If !self:Expression()
		 	self:setError("extraneous input ':='","C8002")
	 		Return .F.
		else
			oExp := self:oFactory:createBinaryExpression()
			oExp:setBinaryType(TOKEN_ASSIGNMENT)
			self:communExitBinaryExpression(oExp)
			self:oStack:Push(oExp)	
	 	Endif		
	 End
Else	
	Return .F.
Endif

Return .T.
//------------------------------------------------------------------------------------------
//OrExpression -> AndExpression ( '.OR.' AndExpression  )*
//------------------------------------------------------------------------------------------
Method OrExpression() Class FWAdvplParser
Local oExp
If self:AndExpression()
	 while ( self:match(LOGICAL_OR))	 		 			
	 	If !self:AndExpression()
		 	self:setError("extraneous input '.Or.'","C8002")
	 		Return .F.
	 	Endif
		oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(TOKEN_OR)
		self:communExitBinaryExpression(oExp)
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
Endif
Return .T.
//------------------------------------------------------------------------------------------
//AndExpression -> relationalExpression  ( '.AND.' relationalExpression)*
//------------------------------------------------------------------------------------------
Method AndExpression() Class FWAdvplParser
Local oExp
If self:relationalExpression()
	 while ( self:match(LOGICAL_AND))	 		 
	 	If !self:relationalExpression()
		 	self:setError("extraneous input '.And.'","C8002")
	 		Return .F.
	 	Endif
		oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(TOKEN_AND)
		self:communExitBinaryExpression(oExp)
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
Endif
Return .T.
//------------------------------------------------------------------------------------------
//relationalExpression -> equalityExpression ( '<'|'>'|'<='|'>=' equalityExpression )*
//------------------------------------------------------------------------------------------
Method relationalExpression() Class FWAdvplParser
Local oExp
Local nTk
Local cSaveTk
If self:equalityExpression()	
	 while ( self:match(MENOR_IGUAL) .Or. self:match(MAIOR_IGUAL) .Or. self:token==MENOR .Or. self:token == MAIOR )//Importante ver o match primeiro pois senao consome errado	 	
	 	If !Empty(self:lastMatch)
		 	cSaveTk := self:lastMatch
			nTk := Iif(self:lastMatch == MENOR_IGUAL,TOKEN_MINOREQUALS,TOKEN_MAJOREQUALS)			
		Else
			cSaveTk := self:token
			nTk := Iif(self:token==MENOR ,TOKEN_MINOR,TOKEN_MAJOR)
			self:getNextToken()
		Endif
		
	 	If !self:equalityExpression()
		 	self:setError("extraneous input '" + cSaveTk + "'","C8002")
	 		Return .F.
	 	Endif
		 oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(nTk)
		self:communExitBinaryExpression(oExp)
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
Endif
Return .T.
//------------------------------------------------------------------------------------------
//equalityExpression -> additiveExpression ('=='|'<>'|'!='|'$'  additiveExpression  )*
//------------------------------------------------------------------------------------------
Method equalityExpression() Class FWAdvplParser
Local oExp
Local nExpType
Local cSaveTk
If self:additiveExpression()	
	 while ( self:match(LOGICAL_EXACT_IGUAL) .Or. self:match(LOGICAL_DIFF1) .Or. self:match(LOGICAL_DIFF2) .Or. self:token==LOGICAL_IGUAL  .Or. self:token== "$" ) //
	 	If !Empty(self:lastMatch)
		 	if (self:lastMatch == LOGICAL_EXACT_IGUAL)
				nExpType := TOKEN_DOUBLEEQUAL
			Else
				nExpType := TOKEN_NOT_EQUAL
			Endif
			cSaveTk := self:lastMatch
		Elseif self:Token == "$"
			nExpType := TOKEN_CONTAINED
			cSaveTk := self:Token
			self:getNextToken()
		else
			nExpType := TOKEN_EQUALS
			cSaveTk := self:Token
			self:getNextToken()
		Endif
		
	 	If !self:additiveExpression()
		 	self:setError("extraneous input '" + cSaveTk + "'","C8002")
	 		Return .F.
	 	Endif
		oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(nExpType)		
		self:communExitBinaryExpression(oExp)		
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
Endif
Return .T.

//------------------------------------------------------------------------------------------
//additiveExpression ->  multiplicativeExpression (('+'|'-') multiplicativeExpression)*
//------------------------------------------------------------------------------------------
Method additiveExpression() Class FWAdvplParser
Local oExp
Local nTk
If self:multiplicativeExpression()
	 while ( self:token==PLUS .Or. (self:token == MINOR .And. self:LL() != ">" ) )	 	
	 	nTk := Iif(self:token==PLUS,TOKEN_PLUS,TOKEN_MINUS)
	 	self:getNextToken()		
	 	If !self:multiplicativeExpression()
		 	self:setError("extraneous input '"+ Iif(nTk==TOKEN_PLUS,PLUS,MINOR) +"'","C8002")
	 		Return .F.
	 	Endif
		oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(nTk)		
		self:communExitBinaryExpression(oExp)
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
EndIf
Return .T.
//------------------------------------------------------------------------------------------
//multiplicativeExpression -> unaryExpression ('*'|'/'|'^') unaryExpression ) *
//------------------------------------------------------------------------------------------
Method multiplicativeExpression(cExp) Class FWAdvplParser
Local cOp
Local oExp
Local nExpType
Local cSaveToken
If self:unaryExpression()
	 while ( self:token==MULT .Or. self:token == DIV .oR. self:token == POW )
	 	cSaveToken := self:token
		If self:token==MULT 
			nExpType := TOKEN_MULT
		ElseIf self:token == DIV
			nExpType := TOKEN_DIV
		Else
		 nExpType := TOKEN_POW
		Endif		
	 	cOp := self:token
	 	self:getNextToken()
	 	If !self:unaryExpression()
		 	self:setError("extraneous input '"+ cSaveToken +"'","C8002")
	 		Return .F.	 	
	 	Endif
		oExp := self:oFactory:createBinaryExpression()
		oExp:setBinaryType(nExpType)		
		self:communExitBinaryExpression(oExp)
		self:oStack:Push(oExp)	
	 End
Else
	Return .F.
Endif
Return .T.
//------------------------------------------------------------------------------------------
//unaryExpression -> primary |('!' |'++'|'--')unaryExpression
// Se for excel, vai ser primary direto, pois iremos usar o ! para endereçamento de planilha
//------------------------------------------------------------------------------------------
Method unaryExpression () Class FWAdvplParser
Local oExp as OBJECT
Local oUnaryExp as OBJECT
Local lRet as LOGICAL

lRet := .T.
If self:token==EXCLAMACAO .Or. self:match(LOGICAL_NOT)	
	If self:lastMatch != LOGICAL_NOT
		self:getNextToken()
	Endif
	oExp := self:oFactory:createUnaryExpression(EXCLAMACAO)
	oExp:setUnaryType(TOKEN_EXCLAMATION)
	self:oStack:Push(oExp)	
	If self:unaryExpression()
		oUnaryExp := self:oStack:Pop()
		oExp:setLeft(oUnaryExp)
	Else
		Return .F.
	Endif
ElseIf self:token == E_COMERCIAL
	self:getNextToken()
	oExp := self:oFactory:createUnaryExpression(E_COMERCIAL)
	oExp:setUnaryType(TOKEN_MACRO)
	self:oStack:Push(oExp)	
	If self:unaryExpression()
		oUnaryExp := self:oStack:Pop()
		oExp:setLeft(oUnaryExp)
	Else
		Return .F.
	Endif
ElseIf self:token==MINOR
	self:getNextToken()
	oExp := self:oFactory:createUnaryExpression(MINOR)
	oExp:setUnaryType(TOKEN_NEGATIVE)
	self:oStack:Push(oExp)	
	If self:unaryExpression()
		oUnaryExp := self:oStack:Pop()
		oExp:setLeft(oUnaryExp)
	Else
		Return .F.
	Endif
ElseIf self:match(PLUS_PLUS) .Or. self:match(MINOR_MINOR) 
	oExp := self:oFactory:createUnaryExpression(self:lastMatch)
	oExp:setUnaryType(Iif(self:lastMatch==PLUS_PLUS,TOKEN_PLUS_PLUS,TOKEN_MINUS_MINUS))
	self:oStack:Push(oExp)	
	if self:unaryExpression()
		oUnaryExp := self:oStack:Pop()
		oExp:setRight(oUnaryExp)
	Else 
		return .F.
	Endif
Else     
	lRet :=  self:primary()
	If lRet
		If self:match(PLUS_PLUS) .Or. self:match(MINOR_MINOR)
			oUnaryExp := self:oStack:Pop()
			oExp := self:oFactory:createUnaryExpression(self:lastMatch)
			oExp:setUnaryType(Iif(self:lastMatch==PLUS_PLUS,TOKEN_PLUS_PLUS,TOKEN_MINUS_MINUS))			
			oExp:setLeft(oUnaryExp)
			self:oStack:Push(oExp)
		Endif
	Endif
Endif

Return lRet

//--------------------------------------------------------
// primary -> '(' Expression ')' | Atom
//--------------------------------------------------------
Method primary() Class FWAdvplParser
Local oExp
Local xTmp
Local lContinue := .T.
If self:token == LPARAN
	self:getnextToken()
	If self:Expression()
		If (self:token == RPARAN)		
		    self:getnextToken()
			oExp := self:oFactory:createParentsExpression()
			oExp:setLeft(self:oStack:Pop())
			self:oStack:Push(oExp)
		    return .T.		  
	    Else
	    	If self:isEndInput()				
	    		self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")
	    	Else 	    	
	    		self:setError("Invalid token at "+Alltrim(Str(self:nCursor))+" caracter( "+ self:token + " )","C2003")
	    	Endif
	    EndIf
	Else
		self:getnextToken()
		oExp := self:oFactory:createEmptyExpression()
		self:oStack:Push(oExp)
	Endif		
Else 
	If self:lFilterSupport
		lContinue :=  !self:FilterSupport()		
	Endif
	If lContinue
		//Atom
		If self:Atom()
			Return .T.
		ElseIf self:StringSimple() .Or. self:StringD()
			If self:lFilterSupport
				oExp := self:oStack:Peek()
				xTmp := oExp:GetContent()
				If SubStr(xTmp,2,1) == "%" .And.  SubStr(xTmp,Len(xTmp)-1,1) == "%" 
					oExp := self:oStack:Peek()
					oExp:setAdditional("#FILTER")
				Endif
			Endif
			Return .T.
		Else		
			Return .F.
		Endif
	Endif
Endif
Return .T.
//--------------------------------------------------------
// filterSupport -> '#' identifier '#' | '%' identifier '%'
//--------------------------------------------------------

Method FilterSupport() Class FWAdvplParser
Local oExp
If self:token == SHARP
	self:getnextToken()
	If self:Identifier()		
		If (self:token == SHARP)		
			oExp := self:oStack:Peek()
			oExp:setAdditional("#FILTER")
		    self:getnextToken()
		    return .T.		  
	    Else
	    	If self:isEndInput()				
	    		self:setError("Statement unterminated at end of line/unbalanced #","C2002")
	    	Else 	    	
	    		self:setError("Invalid token at "+Alltrim(Str(self:nCursor))+" caracter( "+ self:token + " )","C2003")
	    	Endif
	    EndIf
	Endif		
ElseIf self:token == PERCENT
	self:getnextToken()		
	If self:Identifier()
		If (self:token == PERCENT)	
			oExp := self:oStack:Peek()
			oExp:setAdditional("%FILTER")	
		    self:getnextToken()
		    return .T.		  
	    Else
	    	If self:isEndInput()				
	    		self:setError("Statement unterminated at end of line/unbalanced %","C2002")
	    	Else 	    	
	    		self:setError("Invalid token at "+Alltrim(Str(self:nCursor))+" caracter( "+ self:token + " )","C2003")
	    	Endif
	    EndIf
	Endif		
Endif
Return .F.

/*Method Expression() Class FWAdvplParser
Local oExpression := FWAdvplSimpleExpressionInfo():New()
Local lLoopMacro 
Local oPeek
self:oStack:Push(oExpression)
If self:OrExpression()
	oExpression := self:oStack:Pop()
	oExpression:setExpression(self:cParsedInput)	
	if (self:oStack:isEmpty())
		aAdd(self:aExpressions,oExpression)
	Else
		oPeek := self:oStack:Peek()
		oPeek:AddSubExp(oExpression)
	Endif
	//aAdd(self:aExpressions,oExpression)
	self:cParsedInput := ""		
	lLoopMacro := oExpression:lMacro
	while (self:match(ATTRIBUICAO) .Or. lLoopMacro )	
	 	If !self:Expression()		 	
	 		Return .F.
	 	Endif
		If lLoopMacro
		 	lLoopMacro := .F.//  self:oStack:Peek():lMacro
		Endif
	 End
Else
	oExpression := self:oStack:Pop()	
	Return .F.
Endif

Return .T.
*/
//--------------------------------------------------------
// Args-> (',')*  '(' (Expression ','*')* ')'
//--------------------------------------------------------
Method Args(aArgs) Class FWAdvplParser 
Local oExpArgs := self:oFactory:createArgumentsList()
if self:ExpresList(oExpArgs)
	If (self:token != RPARAN) 
		self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")
		//self:setError("Fim inesperado de expressao:"+Alltrim(Str(self:cursor))+ ":"+self:Token)//
		Return .F.
	Endif
Else
	Return .F.
Endif			
Return .T.
/*
Local nSaveCursor
Local oExp
Local oExpList := self:oFactory:createExpressionList()

While self:Token == COMMA 
	self:getnextToken(.T.,COMMA)
	oExp := self:oFactory:createEmptyExpression()
	oExpList:addExpression(oExp)
End
If !(self:token == RPARAN) //Trata expression vazio vai consumir no outro metodo
	While .T.
		nSaveCursor := self:cursor
		If self:Expression()                            
			oExp := self:oStack:Pop()
			oExpList:addExpression(oExp)
			//aAdd(aArgs ,subStr(SELF:INPUT,nSaveCursor,self:cursor-nSaveCursor))
			If self:Token == COMMA  
				self:getnextToken(.T.,COMMA)				
				While self:Token == COMMA 
					self:getnextToken(.T.,COMMA)
					oExp := self:oFactory:createEmptyExpression()
					oExpList:addExpression(oExp)
				End
				If (self:token == RPARAN) 
					Exit
				Endif
			Else
				If (self:token == RPARAN) 
					Exit
				Else
					self:setError("Fim inesperado de expressao:"+Alltrim(Str(self:cursor))+ ":"+self:Token)//
					Return .F.
				Endif
			Endif
		Else
			Return .F.
		Endif	
	End
Endif
self:oStack:Push(oExpList)
Return .T.
*/
Method ExpresList (oExpList) Class FWAdvplParser
Local oExp
Local lContinua := .T.
Local lRet := .F.
While self:Token == COMMA 
	self:getnextToken()
	oExp := self:oFactory:createEmptyExpression()
	oExpList:addExpression(oExp)
	lRet := .T.
End
While lContinua	
	If self:Expression()
		oExp := self:oStack:Pop()
		oExpList:addExpression(oExp)
		if self:Token == COMMA
			self:getnextToken()			
			While self:Token == COMMA 
				self:getnextToken(.T.)
				oExp := self:oFactory:createEmptyExpression()
				oExpList:addExpression(oExp)
			End			
		Else
			lContinua := .F.
		Endif
		lRet := .T.
	Else
		lContinua := .F.
	Endif	
End
self:oStack:Push(oExpList)
Return lRet
//--------------------------------------------------------
// Char -> Identifica um caracter  
//--------------------------------------------------------
Method Char(xStr,lSpaceFound) Class FWAdvplParser
	if self:cUpperToken $ "QWERTYUIOPASDFGHJKLZXCVBNM_"
		xStr += self:token		
		self:getnextToken(,,@lSpaceFound)
		return .T.		
	endif
Return .F.

//--------------------------------------------------------
// STRING    ->  '"' ( ~('"') )* '"'
//--------------------------------------------------------
Method StringD() Class FWAdvplParser
Local oLiteral
Local cString
if self:token ==  '"'
	cString := self:token
	self:getnextToken(,,,.F.)
	cString += self:GetUntilThen('"')	
	If 	self:token == CRLF 
		self:setError("Statement unterminated at end of line/unbalanced strings","C8003")
		return .F.
	Else
		cString += self:token
		self:getnextToken(,,,.F.)
		oLiteral := self:oFactory:createLiteral(cString)
		oLiteral:setLiteralType(TOKEN_STRINGDOUBLE)
		self:oStack:Push(oLiteral)	
		Return .T.
	Endif
Endif
Return .F.

//--------------------------------------------------------
// STRINGSIMPLE -> '\'' (  ~('\'') )* '\''
//--------------------------------------------------------
Method StringSimple() Class FWAdvplParser
Local oLiteral
Local cString
if self:token ==  "'"
	cString := self:token
	self:getnextToken(,,,.F.)
	cString += self:GetUntilThen("'")	
	If 	self:token == CRLF 
		self:setError("Statement unterminated at end of line/unbalanced strings","C8003")
		return .F.
	Else
		cString += self:token
		self:getnextToken(,,,.F.)
		oLiteral := self:oFactory:createLiteral(cString)
		oLiteral:setLiteralType(TOKEN_STRINGSIMPLE)
		self:oStack:Push(oLiteral)	
		Return .T.
	Endif
Endif
Return .F.
//--------------------------------------------------------
// Digit -> Verifica se é digito numerico
//--------------------------------------------------------
Method Digit(cVal,lSpaceFound) Class FWAdvplParser
Local nAsc := ASC(self:token)
	If nAsc >= 48 .And.nAsc <= 57		
		cVal += self:token
		//self:getnextToken(lAddInResult)
		//Return .T.		
		self:getnextToken(,,@lSpaceFound)
		return .T.
	Endif
Return  .F.

//-------------------------------------------------------------------
/*/{Protheus.doc} Numbers
Verifica se é numero

@return lRet Indica se o valor é numérico

@author Rodrigo Antonio
@since 18/01/2019
@version 1.1                 
/*/
//-------------------------------------------------------------------
Method Numbers() Class FWAdvplParser
Local cVal        As Char
Local lContinue   As Logical
Local lRet        As Logical
Local oLiteral    As Object
Local lSpaceFound As Logical

cVal        := ""     
lContinue   := .T.  
lRet        := .F.
lSpaceFound := .F.

If !self:Digit(@cVal,@lSpaceFound)
	lContinue := .F.
Endif
If lContinue
	While !lSpaceFound
		If !self:Digit(@cVal,@lSpaceFound)
			Exit
		Endif
	End
	If !lSpaceFound .And. self:token == DOT // token == DOT
		If Self:IsLastToken() .Or. IsDigit( Self:LL() ) //Falta de espaço entre número e .and./.o./.not.
			cVal += DOT
			self:getnextToken()
			While !lSpaceFound
				If !self:Digit(@cVal,@lSpaceFound)
					Exit
				Endif
			End
		EndIf
	Endif           
	oLiteral := self:oFactory:createLiteral(cVal)
	oLiteral:setLiteralType(TOKEN_NUMBER)
	self:oStack:Push(oLiteral)	
	lRet :=.T.
Endif
Return lRet

//-------------------------------------------------------------------
/*/{Protheus.doc} identifier
Método responsável por procurar identificadores na expressão ADVPL

identifier -> Char (Digit|Char)*  (('(' args ')')?| (':' Char (Digit|Char)* )?  )   

@param [lFieldAlias] Indica se a pesquisa está procurando por um identificador
de campo, acessado por um alias ex: SE1->E1_TESTE, sendo que E1_TESTE é o identificador
Esse parâmetro deve ser utilizado SOMENTE caso tenha sido encontrado o token ->

@return Logical, indica se foi encontrado um identificador

@author Rodrigo Antonio
@since 01/09/2017
/*/
//-------------------------------------------------------------------
Method identifier( lFieldAlias ) Class FWAdvplParser
Local cName       As Char
Local cExp        As Char
Local aArgs       As Array
Local oExp        As Object
Local lSpaceFound As Logical
Local oVisitor    As Object

	cName       := ""
	cExp        := ""
	aArgs       := {}
	lSpaceFound := .F.

	If self:Char(@cName,@lSpaceFound)
		While !lSpaceFound
			If !self:Digit(@cName,@lSpaceFound) 
				If !self:Char(@cName,@lSpaceFound)
					Exit
				Endif
			Endif
		End
		If self:token == LPARAN //Chamada de função			
			self:getnextToken()
			If !(self:token == RPARAN) //Ve os argumentos
				If !self:Args(@aArgs)					
					return .F.  
				Endif				
				oExp := self:oFactory:createFunctionCall(cName)
				oExp:setLeft(self:oStack:Pop())
				self:oStack:Push(oExp)			

				If (self:token == RPARAN)
					self:getnextToken()			
				Else
					self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")										
					Return .F.
				Endif
			Else//Chamada de função sem parametro ou instanciacao de objeto
				self:getnextToken()//Consome o )				
				If (self:token == COLON) // Objeto 

				Else
					oExp := self:oFactory:createFunctionCall(cName)
					self:oStack:Push(oExp)								
				Endif
			Endif    
			
		ElseIf (self:match(ALIAS_ACCESS) ) // == MINOR .AND. Self:LL() == '>') //.OR. (SubStr(self:cParsedInput, Len(Alltrim(self:cParsedInput)) - 1 , 2) == ALIAS_ACCESS) 
			//acesso de campo Alias->Campo   | pega primeiro ate o '->', depois pega a segunda parte 					
			oExp := self:oFactory:createIdentifier(cName)
			oExp:setIdentierType(TOKEN_ID_ALIAS)
			self:oStack:Push(oExp)			
			If self:token == LPARAN
				self:getnextToken(.F.)
				if !self:expression()
					Return .F.
				Endif
				If self:token == RPARAN
					self:getnextToken(.F.)
				Else 
					self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")					
				Endif
			ElseIf !self:identifier( .T. ) //Somente NESSE CASO o parâmetro deve ser utilizado como verdadeiro!
				Return .F.
			Endif
			oExp := self:oFactory:createBinaryExpression()
			oExp:setBinaryType(TOKEN_ALIAS_ACCESS)
			self:communExitBinaryExpression(oExp)

			//Tudo que está entre parenteses é visitado
			If !Empty( oExp:GetRight() )
				oVisitor := FWVisitAliasAccess():New()
				oExp:GetRight():Accept(oVisitor)
			EndIf

			self:oStack:Push(oExp)
		Else                   
			If self:token == COLON //Acesso a Objeto
				If ( self:LL() == '=') //Verifica se é um Assignment é pq é o id simples					
					oExp := self:oFactory:createIdentifier(cName)
					oExp:setIdentierType(TOKEN_ID_NAME)
					self:oStack:Push(oExp)	
					//self:cParsedInput += cName
					Return .T.
				Endif
				self:lInObjectAccess := .t.
				self:getnextToken(.F.)
				If self:identifier()
					self:lInObjectAccess := .F.
					Return .T.
				Else
					self:setError("Outro identificador era esperado ao inves de :"+self:Token,"C2003")//"Outro identificador era esperado ao inves de :"
					self:lInObjectAccess := .F.
					Return .F.	
				Endif				
			
			Else //Identifier puro
				Default lFieldAlias := .F.

				oExp := self:oFactory:createIdentifier(cName)

				If lFieldAlias
					//Somente em caso de alias a esquerda com ->
					oExp:setIdentierType(TOKEN_ID_FIELD)
				Else
					oExp:setIdentierType(TOKEN_ID_NAME)
				EndIf

				self:oStack:Push(oExp)
			Endif
		Endif
	Return .T.	
	Endif
Return .F.
//--------------------------------------------------------
// Atom -> negativeExp |LogicValue| Number|Macro |(identifier(AliasAccess)? )
//--------------------------------------------------------
Method Atom() Class FWAdvplParser
Local lRet := .F.
If self:LogicValue()
	lRet := .T.
Else
	If self:Numbers()
		lRet := .T.
	else
		if self:NilValue()
			lRet := .T.
		else		
			If self:identifier()
				self:ArrayAccess()
				lRet :=  .T.
			Endif
		Endif	
	EndIf
Endif

Return lRet
//--------------------------------------------------------
// NilValue -> 'NIL'
//--------------------------------------------------------
Method NilValue() Class FWAdvplParser
Local oLiteral
if self:token == "N" .Or. self:token == "n"
	if self:Match("NIL")
		oLiteral := self:oFactory:createLiteral("Nil")
		oLiteral:setLiteralType(TOKEN_NIL_VALUE)
		self:oStack:Push(oLiteral)
		Return .t.
	endif
Endif
Return .F.
//--------------------------------------------------------
// AliasAccess -> '->' Expression 
//--------------------------------------------------------
/*Method AliasAccess() Class FWAdvplParser
	if self:Match(ALIAS_ACCESS)
		return self:expression()
	endif
Return
*/
//--------------------------------------------------------
//arrayAccess - >  ( LBRACK expressionList RBRACK )+
//--------------------------------------------------------
Method ArrayAccess() Class FWAdvplParser
Local oExp
Local lOK := .F.
Local oArray
if self:token == LBRACK
	self:getnextToken()
	oArray := self:oFactory:createArrayAccess()
	if self:ExpresList(oArray)
		if self:token == RBRACK
			lOK := .T.
			self:getnextToken()
			oExp := self:oStack:Pop()
			if oExp:isArrayAccess()//em tese o oExp é o mesmo que oArrayAccees
				lOK := .T.
				While (self:token == LBRACK)
					self:getnextToken()
				 	if (self:ExpresList(oArray))
					 	if self:token == RBRACK							
							self:getnextToken()
							oExp := self:oStack:Pop()
							If !oExp:isArrayAccess()
								self:setError("Encontrado erro na pilha de expressionList.")
								lOk := .F.
								Exit
							Endif
						Else
							self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")
							//self:setError("Encontrado um fim de expressao sem finalizar o array.")
							lOk := .F.
						Endif
					Endif
				End
				//oExp := self:oStack:Pop()
				/*While (!oExp:isArrayAccess() .And. !self:oStack:isEmpty())
					aAdd(aExpressions,oExp)
					oExp := self:oStack:Pop()
				End
				oArray:AddReverse(aExpressions)
				aExpressions := aSize(aExpressions,0)*/
				//self:oStack:Push(oExp)
			Else
				self:setError("Encontrado erro na pilha de expressionList.")
				lOk := .F.
			Endif
		else
			//self:setError("Encontrado um fim de expressao sem finalizar o array.")
			self:setError("Statement unterminated at end of line/unbalanced parentesis/brackets","C2002")
			lOk := .F.
		Endif
	Endif
endif
If lOk
	oExp := self:oStack:Peek()
	oExp:setLeft(oArray)
Endif
Return lOK

//--------------------------------------------------------
// Macro -> &expression
//--------------------------------------------------------

/*Method Macro() Class FWAdvplParser
Local oExpression

If self:token == E_COMERCIAL
	//oExpression := self:oStack:Peek()
	//oExpression:lMacro := .T.
	self:getNextToken()	
	return .T.	
Endif
Return .F.*/
//--------------------------------------------------------
// LogicValue -> .T.|.F.
//--------------------------------------------------------
Method LogicValue() Class FWAdvplParser
Local oLiteral
Local cValue
If self:token == DOT
	self:getNextToken()
	If self:cUpperToken == "T" .Or. self:cUpperToken == "F"
		cValue := "."+ self:token 
		self:getNextToken()
		if self:token == DOT
			cValue += "."
			self:getNextToken()
			oLiteral := self:oFactory:createLiteral(cValue)
			oLiteral:setLiteralType(TOKEN_LOGICAL)
			self:oStack:Push(oLiteral)
			return .T.
		else
			self:setError("Token Error, Token expected [.], found[" +self:token +"].","C2003")
		Endif
	Else
		self:setError("Token Error, Token expected [T|F], found[" +self:token +"].","C2003")
	Endif
Endif
Return .F.

//--------------------------------------------------------
// negativeExp -> '-' Expression 
//--------------------------------------------------------
/*
Method negativeExp() Class FWAdvplParser
Local cVal := ""    
Local lNegative := .F. 
Local lContinua := .T.
If self:token == MINOR
	self:getnextToken(.T.,LPARAN+MINOR)
	cVal := LPARAN+MINOR
	If !self:Digit(cVal)	
		lContinua := self:identifier()
	Else
		While .T.
			If !self:Digit(@cVal)	
				Exit
			Endif
		End
	EndIf
	lNegative := .T.
Else
	Return .F.
Endif

If lNegative .And. lContinua
	self:cParsedInput += RPARAN
	cVal +=RPARAN
Endif
Return lContinua
*/
Method communExitBinaryExpression(oExp) Class FWAdvplParser
Local oExp
Local oRight
Local oLeft
oRight	:= self:oStack:Pop()
oLeft	:= self:oStack:Pop()
oExp:setLeft(oLeft)
oExp:setRight(oRight)
Return
