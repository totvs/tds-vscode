import { cellDefaultStyle } from './monitorInterface';
import { mergeProperties, i18n } from '../helper';
import React from 'react';

function fieldDef(
  field: string,
  title: string,
  extraProps: any = { hidden: false, ...cellDefaultStyle },
  render?: any,
  editComponent?: any
): any {

  return { field: field, title: title, editable: "never", ...extraProps}//der: render, editComponent: editComponent };
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
  0: i18n.localize('MANUAL', '(manual)'),
  15: i18n.localize('SHORT', '(short)'),
  30: i18n.localize('NORMAL', '(normal)'),
  60: i18n.localize('LONG', '(long)'),
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

export const propTreeServer = (value: boolean = undefined) => {
  return {
    customProps: {
      treeServer: value,
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
  return propColumn(name, 'hidden', value);
};

export const propColumnGroup = (
  name: string,
  value: boolean = undefined
): any => {
  return propColumn(name, 'XXXX', value);
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
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: 300,
    },
  };

  const environmentProps = {
    ...(extraProps || {}),
    render: (rowData: any) => {
      return rowData.environment;
    }
  };

  return {
    columns: [
      fieldDef('server', i18n.localize('SERVER', 'Server'), extraProps),
      fieldDef('appUser', i18n.localize('USER_NAME', 'User Name'), extraProps),
      fieldDef(
        'environment',
        i18n.localize('ENVIRONMENT', 'Environment'),
        environmentProps
      ),
      fieldDef(
        'computerName',
        i18n.localize('COMPUTER_NAME', 'Computer Name'),
        extraProps
      ),
      fieldDef('threadId', i18n.localize('THREAD', 'ThreadID'), {
        type: 'string',
        extraProps,
      }),
      fieldDef('mainName', i18n.localize('PROGRAM', 'Program'), extraProps),
      fieldDef(
        'loginTime',
        i18n.localize('CONNECTION', 'Connection'),
        extraProps
      ),
      fieldDef(
        'elapsedTime',
        i18n.localize('ELAPSED_TIME', 'Elapsed time'),
        extraProps
      ),
      fieldDef(
        'inactiveTime',
        i18n.localize('INACTIVITY_TIME', 'Idle time'),
        extraProps
      ),
      fieldDef(
        'totalInstrCount',
        i18n.localize('TOTAL_INSTRUCTIONS ', 'Instructions'),
        {
          type: 'string',
          extraProps,
        }
      ),
      fieldDef(
        'instrCountPerSec',
        i18n.localize('INSTRUCTIONS_SEG ', 'Instructions/sec'),
        {
          type: 'string',
          ...extraProps,
        }
      ),
      fieldDef('remark', i18n.localize('COMMENT', 'Comment'), {
        ...remarkProps,
      }),
      fieldDef('memUsed', i18n.localize('MEMORY_USE ', 'Memory in Use'), {
        type: 'string',
        ...extraProps,
      }),
      fieldDef('sid', i18n.localize('SID', 'SID'), {
        type: 'string',
        ...extraProps,
      }),
      fieldDef('ctreeTaskId', i18n.localize('CTREE_ID', 'CTree ID'), {
        type: 'string',
        ...extraProps,
      }),
      fieldDef(
        'clientType',
        i18n.localize('CONNECTION_TYPE ', 'Connection Type'),
        extraProps
      ),
    ],
  };
};

export const DEFAULT_TABLE = () =>
  mergeProperties([
    propColumns({ ...cellDefaultStyle }),
    propPageSize(10),
    propGrouping(false),
    propFiltering(false),
    propTreeServer(false),
    propSpeed(30), //0=manual, 15=fast, 30=normal, 60=slow
  ]);
