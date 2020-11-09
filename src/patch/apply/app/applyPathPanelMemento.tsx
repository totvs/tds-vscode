import * as React from "react";
import { mergeProperties, i18n } from "../helper";
import { applyPatchIcons } from "../helper/applyPatchIcons";
import Alert from "@material-ui/lab/Alert";
import { Button, ButtonGroup, Chip, Link, Popper, PropTypes, Tooltip, Typography } from "@material-ui/core";
import { cellDefaultStyle } from "./applyPathInterface";

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

export function renderStatus(rowData: any) {
  const color = (): Exclude<PropTypes.Color, 'inherit'> => {
    if (rowData.data && rowData.data.error_number && rowData.data.error_number !== -1) {
      return "secondary"
    }

    return "default"
  };

  const variant = (): 'default' | 'outlined' => {
    if (rowData.status !== 'error') {
      return "outlined"
    }

    return "default"
  };

  const status = rowData.status;

  return (
    <Tooltip title={rowData.message}>
      <Chip label={status} size="medium" variant={variant()} color={color()} />
    </Tooltip>
  )
}

export const propColumns = (extraProps?: any): any => {
  const statusProps = {
    ...(extraProps || {}),
    cellStyle: {
      maxWidth: 60,
    },
    render: (rowData) => renderStatus(rowData)
  };

  // colocado na tabela o visual/usabilidade fica desagradável - acandido
  // const soluctionProps = {
  //   ...(extraProps || {}),
  //   cellStyle: {
  //     maxWidth: 60,
  //   },
  //   render: (rowData) => soluctionOptions(rowData)
  // };

  // fieldDef("soluction", i18n.localize("ACTIONS", "Actions"), soluctionProps),
  // ///////////////////////////////////

  return {
    columns: [
      fieldDef("status", "", statusProps), //i18n.localize("STATUS", "status")
      fieldDef("name", i18n.localize("NAME", "Name"), extraProps),
    ],
  };
};

export const DEFAULT_TABLE = () =>
  mergeProperties([
    propColumns({ ...cellDefaultStyle }),
    propPageSize(10),
    propFiltering(false),
  ]);
