import * as vscode from "vscode";
import { ServersConfig } from "./utils";
import { MultiStepInput } from "./multiStepInput";
import { authenticate, doFinishConnectProcess } from "./serversView";
import { ServerItem } from "./serverItem";
import { tryOidcAutoLogin, getStoredOidcTokenForUser, setOidcAuthContext as setOidcAuthContext } from "./oidcauth/OIDCAuthHandler";
import { sendLogMsg } from "./protocolMessages";

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

  let AUTH_TOTAL_STEPS = 2;
  let AUTH_USERNAME_STEP = 1;
  let AUTH_PASSWORD_STEP = 2;

  interface State {
    title: string;
    step: number;
    totalSteps: number;
    username: string;
    password: string;
    doAuthenticate?: boolean;
  }

  async function collectAuthenticationInputs() {
    const state = {} as Partial<State>;
    state.password = "";

    let target = ServersConfig.getServerById(serverItem.id);
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

    setOidcAuthContext(serverItem, environment, state.username);
    const storedOidcToken = await getStoredOidcTokenForUser(serverItem.address, environment, state.username);
    if (storedOidcToken) {
      sendLogMsg(`Stored OIDC token encontrado para user ${state.username} e ambiente ${environment}.`);
      serverItem.hasOIDCToken = true;
      //const oidcResult = await tryOidcAutoLogin(serverItem,environment, state.username, storedOidcToken);
      //if (oidcResult.success) {
        //sendLogMsg(`Login automático com OIDC bem sucedido para user ${state.username} e ambiente ${environment}.`);
        //serverItem.username = state.username;
        //doFinishConnectProcess(serverItem, oidcResult.connectionToken, environment);
        state.doAuthenticate = true;
        //Ja retorna, pois nesse caso nao deve pedir a senha
        return (input: MultiStepInput) => Promise.resolve();
      //}
    }
    
    state.doAuthenticate = true;
    serverItem.hasOIDCToken = false;

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
    state.doAuthenticate = true;
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
    if (authState && authState.doAuthenticate) {
      authenticate(
        serverItem,
        environment,
        authState.username,
        authState.password
      );
    }
  }

  main();
}
