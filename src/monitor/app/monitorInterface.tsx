export interface HeadCell {
  field: keyof IConnectionData;
  title: string;
  cellStyle?: any;
  headerStyle?: any;
}

export interface IConnectionData {
  username: string;
  computerName: string;
  threadId: number;
  server: string;
  mainName: string;
  environment: string;
  loginTime: string;
  elapsedTime: string;
  totalInstrCount: number;
  instrCountPerSec: number;
  remark: string;
  memUsed: number;
  sid: string;
  ctreeTaskId: number;
  clientType: string;
  inactiveTime: string;
}

export const cellDefaultStyle = {
  cellStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "30em",
    minWidth: "8em",
    padding: "0px",
    paddingLeft: "5px",
    paddingRight: "5px"
  },
  headerStyle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "30em",
    minWidth: "8em",
    padding: "0px",
    paddingLeft: "5px",
    paddingRight: "5px"
  }
};
