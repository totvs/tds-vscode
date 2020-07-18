
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

    return result;
  }
}
