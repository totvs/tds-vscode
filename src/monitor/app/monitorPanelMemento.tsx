import { cellDefaultStyle } from "./monitorInterface";
import { mergeProperties } from "../helper";

function fieldDef(
  field: string,
  title: string,
  extraProps: any = { hidden: false, ...cellDefaultStyle }
): any {
  return { field: field, title: title, ...extraProps };
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
  const columns = propColumnList();

  columns.forEach((element: any) => {
    if (element.field === name) {
      result = element;
    }
  });

  return result;
};

export const propColumnHidden = (name: string, value: boolean = undefined) => {
  const column = getColumn(name);
  column["hidden"] = value;

  return {
    configColumns: {
      [name]: {
        hidden: value,
      },
    },
  };
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
      fieldDef("threadId", "Thread", extraProps),
      fieldDef("mainName", "Programa", extraProps),
      fieldDef("loginTime", "Conexão", extraProps),
      fieldDef("elapsedTime", "Tempo Decorrido", extraProps),
      fieldDef("inactiveTime", "Tempo Inatividade", extraProps),
      fieldDef("totalInstrCount", "Total Instruções", extraProps),
      fieldDef("instrCountPerSec", "Instruções/seg", extraProps),
      fieldDef("remark", "Comentário", extraProps),
      fieldDef("memUsed", "Memória em Uso", extraProps),
      fieldDef("sid", "SID", extraProps),
      fieldDef("ctreeTaskId", "CTree ID", extraProps),
      fieldDef("clientType", "Tipo Conexão", extraProps),
    ],
  };
};

export const DEFAULT_TABLE = mergeProperties([
  propColumns({ ...cellDefaultStyle }),
  propPageSize(10),
  propGrouping(false),
  propFiltering(false),
  propSpeed(30) //0=manual, 15=fast, 30=normal, 60=slow
]);
