export default interface IMonitorUser {
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
