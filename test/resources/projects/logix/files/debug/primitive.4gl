#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#

--DATABASE logix

--GLOBALS
--	DEFINE g_user             LIKE usuarios.cod_usuario
--	DEFINE g_cod_empresa      LIKE empresa.cod_empresa
--END GLOBALS

DEFINE m_decimal              DECIMAL
DEFINE m_decimal_1            DECIMAL(10,1)
DEFINE m_decimal_2            DECIMAL(10,2)
DEFINE m_float                FLOAT
DEFINE m_smallfloat           SMALLFLOAT
DEFINE m_money                MONEY
DEFINE m_smallint_min         SMALLINT
DEFINE m_smallint             SMALLINT
DEFINE m_smallint_max         SMALLINT
DEFINE m_integer_min          INTEGER
DEFINE m_integer              INTEGER
DEFINE m_integer_max          INTEGER
DEFINE m_char                 CHAR(10)
DEFINE m_varchar              VARCHAR(10)

main

	DISPLAY "Start MAIN"

	call _local()

END MAIN

function _local()
	DEFINE l_index                SMALLINT
	DEFINE l_decimal              DECIMAL
	DEFINE l_decimal_1            DECIMAL(10,1)
	DEFINE l_decimal_2            DECIMAL(10,2)
	DEFINE l_float                FLOAT
	DEFINE l_smallfloat           SMALLFLOAT
	DEFINE l_money                MONEY
	DEFINE l_smallint_min         SMALLINT
	DEFINE l_smallint             SMALLINT
	DEFINE l_smallint_max         SMALLINT
	DEFINE l_integer_min          INTEGER
	DEFINE l_integer              INTEGER
	DEFINE l_integer_max          INTEGER
	DEFINE l_char                 CHAR(10)
	DEFINE l_varchar              VARCHAR(10)
	DEFINE l_date                 DATE
	DEFINE l_dateTime             DATETIME YEAR TO SECOND

	LET l_index          = 0
	LET l_decimal        = 1.23
	LET l_decimal_1      = 1.23
	LET l_decimal_2      = 1.23
	LET l_float          =  1.23456789012345678901234567890
	LET l_smallfloat     =  1.234567890123456
	LET l_money          =  1.12
	LET l_smallint_min   =  -32767
	LET l_smallint       =  0
	LET l_smallint_max   =  32767
	LET l_integer_min    =  -2147483647
	LET l_integer        =  0
	LET l_integer_max    =  2147483647
	LET l_varchar        =  "varchar"
	LET l_char           =  "char"
	LET l_date           =  "2022-01-01"
	LET l_datetime       =  "2022-01-01 12:00:00"

	DISPLAY "LOCAL"
end function
