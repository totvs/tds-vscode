#Include "PROTHEUS.ch"
#Include "FWMVCDEF.ch"

/*/{Protheus.doc} GPER490SVTestCase
    Classe de casos de teste do Relatório de Admitidos e Desligados Turnover
    @type Class
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
/*/
Class GPER490SVTestCase From FwDefaultTestCase
	// Criação dos atributos da classe
	Data oHelper As Object // Instância da classe FwTestHelper

	// Criação dos métodos da classe
	Method GPER490SVTestCase() Constructor
	Method SetUpClass()
	Method GPER490SV_001()
EndClass

/*/{Protheus.doc} GPER490SVTestCase:GPER490SVTestCase()
    Método construtor da classe.
    @type Method
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
    @return Variant, Retorno nulo pré-fixado
/*/
Method GPER490SVTestCase() As Variant Class GPER490SVTestCase
	// Declaração das variáveis locais
	Local oHelper As Object // Instância da classe FwTestHelper

	// Inicialização das variáveis
	oHelper := FwTestHelper():New()

	_Super:FwDefaultTestSuite()

	// Adiciona os métodos de teste da classe e suas respectivas descrições
	If (oHelper:EnvUpdExp() .and. GetRPORelease() >= "12.1.2310")
		::AddTestMethod("GPER490SV_001", NIL, "Relatório admitidos e desligados turnover com funcionário admitido sem transferência")
		::AddTestMethod("GPER490SV_002", NIL, "Relatório admitidos e desligados turnover com funcionário admitido com transferência")
		::AddTestMethod("GPER490SV_003", NIL, "Relatório admitidos e desligados turnover com funcionário admitido com salário")
        /*::AddTestMethod("GPER490SV_004", NIL, "Relatório admitidos e desligados turnover com funcionário admitido com tipo de contratação")
        ::AddTestMethod("GPER490SV_005", NIL, "Relatório admitidos e desligados turnover com funcionário desligado com aviso prévio e motivo de desligamento")
    */EndIf
		Return NIL

/*/{Protheus.doc} GPER490SVTestCase:SetUpClass()
    Instancia os casos de teste do módulo.
    @type Method
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
    @return Object, Instância da classe FwTestHelper
/*/
Method SetUpClass() As Object Class GPER490SVTestCase
	// Declaração das variáveis locais
	Local oHelper As Object // Instância da classe FwTestHelper

	// Inicialização das variáveis
	oHelper := FwTestHelper():New()
Return oHelper

/*/{Protheus.doc} GPER490SVTestCase:GPER490SV_001()
    Relatório admitidos e desligados turnover com funcionário admitido sem transferência
    @type Method
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
    @return Object, Instância da classe FwTestHelper
/*/
Method GPER490SV_001() As Object Class GPER490SVTestCase
	// Declaração das variáveis locais
	Local oHelper   As Object    // Instância da classe FwTestHelper
	Local cReport   As Character // Nome do design (.trp) que será testado
	Local cFileName As Character // Base do nome do arquivo que o test case irá gerar (por convenção, estamos usando o identificador do pergunte (SX1) associado a objeto de negócio mais o número identificador do método de teste)
	Local aReplace  As Array
	Local aReplaceX As Array

	// Inicialização das variáveis
	oHelper   := FwTestHelper():New()
	cReport   := "rh.sv.gpe.gper490.default.rep"
	cFileName := "GPER490SV_002"
	aReplace  := {}
	aReplaceX := {}

	oHelper:Activate()
	// Define os parâmetros do relatório
	oHelper:UTParamSmartView("ReferenceDateFrom",  FwTimeStamp(6, CToD("01/01/2000"))) // Data de Referência De
	oHelper:UTParamSmartView("ReferenceDateTo",    FwTimeStamp(6, CToD("31/01/2000"))) // Data de Referência Até
	oHelper:UTParamSmartView("BranchCodeFrom",     "D MG 01") //Filial De
	oHelper:UTParamSmartView("BranchCodeTo",       "D MG 01") // Filial Até
	oHelper:UTParamSmartView("CostCenterCodeFrom", "") //CC De
	oHelper:UTParamSmartView("CostCenterCodeTo",   "") //CC Ate
	oHelper:UTParamSmartView("EmployeeCodeFrom",   "110006")  //Matrícula De
	oHelper:UTParamSmartView("EmployeeCodeTo",     "110006") //Matrícula Até
	oHelper:UTParamSmartView("NameFrom",           "") // Nome Funcionário De
	oHelper:UTParamSmartView("NameTo",             "") // Nome Funcionário Até
	oHelper:UTParamSmartView("EmployeeSituation",  "") // Situações
	oHelper:UTParamSmartView("EmployeeCategory",   "") // Categoria
	oHelper:UTParamSmartView("Funds",              "") // Verbas
	oHelper:UTParamSmartView("BreakBy",            "") // Quebra Por Filial

	// Gera o relatório
	oHelper:UTGenerateSmartView(cReport, cFileName)

	// Substitui o conteúdo que está entre duas strings para comparação do arquivo
	AAdd(aReplaceX, {"Data de referência:", "Página", "01/01/2015 | 01:01:01"})

	// Compara relatório com Baseline
	oHelper:UTCompareSmartView(cFileName, aReplace, aReplaceX, .T.)

	oHelper:AssertTrue(oHelper:lOk, "")
Return oHelper

/*/{Protheus.doc} GPER490SVTestCase:GPER490SV_002()
    Relatório admitidos e desligados turnover com funcionário admitido com transferência
    @type Method
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
    @return Object, Instância da classe FwTestHelper
/*/
Method GPER490SV_002() As Object Class GPER490SVTestCase
	// Declaração das variáveis locais
	Local oHelper   As Object    // Instância da classe FwTestHelper
	Local cReport   As Character // Nome do design (.trp) que será testado
	Local cFileName As Character // Base do nome do arquivo que o test case irá gerar (por convenção, estamos usando o identificador do pergunte (SX1) associado a objeto de negócio mais o número identificador do método de teste)
	Local aReplace  As Array
	Local aReplaceX As Array

	// Inicialização das variáveis
	oHelper   := FwTestHelper():New()
	cReport   := "rh.sv.gpe.gper490.default.rep"
	cFileName := "GPER490SV_002"
	aReplace  := {}
	aReplaceX := {}

	oHelper:Activate()
	// Define os parâmetros do relatório
	oHelper:UTParamSmartView("ReferenceDateFrom",  FwTimeStamp(6, CToD("01/10/2010"))) // Data de Referência De
	oHelper:UTParamSmartView("ReferenceDateTo",    FwTimeStamp(6, CToD("30/10/2010"))) // Data de Referência Até
	oHelper:UTParamSmartView("BranchCodeFrom",     "D MG 01") //Filial De
	oHelper:UTParamSmartView("BranchCodeTo",       "D MG 01") // Filial Até
	oHelper:UTParamSmartView("CostCenterCodeFrom", "") //CC De
	oHelper:UTParamSmartView("CostCenterCodeTo",   "") //CC Ate
	oHelper:UTParamSmartView("EmployeeCodeFrom",   "000333")  //Matrícula De
	oHelper:UTParamSmartView("EmployeeCodeTo",     "000333") //Matrícula Até
	oHelper:UTParamSmartView("NameFrom",           "") // Nome Funcionário De
	oHelper:UTParamSmartView("NameTo",             "") // Nome Funcionário Até
	oHelper:UTParamSmartView("EmployeeSituation",  "") // Situações
	oHelper:UTParamSmartView("EmployeeCategory",   "") // Categoria
	oHelper:UTParamSmartView("Funds",              "") // Verbas
	oHelper:UTParamSmartView("BreakBy",            "") // Quebra Por Filial

	// Gera o relatório
	oHelper:UTGenerateSmartView(cReport, cFileName)

	// Substitui o conteúdo que está entre duas strings para comparação do arquivo
	AAdd(aReplaceX, {"Data de referência:", "Página", "01/01/2015 | 01:01:01"})

	// Compara relatório com Baseline
	oHelper:UTCompareSmartView(cFileName, aReplace, aReplaceX, .T.)

	oHelper:AssertTrue(oHelper:lOk, "")
Return oHelper

/*/{Protheus.doc} GPER490SVTestCase:GPER490SV_003()
    Relatório admitidos e desligados turnover com funcionário admitido com salário
    @type Method
    @version 12.1.2310
    @author karina.alves
    @since 23/05/2024
    @return Object, Instância da classe FwTestHelper
/*/
Method GPER490SV_003() As Object Class GPER490SVTestCase
	// Declaração das variáveis locais
	Local oHelper   As Object    // Instância da classe FwTestHelper
	Local cReport   As Character // Nome do design (.trp) que será testado
	Local cFileName As Character // Base do nome do arquivo que o test case irá gerar (por convenção, estamos usando o identificador do pergunte (SX1) associado a objeto de negócio mais o número identificador do método de teste)
	Local aReplace  As Array
	Local aReplaceX As Array

	// Inicialização das variáveis
	oHelper   := FwTestHelper():New()
	cReport   := "rh.sv.gpe.gper490.default.rep"
	cFileName := "GPER490SV_003"
	aReplace  := {}
	aReplaceX := {}

	oHelper:Activate()
	// Define os parâmetros do relatório
	oHelper:UTParamSmartView("ReferenceDateFrom",  FwTimeStamp(6, CToD("01/10/2010"))) // Data de Referência De
	oHelper:UTParamSmartView("ReferenceDateTo",    FwTimeStamp(6, CToD("30/10/2010"))) // Data de Referência Até
	oHelper:UTParamSmartView("BranchCodeFrom",     "D MG 01") //Filial De
	oHelper:UTParamSmartView("BranchCodeTo",       "D MG 01") // Filial Até
	oHelper:UTParamSmartView("CostCenterCodeFrom", "") //CC De
	oHelper:UTParamSmartView("CostCenterCodeTo",   "") //CC Ate
	oHelper:UTParamSmartView("EmployeeCodeFrom",   "000333")  //Matrícula De
	oHelper:UTParamSmartView("EmployeeCodeTo",     "000333") //Matrícula Até
	oHelper:UTParamSmartView("NameFrom",           "") // Nome Funcionário De
	oHelper:UTParamSmartView("NameTo",             "") // Nome Funcionário Até
	oHelper:UTParamSmartView("EmployeeSituation",  "") // Situações
	oHelper:UTParamSmartView("EmployeeCategory",   "") // Categoria
	oHelper:UTParamSmartView("Funds",              "") // Verbas
	oHelper:UTParamSmartView("BreakBy",            "") // Quebra Por Filial

	// Gera o relatório
	oHelper:UTGenerateSmartView(cReport, cFileName)

	// Substitui o conteúdo que está entre duas strings para comparação do arquivo
	AAdd(aReplaceX, {"Data de referência:", "Página", "01/01/2015 | 01:01:01"})

	// Compara relatório com Baseline
	oHelper:UTCompareSmartView(cFileName, aReplace, aReplaceX, .T.)

	oHelper:AssertTrue(oHelper:lOk, "")
Return oHelper
