import {
  LanguageClient,
  ServerOptions,
  LanguageClientOptions,
} from 'vscode-languageclient';

export class TotvsLanguageClientA extends LanguageClient {
  constructor(
    serverOptions: ServerOptions,
    clientOptions: LanguageClientOptions
  ) {
    super(
      'totvsLanguageServer',
      'TOTVS Language Server',
      serverOptions,
      clientOptions
    );
  }

  registerBuiltinFeatures() {
    super.registerBuiltinFeatures();
  }
}
