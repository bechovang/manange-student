@echo off
REM File: reset_db.bat
REM Tu dong reset database edudb voi password mac dinh

SETLOCAL

REM Cau hinh ket noi
SET PG_USER=postgres
SET PG_PASSWORD=phuc2006
SET DB_NAME=edudb
SET CREATE_TABLES_SCRIPT=create_tables.sql
SET INSERT_DATA_SCRIPT=insert_data.sql

REM Set password for psql commands
SET PGPASSWORD=%PG_PASSWORD%

echo.
echo [1/4] Dang xoa database cu...
psql -U %PG_USER% -c "DROP DATABASE IF EXISTS %DB_NAME%"

echo.
echo [2/4] Dang tao database moi...
psql -U %PG_USER% -c "CREATE DATABASE %DB_NAME%"

echo.
echo [3/4] Dang tao cac bang...
psql -U %PG_USER% -d %DB_NAME% -f %CREATE_TABLES_SCRIPT%

echo.
echo [4/4] Dang chen du lieu mau...
psql -U %PG_USER% -d %DB_NAME% -f %INSERT_DATA_SCRIPT%

echo.
echo HOAN TAT! Database da duoc reset.
echo.
echo Cac thong tin ket noi:
echo Username: %PG_USER%
echo Password: %PG_PASSWORD%
echo Database: %DB_NAME%
echo.

ENDLOCAL
pause