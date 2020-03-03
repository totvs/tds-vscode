interface IMonitorServer {
	readonly name: string;
	readonly type: string;
	readonly address: string;
	readonly port: number;
	readonly secure: number;
	readonly id: string;
	readonly buildVersion: string;
	readonly environments?: Array<String>;
}