#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#

--DATABASE logix

GLOBALS
	--DEFINE g_user             LIKE usuarios.cod_usuario
	--DEFINE g_cod_empresa      LIKE empresa.cod_empresa
END GLOBALS

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
-- 

	DISPLAY "Start MAIN"

	call _local()

<<<<<<< Updated upstream
END MAIN
=======
	let l_date         = "12/31/1899"
	let l_date_22      = "12/31/2022"
	let l_date_max     = l_Date + 2,264,870

end function

-- DATETIME -- Points in time, specified as calendar dates and time-of-day.
function _dateTime() --YYYY-MM-DD HH:MM:SS
	define    l_dateTime          DATETIME YEAR TO FRACTION 
	define    l_dateTime_YS       DATETIME YEAR TO SECOND
	define    l_dateTime_YD       DATETIME YEAR TO DAY
	define    l_dateTime_HS       DATETIME HOUR TO SECOND

	let l_dateTime         = "1899-12-31 00:00:00.000"
	let l_dateTime_YS      = "1899-12-31 00:00:00"
	let l_dateTime_YD      = "2022-12-31" -- 12:30:30"
	let l_dateTime_HS      = "12:30:30"

end function

-- DEC-- (This keyword is a synonym for DECIMAL.)
-- DECIMAL-- Fixed point numbers, of a specified scale and precision.
--function _dec()  --mm/dd/yy
--	define l_dec          DEC     

-- DOUBLE PRECISION-- (These keywords are a synonym for FLOAT.)
-- FLOAT -- Floating-point numbers, of up to 32-digit precision.
-- INT -- (This keyword is a synonym for INTEGER.)
-- INTEGER-- Whole numbers, from -2,147,483,647 to +2,147,483,647.
-- INTERVAL-- Spans of time in years and months, or else in smaller time units.
-- MONEY-- Currency amounts, with definable scale and precision.
-- NUMERIC-- (This keyword is a synonym for DECIMAL.)
-- REAL-- (This keyword is a synonym for SMALLFLOAT.)
-- RECORD-- Ordered sets of values, of any combination of 4GL data types.
-- SMALLFLOAT -- Floating-point numbers, of up to 16-digit precision.
-- SMALLINT-- Whole numbers, from -32,767 to +32,767.
-- TEXT-- Character strings of any length.
-- VARCHAR-- Character strings of varying length, no greater than 255.
>>>>>>> Stashed changes

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
