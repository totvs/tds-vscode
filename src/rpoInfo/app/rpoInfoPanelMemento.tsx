import { cellDefaultStyle } from "./rpoInfoInterface";
import { i18n, mergeProperties } from "../helper";

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

export const propColumns = (extraProps?: any): any => {
  const remarkProps = {
    ...(extraProps || {}),
    cellStyle: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      maxWidth: 300,
    },
  };

  return {
    columns: [
      fieldDef("name", i18n.localize("PROGRAM", "Program"), extraProps),
      fieldDef("date", i18n.localize("DATE", "Date"), extraProps),
    ],
  };
};

export const DEFAULT_TABLE = () =>
  mergeProperties([
    propColumns({ ...cellDefaultStyle }),
    propPageSize(10),
    propFiltering(false),
  ]);
