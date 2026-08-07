#include "protheus.ch"

#define TTREE_ISEDITABLE        1
#define TTREE_ISDRAGANDDROP     2
#define TTREE_SCROLL_HORIZINTAL 1
#define TTREE_SCROLL_VERTICAL   2

// Short for cValToChar
#define n2s(cNum)  cValToChar(cNum)

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

/*/{Protheus.doc} button
Presents a dialog with options to test TTree functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TTree
/*/
user function tree()

	local aOption := {;
		{"Visual",  { |aoParent| tree_01(aoParent) }}, ;
		{"Events",  { |aoParent| tree_02(aoParent) }},;
		{"Process", { |aoParent| tree_03(aoParent) }},;
		}

	u_startRemotelogMessage("tree")

	u_selectTest("TTree", aOption)

	u_stopRemotelogMessage()
return

// Função principal
static function tree_01(aoParent)
	private lEnabled := .T.
	public nLastItem := 0
	public Otree

	// Cria a TTree
	oTree := TTree():new(SAY_ROW(1),10,SAY_ROW(11),260,aoParent,,)
	//oTree:SetFlags(TTREE_ISEDITABLE + TTREE_ISDRAGANDDROP) // Habilita edicao e drag
	oTree:SetScroll(TTREE_SCROLL_HORIZINTAL, .T.) // Habilita barra de rolagem horizontal
	oTree:SetScroll(TTREE_SCROLL_VERTICAL  , .T.) // Habilita barra de rolagem vertical
	oTree:cName := "oTree"
	oTree:cReadVar := "oTree"

	// Insere itens
	addRoot(1, oTree)
	addRoot(2, oTree)

	oTree:BeginUpdate() // Desliga eventos de pintura pra evitar flicks
	oTree:PTSendNodes() // Carrega itens pre-inseridos
	oTree:EndUpdate()   // Liga eventos de pintura

	// Menu de opcoes
	oTree:setPopup( createMenu(aoParent, oTree) )

	@ SAY_ROW(12), 010 button oEnabledBtn;
		prompt "Toggle state";
		action {|| lEnabled := !lEnabled, ;
		iif(lEnabled, oTree:SetEnable(), oTree:SetDisable());
		};
		size 50, 15;
		of aoParent pixel

Return

static function tree_02(aoParent)
	private lEnabled := .T.
	public nLastItem := 0
	public Otree

	//DEFINE DIALOG aoParent TITLE "DTCLIENT01-5260" FROM 180,180 TO 550,700 PIXEL

	// Cria a TTree
	oTree := TTree():new(SAY_ROW(1),10,SAY_ROW(11),260,aoParent,,)
	//oTree:SetFlags(TTREE_ISEDITABLE + TTREE_ISDRAGANDDROP) // Habilita edicao e drag
	oTree:SetScroll(TTREE_SCROLL_HORIZINTAL, .T.) // Habilita barra de rolagem horizontal
	oTree:SetScroll(TTREE_SCROLL_VERTICAL  , .T.) // Habilita barra de rolagem vertical
	oTree:cName := "oTree"
	oTree:cReadVar := "oTree"

	// Insere itens
	addRoot(1, oTree)
	addRoot(2, oTree)

	oTree:BeginUpdate() // Desliga eventos de pintura pra evitar flicks
	oTree:PTSendNodes() // Carrega itens pre-inseridos
	oTree:EndUpdate()   // Liga eventos de pintura

	//TSrvObject and TControl
	u_allEvents(oTree, "oTree")
Return

static function tree_03(aoParent)
	private lEnabled := .T.
	public nLastItem := 0
	public oTree

	// Cria a TTree
	oTree := TTree():new(SAY_ROW(1),10,SAY_ROW(11),260,aoParent,,)
	oTree:SetFlags(TTREE_ISEDITABLE + TTREE_ISDRAGANDDROP) // Habilita edicao e drag
	oTree:SetScroll(TTREE_SCROLL_HORIZINTAL, .T.) // Habilita barra de rolagem horizontal
	oTree:SetScroll(TTREE_SCROLL_VERTICAL  , .T.) // Habilita barra de rolagem vertical
	oTree:cName := "oTree"
	oTree:cReadVar := "oTree"

	// oTree:BeginUpdate() // Desliga eventos de pintura pra evitar flicks
	// // Insere itens
	// addRoot(1, oTree)
	// addRoot(2, oTree)

	// oTree:PTSendNodes() // Carrega itens pre-inseridos
	// oTree:EndUpdate()   // Liga eventos de pintura

	// Menu de opcoes
	oTree:setPopup( createMenu(aoParent, oTree) )

	@ SAY_ROW(12), 010 say "Activate popup menu for actions";
		of aoParent pixel

Return

// Posiciona no 2o item
// --------------------------------------------------------------------
static function PTGotoToNode(oTree)
	oTree:PTGotoToNode("2") // No exemplo: Busca sempre o 2o item da Tree
return

// Insere itens a partir de um Array (PTAddArrayNodes)
// --------------------------------------------------------------------
static function PTAddArrayNodes()
	local aNodes := {}

	nNewRoot := ++nLastItem // Guarda numero do proximo item raiz
	aAdd(aNodes,{"0"        , n2s(nNewRoot)   ,"","Raiz"+cValToChar(nNewRoot) ,"FOLDER5","FOLDER6"}) // Insere item na Raiz
	aAdd(aNodes,{n2s(nNewRoot), n2s(++nLastItem),"","Item"+cValToChar(nLastItem),"FOLDER5","FOLDER6"})
	aAdd(aNodes,{n2s(nNewRoot), n2s(++nLastItem),"","Item"+cValToChar(nLastItem),"FOLDER5","FOLDER6"})

	oTree:PTAddArrayNodes( aNodes )
	oTree:PTSendNodes() // Carrega itens pre-inseridos
	oTree:PTGotoToNode(cValToChar(nNewRoot)) // Expande o item inserido
Return

// Insere itens a partir de um Array (PTSendTree)
// --------------------------------------------------------------------
static function PTSendTree(oTree)
	local aNodes := {}

	nNewRoot := ++nLastItem // Guarda numero do proximo item raiz
	aAdd(aNodes,{"0"        , n2s(nNewRoot)   ,"","Raiz"+cValToChar(nNewRoot) ,"FOLDER5","FOLDER6"}) // Insere item na Raiz
	aAdd(aNodes,{n2s(nNewRoot), n2s(++nLastItem),"","Item"+cValToChar(nLastItem),"FOLDER5","FOLDER6"})
	aAdd(aNodes,{n2s(nNewRoot), n2s(++nLastItem),"","Item"+cValToChar(nLastItem),"FOLDER5","FOLDER6"})

	oTree:PTSendTree( aNodes )
	oTree:PTGotoToNode(cValToChar(nNewRoot)) // Expande o item inserido
Return

// Menu de opcoes
// --------------------------------------------------------------------
static function createMenu(aoParent, oTree)
	local oMenu := TMenu():New(0,0,0,0,.T.)

	oMenu:Add( TMenuItem():New(aoParent,"CurrentNodeID/PTGetNivel/PTGetPrompt - Retorna ID/Nivel/Prompt",,,,;
		{|| logMessage( "ID: " + oTree:CurrentNodeID +;
		" | Nivel: " + cValToChar(oTree:PTGetNivel()) +;
		" | Prompt: " + oTree:PTGetPrompt()) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTGetNodeCount - Retorna numero de itens da Tree",,,,;
		{|| logMessage( "PTGetNodeCount:" + cValToChar( oTree:PTGetNodeCount() )) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTChangeBmp(LBOK) - Muda imagem",,,,;
		{|| oTree:PTChangeBmp("LBNO","LBTIK",oTree:CurrentNodeID) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTChangeBmp(LBTIK) - Muda imagem",,,,;
		{|| oTree:PTChangeBmp("LBTIK","LBNO",oTree:CurrentNodeID) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTChangePrompt - Muda texto",,,,;
		{|| oTree:PTChangePrompt(FWInputBox("PTChangePrompt", alltrim(oTree:PTGetPrompt())),oTree:CurrentNodeID) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTAddArrayNodes - Insere +itens",,,,;
		{|| PTAddArrayNodes() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"-") ) // Separador
	oMenu:Add( TMenuItem():New(aoParent,"PTSendTree - Insere +itens",,,,;
		{|| PTSendTree(oTree) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTDeleteCurrentNode - Deleta item corrente",,,,;
		{|| oTree:PTDeleteCurrentNode() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"-") )
	oMenu:Add( TMenuItem():New(aoParent,"PTCollapse - Contrai item selecionado",,,,;
		{|| oTree:PTCollapse() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTReset - Limpa a Tree",,,,;
		{|| nLastItem := 0, oTree:PTReset() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"SetEnable - Habilita a Tree",,,,{|| oTree:SetEnable() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"-") )
	oMenu:Add( TMenuItem():New(aoParent,"SetDisable - Desabilita a Tree",,,,{|| oTree:SetDisable() },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"PTGotoToNode('2') - Posiciona no 2o item",,,,{|| PTGotoToNode(oTree) },,,,,,,,,.T.) )
	oMenu:Add( TMenuItem():New(aoParent,"-") )
return oMenu

static function addRoot(anRoot, aoTree)
	local nInd
	local nInd2
	local nRoot := ++nLastItem
	local nId

	oTree:PTAddNodes("0", n2s(nRoot), "", "Root " + n2s(anRoot), "FOLDER5" , "FOLDER6" )

	for nInd := 0 to 4
		oTree:PTAddNodes(n2s(nRoot), n2s(++nLastItem), "", "Item " + n2s(anRoot) + "." + n2s(anRoot + nInd), "FOLDER10", "FOLDER11")

		nId := nLastItem
		for nInd2 := 0 to 4
			oTree:PTAddNodes(n2s(nId), n2s(++nLastItem), "", "Item " + n2s(anRoot) + "." + n2s(anRoot + nInd) + "." + n2s(nInd2+1), "FOLDER10", "FOLDER11")
		next
	next
return


static function logMessage(acMessage)
	u_remoteLog(acMessage, [], "u_tree")
return
