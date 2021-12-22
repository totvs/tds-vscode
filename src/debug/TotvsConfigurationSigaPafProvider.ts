import { DebugConfiguration, DebugConfigurationProvider } from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";

export class TotvsConfigurationSigaPafProvider
  extends TotvsConfigurationProvider
  implements DebugConfigurationProvider
{
  static _TYPE: string = "totvs_language_sigapaf_debug";
  static _NAME: string = "TOTVS Language Debug (SIGAPAF)";
  static _SC_BIN: string = "";

  protected initialize(config: DebugConfiguration) {
    config.type = TotvsConfigurationSigaPafProvider._TYPE;
    config.name = TotvsConfigurationSigaPafProvider._NAME;
    config.sigapafBin = TotvsConfigurationSigaPafProvider._SC_BIN;
  }

  protected finalize(config: DebugConfiguration): DebugConfiguration {
    config.smartclientBin = config.sigapafBin;

    return super.finalize(config);
  }
}
