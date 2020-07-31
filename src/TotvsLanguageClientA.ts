import {
  LanguageClient,
  ServerOptions,
  LanguageClientOptions
} from "vscode-languageclient";

export class TotvsLanguageClientA extends LanguageClient {
  constructor(
    serverOptions: ServerOptions,
    clientOptions: LanguageClientOptions
  ) {
    super(
      "totvsLanguageServer",
      "TOTVS Language Server",
      serverOptions,
      clientOptions
    );
  }

  registerBuiltinFeatures() {
    super.registerBuiltinFeatures();
  }

}
  // function provideCodeLens(
  //   document: TextDocument,
  //   token: CancellationToken,
  //   next: ProvideCodeLensesSignature
  // ): ProviderResult<CodeLens[]> {
  //   let config = workspace.getConfiguration("AdvPL");
  //   let enableInlineCodeLens = config.get("codeLens.renderInline", false);
  //   if (!enableInlineCodeLens) {
  //     return next(document, token);
  //   }
  //   // We run the codeLens request ourselves so we can intercept the response.
  //   return languageClient
  //     .sendRequest("textDocument/codeLens", {
  //       textDocument: {
  //         uri: document.uri.toString(),
  //       },
  //     })
  //     .then((a: ls.CodeLens[]): CodeLens[] => {
  //       let result: CodeLens[] = languageClient.protocol2CodeConverter.asCodeLenses(
  //         a
  //       );
  //       displayCodeLens(document, result, codeLensDecoration);
  //       return [];
  //     });
  // }

