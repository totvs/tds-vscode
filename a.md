# Plano - Parse incremental do tree-sitter no TOTVS LS

Objetivo: fazer o parser tree-sitter reusar a arvore anterior a cada edicao
(ts_tree_edit + ts_parser_parse com o oldTree), reparseando apenas a regiao
alterada, em vez de reparsear o arquivo inteiro do zero.

- Extensao VS Code (cliente): W:\tds\tds-vscode
- Language Server (servidor): W:\ls_da\ls_da\totvsls

---

## Estado atual (diagnostico)

1. Sync do documento e Full. Em totvsls/totvsls/msg_lsp_initialize_request.cc (~linha 129):
     optional<lsTextDocumentSyncKind> change = lsTextDocumentSyncKind::Full;
   Logo, o VS Code envia o texto inteiro a cada mudanca.

2. didChange ignora deltas. Em totvsls/totvsls/msg_text_document_did_change.cc (~linha 32):
     workspaceFile->setContent(request->params.contentChanges[0].text.c_str(), version);
   Usa apenas contentChanges[0].text (documento completo); nao ha range.

3. Tree-sitter sempre parseia do zero e descarta a arvore. Em
   totvsls/totvsls/totvs_linter.cc (callTreesitter, ~linha 553):
     TSTree* tree = ts_parser_parse_string(parser, NULL, source, len); // NULL = do zero
     ...
     ts_tree_delete(tree);
     ts_parser_delete(parser);
   Nao existe ts_tree_edit/TSInputEdit; a arvore nao e persistida entre chamadas.
   Mesmo padrao em msg_totvsserver_ast.cc e formatter/document_ast_formatting.cpp.

4. Extensao nao forca sync proprio. Em src/TotvsLanguageClient.ts, clientOptions
   nao define synchronize.textDocumentSync; o vscode-languageclient respeita o
   textDocumentSync.change anunciado pelo servidor. Portanto, NAO e preciso
   alterar a extensao para habilitar deltas - basta o servidor anunciar Incremental.

Conclusao: o transporte manda o arquivo inteiro e o servidor reparseia tudo do
zero, descartando a arvore. Para incremental, faltam: persistir a arvore por
documento, calcular o edit e reusar o oldTree.

---

## Pecas necessarias (em ordem de dependencia)

### 1. (Servidor) Anunciar Incremental sync - pre-requisito para deltas
Arquivo: totvsls/totvsls/msg_lsp_initialize_request.cc (~129)
   optional<lsTextDocumentSyncKind> change = lsTextDocumentSyncKind::Incremental;
Efeito: o VS Code passa a enviar contentChanges como lista de deltas
(cada item com range, rangeLength, text). Automatico via vscode-languageclient
(sem mudanca na extensao).

### 2. (Servidor) Tratar os deltas no didChange
Arquivo: totvsls/totvsls/msg_text_document_did_change.cc
- Hoje pega so contentChanges[0].text (texto completo). Com Incremental,
  iterar sobre todos os contentChanges, cada um com range.
- Verificar/estender a desserializacao de lsTextDocumentDidChangeParams /
  contentChanges para incluir range e rangeLength (hoje so usa text).
- Para cada edit:
  - aplicar ao buffer em memoria (recortar o range e inserir o texto novo);
  - montar um TSInputEdit (offsets em bytes + pontos linha/coluna de start,
    old_end e new_end) para alimentar o tree-sitter.

### 3. (Servidor) Persistir e reusar a arvore por documento
Arquivos: totvsls/totvsls/dbcode/workspace_file.{h,cpp} e totvs_linter.cc
- Guardar TSParser* e TSTree* por documento (membros no WorkspaceFile), em vez
  de criar/destruir a cada chamada.
- didOpen: parse inicial (ts_parser_parse_string(parser, NULL, ...)) e guardar.
- didChange: para cada TSInputEdit, ts_tree_edit(oldTree, &edit); depois
  newTree = ts_parser_parse(parser, oldTree, input) (ou
  ts_parser_parse_string(parser, oldTree, newSource, len) passando o oldTree
  editado em vez de NULL). Substituir a arvore guardada.
- didClose: ts_tree_delete + liberar o parser.
- Thread-safety: ja existe std::lock_guard<std::mutex> mutexAdvplc no linter;
  proteger o acesso a arvore por documento.

### 4. (Extensao) Nenhuma mudanca necessaria
Com o servidor anunciando Incremental, o vscode-languageclient ja envia os
deltas. So mexeria na extensao se quisesse forcar/override o sync (nao e o caso).

---

## Alternativa recomendada como 1o passo (menor risco)

Obter a maior parte do ganho SEM mudar o protocolo (mantendo Full sync), pois o
custo real esta no reparse, nao no transporte:

- Manter Full sync (VS Code continua mandando o texto inteiro).
- No servidor: persistir o TSTree* por documento e, no didChange, calcular o
  TSInputEdit a partir do diff entre o conteudo antigo (em memoria) e o novo
  (recebido). Com o edit: ts_tree_edit(old, &edit) +
  ts_parser_parse_string(parser, old, newSource, len).
- O tree-sitter tolera edits imprecisos (no pior caso reparseia mais), entao um
  diff simples (prefixo/sufixo comum) ja habilita o reuso da arvore.

Vantagem: evita mexer no initialize e na desserializacao de range.
Depois, se quiser precisao maxima, migrar para Incremental (itens 1-2).

---

## Passo a passo minimo viavel

1. WorkspaceFile: adicionar TSParser*/TSTree* persistentes; criar no didOpen,
   editar+reparsear no didChange, destruir no didClose.
2. callTreesitter (totvs_linter.cc): parar de criar/destruir parser+tree a cada
   chamada; usar os do WorkspaceFile e passar o oldTree para ts_parser_parse.
3. Calcular o TSInputEdit: via diff (mantendo Full sync) OU via
   contentChanges[].range (migrando initialize para Incremental e
   desserializando range no didChange).
4. Extensao: sem mudancas.

---

## Observacoes / expectativa de ganho

- O parse do tree-sitter dessas gramaticas costuma ser muito rapido mesmo do
  zero; o ganho incremental e mais perceptivel em arquivos grandes e digitacao
  continua.
- Recomenda-se medir o tempo atual de callTreesitter (ha printTreesitterAst/logs
  disponiveis) antes de investir, para confirmar que o reparse e o gargalo.
- Pontos de atencao: consistencia entre o buffer em memoria e a arvore; edits
  multibyte/encoding (o conteudo chega em UTF-8); recomputo de diagnosticos apos
  o reparse; e os outros consumidores que hoje parseiam do zero
  (msg_totvsserver_ast.cc, document_ast_formatting.cpp) - decidir se tambem
  reusam a arvore persistida.
