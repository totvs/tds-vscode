#include "totvs.ch"

#define SIMPLE_CONST 42
#define NO_VALUE
#define STRING_CONST "hello world"
#define MULTI_PARAM(A, B, C) (A + B + C)
#define SINGLE_PARAM(X) (X * 2)
#define EXPR_VALUE (10 + 20)
#define CONCAT_STR "prefix" + "suffix"
//#define EMPTY_PARAMS() (conout("empty")) //yacc sintaxe error
#DEFINE UPPER_CASE_KW 999

user function testDefines()
  local nVal := SIMPLE_CONST
  local cStr := STRING_CONST
  local nSum := MULTI_PARAM(1, 2, 3)
return
