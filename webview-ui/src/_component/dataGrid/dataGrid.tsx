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
	VSCodeTextField, VSCodeDropdown, VSCodeOption,
	VSCodeLink
} from "@vscode/webview-ui-toolkit/react";
import { UseFormReturn } from "react-hook-form";
import TdsPaginator, { TdsDataGridAction } from "./paginator";
import { TdsSelectionField, TdsTextField } from "@totvs/tds-webtoolkit";
import { vsCodeButton } from '@vscode/webview-ui-toolkit';

export type TdsDataGridColumnDef = {
	name: string;
	label?: string;
	width?: string;
	lookup?: Record<string, string>;
	//align?: "left" | "center" | "right";
	sortable?: boolean;
	sortDirection?: "asc" | "desc" | "";
	//onSort?: (key: string) => void;
}

export interface ITdsDataGridProps {
	id: string;
	methods: UseFormReturn<any>;
	columnDef: TdsDataGridColumnDef[]
	dataSource: any; //Record<string, string | number | Date | boolean>[]
	options: {
		bottomActions?: TdsDataGridAction[];
		translations: Translation | undefined;
		filter?: boolean;
		pageSize?: number,
		pageSizeOptions?: number[],
	}
	//onFilterChanged?(fieldName: string, filter: string): void;
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
				return props.onFilterChanged(props.fieldDef.name, e.target.value);
			}}
		>
			<span slot="end" className="codicon codicon-list-filter"></span>
		</VSCodeTextField>
	)
}

export default function TdsDataGrid(props: ITdsDataGridProps): React.ReactElement {
	const [itemOffset, setItemOffset] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(props.options.pageSize || 10);
	const [totalItems, setTotalItems] = React.useState(props.dataSource.length);
	const [showFilter, setShowFilter] = React.useState(false);
	const [_, setSortedInfo] = React.useState(props.columnDef[0]);
	const [dataSource, setDataSource] = React.useState(props.dataSource);

	const gridTemplateColumns: string[] = props.columnDef.map(column => column.width || "1fr");
	const gridHeaders: string[] = props.columnDef.map(column => column.label || column.name);
	const translations: Record<TranslationKey, string> = props.options.translations || {
		"Filter": "Filter",
		"FilterInfo": `Filter by [${gridHeaders[0]}]`,
		"Lines/page": "Lines/page"
	};

	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize || 10)) % dataSource.length;

		setItemOffset(newOffset);
		setCurrentPage(newPage);
	};

	const changeSortCallback = (indexColumn: number) => {
		const columnDef = props.columnDef[indexColumn];
		const newColumnDef: TdsDataGridColumnDef = {
			...columnDef,
			sortDirection: columnDef.sortDirection === "asc" ? "desc" : columnDef.sortDirection === "desc" ? "" : "asc"
		}

		props.columnDef.forEach((columnDef: TdsDataGridColumnDef) => {
			columnDef.sortDirection = "";
		})

		props.columnDef[indexColumn] = newColumnDef;

		if (newColumnDef.sortDirection == "asc") {
			setDataSource(dataSource.sort((r1: any, r2: any) => r1[columnDef.name] > r2[columnDef.name] ? 1 : -1));
		} else if (newColumnDef.sortDirection == "desc") {
			setDataSource(dataSource.sort((r1: any, r2: any) => r1[columnDef.name] > r2[columnDef.name] ? -1 : 1));
		} else {
			setDataSource(props.dataSource);
		}

		setSortedInfo(props.columnDef[indexColumn])
	}

	const applyFilter = (filter: any, objects: any[]): any[] => {
		if (Object.keys(filter).length > 0) {
			return objects
				.filter((row: any) => {
					let found: boolean = false;
					Object.keys(filter).forEach((key: string) => {
						found = found || (filter[key].test(row[key]))
					});

					return found ? row : null;
				});
		} else {
			return objects;
		}
	}

	React.useEffect(() => {
		setPageSize(props.options.pageSize || 10);
		setTotalItems(dataSource.length);
		setDataSource(props.dataSource);
	}, [props.dataSource.length, props.options.pageSize]);

	return (
		<section className="tds-data-grid" id={`${props.id}`}>
			<div className="tds-data-grid-header">
				<section className="tds-row-container">
					{(props.options.filter || false) &&
						<>
							<TdsTextField
								methods={props.methods}
								name="filter"
								label={translations["Filter"]}
								info={translations["FilterInfo"]}
								onInput={(e: any) => {
									e.preventDefault();

									let filters: any = {};
									if (e.target.value.trim() !== "") {
										const wildcard: RegExp = new RegExp(`^${e.target.value.trim().replace("?", ".").replace("*", ".*")}$`, "gi");
										props.columnDef.forEach((columnDef: TdsDataGridColumnDef) => {
											filters[columnDef.name] = wildcard;
										});
									}

									setDataSource(applyFilter(filters, props.dataSource));
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
									{props.columnDef[index].sortable &&
										<VSCodeButton
											appearance="icon"
											onClick={() => {
												changeSortCallback(index);
											}}
										>
											{props.columnDef[index].sortDirection == "asc" && <span className="codicon codicon-arrow-small-down"></span>}
											{props.columnDef[index].sortDirection == "desc" && <span className="codicon codicon-arrow-small-up"></span>}
											{props.columnDef[index].sortDirection == "" && <span className="codicon codicon-sort-precedence"></span>}
										</VSCodeButton>
									}
								</VSCodeDataGridCell>
							))}
						</VSCodeDataGridRow>
					}
					{showFilter &&
						<VSCodeDataGridRow row-type="default" key={0}>
							{props.columnDef.map((cd: TdsDataGridColumnDef, indexCol: number) => (
								<VSCodeDataGridCell grid-column={indexCol + 1}>
									<FieldFilter
										methods={props.methods}
										fieldDef={cd}
										onFilterChanged={
											(fieldName: string, filter: string) => {
												let filters: any = {};
												if (filter.trim() !== "") {
													const wildcard: RegExp = new RegExp(`^${filter.replace("?", ".").replace("*", ".*")}$`, "gi");
													filters = { [fieldName]: wildcard };
												}
												setDataSource(applyFilter(filters, props.dataSource));
											}
										}
										dataSource={dataSource}
									/>
								</VSCodeDataGridCell>
							))}
						</VSCodeDataGridRow>
					}
					{dataSource.slice(itemOffset, itemOffset + pageSize).map((row: any, index: number) => (
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
				<TdsSelectionField
					methods={props.methods}
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
				{props.options.bottomActions && <div className="tds-data-grid-actions">
					{props.options.bottomActions.map((action: TdsDataGridAction) => {
						let propsField: any = {};
						let visible: string = "";

						if (typeof action.id === "string") {
							propsField["id"] = action.id;
						}

						propsField["key"] = action.id;
						propsField["type"] = action.type || "button";

						if (action.enabled !== undefined) {
							if (typeof action.enabled === "function") {
								propsField["disabled"] = !(action.enabled as Function)(false, true);
							} else {
								propsField["disabled"] = !action.enabled;
							}
						}

						if (action.appearance) {
							propsField["appearance"] = action.appearance;
						}

						if (action.onClick) {
							propsField["onClick"] = action.onClick;
						}

						if (action.visible !== undefined) {
							let isVisible: boolean = false;

							if (action.visible = typeof action.visible === "function") {
								isVisible = (Function)(action.visible)(false, true)
							} else {
								isVisible = action.visible;
							}

							visible = isVisible ? "" : "tds-hidden";
						}

						return (action.type == "link" ?
							<VSCodeLink key={action.id}
								href={action.href}>{action.caption}
							</VSCodeLink>
							: <VSCodeButton
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VSCodeButton>)
					})}
				</div>
				}
			</div>
		</section >
	);
}
