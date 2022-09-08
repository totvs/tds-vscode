#Include 'protheus.ch' 
#Include 'apvso090.ch'
 
//	4100	Formula    
//	4101	Name     
//	4102	ResultIU         
//	4103	RowName 
//	4104	VsoFormulaU

//	4300	Error()
//	4301	FormulaForce()
//	4302	ObjectType()
//	4303	VsoStat()
//	4304	Units()
//	4305	LocalName() 
//	4306	Section()
//	4307	Row()
//	4308	Column()  
//	4309	IsConstant()
//	4310	IsInherited() 
//	4311	PersistsEvents()
//	4312	Shape() 
//	4313	VsoFormulaForceU()     
//	4314	ResultForce() String       
//	4315	ResultForce() Numeric 
//	4316	ResultInt() String 
//	4317	ResultInt() Numeric
//	4318	ResultFromInt() String 
//	4319	ResultFromInt() Numeric
//	4320	VsoResultFromIntForce() String 
//	4321	VsoResultFromIntForce() Numeric
//	4322	ResultStr() String
//	4323	ResultStr() Numeric
//	4324	Trigger()   
//	4325	GlueTo()        
//	4326	GlueToPos()     
//	4327	InheritedValueSource()    
//	4328	InheritedFormulaSource()

CLASS VisioCell FROM ApComBase

	METHOD New() CONSTRUCTOR     
	METHOD Error()      
	METHOD FormulaForce(cFormula)
	METHOD ObjectType()
	METHOD VsoStat()
	METHOD Units()
	METHOD LocalName() 
	METHOD Section() 
	METHOD Row()
	METHOD Column()
	METHOD IsConstant()
	METHOD IsInherited()
	METHOD PersistsEvents()    
	METHOD Shape() 
	METHOD VsoFormulaForceU(cFormula)    
	METHOD ResultForce(cUnitsNameOrCode, cValue)
	METHOD ResultInt(cUnitsNameOrCode, nfRound)
	METHOD ResultFromInt(cUnitsNameOrCode, nValue) 
	METHOD VsoResultFromIntForce(cUnitsNameOrCode, nValue) 
	METHOD ResultStr(cUnitsNameOrCode)     
	METHOD Trigger()    
	METHOD GlueTo(oOtherCell)       
	//METHOD GlueToPos(oOtherShape, nxPercent, nyPercent)  
	METHOD InheritedValueSource()  
	METHOD InheritedFormulaSource()
	
	METHOD SetFormula( uValue )
	METHOD GetFormula() 
	METHOD GetName()              
	METHOD GetResultIU()
	METHOD SetResultIU(nResultIU)  
	METHOD GetRowName()
	METHOD SetRowName(cRowName)   
	METHOD GetVsoFormulaU()
	METHOD SetVsoFormulaU(cFormulaU)

ENDCLASS 

METHOD New() CLASS VisioCell

::cVisioClassName	:= 'Cell'
::cAdvPlClassName	:= 'VisioCell'
::nObjectType		:= 4
::nObjectID			:= -1

Return

METHOD Error() CLASS VisioCell
Return Val(_Super:ExecMethod(4300,{}))    

METHOD FormulaForce(cFormula) CLASS VisioCell
Return (_Super:ExecMethod(4301, {cFormula}))

METHOD ObjectType() CLASS VisioCell
Return Val(_Super:ExecMethod(4302,{}))    

METHOD VsoStat() CLASS VisioCell
Return Val(_Super:ExecMethod(4303,{})) 

METHOD Units() CLASS VisioCell
Return Val(_Super:ExecMethod(4304,{}))  

METHOD LocalName() CLASS VisioCell
Return (_Super:ExecMethod(4305, {}))  

METHOD Section() CLASS VisioCell
Return Val(_Super:ExecMethod(4306, {}))  

METHOD Row() CLASS VisioCell
Return Val(_Super:ExecMethod(4307, {}))  

METHOD Column() CLASS VisioCell
Return Val(_Super:ExecMethod(4308, {}))    

METHOD IsConstant() CLASS VisioCell
Return Val(_Super:ExecMethod(4309, {}))    

METHOD IsInherited() CLASS VisioCell
Return Val(_Super:ExecMethod(4310, {}))

METHOD PersistsEvents() CLASS VisioCell
Return Val(_Super:ExecMethod(4311, {}))   

METHOD Shape() CLASS VisioCell
Local oObject := VisioShape():New()
oObject:nObjectID	:= Val(_Super:ExecMethod(4312, {} ))
Return oObject            

METHOD VsoFormulaForceU(cFormula) CLASS VisioCell
Return (_Super:ExecMethod(4313, {cFormula}))
                                                   
METHOD ResultForce(cUnitsNameOrCode, nValue) CLASS VisioCell
If ( ValType(cUnitsNameOrCode) == 'C' )
	(_Super:ExecMethod(4314, {cUnitsNameOrCode, nValue}))
ElseIf ( ValType(cUnitsNameOrCode) == 'N' )	
	(_Super:ExecMethod(4315, {cUnitsNameOrCode, nValue}))
EndIf
Return		

METHOD ResultInt(cUnitsNameOrCode, nfRound) CLASS VisioCell
Local nRet
If ( ValType(cUnitsNameOrCode) == 'C' )
	nRet := Val(_Super:ExecMethod(4316, {cUnitsNameOrCode, nfRound}))   
ElseIf ( ValType(cUnitsNameOrCode) == 'N' )	
	nRet := Val(_Super:ExecMethod(4317, {cUnitsNameOrCode, nfRound}))   
EndIf
Return nRet		

METHOD ResultFromInt(cUnitsNameOrCode, nValue) CLASS VisioCell
If ( ValType(cUnitsNameOrCode) == 'C' )
	(_Super:ExecMethod(4318, {cUnitsNameOrCode, nValue}))
ElseIf ( ValType(cUnitsNameOrCode) == 'N' )	
	(_Super:ExecMethod(4319, {cUnitsNameOrCode, nValue}))
EndIf
Return		

METHOD VsoResultFromIntForce(cUnitsNameOrCode, nValue) CLASS VisioCell
If ( ValType(cUnitsNameOrCode) == 'C' )
	(_Super:ExecMethod(4320, {cUnitsNameOrCode, nValue}))  
ElseIf ( ValType(cUnitsNameOrCode) == 'N' )        
	(_Super:ExecMethod(4321, {cUnitsNameOrCode, nValue}))  
EndIf 
Return		

METHOD ResultStr(cUnitsNameOrCode) CLASS VisioCell
Local cRet
If ( ValType(cUnitsNameOrCode) == 'C' )
	cRet := (_Super:ExecMethod(4322, {cUnitsNameOrCode}))
ElseIf ( ValType(cUnitsNameOrCode) == 'N' )       	
	cRet := (_Super:ExecMethod(4323, {cUnitsNameOrCode}))
EndIf
Return cRet	

METHOD Trigger() CLASS VisioCell
Return (_Super:ExecMethod(4324, {}))  

METHOD GlueTo(oOtherCell) CLASS VisioCell  
If ValType(oOtherCell) <> "O"
	UserException( STR0002 + ValType(oOtherCell) + STR0001 ) //"Invalid parameter, received " # " expected O"
EndIf                                                                                   
If (oOtherCell:cVisioClassName <> "Cell")                                             
	UserException( STR0004 + ValType(oOtherCell:cVisioClassName) + STR0003 ) //"Invalid object, received " # " expected Cell"
EndIf
Return (_Super:ExecMethod(4325, {oOtherCell:nObjectID} ))          

/*METHOD GlueToPos(oOtherShape, nxPercent, nyPercent) CLASS VisioCell
If ValType(oOtherShape) <> "O"
	UserException("Invalid parameter, received " + ValType(oOtherShape) + " expected O")
EndIf                                                                                   
If (oOtherShape:cVisioClassName <> "Shape")                                             
	UserException("Invalid object, received " + ValType(oOtherShape:cVisioClassName) + " expected Shape")
EndIf
Return Val(_Super:ExecMethod(4326, {oOtherShape:nObjectID, nxPercent, nyPercent} ))*/


//  HRESULT GlueToPos(CVisioShape FAR &SheetObject, double xPercent, double yPercent); 

METHOD InheritedValueSource() CLASS VisioCell    
Local oObject := VisioCell():New()
oObject:nObjectID	:= Val(_Super:ExecMethod(4327, {} ))
Return oObject  

METHOD InheritedFormulaSource() CLASS VisioCell    
Local oObject := VisioCell():New()
oObject:nObjectID	:= Val(_Super:ExecMethod(4328, {} ))
Return oObject 


//----------------------------------------------------------

METHOD SetFormula( cValue ) CLASS VisioCell
Return (_Super:SetProperty(4100, cValue ))

METHOD GetFormula() CLASS VisioCell
Return (_Super:GetProperty(4100, "C"))

METHOD GetName() CLASS VisioCell
Return (_Super:GetProperty(4101, "C"))    
                                                                                                     
METHOD GetResultIU() CLASS VisioCell
Return (_Super:GetProperty(4102, "C"))    

METHOD SetResultIU(nResultIU) CLASS VisioCell
Return (_Super:SetProperty(4102, nResultIU ))

METHOD GetRowName() CLASS VisioCell
Return (_Super:GetProperty(4103, "C"))     

METHOD SetRowName(cRowName) CLASS VisioCell
Return (_Super:SetProperty(4103, cRowName ))      
                                                                 
METHOD GetVsoFormulaU() CLASS VisioCell
Return (_Super:GetProperty(4104, "C"))     

METHOD SetVsoFormulaU(cFormulaU) CLASS VisioCell
Return (_Super:SetProperty(4104, cFormulaU ))      

//  HRESULT ResultIUForce(VW_CONST double param01);    
//  HRESULT Application(CVisioApplication FAR &rWrap);
//  HRESULT getResult(VARIANT_HELPER_CLASS FAR &UnitsNameOrCode, double FAR *lpRet);
//  HRESULT putResult(VW_CONST VARIANT_HELPER_CLASS FAR &UnitsNameOrCode, VW_CONST double param02);
//  HRESULT Document(CVisioDocument FAR &rWrap);
//  HRESULT Style(CVisioStyle FAR &rWrap);
//  HRESULT EventList(CVisioEventList FAR &rWrap);
//  HRESULT ContainingRow(CVisioRow FAR &rWrap);
