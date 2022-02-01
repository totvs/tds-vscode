import { cellDefaultStyle } from "./inpectorInterface";
import { i18n, mergeProperties } from "../helper";

function fieldDef(
  field: string,
  title: string,
  extraProps: any = { hidden: false, ...cellDefaultStyle }
): any {
  return { field: field, title: title, ...extraProps };
}

export const propGrouping = (value: boolean = undefined) => {
  return {
    props: {
      options: {
        grouping: value,
      },
    },
  };
};

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

export const getColumn = (name: string) => {
  let result = undefined;
  const columns = propFunctionsColumns();

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

export const propColumnGroup = (
  name: string,
  value: boolean = undefined
): any => {
  return propColumn(name, "XXXX", value);
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

export const propColumnsOrder = (value: any[] = undefined): any => {
  return {
    customProps: {
      columnsOrder: value,
    },
  };
};

export const _propColumnList = (): any => {
  return {
    columns: [],
  };
};

//ALTERAÇÕES EFETUADAS EM propFunctionsColumns ou em uma das colunas,
//obrigatoriamente deve-se modificar o nome "stateKey" (InspectorLoader.stateKey)
export const propFunctionsColumns = (extraProps?: any): any => {
  return {
    columns: [
      fieldDef("function", i18n.localize("OBJECT", "Object"), {
        ...extraProps,
        grouping: false,
        width: "45%",
      }),
      fieldDef("source", i18n.localize("PROGRAM", "Program"), {
        ...extraProps,
        width: "40%",
      }),
      fieldDef("line", i18n.localize("LINE", "Line"), {
        ...extraProps,
        grouping: false,
        type: "numeric",
        width: "5%",
      }),
      fieldDef("source_status", i18n.localize("SOURCE_STATUS", "Status"), {
        ...extraProps,
        lookup: { N: "NoAuth", P: "Prod", D: "Dev" },
        width: "5%",
      }),
      fieldDef("rpo_status", i18n.localize("RPO_STATUS", "RPO"), {
        ...extraProps,
        lookup: {
          N: "None",
          D: "Default",
          T: "Tlpp",
          C: "Custom",
        },
        width: "5%",
      }),
    ],
  };
};

//ALTERAÇÕES EFETUADAS EM propObjectsColumns ou em uma das colunas,
//obrigatoriamente deve-se modificar o nome "stateKey" (InspectorLoader.stateKey)
export const propObjectsColumns = (extraProps?: any): any => {
  return {
    columns: [
      fieldDef("source", i18n.localize("PROGRAM", "Program"), {
        ...extraProps,
        grouping: false,
        width: "45%",
      }),
      fieldDef("date", i18n.localize("DATE", "Date"), {
        ...extraProps,
        grouping: false,
        width: "45%",
      }),
      fieldDef("source_status", i18n.localize("SOURCE_STATUS", "Status"), {
        ...extraProps,
        width: "5%",
        lookup: { N: "NoAuth", P: "Prod", D: "Dev" },
      }),
      fieldDef("rpo_status", i18n.localize("RPO_STATUS", "RPO"), {
        ...extraProps,
        width: "5%",
        lookup: {
          N: "None",
          D: "Default",
          T: "Tlpp",
          C: "Custom",
        },
      }),
    ],
  };
};

//ALTERAÇÕES EFETUADAS EM DEFAULT_TABLE ou em uma das colunas,
//obrigatoriamente deve-se modificar o nome "stateKey" (InspectorLoader.stateKey)
export const DEFAULT_TABLE = (objectsInspector: boolean) =>
  mergeProperties([
    objectsInspector
      ? propObjectsColumns({ ...cellDefaultStyle })
      : propFunctionsColumns({ ...cellDefaultStyle }),
    propPageSize(50),
    propFiltering(false),
  ]);
