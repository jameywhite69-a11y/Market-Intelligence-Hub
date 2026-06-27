@echo off
title Market Intelligence Hub v24.1 CSV Data Import Tools
echo Starting Market Intelligence Hub v24.1 CSV Data Import Tools...
echo.
echo Open http://127.0.0.1:8000
echo.
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
