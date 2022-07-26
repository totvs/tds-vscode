#---------------------------------------------------------------------#
# Caution:                                                            #
#  If this source is modified, review breakpoints in the test source. #
#---------------------------------------------------------------------#

DEFINE list_50              ARRAY[50] OF INT
DEFINE list_100              ARRAY[100] OF INT
DEFINE list_101              ARRAY[101] OF INT
DEFINE list_199              ARRAY[199] OF INT
DEFINE list_200              ARRAY[200] OF INT
DEFINE list_223              ARRAY[223] OF INT
DEFINE list_250              ARRAY[250] OF INT
DEFINE list_500              ARRAY[500] OF INT
DEFINE list_1000              ARRAY[1000] OF INT
DEFINE _index            INT

main
	DISPLAY "Start MAIN"
	call conout("start MAIN")

	FOR _index = 1 TO 1000
		IF (_index < 51) THEN
		  LET list_50[_index] = _index
		END IF

		IF (_index < 101) THEN
		  LET list_100[_index] = _index
		END IF

		IF (_index < 102) THEN
		  LET list_101[_index] = _index
		END IF

		IF (_index < 200) THEN
		  LET list_199[_index] = _index
		END IF

		IF (_index < 201) THEN
		  LET list_200[_index] = _index
		END IF

		IF (_index < 224) THEN
		  LET list_223[_index] = _index
		END IF

		IF (_index < 251) THEN
		  LET list_250[_index] = _index
		END IF

		IF (_index < 501) THEN
		  LET list_500[_index] = _index
		END IF

		LET list_1000[_index] = _index
	END FOR

	call conout("display com erro")
   --display list_1000[2000]

	call conout("depois do display com erro")
	DISPLAY "Continue MAIN"

END MAIN
