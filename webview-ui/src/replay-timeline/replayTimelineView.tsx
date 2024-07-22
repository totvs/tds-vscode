import "./replayTimeline.css";
import { ErrorBoundary, getCloseActionForm, getDefaultActionsForm, IFormAction, TdsDataGrid, TdsFormActionsEnum, TdsLabelField, TdsPage, TdsPaginator, TdsProgressRing, TdsTable, tdsVscode, TTdsDataGridAction, TTdsDataGridColumnDef } from "@totvs/tds-webtoolkit";
import React, { createRef, RefObject } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CommonCommandEnum, ReceiveMessage, sendSaveAndClose } from "@totvs/tds-webtoolkit";
import { TdsForm, TdsSelectionFileField, TdsSelectionFolderField, TdsSimpleCheckBoxField, TdsTextField, setDataModel, setErrorModel } from "@totvs/tds-webtoolkit";
import { BuildResultCommandEnum, EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL, EMPTY_REPLAY_TIMELINE_MODEL, ReplayTimelineCommandEnum, TPaginatorData, TReplayTimelineData, TReplayTimelineModel } from "tds-shared/lib";

enum ReceiveCommandEnum {
}
type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TReplayTimelineModel>;

let tableElement: RefObject<HTMLTableElement> | undefined = undefined;

export default function ReplayTimelineView() {
  const methods = useForm<TReplayTimelineModel>({
    defaultValues: EMPTY_REPLAY_TIMELINE_MODEL,
    mode: "all"
  })
  const [timeline, setTimeline] = React.useState<TReplayTimelineData[]>([]);
  const [paginator, setPaginator] = React.useState<TPaginatorData>(EMPTY_REPLAY_TIMELINE_MODEL.paginator);
  const [openWaitPage, setOpenWaitPage] = React.useState(false);
  //const tableElement: React.RefObject<HTMLTableElement> = null;

  const onSubmit: SubmitHandler<TReplayTimelineModel> = (data) => {
    //not applicable
  }

  React.useEffect(() => {
    let listener = (event: any) => {
      const command: ReceiveCommand = event.data as ReceiveCommand;
      //const message: TReplayTimelineModel = event.data; // The JSON data our extension sent

      console.log("************************************")
      console.log(event);

      // switch (message.command) {
      //   case ReplayTimelineCommandEnum.SelectTimeLine:
      //     let timeLineId = message.data;
      //     //selectTimeLineInTable(timeLineId);
      //     break;
      //   case ReplayTimelineCommandEnum.AddTimeLines:
      //     setOpenWaitPage(false);
      //     //setPageData(event, message);
      //     setDataSource(event.timeLines);

      //     break;
      //   case ReplayTimelineCommandEnum.OpenSourcesDialog:
      //     //setTimeLineData({ sources: message.data.sources, selected: message.data.selected });
      //     //setOpenSourcesDialog(true);
      //     break;
      //   case ReplayTimelineCommandEnum.ShowLoadingPageDialog:
      //     setOpenWaitPage(message.data);
      //     break;
      //   case ReplayTimelineCommandEnum.SetUpdatedState:
      //     //setPageData(event, message);
      //     break;
      //   case ReplayTimelineCommandEnum.ShowMessageDialog:
      //     //setOpenMessageDialog(true);
      //     //setMsgType(message.data.msgType);
      //     //setMessage(message.data.message);
      //     break;
      // }
      let model: TReplayTimelineModel;

      switch (command.command) {
        case CommonCommandEnum.UpdateModel:
          model = command.data.model;

          setDataModel(methods.setValue, model);
          setTimeline(model.timeline);
          setPaginator(model.paginator);

          if (model.timeline.length > 0) {
            scrollToLineIfNeeded(model.timeline[0].id);
          }

          break;
        case ReplayTimelineCommandEnum.SelectTimeLine:
          const timeLineId: number = command.data.timeLineId;
          const currentLine: number = methods.getValues("timeline").findIndex((row: TReplayTimelineData) => row.id == timeLineId);
          setPaginator({ ...paginator, currentLine: currentLine });

        default:
          break;
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);

  const sendShowSources = (model: any) => {
    tdsVscode.postMessage({
      command: ReplayTimelineCommandEnum.OpenSourcesDialog,
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

    let parent = getScrollParent(target.parentNode as HTMLElement);

    if (!parent) return;

    let parentComputedStyle = window.getComputedStyle(parent, null),
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
      target.scrollIntoView(true);
    } else if (overBottom) {
      target.scrollIntoView(false);
    }
  };

  const scrollToLineIfNeeded = (id: number) => {
    if (tableElement && tableElement.current !== null) {
      const rows = Array.from(
        tableElement.current.querySelectorAll("tbody tr")
      ),
        newRow = rows.find((row) => row.id === `${id}`) as HTMLElement;
      //tableElement.current.scrollTo()
      scrollIntoViewIfNeeded(newRow);
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
      id: "chkIgnoreNotFOund",
      caption: tdsVscode.l10n.t("Ignore Sources not found"),
      type: "checkbox",
      onClick: () => {
        console.log("btnShowSources");
        //sendExport(methods.getValues(), "TXT");
      }
    }
  ]

  return (
    <TdsPage>
      <TdsForm<TReplayTimelineModel>
        methods={methods}
        onSubmit={onSubmit}
        actions={actions}
      >
        {!timeline || timeline.length == 0
          ? <TdsProgressRing size="full" />
          : <>
            {
              <TdsTable
                id={"tblTimeLine"}
                headerColumns={["Time", "Source", "Line"]}
                widthColumns={[1, 3, 1]}
                dataColumns={["timeStamp", "srcName", "line"]}
                dataSource={timeline}
                highlighRows={[paginator.currentLine]}
                ref={tableElement}
                onClick={(
                  target: HTMLElement,
                  rowIndex: number,
                  modifiers: {
                    altKey: boolean;
                    ctrlKey: boolean;
                    shiftKey: boolean;
                    metaKey: boolean;
                  }) => {
                  sendSetTimeline(methods.getValues(), timeline[rowIndex].id);
                }
                }
              />
            }
            <TdsPaginator
              currentPage={paginator.currentPage}
              firstPageItem={paginator.firstPageItem}
              totalItems={paginator.totalItems}
              pageSize={paginator.pageSize}
              onPageChange={(page: number) => {
                console.log("onPageChange", page);
              }}
            />
          </>
        }
        {
          // < TdsDataGrid id={"replay-timeline-table"}
          //   columnDef={columnsDef()}
          //   dataSource={timeline}
          //   options={{
          //     bottomActions: [],
          //     topActions: [],
          //     sortable: false,
          //     filter: false,
          //     grouping: false,
          //     //pageSize?: number;
          //     //pageSizeOptions?: number[];
          //     moveRow: false,
          //     rowSeparator: false
          //   }}
          // />
        }

      </TdsForm>
    </TdsPage>
  );
}
