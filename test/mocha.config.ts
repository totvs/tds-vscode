import { MochaOptions } from "vscode-extension-tester";

const options: MochaOptions = {
  reporter: 'spec',
  slow: 2000, //< 2 seg considerado lento
  timeout: 60000, //60 seg para teste
  ui: 'bdd'
}

export default options;