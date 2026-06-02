# Code Actions (textDocument/codeAction)

## Referências no projeto

- `totvsls/totvsls/msg_lsp_initialize_request.cc` — anúncio da capability
- `totvsls/totvsls/msg_text_document_code_action.cc` — handler da requisição
- `totvsls/totvsls/lsp_code_action.h` — estruturas `CommandArgs`, `lsCodeLensCommandArguments`

---

## 1. Anunciar o suporte no `initialize`

Em `msg_lsp_initialize_request.cc`, dentro do bloco `g_config->isTDS_2()`, preencher `codeActionProvider`:

```cpp
lsCodeActionOptions codeActionOptions;
codeActionOptions.codeActionKinds = {
    "quickfix",         // correções automáticas associadas a diagnósticos
    "refactor",         // refatorações gerais
    "refactor.rewrite"  // reescrita de código
};
out.result.capabilities.codeActionProvider = codeActionOptions;
```

> **Situação atual:** `codeActionProvider` **não é preenchido** — o campo existe no tipo `lsServerCapabilities` mas não recebe valor no fluxo do `initialize`.

---

## 2. Valores convencionais de `codeActionKind` (LSP 3.x)

| Kind | Uso |
| --- | --- |
| `""` | Qualquer tipo (sem categoria) |
| `quickfix` | Correção rápida ligada a um diagnóstico |
| `refactor` | Refatoração genérica |
| `refactor.extract` | Extrair função ou variável |
| `refactor.inline` | Inline de função ou variável |
| `refactor.rewrite` | Reescrita de código |
| `source` | Ação de nível de arquivo |
| `source.organizeImports` | Organizar includes/imports |

---

## 3. Responder as ações em `Handler_TextDocumentCodeAction::Run`

Em `msg_text_document_code_action.cc`, o handler deve montar o vetor `out.result` com os comandos disponíveis para o range/contexto recebido.

### 3.1 Estruturas envolvidas

```cpp
// Entrada
struct lsCodeActionParams {
    lsTextDocumentIdentifier textDocument;
    lsRange range;
    lsCodeActionContext context;  // contém: std::vector<lsDiagnostic> diagnostics
};

// Saída
struct Out_TextDocumentCodeAction {
    lsRequestId id;
    std::vector<Command> result;  // Command = lsCommand<CommandArgs>
};

// CommandArgs (lsp_code_action.h)
struct CommandArgs {
    lsDocumentUri textDocumentUri;
    std::vector<lsTextEdit> edits;
};

// Cada item do resultado
struct Command {
    std::string title;    // texto exibido no menu do cliente
    std::string command;  // ID do comando (executado via workspace/executeCommand)
    CommandArgs arguments;
};
```

### 3.2 Exemplo de implementação

```cpp
void Run(In_TextDocumentCodeAction* request) override {
    Out_TextDocumentCodeAction out;
    out.id = request->id;

    // --- QuickFix: uma ação para cada diagnóstico com fixits ---
    for (auto& diag : request->params.context.diagnostics) {
        if (!diag.fixits_.empty()) {
            Out_TextDocumentCodeAction::Command command;
            command.title   = "FixIt: " + diag.message;
            command.command = "totvsls._applyFixIt";
            command.arguments.textDocumentUri = request->params.textDocument.uri;
            command.arguments.edits = diag.fixits_;
            out.result.push_back(command);
        }
    }

    // --- Refactor: baseado na palavra/range atual ---
    // WorkspaceFile* workspaceFile = ... (obtido via DBCodeManager)
    // std::string word = workspaceFile->getWordAtPosition(
    //     request->params.range.start.line,
    //     request->params.range.start.character);
    // if (!word.empty()) {
    //     Out_TextDocumentCodeAction::Command refactor;
    //     refactor.title   = "Refactor: extrair função";
    //     refactor.command = "totvsls._extractFunction";
    //     refactor.arguments.textDocumentUri = request->params.textDocument.uri;
    //     out.result.push_back(refactor);
    // }

    QueueManager::WriteStdout(kMethodType, out, out.id.value);
}
```

---

## 4. Fluxo completo

```console
1. initialize response
   └─ codeActionProvider.codeActionKinds = ["quickfix", "refactor", ...]
         ↓ cliente habilita o menu de ações (lâmpada / Ctrl+.)

2. textDocument/codeAction request  (cliente envia ao servidor)
   └─ params.textDocument  → arquivo atual
   └─ params.range         → seleção ou posição do cursor
   └─ params.context.diagnostics → diagnósticos ativos no range

3. Handler_TextDocumentCodeAction::Run  (servidor responde)
   └─ monta vetor de Command
        ├─ command.title    → texto exibido no menu
        ├─ command.command  → ID registrado no cliente
        └─ command.arguments.edits → edits a aplicar

4. workspace/executeCommand  (cliente dispara ao selecionar a ação)
   └─ servidor aplica os edits ou executa lógica adicional
```

---

## 5. Situação atual do projeto

| Aspecto | Estado |
| --- | --- |
| `codeActionProvider` no `initialize` | ❌ Não anunciado |
| Handler `textDocument/codeAction` | ⚠️ Stub — retorna 1 comando fixo de teste (`cquery._applyFixIt`) |
| Lógica real de quickfix por diagnóstico | Comentada (código legado `cquery`) |
| Lógica de refactor por símbolo | Comentada (código legado `cquery`) |
| Estrutura `CommandArgs` | ✅ Definida em `lsp_code_action.h` |
| `workspace/executeCommand` handler | A verificar |
