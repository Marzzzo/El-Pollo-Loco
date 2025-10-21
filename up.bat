@echo off
ECHO Pushing changes to GitHub...

REM Add all new or modified files
git add .

REM Get the current date and time for the commit message
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=:" %%a in ('time /t') do set mytime=%%a-%%b
set "commit_message=Update %mydate% at %mytime%"

REM Commit the changes with the timestamped message
git commit -m "%commit_message%"

REM Push the changes to the remote repository
git push

ECHO.
ECHO All changes have been pushed to GitHub.
PAUSE
