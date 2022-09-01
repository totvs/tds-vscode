lexer grammar pdocLexer;

@lexer::header {

}

/**
 * Adv/PL Tokens
 */

POUND_SIGN: '#';

SEMICOLON: ';';

NEWLINE: '\n';

AT_SIGN: '@';

PROTHEUS_DOC_START: '/*/{Protheus.doc}' -> pushMode ( PDOC );

PROTHEUS_DOC_START_4GL: '{/{Protheus.doc}' -> pushMode ( PDOC );

DOT: '.';

ACCENTED_CHARACTERS: [\u007F-\u00FF];

LPAREN: '(';

RPAREN: ')';

LBRACK: '[';

RBRACK: ']';

LBRACE: '{';

RBRACE: '}';

COMMA: ',';

COLON: ':';

PIPE: '|';

ID: ( LETTER | '_') ( LETTER | DIGIT | '_')*;

NUMBER: DIGIT+ ( DOT DIGIT+)?;

SYMBOLS:
	'\''
	| '"'
	| '!'
	| '$'
	| '%'
	| '¨'
	| '&'
	| '*'
	| '-'
	| '–'
	| '_'
	| '='
	| '+'
	| '§'
	| '´'
	| '`'
	| '~'
	| '^'
	| '\\'
	| '<'
	| '>'
	| '/'
	| '?'
	| '‡'
	| '…'
	| '„'
	| ''
	| '€'
	| 'ƒ'
	| '‘'
	| '†';

mode PDOC;

PROTHEUS_DOC_END: '/*/' -> popMode;

PROTHEUS_DOC_END_4GL: '/}' -> popMode;

PDOC_ID: ( LETTER | DIGIT | '_' | ':' | '.')+;

PDOC_WS: ( ' ' | '\t' | '\r' | '\f') -> channel (HIDDEN);

PDOC_COMMA: COMMA;

PDOC_SPECIAL_CHARS:
	SYMBOLS
	| ACCENTED_CHARACTERS
	| LPAREN
	| RPAREN
	| LBRACK
	| RBRACK
	| LBRACE
	| RBRACE
	| COLON
	| PIPE
	| DOT
	| POUND_SIGN
	| SEMICOLON;

AT_ACCESSLEVEL: AT_SIGN A C C E S S L E V E L;

AT_AUTHOR: AT_SIGN A U T H O R;

AT_BUILD: AT_SIGN B U I L D;

AT_CHILDREN: AT_SIGN C H I L D R E N;

AT_COUNTRY: AT_SIGN C O U N T R Y;

AT_DATABASE: AT_SIGN D A T A B A S E;

AT_DESCRIPTION: AT_SIGN D E S C R I P T I O N;

AT_DEPRECATED: AT_SIGN D E P R E C A T E D;

AT_EXAMPLE: AT_SIGN E X A M P L E;

AT_SAMPLE: AT_SIGN S A M P L E;

AT_LANGUAGE: AT_SIGN L A N G U A G E;

AT_LINK: AT_SIGN L I N K;

AT_OBS: AT_SIGN O B S;

AT_PARAM: AT_SIGN P A R A M;

AT_PARENTS: AT_SIGN P A R E N T S;

AT_PROTECTED: AT_SIGN P R O T E C T E D;

AT_TYPE: AT_SIGN T Y P E;

AT_PROPTYPE: AT_SIGN P R O P T Y P E;

AT_DEFVALUE: AT_SIGN D E F V A L U E;

AT_READONLY: AT_SIGN R E A D O N L Y;

AT_SOURCE: AT_SIGN S O U R C E;

AT_HISTORY: AT_SIGN H I S T O R Y;

AT_RETURN: AT_SIGN R E T U R N;

AT_SYSTEMOPER: AT_SIGN S Y S T E M O P E R;

AT_SEE: AT_SIGN S E E;

AT_SINCE: AT_SIGN S I N C E;

AT_TABLE: AT_SIGN T A B L E;

AT_TODO: AT_SIGN T O D O;

AT_VERSION: AT_SIGN V E R S I O N;

REFERENCE: AT_SIGN;

AT_PROJECT: AT_SIGN P R O J E C T;

AT_OWNER: AT_SIGN O W N E R;

AT_MENU: AT_SIGN M E N U;

AT_ISSUE: AT_SIGN I S S U E;

//Obrigatório ficar após as marcações esperadas
AT_UNKNOWN: AT_SIGN PDOC_ID;

PDOC_NEWLINE: NEWLINE;

/**
 * Fragments tokens
 */
fragment A: 'A' | 'a';

fragment B: 'B' | 'b';

fragment C: 'C' | 'c';

fragment D: 'D' | 'd';

fragment E: 'E' | 'e';

fragment F: 'F' | 'f';

fragment G: 'G' | 'g';

fragment H: 'H' | 'h';

fragment I: 'I' | 'i';

fragment J: 'J' | 'j';

fragment K: 'K' | 'k';

fragment L: 'L' | 'l';

fragment M: 'M' | 'm';

fragment N: 'N' | 'n';

fragment O: 'O' | 'o';

fragment P: 'P' | 'p';

fragment Q: 'Q' | 'q';

fragment R: 'R' | 'r';

fragment S: 'S' | 's';

fragment T: 'T' | 't';

fragment U: 'U' | 'u';

fragment V: 'V' | 'v';

fragment W: 'W' | 'w';

fragment X: 'X' | 'x';

fragment Y: 'Y' | 'y';

fragment Z: 'Z' | 'z';

fragment LETTER: 'A' .. 'Z' | 'a' .. 'z';

fragment DIGIT: '0' .. '9';