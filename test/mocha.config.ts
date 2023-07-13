import { MochaOptions } from "vscode-extension-tester";

const options: MochaOptions = {
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd'
}

export default options;