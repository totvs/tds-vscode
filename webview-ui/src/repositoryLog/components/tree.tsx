import {
	provideFASTDesignSystem,
	fastTreeItem,
	fastTreeView
} from "@microsoft/fast-components";
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import React from 'react';

// provideFASTDesignSystem()
// 	.register(
// 		fastTreeItem(),
// 		fastTreeView()
// );

const { wrap } = provideReactWrapper(
	React,
	provideFASTDesignSystem()
);
export const FastTreeView = wrap(fastTreeView());
export const FastTreeItem = wrap(fastTreeItem());

