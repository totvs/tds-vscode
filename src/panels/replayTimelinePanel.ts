/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as vscode from "vscode";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { CommonCommandFromWebViewEnum, ReplayTimelineCommand, ReceiveMessage, TFieldErrors, TReplayTimelineData, TReplayTimelineModel, isErrors, EMPTY_REPLAY_TIMELINE_MODEL, ReplayTimelineCommandEnum } from "tds-shared/lib";
import { TdsPanel } from "./panel";

export type ReplayTimelineOptions = {
  replayFile: string;
  isIgnoreSourceNotFound: boolean;
  selectedSources: string[];
  //debugEvent: vscode.DebugSessionCustomEvent;
  debugSession: vscode.DebugSession;
};

export class ReplayTimelinePanel extends TdsPanel<TReplayTimelineModel, ReplayTimelineOptions> {
  public static currentPanel: ReplayTimelinePanel | undefined;

  /**
   * Renders the Global Include panel in the Visual Studio Code editor.
   *
   * If the panel already exists, it will be revealed. Otherwise, a new panel will be created and shown in the first editor column.
   *
   * @param context The extension context, used to get the extension URI.
   * @returns The current instance of the ReplayTimelinePanel.
   */
  public static render(context: vscode.ExtensionContext, options: ReplayTimelineOptions): ReplayTimelinePanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (ReplayTimelinePanel.currentPanel) {
      // If the webview panel already exists reveal it
      ReplayTimelinePanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "replay-timeline--panel",
        // Panel title
        vscode.l10n.t("TDS-Replay Timeline"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.Beside,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      ReplayTimelinePanel.currentPanel = new ReplayTimelinePanel(panel, extensionUri, options);
    }

    return ReplayTimelinePanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ReplayTimelinePanel.currentPanel = undefined;

    super.dispose();
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param extensionUri The URI of the directory containing the extension
   * @returns A _template_ string literal containing the HTML that should be
   * rendered within the webview panel
   */
  protected getWebviewContent(extensionUri: vscode.Uri) {

    return getWebviewContent(this._panel.webview, extensionUri, "replayTimelineView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<ReplayTimelineCommand, TReplayTimelineModel>, result: any): Promise<any> {
    const command: ReplayTimelineCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        //this.revealData(this._options);
        const model: TReplayTimelineModel = EMPTY_REPLAY_TIMELINE_MODEL;
        this.sendUpdateModel(model, undefined);

        // model.timeline = this._options.debugEvent.body.timeLines;
        // model.paginator = {
        //   currentLine: model.timeline.findIndex(item => item.id === this._options.debugEvent.body.currentSelectedLine as number),
        //   currentPage: this._options.debugEvent.body.currentPage,
        //   firstPageItem: 0,
        //   totalItems: this._options.debugEvent.body.totalItems,
        //   pageSize: this._options.debugEvent.body.itemsPerPage
        // };

        // this.selectTimeLine(this._options.debugEvent.body.currentSelectedLine);

        break;

      case ReplayTimelineCommandEnum.OpenSourcesDialog:
        vscode.commands.executeCommand("totvs-developer-studio.configure.automaticLauncher",
          vscode.Uri.parse("file:///" + this._options.replayFile));

        this.sendUpdateModel(data.model, undefined);
        break;

      case ReplayTimelineCommandEnum.SetTimeline:
        if (this._options.debugSession) {
          let timeLine = { "id": parseInt(data.timelineId) };
          this._options.debugSession.customRequest("TDA/setTimeLine", timeLine);

          this.selectTimeLine(timeLine.id);
        }
        break;

    }
  }

  protected validateModel(model: TReplayTimelineModel, errors: TFieldErrors<TReplayTimelineModel>): boolean {
    //not applicable

    return !isErrors(errors);
  }

  protected saveModel(model: TReplayTimelineModel): boolean {
    //not applicable

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
    };
  }

  public revealData(debugEvent: vscode.DebugSessionCustomEvent): void {
    const model: TReplayTimelineModel = EMPTY_REPLAY_TIMELINE_MODEL;

    model.timeline = debugEvent.body.timeLines;
    model.paginator = {
      currentLine: model.timeline.findIndex(item => item.id === debugEvent.body.currentSelectedTimeLineId as number),
      currentPage: debugEvent.body.currentPage,
      firstPageItem: 0,
      totalItems: debugEvent.body.totalItems,
      pageSize: debugEvent.body.itemsPerPage
    };

    this.sendUpdateModel(model, undefined);
    this.selectTimeLine(debugEvent.body.currentSelectedTimeLineId);
  }

  //-------------------- Envio de mensagens PARA a pagina

  public selectTimeLine(timeLineId: string | number) {
    this._panel.webview.postMessage({
      command: ReplayTimelineCommandEnum.SelectTimeLine,
      data: { timeLineId: timeLineId }
    });
  }

  public showLoadingPageDialog(showLoadingPageDialog: boolean) {
    this._panel.webview.postMessage({
      command: ReplayTimelineCommandEnum.ShowLoadingPageDialog,
      data: showLoadingPageDialog
    });
  }

  public showMessageDialog(msgType: string, message: string) {
    this._panel.webview.postMessage({
      command: ReplayTimelineCommandEnum.ShowMessageDialog,
      data: {
        msgType: msgType,
        message: message
      }
    });
  }

  public openSourcesDialog(jsonResponse: any) {
    var selected: string[] = [];// [...this._selectedSources];

    // if (this._selectedSources.length == 0) {
    //   jsonResponse.sources.forEach((source: any) => {
    //     selected.push(source.name);
    //   })
    // }

    this._panel.webview.postMessage({
      command: ReplayTimelineCommandEnum.OpenSourcesDialog,
      data: { sources: jsonResponse.sources, selected: selected }
    });
  }

  public postSetUpdatedState() {
    this._panel.webview.postMessage({
      command: ReplayTimelineCommandEnum.SetUpdatedState,
      //data: this._debugEvent
    });
  }

}