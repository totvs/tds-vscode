# Configurações

As configurações do **TDS-VSCode** seguem a estrutura de configurações do **VS-Code**. Para acessar as configurações, acione o comando `Preferences: Open Settings (UI)` ou `Preferences: Open User Settings` ou se preferir pode editar (texto) diretamente os arquivos acionando os comando `Preferences: Open Settings (JSON)` ou `Preferences: Open User Settings (JSON)`.

> Para detalhes de como funciona a estrutura de configurações do **VS-Code**, acesse a documentação oficial: [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings).

## Chaves de configuração do **TDS-VSCode**

Essas chaves de configuração são específicas do **TDS-VSCode** e podem ser utilizadas para personalizar o comportamento da extensão.

> Por questão de clareza da documentação, todas as chaves devem ter o prefixo `totvsLanguageServer.` e aqui será suprimido. Por exemplo: ``totvsLanguageServer.compilation.tempDir`` será apresentada como ``.compilation.tempDir``.
> Chaves enumeradas terão seu valores listados em tópico específico, mais a frente.

<!-- Manter as linhas desta tabela em ordem alfabética -->
| Chave | Padrão | Descrição  |
| totvsLanguageServer. | | Prefixo das chaves  |
| - | - | - |
| .4gl.formatter.keywordsCase | upper | Coloca as palavras chaves da linguagem na caixa indicada. |
| .4gl.formatter.stringStyle | ignore | Indica como as _strings_ devem ser informadas. |
| .askCompileResult | true | Pede para exibir tabela com resultados da compilação. |
| .askEncodingChange  | true | Requisitar alteração na codificação para Windows-1252. |
| .clearConsoleBeforeCompile | false | Limpar o console antes da compilação. |
| .compilation.commitWithErrorOrWarning | false | Confirma (_commit_) a compilação com erros/alertas |
| .compilation.generatePpoFile | false | Gere arquivo PPO. |
| .compilation.showPreCompiler | false | Mostrar comando pré compilador. |
| .compilation.tempDir | |  Diretório temporário. |
| .editor.autocomplete | LS | tds.package.editor.autocomplete |
| .editor.codeLens | true | Controls activation of the CodeLens. |
| .editor.hover | markDown | Control how the presentation is displayed on hover. |
| .editor.index.cache | off | Browsing cache persistence |
| .editor.linter.behavior | enableOnlyOpenFiles | Habilitar o Linter |
| .editor.show.notification | none| %tds.package.editor.notification.show% |
| .editor.signatureHelp | true | Controls activation of the signature help. |
| .filesystem.encoding | cp1252 | Definir a codificação do sistema de arquivos. |
| .folder.enableExtensionsFilter | true | Compile apenas arquivos com extensões permitidas. |
| .folder.extensionsAllowed | \* | Extensões permitidas para compilação. |
| <a name="totvsLanguageServer.formatDate"></a>.formatDate | | Informe o código do idioma/país que usa o formato de data desejada, que será utilizado na formatação de datas nas interfaces com o usuário. O padrão é o idioma/país configurado no **VS-Code**. Formato: `<código idioma>-<código país>`, ambos com duas letras. |
| | [Language Code (IETF)](https://en.wikipedia.org/wiki/IETF_language_tag) [Country Code (ISO 3166-1)](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes). |
| .launch.args| [] | Lista contendo argumentos extras para passar ao binário do TOTVS Language Server. |
| .reconnectLastServer | true | Reconectar ao último servidor conectado na inicialização. |
| .showBanner | true | Apresenta banner na inicialização. |
| .showConsoleOnCompile | true | Exibir console na compilação. |
| .trace.debug | off | Rastreia a comunicação entre o VS Code e o Debug Adapter. |
| .trace.server | off | Rastreia a comunicação entre o VS Code e o Language Server. |
| .usageInfoConfig | false | Toggle indication of use. |
| .web.arguments | [] | Argumentos para navegador web. |
| .web.navigator | | Navegador da Web (depuração com SmartClientHtml). |
| .welcomePage | true | Mostrar página de boas-vindas na primeira inicialização. |
| .workspaceServerConfig | false | Use a área de trabalho para manter as configurações do servidor. |

* Extensões padrão para compilação: \[".PRW",".PRX",".PRG",".PPX",".PPP",".TLPP",".APW",".APH",".APL",".AHU",".TRES",".PNG",".BMP",".RES",".4GL",".PER",".JS",".RPTDESIGN"\]

## Valores das chaves enumeradas

### totvsLanguageServer.4gl.formatter.keywordsCase

| Valor  | Uso                                                               |
| ------ | ----------------------------------------------------------------- |
| upper  | Coloca palavras-chaves em maiúsculas (padrão). |
| lower  | Coloca palavras-chaves em minúsculas.  |
| ignore | Desliga a formatação. |

### totvsLanguageServer.4gl.stringStyle

| Valor         | Uso                                                               |
| ------------- | ----------------------------------------------------------------- |
| double-quotes | Usar aspas simples. |
| single-quotes | Usar aspas duplas em strings. |
| ignore        | Usar aspas simples ou duplas em strings (padrão) |

### totvsLanguageServer.editor.autocomplete

| Valor         | Uso                                                               |
| ------------- |
| off   | Desliga o recurso. |
| basic | Básico (executado pelo VS-Code). |
| ls    | "LS (executado pelo LS). |

### totvsLanguageServer.editor.index.cache

| Valor         | Uso                                                               |
| ------------- |
| off   | Desliga o uso de cache. Algumas funcionalidades do DSS podem ficar indisponíveis.  |
| onMemory   | O cache é feito na memória.  |
| onDisk   | Persiste o cache no disco. |

### totvsLanguageServer.editor.hover

| Valor         | Uso                                                               |
| ------------- |
| off | Desliga o recurso. |
| plaintext | Apresenta sem formatação |
| markDown | Formata a apresentação (padrão)" |

### totvsLanguageServer.editor.linter.behavior

| Valor         | Uso                                                               |
| ------------- |
| enable | Executa o _linter_ para toda a área de trabalho. |
| enableOnlyOpenFiles | Executa o _linter_ somente em arquivos abertos (padrão). |
| disable | Desliga o recurso. |

### totvsLanguageServer.editor.show.notification

| Valor         | Uso                                                               |
| ------------- |
| none | Nenhum mensagem é apresentada (padrão). |
| only errors | Somente erros. |
| errors and warnings | Erros e avisos. |
| errors warnings and infos | Erros, avisos e informativos. |
| all | Todas as mensagens, incluindo de depuração. |

### totvsLanguageServer.filesystem.encoding

| Valor         | Uso                                                               |
| ------------- |
| cp1252 | Utiliza a codificação Windows-1252 (padrão). |
| cp1251 | Utiliza a codificação Windows-1251 (russo). |

### totvsLanguageServer.trace.debug

| Valor         | Uso                                                               |
| ------------- |
| off | Desliga o recurso (padrão). |
| messages | Somente a identificação da mensagem. |
| verbose | Inclui detalhes da mensagem. |

### totvsLanguageServer.trace.server

| Valor         | Uso                                                               |
| ------------- |
| off | Desliga o recurso (padrão). |
| messages | Somente a identificação da mensagem. |
| verbose | Inclui detalhes da mensagem. |
