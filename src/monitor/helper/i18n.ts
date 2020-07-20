
let _translations = {};

export const i18n = {
  translations: (translations: any) => {
    _translations = translations || {};
  },
  localize: (key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string => {
    let result = message;

    if (_translations.hasOwnProperty(key)) {
      result = _translations[key];
    }

    if (args && args.length > 0) {
      args.forEach((arg: any, index: number) => {
        result = result.replace("{" + index + "}", "" + (args[index] || "null"));
      })
    }

    return result;
  }
}
