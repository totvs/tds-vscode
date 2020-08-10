import * as prettier from "prettier";

function _parser(
  languageId: string,
  content: string,
  options?: prettier.Options
): any {
  const info: prettier.SupportInfo = prettier.getSupportInfo();

  const language: any = info.languages.filter((language) => {
    return language.vscodeLanguageIds.includes(languageId);
  });

  const result: any = prettier.format(content.concat("\n"), { //\n é obrigatório
    parser: language[0].parsers[0],
  });

  return result;
}

export enum Token4GlType {
  keyword = "keyword",
}

export const parser4GL: any = {
  getAst: (languageId: string, content: string) => {
    return _parser(languageId, content);
  },
};
