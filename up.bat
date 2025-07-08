@echo off
setlocal enabledelayedexpansion

set "msgFile=.git_commit_msg.txt"

if "%~1"=="" (
  notepad "%msgFile%"
) else (
"%msgFile%" echo %~1
  shift

  :loop
  if "%~1"=="" goto commit
  >> "%msgFile%" echo %~1
  shift
  goto loop
)

:commit
git add .
git commit -F "%msgFile%"
git push