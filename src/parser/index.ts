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

  let result: any = prettier.format(
    content.concat("\n"),//fim de linha é obrigatório
    { ...options, rangeStart: undefined, rangeEnd: undefined }
  );
  result = result.formatted || result;

  return result ? result.substring(0, result.length - 1) : "";
}

export function format4GL(
  languageId: string,
  content: string,
  options: prettier.Options
): string {
  let result: string;

  if (options.rangeStart) {
    result = content.substring(options.rangeStart, options.rangeEnd);
    options = {
      ...options,
      parser: "4gl-token",
      requirePragma: false,
      insertPragma: false,
    };
  } else {
    result = content;
    options = {
      ...options,
      parser: "4gl-source",
    };
  }

  result = process(languageId, result, options);

  return result as string;
}
