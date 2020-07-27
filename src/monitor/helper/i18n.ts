
let _translations = {};

class I18n {
  private _translations: any = {};

  public get translations(): any {

    return this._translations;
  }

  public set translations(value: any) {
    this._translations = value || {};
  }

  public _localize (key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string {
    let result = message;

    if (this._translations.hasOwnProperty(key)) {
      result = this._translations[key];
    }

    if (args && args.length > 0) {
      args.forEach((arg: any, index: number) => {
        result = result.replace("{" + index + "}", "" + (args[index] || "null"));
      });
    }

    return result;
  }
}

export const i18n = new I18n();
