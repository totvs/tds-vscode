{
//
//Function String = "% ++^{function^}^{report^} *(*)*"
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

function node(_type, value, location, key) {
    var obj = { type: _type, value: value, offset: location.start.offset };
    //var obj = { type: _type, value: value, line: 0, column: 0 };

    //console.log(value);

    if (key) obj.key = key;

    return obj;
  }

function nodeStr(value, location) {

  return node("string", value, location);
}

function nodeOperator(value, location) {

  return node("operator", value, location);
}

function nodeWord(value, location) {
  const _type = keywordList.indexOf(value.toUpperCase()) === -1?"word":"keyword";

  return node(_type, value, location);
}

function nodeLineComment(value, location) {
  return node("lineComment", value, location);
}

function nodeBlockComment(value, location) {
  return node("blockComment", value, location);
}

}

start
  = SPACE
  / l:(line) (NL+ / EOF) { return l}

line
  = w:(word SPACE / string / OPERATOR / SPACE)*  {
    return w;
  }
  / comment
  / SPACE?

comment
  = w:(("#" / "-" "-") (!(NL / EOF) .)*) {
        return nodeLineComment(w.join(""), location());
  }
  / w:("{" (!"}".*) "}") {
        return nodeBlockComment(w.join(""), location());
  }

word
  = w:(LETTER)+  {
        return nodeWord(w.join(""), location());
  }

string
  = double_quoted_multiline_string
  / double_quoted_single_line_string
  / single_quoted_multiline_string
  / single_quoted_single_line_string

double_quoted_multiline_string
  = '"""' NL? chars:multiline_string_char* '"""'  { return nodeStr(chars.join(''), location()) }
double_quoted_single_line_string
  = '"' chars:string_char* '"'                    { return nodeStr(chars.join(''), location()) }
single_quoted_multiline_string
  = "'''" NL? chars:multiline_literal_char* "'''" { return nodeStr(chars.join(''), location()) }
single_quoted_single_line_string
  = "'" chars:literal_char* "'"                   { return nodeStr(chars.join(''), location()) }

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

LETTER = [a-z0-9]i

OPERATOR
  = o:[~!@%^&*\(\)\-+=|/{}\[\]\:;<> ,.?#_] {
    return nodeOperator(o, location());
}

SPACE = s:[ \t\n\r]+ { return node("ws", s, location()); }

NL
  = s:("\n" / "\r" "\n") { return node("nl", s, location()); }

NLS              = NL / SPACE

EOF
  = !.
