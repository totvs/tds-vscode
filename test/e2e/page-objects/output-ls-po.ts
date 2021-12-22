import { OutputPageObject } from "./output-po";
import { WorkbenchPageObject } from "./workbench-po";

export class OutputLsPageObject extends OutputPageObject {
  constructor(workbenchPO: WorkbenchPageObject) {
    super(workbenchPO, "TOTVS LS");
  }

  async validServerSequenceTest() {
    const sequence: RegExp[] = [
      /Starting validate server/,
      /Appserver detected with build/,
      /Validate server/,
    ];
    return await this.sequenceDefaultTest(sequence);
  }

  async compileSequenceTest(): Promise<void> {
    const sequence: RegExp[] = [
      /(Starting compile)/,
      /(Starting build for environment)/,
      /(Starting build using RPO token)/,
      /(Start file compile)/,
      /(Using Includes:)/,
      /(Start secure compiling.*1\/1)/,
      /(.*)/,
      /((Aborting|Committing) end build)/,
      /(All files compiled.*)/,
      /(Compile finished)/,
    ];

    return await this.sequenceDefaultTest(sequence);
  }

  async recompileSequenceTest(): Promise<void> {
    const sequence: RegExp[] = [
      /(Starting recompile)/,
      /(Starting build for environment)/,
      /(Starting build using RPO token)/,
      /(Start file recompile)/,
      /(Using Includes:)/,
      /(Start secure compiling.*1\/1)/,
      /(.*)/,
      /((Aborting|Committing) end build)/,
      /(All files compiled.*)/,
      /(Recompile finished)/,
    ];

    return await this.sequenceDefaultTest(sequence);
  }

  async compileSequenceWithWarningTest(): Promise<void> {
    const sequence: RegExp[] = [
      /(Start file recompile)/,
      /(Using Includes:)/,
      /(Start secure compiling.*1\/1)/,
      /(\[WARNING]\ Source)/,
      /(Committing end build)/,
      /(One or more files have warnings)/,
      /(Recompile finished)/,
    ];

    return await this.sequenceDefaultTest(sequence);
  }

  async compileSequenceWithErrorTest(): Promise<void> {
    const sequence: RegExp[] = [
      /(Start file recompile)/,
      /(Using Includes:)/,
      /(Start secure compiling.*1\/1)/,
      /(\[FATAL\] Aborting/,
      /(Aborting end build)/,
      /(One or more files have errors)/,
      /(Recompile finished)/,
    ];

    return await this.sequenceDefaultTest(sequence);
  }

  async loginSequenceTest(): Promise<void> {
    const sequence: RegExp[] = [
      /Starting connection to the server/,
      /Connection to the server /,
      /Starting user /,
      /Secure authenticating/,
      /User authenticated successfully/,
      /User '.*' authentication finished/,
    ];

    return await this.sequenceDefaultTest(sequence);
  }
}
