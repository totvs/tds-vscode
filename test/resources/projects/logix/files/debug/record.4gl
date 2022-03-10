#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#

define rec record  
	 l_decimal              DECIMAL
	, l_decimal_1            DECIMAL(10,1)
	, l_decimal_2            DECIMAL(10,2)
	, l_float                FLOAT
	, l_smallfloat           SMALLFLOAT
	, l_money                MONEY
	, l_smallint_min         SMALLINT
	, l_smallint             SMALLINT
	, l_smallint_max         SMALLINT
	, l_integer_min          INTEGER
	, l_integer              INTEGER
	, l_integer_max          INTEGER
	, l_char                 CHAR(10)
	, l_varchar              VARCHAR(10)
	, l_date                 DATE
	, l_dateTime             DATETIME YEAR TO SECOND
end record

define l_index                SMALLINT

main

FOR l_index = 1 TO 5
	LET rec.l_decimal        = 1.23
	LET rec.l_decimal_1      = 1.23
	LET rec.l_decimal_2      = 1.23
	LET rec.l_float          =  1.23456789012345678901234567890
	LET rec.l_smallfloat     =  1.234567890123456
	LET rec.l_money          =  1.12
	LET rec.l_smallint_min   =  -32767
	LET rec.l_smallint       =  0
	LET rec.l_smallint_max   =  32767
	LET rec.l_integer_min    =  -2147483647
	LET rec.l_integer        =  0
	LET rec.l_integer_max    =  2147483647
	LET rec.l_varchar        =  "varchar"
	LET rec.l_char           =  "char"
	LET rec.l_date           =  "2022-01-01"
	LET rec.l_datetime       =  "2022-01-01 12:00:00"
end for

END MAIN

function __bpValid(result)
     DEFINE result     int 

	return result
end function
