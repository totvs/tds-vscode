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
        labelRowsSelect: this.localize("CONNECTIONS", "connections"),
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
          "CONNECTIONS_SELECTED",
          "{0} connections selected"
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
          "NO_CONNECTIONS",
          "There are no connections or they are not visible to the monitor."
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
