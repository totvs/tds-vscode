import { Event, EventEmitter, Location, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { parseUri } from './extension';


enum CallType {
  Normal = 0,
  Base = 1,
  Derived = 2,
  All = 3 // Normal & Base & Derived
}
export class CallHierarchyNode {
  // These properties come directly from the language server.
  id: any;
  name: string;
  location: Location;
  callType: CallType;

  // If |numChildren| != |children.length|, then the node has not been expanded
  // and is incomplete - we need to send a new request to expand it.
  numChildren: number;
  children: CallHierarchyNode[];
}

export class CallHierarchyProvider implements TreeDataProvider<CallHierarchyNode> {
  root: CallHierarchyNode | undefined;

  constructor(
    readonly languageClient: LanguageClient, readonly derivedDark: string,
    readonly derivedLight: string, readonly baseDark: string,
    readonly baseLight: string) { }

  readonly onDidChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  readonly onDidChangeTreeData: Event<any> = this.onDidChangeEmitter.event;

  getTreeItem(element: CallHierarchyNode): TreeItem {
    let collapseState = TreeItemCollapsibleState.None;
    if (element.numChildren > 0) {
      if (element.children.length > 0) {
        collapseState = TreeItemCollapsibleState.Expanded;
      }
      else {
        collapseState = TreeItemCollapsibleState.Collapsed;
      }
    }

    let light = '';
    let dark = '';
    if (element.callType === CallType.Base) {
      light = this.baseLight;
      dark = this.baseDark;
    } else if (element.callType === CallType.Derived) {
      light = this.derivedLight;
      dark = this.derivedDark;
    }

    let label = element.name;
    if (element.location) {
      let path = parseUri(element.location.uri).path;
      let name = path.substr(path.lastIndexOf('/') + 1);
      label += ` (${name}:${element.location.range.start.line + 1})`;
    }

    return {
      label: label,
      collapsibleState: collapseState,
      contextValue: 'cqueryGoto',
      command: {
        command: 'cquery.hackGotoForTreeView',
        title: 'Goto',
        arguments: [element, element.numChildren > 0]
      },
      iconPath: { light: light, dark: dark }
    };
  }

  getChildren(element?: CallHierarchyNode): CallHierarchyNode[] | Thenable<CallHierarchyNode[]> {
    if (!this.root) {
      return [];
    }
    if (!element) {
      return [this.root];
    }
    if (element.numChildren === element.children.length) {
      return element.children;
    }

    return this.languageClient
      .sendRequest('$cquery/callHierarchy', {
        id: element.id,
        callee: false,
        callType: CallType.All,
        detailedName: false,
        levels: 1
      })
      .then((result: CallHierarchyNode) => {
        element.children = result.children;
        return result.children;
      });
  }
}
