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
let _translations = {};

class I18n {
  private _translations: any = {};

  public get translations(): any {
    return this._translations;
  }

  public set translations(value: any) {
    this._translations = value || {};
  }

  public localize(
    key: string,
    message: string,
    ...args: (string | number | boolean | undefined | null)[]
  ): string {
    let result = message;

    if (this._translations.hasOwnProperty(key)) {
      result = this._translations[key];
    }

    if (args && args.length > 0) {
      args.forEach((arg: any, index: number) => {
        result = result.replace(
          "{" + index + "}",
          "" + (args[index] || "null")
        );
      });
    }

    return result;
  }

  public get materialTableLocalization(): any {
    return {
      pagination: {
        labelDisplayedRows: "{from}-{to}/{count}",
        labelRowsSelect: this.localize("FILES", "files"),
        labelRowsPerPage: this.localize("LINES_PAGE.", "lines/p."),
        firstAriaLabel: this.localize("FIRST", "First"),
        firstTooltip: this.localize("FIRST_PAGE", "First page"),
        previousAriaLabel: this.localize("PREVIOUS", "Previous"),
        previousTooltip: this.localize("PREVIOUS_PAGE", "Previous page"),
        nextAriaLabel: this.localize("NEXT", "Next"),
        nextTooltip: this.localize("NEXT_PAGE", "Next page"),
        lastAriaLabel: this.localize("LAST", "Last"),
        lastTooltip: this.localize("LAST_PAGE", "Last page"),
      },
      toolbar: {
        nRowsSelected: this.localize(
          "FILES_SELECTED",
          "{0} files selected"
        ),
        addRemoveColumns: this.localize(
          "SHOW_HIDE_COLUMNS",
          "Show/hide columns"
        ),
        searchTooltip: this.localize(
          "SEARCH_ALL_COLUMNS",
          "Search in all columns"
        ),
        searchPlaceholder: this.localize("SEARCH", "Search"),
        showColumnsTitle: this.localize("SHOW_COLUMNS", "Show Columns"),
        showColumnsAriaLabel: this.localize("SHOW_COLUMNS", "Show Columns"),
      },
      header: {
        actions: this.localize("ACTIONS", "Actions"),
      },
      body: {
        emptyDataSourceMessage: this.localize(
          "NO_DATA",
          "There are no patchs to validate or apply."
        ),
        filterRow: {
          filterTooltip: this.localize("FILTER", "Filter"),
        },
      },
      grouping: {
        placeholder: this.localize("DRAG_HEADERS", "Drag headers ..."),
        groupedBy: this.localize("GROUPED_BY", "Grouped by:"),
      },
    };
  }
}

export const i18n = new I18n();
