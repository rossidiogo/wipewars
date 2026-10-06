@echo off
cd /d "%~dp0"
set PY=%LOCALAPPDATA%\Programs\Python\Python313\python.exe
if not exist "%PY%" set PY=python
echo Estudio de Fotos rodando. Feche esta janela para parar.
"%PY%" server.py
pause
