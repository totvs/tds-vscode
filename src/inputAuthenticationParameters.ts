import * as vscode from "vscode";
import { ServersConfig } from "./utils";
import { MultiStepInput } from "./multiStepInput";
import { authenticate } from "./serversView";
import { ServerItem } from "./serverItem";

/**
 * Coleta os dados necessarios para logar a um servidor advpl/4gl.
 *
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function inputAuthenticationParameters(
  serverItem: ServerItem,
  environment: string
) {
  //const VALIDADE_TIME_OUT = 1000;
  const title = vscode.l10n.t("Authentication");

  const AUTH_TOTAL_STEPS = 2;
  const AUTH_USERNAME_STEP = 1;
  const AUTH_PASSWORD_STEP = 2;

  interface State {
    title: string;
    step: number;
    totalSteps: number;
    username: string;
    password: string;
  }

  async function collectAuthenticationInputs() {
    const state = {} as Partial<State>;

    const target = ServersConfig.getServerById(serverItem.id);
    if (target) {
      state.username = target.username;
    }
    await MultiStepInput.run((input) =>
      inputUsername(input, state)
    );

    return state as State;
  }

  async function inputUsername(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.username = await input.showInputBox({
      title: title,
      step: AUTH_USERNAME_STEP,
      totalSteps: AUTH_TOTAL_STEPS,
      value: state.username || "",
      prompt: vscode.l10n.t("User identification"),
      validate: validateRequiredValue,
      shouldResume: shouldResume,
      password: false,
    });

    return (input: MultiStepInput) =>
      inputPassword(input, state);
  }

  async function inputPassword(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.password = await input.showInputBox({
      title: title,
      step: AUTH_PASSWORD_STEP,
      totalSteps: AUTH_TOTAL_STEPS,
      value: state.password || "",
      prompt: vscode.l10n.t("Access password"),
      validate: allTrueValue,
      shouldResume: shouldResume,
      password: true,
    });
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      return false;
    });
  }

  async function allTrueValue(value: string) {
    // ...validate...
    //await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));

    return undefined;
  }

  async function validateRequiredValue(value: string) {
    // ...validate...
    //Nao esta claro o motivo desse timeout, pois o resolve nunca é passado e sempre é esperado o total do timeout antes de continuar
    //await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));
    return value === ""
      ? vscode.l10n.t("Required information")
      : undefined;
  }

  async function main() {
    const authState = await collectAuthenticationInputs();
    authenticate(
      serverItem,
      environment,
      authState.username,
      authState.password
    );
  }

  main();
}
