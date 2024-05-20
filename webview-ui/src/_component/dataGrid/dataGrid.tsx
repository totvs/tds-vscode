/*
Copyright 2024 TOTVS S.A

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

import "./dataGrid.css";
import React from "react";
import {
	VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,
	VSCodeTextField, VSCodeDropdown, VSCodeOption
} from "@vscode/webview-ui-toolkit/react";
import { TdsSelectionField, TdsTextField } from "@totvs/tds-webtoolkit";
import { UseFormReturn, useForm } from "react-hook-form";
import TdsPaginator from "./paginator";

const FirstPage = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M18 6h2v12h-2zm-2 5H7.414l4.293-4.293-1.414-1.414L3.586 12l6.707 6.707 1.414-1.414L7.414 13H16z" />
		</svg>
	);
}


const LastPage = () => {

	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M4 6h2v12H4zm4 7h8.586l-4.293 4.293 1.414 1.414L20.414 12l-6.707-6.707-1.414 1.414L16.586 11H8z" />
		</svg>
	);
}

const LeftPage = () => {

	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
		</svg>
	);
}

const RightPage = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
			transform="matrix(-1,0,0,1,0,0)"
		>
			<path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
		</svg>
	);
}

export type TdsDataGridColumnDef = {
	name: string;
	label?: string;
	width?: string;
	lookup?: Record<string, string>;
	//align?: "left" | "center" | "right";
	//sortable?: boolean;
	//sortDirection?: "asc" | "desc";
	//onSort?: (key: string) => void;
}

export interface ITdsDataGridProps {
	id: string;
	columnDef: TdsDataGridColumnDef[]
	dataSource: any; //Record<string, string | number | Date | boolean>[]
	options: {
		translations: Translation | undefined;
		filter?: boolean;
		pageSize?: number,
		pageSizeOptions?: number[],
	}
	onFilterChanged?(fieldName: string, filter: string): void;
}

type TranslationKey = "Filter" | "FilterInfo" | "Lines/page";
type Translation = Record<TranslationKey, string>;

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFields = {
	filter: string;
	currentPage: number,
	pageSize: number,
	pageSizeOptions: number[],
	totalItens: number,
}

type TFieldFilterProps = {
	methods: UseFormReturn<any>;
	fieldDef: TdsDataGridColumnDef;
	dataSource: any;
	onFilterChanged(fieldName: string, filter: string): void;
}

function FieldFilter(props: TFieldFilterProps) {
	if (props.fieldDef.lookup) {
		const currentValue: string = props.methods.getValues(props.fieldDef.name) as string;
		const options: Record<string, string> = props.dataSource.reduce((acc: Record<string, string>, item: any) => {

			if (!acc[item[props.fieldDef.name]]) {
				acc[item[props.fieldDef.name]] = props.fieldDef.lookup![item[props.fieldDef.name]];
			}

			return acc;
		}, []);

		if (Object.keys(options).length > 0) {
			return (
				<VSCodeDropdown
					onChange={(e: any) => {
						e.preventDefault();
						const value: string = e?.target?.value;
						return props.onFilterChanged(props.fieldDef.name, value);
					}}>
					<VSCodeOption key={0}
						value={""}
						checked={currentValue === ""}>{""}
					</VSCodeOption>
					{Object.keys(options).map((key: string, index: number) => {
						return (
							<VSCodeOption key={index}
								value={key}
								checked={currentValue === key}>{options[key]}
							</VSCodeOption>
						)
					})}
				</VSCodeDropdown>
			)
		}
	}

	return (
		<VSCodeTextField
			onInput={(e: any) => {
				e.preventDefault();
				return props.onFilterChanged(props.fieldDef.name,  e.target.value);
			}}
		>
			<span slot="end" className="codicon codicon-list-filter"></span>
		</VSCodeTextField>
	)
}

export default function TdsDataGrid(props: ITdsDataGridProps): React.ReactElement {
	const methods = useForm<TFields>({
		defaultValues: {
			filter: "",
			// currentPage: 1,
			// pageSize: 20,
			// pageSizeOptions: [10, 50, 100, 500, 1000],
			// totalItens: props.dataSource.length,
		},
		mode: "all"
	})
	const [itemOffset, setItemOffset] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(props.options.pageSize || 10);
	const [totalItems, setTotalItems] = React.useState(props.dataSource.length);
	const [showFilter, setShowFilter] = React.useState(false);

	const gridTemplateColumns: string[] = props.columnDef.map(column => column.width || "1fr");
	const gridHeaders: string[] = props.columnDef.map(column => column.label || column.name);
	const translations: Record<TranslationKey, string> = props.options.translations || {
		"Filter": "Filter",
		"FilterInfo": `Filter by [${gridHeaders[0]}]`,
		"Lines/page": "Lines/page"
	};

	const handlePageClick = (newPage: number) => {
		console.log("handlePageClick", newPage);

		const newOffset = (newPage * (props.options.pageSize || 10)) % props.dataSource.length;
		setItemOffset(newOffset);
		setCurrentPage(newPage);
		//props.onPageChange && props.onPageChange(newPage);
	};

	React.useEffect(() => {
		setPageSize(props.options.pageSize || 10);
		setTotalItems(props.dataSource.length);
	}, [props.dataSource.length, props.options.pageSize]);

	return (
		<section className="tds-data-grid" id={`${props.id}`}>
			<div className="tds-data-grid-header">
				<section className="tds-row-container">
					{(props.options.filter || props.onFilterChanged || false) &&
						<>
							<TdsTextField
								methods={methods}
								name="filter"
								label={translations["Filter"]}
								info={translations["FilterInfo"]}
								onInput={(e: any) => {
									e.preventDefault();
									console.log("*** filter ***", e.target.value);
									console.log(props.onFilterChanged);

									return props.onFilterChanged && props.onFilterChanged("_filter_",  e.target.value);
								}}
							/>
							<VSCodeButton appearance="icon" aria-label="Filter"
								onClick={() => {
									setShowFilter(!showFilter);
								}}
							>
								<span className="codicon codicon-list-filter"></span>
							</VSCodeButton>
						</>
					}
				</section>
			</div >
			<div className="tds-data-grid-content">
				<VSCodeDataGrid
					id={`${props.id}_grid`}
					generate-header="sticky"
					grid-template-columns={gridTemplateColumns.join(" ")}
				>
					{gridHeaders &&
						<VSCodeDataGridRow row-type="header">
							{gridHeaders.map((header: string, index: number) => (
								<VSCodeDataGridCell cell-type="columnheader" grid-column={index + 1}>
									{header}
								</VSCodeDataGridCell>
							))}
						</VSCodeDataGridRow>
					}
					{showFilter &&
						<VSCodeDataGridRow row-type="default" key={0}>
							{props.columnDef.map((cd: TdsDataGridColumnDef, indexCol: number) => (
								<VSCodeDataGridCell grid-column={indexCol + 1}>
									<FieldFilter
										methods={methods}
										fieldDef={cd}
										onFilterChanged={
											(fieldName: string, filter:string) => {
												props.onFilterChanged ? props.onFilterChanged(fieldName, filter) : null;
											}
										}
										dataSource={props.dataSource}
									/>
								</VSCodeDataGridCell>
							))}
						</VSCodeDataGridRow>
					}
					{props.dataSource.slice(itemOffset, itemOffset + pageSize).map((row: any, index: number) => (
						<VSCodeDataGridRow row-type="default" key={itemOffset + index}>
							{props.columnDef.map((cd: TdsDataGridColumnDef, indexCol: number) => (
								<VSCodeDataGridCell grid-column={indexCol + 1}>
									<VSCodeTextField
										readOnly={true}
										value={cd.lookup && cd.lookup[row[cd.name]] ? cd.lookup[row[cd.name]] : row[cd.name]}
									></VSCodeTextField>

								</VSCodeDataGridCell>
							))}
						</VSCodeDataGridRow>
					))}
				</VSCodeDataGrid>
			</div>
			<div className="tds-data-grid-footer">
				<div className="tds-data-grid-pagination">
					<TdsSelectionField
						methods={methods}
						name={"pageSize"}
						label={translations["Lines/page"]}
						options={(props.options.pageSizeOptions || [])
							.map((value: number) => { return { value: value.toString(), text: value.toString() } })
						}
						onInput={(e: any) => {
							console.log("onInput", e.target.value);
							e.preventDefault();
							setPageSize(parseInt(e.target.value));
							setCurrentPage(0);
							setItemOffset(0);
						}}
					/>
					<TdsPaginator
						onPageChange={handlePageClick}
						pageSize={pageSize}
						currentPage={currentPage}
						currentItem={itemOffset}
						totalItems={totalItems}
					/>
				</div>
			</div>
		</section >
	);
}
