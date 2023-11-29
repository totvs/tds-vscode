const parser_4gl = require("./4gl-parser.js");

const languages = [
  {
    extensions: [".4gl"],
    name: "4GL",
    parsers: ["4gl-parser"],
    vscodeLanguageIds: ["4gl"],
  },
];

const parsers = {
  "4gl-parser": {
    parse: (text) => parser_4gl.parse(text),
    astFormat: "4gl-ast",
  },
};

const printers = {
  "4gl-ast": {
    print: print4gl,
  },
};

function print4gl(path, options, print) {
  const node = path.getValue();

  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return path.map(print).concat();
  }

//console.debug(JSON.stringify(node));

  switch (node.type) {
    case "ws":
    case "nl":
      return node.value;
    case "keyword":
      return node.value.toLowerCase();
    case "word":
      return node.value.toUpperCase();
    case "operator":
      return node.value;
    case "string":
      return node.value;
    default:
      throw new Error("unknown 4GL type: " + JSON.stringify(node));
  }
}

export interface IParserOptions {
  ignoreWhitespace?: boolean;
  ignoreNewLine?: boolean;
}

const parserOptionsDefault: IParserOptions = {
  "ignoreWhitespace": true,
  "ignoreNewLine": false
}

export function parser(
  vscodeLanguageId: string,
  code: string,
  options?: IParserOptions
): any {
  const lang: any = languages.filter((language: any) => {
    return language.vscodeLanguageIds.includes(vscodeLanguageId);
  });

  if (lang) {
    options = options ? options : parserOptionsDefault;
    options.ignoreNewLine = options.ignoreNewLine || parserOptionsDefault.ignoreNewLine
    options.ignoreWhitespace = options.ignoreWhitespace || parserOptionsDefault.ignoreWhitespace

    const parser = parsers[lang[0].parsers[0]];
    return parser.parse(code, options);
  }

  return [];
}

//Compatibilizar com TokenType em 4gl.pegjs
export enum Token4GlType {
  program = 1,
  block = 2,
  keyword = 3,
  string = 4,
  operator = 5,
  whitespace = 6,
  lineComment = 7,
  blockComment = 8,
  newLine = 11,
  unknown = 0,
}
