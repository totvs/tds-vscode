import { cellDefaultStyle } from "./monitorInterface";
import { mergeProperties } from "../helper";

function fieldDef(
  field: string,
  title: string,
  extraProps: any = { hidden: false, ...cellDefaultStyle }
): any {
  return { field: field, title: title, ...extraProps };
}

function doFormatNumber(
  value: number,
  props: {} = { minimumFractionDigits: 0 }
) {
  const result = value.toLocaleString([], props);
  return result;
}

export const propPageSize = (value: number = undefined) => {
  return {
    props: {
      options: {
        pageSize: value,
      },
    },
  };
};

export const propFiltering = (value: boolean = undefined) => {
  return {
    props: {
      options: {
        filtering: value,
      },
    },
  };
};

// see speedUpdateDialog.tsx
// short: value === 15,
// normal: value === 30,
// long: value === 60,
// manual: value === 0,
export const propSpeed = (value: number = undefined) => {
  return {
    customProps: {
      speed: value,
    },
  };
};

const speedText = {
  0: "(manual)",
  15: "(short)",
  30: "(normal)",
  60: "(long)",
};
export const propSpeedText = (value: number): string => {
  return speedText[value];
};

export const propGrouping = (value: boolean = undefined) => {
  return {
    props: {
      options: {
        grouping: value,
      },
    },
  };
};

export const getColumn = (name: string) => {
  let result = undefined;
  const columns = propColumns();

  for (let index = 0; index < columns.length; index++) {
    const element = columns[index];
    if (element.field === name) {
      result = element;
      break;
    }
  }

  return result;
};

export const propColumn = (
  name: string,
  key: string,
  value: any = undefined
): any => {
  return {
    customColumns: {
      [name]: { [key]: value },
    },
  };
};

export const propColumnHidden = (
  name: string,
  value: boolean = undefined
): any => {
  return propColumn(name, "hidden", value);
};

export const propOrderDirection = (value: string = undefined): any => {
  return {
    customProps: {
      direction: value,
    },
  };
};

export const propOrderBy = (value: number = undefined): any => {
  return {
    customProps: {
      orderBy: value,
    },
  };
};

export const propColumnsOrder = (value: string[] = undefined): any => {
  return {
    customProps: {
      columnsOrder: value,
    },
  };
};

export const propColumnMove = (
  sourceIndex: number,
  destinationIndex: number
): any => {
  const columns = propColumns().columns;
  const columnsOrder: string[] = columns.map((element: any) => element.field);
  let result: string[];

  if (sourceIndex > destinationIndex) {
    const aux = destinationIndex;
    destinationIndex = sourceIndex;
    sourceIndex = aux;
  }

  result = columnsOrder.slice(0, sourceIndex - 1);
  result.push(...columnsOrder.slice(sourceIndex, destinationIndex - 1));
  result.push(columnsOrder[destinationIndex]);
  result.push(...columnsOrder.slice(destinationIndex+1, columnsOrder.length));

  console.log(JSON.stringify(result));
  return propColumnsOrder(result);
};

export const propColumnList = (): any => {
  return {
    columns: [],
  };
};

export const propColumns = (extraProps?: any): any => {
  return {
    columns: [
      fieldDef("server", "Servidor", extraProps),
      fieldDef("environment", "Ambiente", extraProps),
      fieldDef("username", "Usuário", extraProps),
      fieldDef("computerName", "Estação", extraProps),
      fieldDef("threadId", "Thread", {
        type: "numeric",
        ...extraProps,
        render: (row: any) => doFormatNumber(row["threadId"]),
      }),
      fieldDef("mainName", "Programa", extraProps),
      fieldDef("loginTime", "Conexão", extraProps),
      fieldDef("elapsedTime", "Tempo Decorrido", extraProps),
      fieldDef("inactiveTime", "Tempo Inatividade", extraProps),
      fieldDef("totalInstrCount", "Total Instruções", {
        type: "numeric",
        ...extraProps,
        render: (row: any) => doFormatNumber(row["totalInstrCount"]),
      }),
      fieldDef("instrCountPerSec", "Instruções/seg", {
        type: "numeric",
        ...extraProps,
        render: (row: any) =>
          doFormatNumber(row["instrCountPerSec"], {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
      }),
      fieldDef("remark", "Comentário", extraProps),
      fieldDef("memUsed", "Memória em Uso", {
        type: "numeric",
        ...extraProps,
        render: (row: any) => doFormatNumber(row["memUsed"]),
      }),
      fieldDef("sid", "SID", {
        type: "numeric",
        ...extraProps,
        render: (row: any) => doFormatNumber(row["sid"]),
      }),
      fieldDef("ctreeTaskId", "CTree ID", {
        type: "numeric",
        ...extraProps,
        render: (row: any) => doFormatNumber(row["ctreeTaskId"]),
      }),
      fieldDef("clientType", "Tipo Conexão", extraProps),
    ],
  };
};

export const DEFAULT_TABLE = mergeProperties([
  propColumns({ ...cellDefaultStyle }),
  propPageSize(10),
  propGrouping(false),
  propFiltering(false),
  propSpeed(30), //0=manual, 15=fast, 30=normal, 60=slow
]);
