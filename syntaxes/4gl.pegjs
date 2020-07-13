{

const keywordList = [
  // "arg_val",
  // "arr_count",
  // "arr_curr",
  // "errorlog",
  // "fgl_keyval",
  // "fgl_lastkey",
  // "infield",
  // "int_flag",
  // "quit_flag",
  // "num_args",
  // "scr_line",
  // "set_count",
  // "showhelp",
  // "sqlca",
  // "sqlcode",
  // "sqlerrd",
  // "startlog",
  "AFTER",
  "ALL",
  "AND",
  "ANY",
  "ARRAY",
  "ASC",
  "ASCII",
  "ASCENDING",
  "AT",
  "ATTRIBUTE",
  "ATTRIBUTES",
  "AUTONEXT",
  "AVG",
  "BEFORE",
  "BEGIN",
  "BETWEEN",
  "BORDER",
  "BOTTOM",
  "BY",
  "CALL",
  "CASE",
  "CHAR",
  "CLEAR",
  "CLIPPED",
  "CLOSE",
  "COLUMN",
  "COLUMNS",
  "COMMAND",
  "COMMENTS",
  "COMMIT",
  "CONSTRAINT",
  "CONSTRUCT",
  "CONTINUE",
  "COUNT",
  "CREATE",
  "CURRENT",
  "CURSOR",
  "DATABASE",
  "DATE",
  "DATETIME",
  "DAY",
  "DECIMAL",
  "DECLARE",
  "DEFAULTS",
  "DEFER",
  "DEFINE",
  "DELETE",
  "DELIMITERS",
  "DELIMITER",
  "DESC",
  "DESCENDING",
  "DIRTY",
  "DISPLAY",
  "DISTINCT",
  "DOWNSHIFT",
  "DROP",
  "ELSE",
  "END",
  "ERROR",
  "EVERY",
  "EXCLUSIVE",
  "EXECUTE",
  "EXIT",
  "EXISTS",
  "EXTEND",
  "EXTERNAL",
  "FALSE",
  "FETCH",
  "FIELD",
  "FILE",
  "FINISH",
  "FIRST",
  "FLUSH",
  "FOR",
  "FOREACH",
  "FORM",
  "FORMAT",
  "FRACTION",
  "FREE",
  "FROM",
  "FUNCTION",
  "GLOBALS",
  "GROUP",
  "HAVING",
  "HEADER",
  "HELP",
  "HIDE",
  "HOLD",
  "HOUR",
  "IF",
  "IN",
  "INCLUDE",
  "INDEX",
  "INITIALIZE",
  "INPUT",
  "INSERT",
  "INSTRUCTIONS",
  "INTEGER",
  "INTERRUPT",
  "INTERVAL",
  "INTO",
  "IS",
  "ISOLATION",
  "KEY",
  "LABEL",
  "LAST",
  "LEFT",
  "LENGTH",
  "LET",
  "LIKE",
  "LINE",
  "LINES",
  "LOAD",
  "LOCK",
  "LOG",
  "MAIN",
  "MARGIN",
  "MATCHES",
  "MAX",
  "MDY",
  "MENU",
  "MESSAGE",
  "MIN",
  "MINUTE",
  "MOD",
  "MODE",
  "MONTH",
  "NAME",
  "NEED",
  "NEXT",
  "NO",
  "NOENTRY",
  "NOT",
  "NOTFOUND",
  "NULL",
  "OF",
  "ON",
  "OPEN",
  "OPTION",
  "OPTIONS",
  "OR",
  "ORDER",
  "OTHERWISE",
  "OUTER",
  "OUTPUT",
  "PAGE",
  "PAGENO",
  "PIPE",
  "PREPARE",
  "PREVIOUS",
  "PRIMARY",
  "PRINT",
  "PROGRAM",
  "PROMPT",
  "PUT",
  "QUIT",
  "READ",
  "RECORD",
  "REPORT",
  "RETURN",
  "RETURNING",
  "REVERSE",
  "RIGTH",
  "ROLLBACK",
  "ROW",
  "ROWS",
  "RUN",
  "SCREEN",
  "SCROLL",
  "SECOND",
  "SELECT",
  "SET",
  "SHARE",
  "SHOW",
  "SKIP",
  "SLEEP",
  "SMALLINT",
  "SPACE",
  "SPACES",
  "SQL",
  "START",
  "STEP",
  "STOP",
  "SUM",
  "TABLE",
  "TABLES",
  "TEMP",
  "THEN",
  "TIME",
  "TO",
  "TODAY",
  "TOP",
  "TRAILER",
  "TRUE",
  "TYPE",
  "UNCONSTRAINED",
  "UNION",
  "UNIQUE",
  "UNITS",
  "UNLOAD",
  "UNLOCK",
  "UNLOAD",
  "UPDATE",
  "UPSHIFT",
  "USING",
  "VALUES",
  "VARCHAR",
  "WAIT",
  "WAITING",
  "WEEKDAY",
  "WHEN",
  "WHENEVER",
  "WHERE",
  "WHILE",
  "WINDOW",
  "WITH",
  "WITHOUT",
  "WORDWRAP",
  "WORK",
  "YEAR"
]

//Compatibilizar com Token4glType em index.ts
const TokenType = {
  program: 1,
  block: 2,
  keyword: 3,
  string: 4,
  operator: 5,
  whitespace: 6,
  lineComment: 7,
  blockComment: 8,
  newLine: 11,
  unknown: 0
}

function node(_type, value, info, key) {
  var obj = { type: _type, value: value, location: location() };

  if (info) obj.info = info;
  if (key) obj.key = key;

  return obj;
}

}

start
  = p:line* { return node(TokenType.program, p) }

line
  = c:(SPACE* command SPACE* comment*) (NL+ / EOF) { return node(TokenType.line, c) }

command
  = (comment
  / words
  / string
  / OPERATOR
  / SPACE)+

comment
  = c:("#" (!(NL / EOF) .)*) {
        return node(TokenType.lineComment,c);
  }
  / c:("--" (!(NL / EOF) .)*) {
        return node(TokenType.lineComment,c);
  }
  / c:("{" (!"}".*) "}") {
        return node(TokenType.blockComment,c);
  }

words
  = (word (SPACE / NL))+

word
  = w:([a-zA-Z0-9_]+)  {
    const word = w.join("");
    const _type = keywordList.indexOf(word.toUpperCase()) === -1?TokenType.word:TokenType.keyword;

  return node(_type, word);
}

string
  = double_quoted_multiline_string
  / double_quoted_single_line_string
  / single_quoted_multiline_string
  / single_quoted_single_line_string

double_quoted_multiline_string
  = s:('"""' NL? chars:multiline_string_char* '"""')  { return node(TokenType.string_double,s) }
double_quoted_single_line_string
  = '"' chars:string_char* '"'                    { return node(TokenType.string_double,chars.join(''), {subType: '"' }) }
single_quoted_multiline_string
  = "'''" NL? chars:multiline_literal_char* "'''" { return node(TokenType.string_single,chars.join(''), {subType: "'" }) }
single_quoted_single_line_string
  = "'" chars:literal_char* "'"                   { return node(TokenType.string_single,chars.join(''), {subType: "'" }) }

string_char
  = (!'"' char:. { return char })

literal_char
  = (!"'" char:. { return char })


multiline_string_char
  = multiline_string_delim / (!'"""' char:. { return char})

multiline_string_delim
  = '\\' NL NLS*                        { return '' }

multiline_literal_char
  = (!"'''" char:. { return char })

OPERATOR
  = o:[~!@%^&*()-+=|/{}[\]:;<>,.?#_] {
    return node(TokenType.operator, o);
}

SPACE = s:[ \t\n\r]+ {
  return node(TokenType.whitespace, s.join(""));
}

NL
  = s:("\n" / "\r\n") { return node(TokenType.newLine, s); }

NLS = NL / SPACE

EOF
  = !.
