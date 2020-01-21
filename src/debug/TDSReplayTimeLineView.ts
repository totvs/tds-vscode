import * as vscode from 'vscode';

export class TimeLineItem extends vscode.TreeItem {

	constructor(
		public label: string,
		public timeStamp: string,
		public timeLineId: number,
		public srcName: string,
		public line: number
	) {
		super(label, vscode.TreeItemCollapsibleState.None);
	}

	get tooltip(): string {
		return `${this.srcName} - ${this.line}`;
	}

	get description(): string {
		return "";
	}

	//iconPath = {
		//light: path.join(__filename, '..', '..', 'resources', 'light', connectedServerItem !== undefined && this.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg'),
		//dark: path.join(__filename, '..', '..', 'resources', 'dark', connectedServerItem !== undefined && this.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg')
	//};
	contextValue = 'timeLineItem'
}

let list = Array<TimeLineItem>();
export let timeLineTreeView: vscode.TreeView<TimeLineItem>;

export class TimeLineItemProvider implements vscode.TreeDataProvider<TimeLineItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<TimeLineItem | undefined> = new vscode.EventEmitter<TimeLineItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TimeLineItem | undefined> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: TimeLineItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TimeLineItem): Thenable<TimeLineItem[]> {
		return Promise.resolve(list);
	}

	getParent(element: TimeLineItem): vscode.ProviderResult<TimeLineItem> {
		return undefined;
	}
}


const treeDataProvider = new TimeLineItemProvider();
export class TDSReplayTimeLineView {

	constructor(context: vscode.ExtensionContext) {
		timeLineTreeView = vscode.window.createTreeView('tdsreplay.timeline', { treeDataProvider });
		vscode.window.registerTreeDataProvider('tdsreplay.timeline', treeDataProvider);

		vscode.commands.registerCommand('timeline.selection', selectedItem => {
			if(vscode.debug.activeDebugSession) {
				//Envia para o DAP a timeline anterior, pois o vscode ira enviar uma solicitação de step, a qual avança uma timeline
				let timeLine = {"id": selectedItem.timeLineId - 1};
				vscode.debug.activeDebugSession.customRequest("TDA/setTimeLine", timeLine).then((value: any) => {
					vscode.commands.executeCommand("workbench.action.debug.stepOver");
				});
			}
		});
	}

}


export function createTimeLine(id: number, timeStamp:string, srcName: string, line: number) {
	let timeStampAsNumber : number = parseInt(timeStamp);

	//A formatação abaixo nao esta gerando a data e hora correta..
	let date = new Date(timeStampAsNumber);
	//let date = new Date();

	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

//	let month = ("0" + (date.getMonth() + 1)).substr(-2);
//	let day = ("0" + date.getDate()).substr(-2);
//	let hour = ("0" + date.getHours()).substr(-2);
//	let minutes = ("0" + date.getMinutes()).substr(-2);
//	let seconds = ("0" + date.getSeconds()).substr(-2);

	let formattedDate = day + "/" + month + "/" + year + "-" + hour + ":" + minutes + ":" + seconds;

	let label = `${formattedDate}  -  ${srcName}  -  ${line}`; //label é como sera apresentado a informação na view
	let timeLine = new TimeLineItem(label, formattedDate, id, srcName, line);
	timeLine.command = {
		command: 'timeline.selection',
		title: '',
		arguments: [timeLine]
	};
	list.push(timeLine);
}

export function refreshTimeLineView() {
	if (treeDataProvider !== undefined) {
		treeDataProvider.refresh();
	}
}

export function selectTimeLine(timeLineId: number) {
	//Os Ids das timelines começam em 500 e sao adicionados no array sequencialmente, portanto, o indice sera o id - 500. Por exemplo
	//primeira timeline: id = 500; indice 0; 500 - 500 = 0;
	//segunda linha: id = 501; indice 1; 501 - 500 = 1;
	//...
	//centesima linha: id = 600; indice = 100; 600 - 500 = 100;
	let index = timeLineId - 500;
	let item = list[index];
	timeLineTreeView.reveal(item, {select: true});
}

export function clearTimeLineView() {
	list = new Array<TimeLineItem>();
}

vscode.debug.onDidTerminateDebugSession(event => {
	clearTimeLineView();
	refreshTimeLineView();
})