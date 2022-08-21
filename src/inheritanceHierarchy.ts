import { Event, EventEmitter, Location, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { parseUri } from './extension';
import { LanguageClient } from 'vscode-languageclient/node';

export class InheritanceHierarchyNode {
  id: any;
  kind: number;
  name: string;
  location: Location;
  numChildren: number;
  children: InheritanceHierarchyNode[];

  // If true and children need to be expanded derived will be used, otherwise
  // base will be used.
  _wantsDerived: boolean;
  static setWantsDerived(node: InheritanceHierarchyNode, value: boolean) {
    node._wantsDerived = value;
    node.children.map(c => InheritanceHierarchyNode.setWantsDerived(c, value));
  }
}

export class InheritanceHierarchyProvider implements
  TreeDataProvider<InheritanceHierarchyNode> {
  root: InheritanceHierarchyNode | undefined;

  readonly onDidChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  readonly onDidChangeTreeData: Event<any> = this.onDidChangeEmitter.event;

  constructor(readonly languageClient: LanguageClient) { }

  getTreeItem(element: InheritanceHierarchyNode): TreeItem {
    const kBaseName = '[[Base]]';

    let collapseState = TreeItemCollapsibleState.None;
    if (element.numChildren > 0) {
      if (element.children.length > 0 && element.name !== kBaseName) {
        collapseState = TreeItemCollapsibleState.Expanded;
      }
      else {
        collapseState = TreeItemCollapsibleState.Collapsed;
      }
    }

    let label = element.name;
    if (element.name !== kBaseName && element.location) {
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
      }
    };
  }

  getChildren(element?: InheritanceHierarchyNode):
    InheritanceHierarchyNode[] | Thenable<InheritanceHierarchyNode[]> {
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
      .sendRequest('$cquery/inheritanceHierarchy', {
        id: element.id,
        kind: element.kind,
        derived: element._wantsDerived,
        detailedName: false,
        levels: 1
      })
      .then((result: InheritanceHierarchyNode) => {
        element.children = result.children;
        result.children.map(c => InheritanceHierarchyNode.setWantsDerived(c, element._wantsDerived));
        return result.children;
      });
  }
}