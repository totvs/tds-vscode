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

import "./replayTimeline.css";
import { IFormAction, TdsDataGrid, TdsDialog, TdsPage, TdsPaginator, TdsProgressRing, TdsTable, tdsVscode, TTdsDataGridColumnDef } from "@totvs/tds-webtoolkit";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage } from "@totvs/tds-webtoolkit";
import { TdsForm, setDataModel } from "@totvs/tds-webtoolkit";
import { EMPTY_REPLAY_TIMELINE_MODEL, ReplayTimelineCommandEnum, TImportSourcesOnlyResultData, TPaginatorData, TReplayTimelineData, TReplayTimelineModel } from "@tds-shared/index";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TReplayTimelineModel>;

export default function ReplayTimelineView() {
  const methods = useForm<TReplayTimelineModel>({
    defaultValues: EMPTY_REPLAY_TIMELINE_MODEL(),
    mode: "all"
  })
  const [timeline, setTimeline] = React.useState<TReplayTimelineData[]>([]);
  const [timelineCurrent, setTimelineCurrent] = React.useState<number>(-1);
  const [paginator, setPaginator] = React.useState<TPaginatorData>(EMPTY_REPLAY_TIMELINE_MODEL().paginator);
  const [openSourceDialog, setOpenSourceDialog] = React.useState(false);
  //const tableElement: React.RefObject<HTMLTableElement> = null;
  const paginatorWatch = methods.watch("paginator");
  const [percent, setPercent] = React.useState(0);
  const [message, setMessage] = React.useState("");

  const onSubmit: SubmitHandler<TReplayTimelineModel> = (data) => {
    //not applicable
  }

  React.useEffect(() => {
    const listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      const data = command.data;
      let model: TReplayTimelineModel;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          model = data.model;

          setDataModel(methods.setValue, model);
          setTimeline(model.timeline);
          setPaginator(model.paginator);

          if (model.sources && model.sources.showDialog) {
            model.sources.sources.forEach((element: TImportSourcesOnlyResultData, index: number) => {
              model.sources.sources[index].compileDate = new Date(element.compileDate);
            });

            setOpenSourceDialog(true);
          }

          break;

        case ReplayTimelineCommandEnum.SelectTimeLine:
          const timeLineId: number = data.timeLineId;
          const currentLine: number = methods.getValues("timeline").findIndex((row: TReplayTimelineData) => row.id == timeLineId);

          setPaginator({ ...methods.getValues("paginator"), currentLine: currentLine });
          setTimelineCurrent(timeLineId);

          break;
        case ReplayTimelineCommandEnum.UpdateProgressRing:
          setPercent(event.data.data.percent);
          setMessage(event.data.data.message);

          break;
        default:
          break;
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  React.useEffect(() => {
    if (timelineCurrent > 0) {
      scrollToLineIfNeeded(timelineCurrent);
    }
  }, [timelineCurrent, setTimelineCurrent]);

  const sendShowSources = (model: any) => {
    tdsVscode.postMessage({
      command: ReplayTimelineCommandEnum.OpenSourcesDialog,
      data: {
        model: model
      }
    });
  }

  const sendIgnoreSourcesNotFound = (model: any) => {
    tdsVscode.postMessage({
      command: ReplayTimelineCommandEnum.IgnoreSourceNotFound,
      data: {
        model: model
      }
    });
  }

  const sendSetTimeline = (model: any, timelineId: number) => {
    tdsVscode.postMessage({
      command: ReplayTimelineCommandEnum.SetTimeline,
      data: {
        model: model,
        timelineId: timelineId
      }
    });
  }

  const sendChangePage = (page: number) => {
    tdsVscode.postMessage({
      command: ReplayTimelineCommandEnum.ChangePage,
      data: {
        model: methods.getValues(),
        newPage: page
      }
    });
  }

  const scrollIntoViewIfNeeded = (target: HTMLElement) => {
    function getScrollParent(node: HTMLElement): HTMLElement | undefined {
      if (node === null) {
        return undefined;
      }

      if (node.scrollHeight > node.clientHeight) {
        return node;
      } else {
        return getScrollParent(node.parentNode as HTMLElement);
      }
    }

    const parent = getScrollParent(target.parentNode as HTMLElement);

    if (!parent) return;

    const parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(
        parentComputedStyle.getPropertyValue("border-top-width")
      ),
      overTop = target.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom =
        target.offsetTop -
        parent.offsetTop +
        target.clientHeight -
        parentBorderTopWidth >
        parent.scrollTop + parent.clientHeight;

    if (overTop) {
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    } else if (overBottom) {
      target.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const scrollToLineIfNeeded = (id: number) => {
    const targetRow = document.getElementById("tblTimeLine_header");

    if (targetRow) {
      scrollIntoViewIfNeeded(targetRow);
    }
  };

  const actions: IFormAction[] = [
    {
      id: "btnShowSources",
      caption: tdsVscode.l10n.t("Sources"),
      type: "button",
      onClick: () => {
        sendShowSources(methods.getValues());
      }
    },
    {
      id: "chkIgnoreNotFound",
      caption: tdsVscode.l10n.t("Ignore Sources not found"),
      type: "checkbox",
      onClick: () => {
        console.log("chkIgnoreNotFound");
        sendIgnoreSourcesNotFound({ ...methods.getValues(), ignoresSourcesNotFound: !methods.getValues("ignoresSourcesNotFound") });
      }
    }
  ]

  const buildShowSourcesDialog = () => {
    function columnsDef(): TTdsDataGridColumnDef[] {

      const result: TTdsDataGridColumnDef[] = [
        {
          type: "boolean",
          name: "selected",
          label: " ",
          width: "1fr",
          sortable: false
        },
        {
          type: "string",
          name: "name",
          label: tdsVscode.l10n.t("Source"),
          width: "8fr",
          sortable: true,
          sortDirection: "asc",
        },
        {
          type: "datetime",
          name: "compileDate",
          label: tdsVscode.l10n.t("Compile Date"),
          width: "8fr",
          sortable: true,
          sortDirection: "",
        },
      ];

      return result;
    }

    const sources = methods.getValues("sources");

    return (
      <TdsDataGrid
        id={"grdSources"}
        columnsDef={columnsDef()}
        dataSource={sources.sources}
        options={{
          bottomActions: undefined,
          topActions: undefined,
          sortable: undefined,
          filter: undefined,
          grouping: undefined,
          pageSize: undefined,
          pageSizeOptions: undefined,
          rowSeparator: undefined
        }} />
    )
  }

  const dlgSourceActions: IFormAction[] = [
    {
      id: "btnCloseDialog",
      caption: tdsVscode.l10n.t("Close"),
      type: "button",
      onClick: () => {
        setOpenSourceDialog(false)
      }
    },
    {
      id: "btnApplyDialog",
      caption: tdsVscode.l10n.t("Apply"),
      type: "button",
      onClick: () => {
        sendShowSources(methods.getValues());
        setOpenSourceDialog(false)
      }
    },
    {
      id: "btnResetDialog",
      caption: tdsVscode.l10n.t("Reset"),
      type: "button",
      onClick: () => {
        methods.getValues("sources").selected = [];
      }
    },

  ];

  return (
    <TdsPage>
      {!timeline || timeline.length == 0
        ? <TdsProgressRing size="full" message={message} value={percent} />
        : <TdsForm<TReplayTimelineModel>
          id="frmReplayTimeline"
          methods={methods}
          onSubmit={onSubmit}
          actions={actions}
        >
          <TdsTable
            id={"tblTimeLine"}
            columns={[
              { type: "string", name: "time", label: tdsVscode.l10n.t("Time"), width: "2fr" },
              { type: "string", name: "source", label: tdsVscode.l10n.t("Source"), width: "*fr" },
              { type: "number", name: "line", label: tdsVscode.l10n.t("Line"), width: "2fr" }
            ]}
            dataSource={timeline}
            highlightRows={[paginator.currentLine]}
            highlightGroups={{
              "tds-source-not-found": timeline
                .map((element: TReplayTimelineData, index: number) => {
                  if (!element.srcFoundInWS) {
                    return index;
                  }
                }).filter((value: number | undefined) => value !== undefined)
            }}
            onClick={(
              _target: HTMLElement,
              rowIndex: number) => {
              sendSetTimeline(methods.getValues(), timeline[rowIndex].id);
            }
            }
          />
          {paginatorWatch && <TdsPaginator
            currentPage={paginator.currentPage}
            firstPageItem={paginator.firstPageItem}
            totalItems={paginator.totalItems}
            pageSize={paginator.pageSize}
            onPageChange={(page: number) => {
              sendChangePage(page);
            }}
          />
          }
        </TdsForm>
      }
      {openSourceDialog && <TdsDialog
        title={tdsVscode.l10n.t("Sources")}
        onClose={(ok: boolean, data: any) => {
          if (ok) {
            sendShowSources(methods.getValues());
          }

          setOpenSourceDialog(false);
        }}
      >
        <TdsForm<TReplayTimelineModel>
          methods={methods}
          onSubmit={onSubmit}
          actions={dlgSourceActions}
        >
          {buildShowSourcesDialog()}
        </TdsForm>
      </TdsDialog>}
    </TdsPage>
  );
}
