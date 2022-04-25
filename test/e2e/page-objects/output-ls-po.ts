import { OutputPageObject } from "./output-po";
import { WorkbenchPageObject } from "./workbench-po";

export const VALID_SERVER_SEQUENCE: string[] = [
  "Starting validate server",
  "Appserver detected with build",
  "Validate server",
];

const VALID_SERVER_BLOCK: RegExp[] = [
  /Starting validate server/,
  /Validate server/,
];

export const COMPILE_SEQUENCE: string[] = [
  "Starting compile",
  "Starting build for environment",
  "Starting build using RPO token",
  "Start file compile",
  "Using Includes:",
  "Start secure compiling.*1/1",
  "",
  "Aborting|Committing) end build",
  "All files compiled.",
  "Compile finished",
];

const COMPILE_BLOCK: RegExp[] = [
  /(Starting [compile|recompile])/,
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

export class OutputLsPageObject extends OutputPageObject {
  extractCompileResult(): string {
    throw new Error("Method not implemented.");
  }
  constructor(workbenchPO: WorkbenchPageObject) {
    super("TOTVS LS");
  }

  async extractServerSequenceTest(): Promise<string[]> {
    const result: string[] = await this.extractSequenceTest(
      VALID_SERVER_BLOCK[0],
      VALID_SERVER_BLOCK[1]
    );

    if (result.length == VALID_SERVER_SEQUENCE.length) {
      return result.map((value: string, index: number) =>
        value.substring(0, VALID_SERVER_SEQUENCE[index].length)
      );
    }

    return result;
  }

  async extractCompileSequenceTest(): Promise<string[]> {
    return await this.extractSequenceTest(COMPILE_BLOCK[0], COMPILE_BLOCK[1]);
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
