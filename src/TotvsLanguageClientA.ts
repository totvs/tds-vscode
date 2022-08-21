import { sendShutdown, sendExit } from './protocolMessages';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

export class TotvsLanguageClientA extends LanguageClient {
  private _ready: boolean = false;

  public get isReady(): boolean {
    return this._ready;
  }

  public set ready(value: boolean) {
    this._ready = value;
  }

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
