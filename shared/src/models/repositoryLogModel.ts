/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { TAbstractModelPanel } from "../panels/panelInterface";

export type TTreeNodeRpo = {
	id: string;
	name: string;
	children: TTreeNodeRpo[];
	rpoPatch: any;
}

export type TRepositoryLogModel = TAbstractModelPanel & {
	serverName: string;
	rpoVersion: string;
	dateGeneration: Date;
	environment: string;
	// rpoName: string;
	// rpoType: string;
	// rpoDescription: string;
	// rpoStatus: string;
	// rpoDate: string;
	// rpoUser: Date;
	// rpoComment: string;
	treeNodes: TTreeNodeRpo,
}

export const EMPTY_TREE_NODE: TTreeNodeRpo = {
	id: "",
	name: "",
	children: [],
	rpoPatch: undefined
}

export const EMPTY_REPOSITORY_MODEL: TRepositoryLogModel = {
	serverName: "",
	environment: "",
	rpoVersion: "",
	dateGeneration: new Date(),
	treeNodes: EMPTY_TREE_NODE
}
