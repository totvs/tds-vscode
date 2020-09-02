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

  let result: any = prettier.format(content.concat("\n"), {
    //fim de linha é obrigatório
    parser: language[0].parsers[0],
    ...options,
  });
  result = result.formatted || result;

  return result ? result.substring(0, result.length - 1) : "";
}

export interface IOffsetPosition {
  rangeStart: number;
  rangeEnd: number;
}

export function format4GL(
  languageId: string,
  content: string,
  offsetPosition?: IOffsetPosition
): string {
  let options: any = {};
  let result: string;
  offsetPosition = offsetPosition || {rangeStart: undefined, rangeEnd: undefined};

  if (offsetPosition.rangeStart) {
    result = content.substring(
      offsetPosition.rangeStart,
      offsetPosition.rangeEnd
    );
    options = {
      parser: "4gl-token",
      requirePragma: false,
      insertPragma: false,
    };
  } else {
    result = content;
    options = { parser: "4gl-source" };
  }

  result = process(languageId, result, options);

  return result as string;
}
