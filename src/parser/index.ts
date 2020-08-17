import * as prettier from "prettier";

function process(
  languageId: string,
  content: string,
  options?: prettier.Options
): any {
  const info: prettier.SupportInfo = prettier.getSupportInfo();

  const language: any = info.languages.filter((language) => {
    return language.vscodeLanguageIds.includes(languageId);
  });

  const result: any = prettier.formatWithCursor(content.concat("\n"), { //\n é obrigatório
    parser: language[0].parsers[0],
    ...options
  });

  return result.formatted || result;
}

export enum _Token4GlType {
  _keyword = "keyword",
}

export interface IOffsetPosition {
  locStart: number,
  locEnd:  number,
  //cursorOffset: number;
}

export const parser4GL: any = {
  getAst: (languageId: string, content: string, offsetPosition?: IOffsetPosition) => {
    let options: any = offsetPosition || {};

    return process(languageId, content, { ...options, astFormat: "4GL-ast" });
  },
  getFormatted: (languageId: string, content: string, offsetPosition?: IOffsetPosition) => {
    let options: any = offsetPosition || {};

    return process(languageId, content, { ...options, astFormat: "4GL-source" });
  },
};
