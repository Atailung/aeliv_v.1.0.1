@echo off
echo ===============================================
echo   AELIV Development Server Health Check
echo ===============================================
echo.

echo Checking pnpm installation...
pnpm --version
echo.

echo Starting development server...
echo This will run in the background and show compilation status.
echo.

echo Performance Tips:
echo 1. Add D:\aeliv to your antivirus exclusions
echo 2. Ensure stable internet for font loading  
echo 3. Use 'pnpm clean:cache' if you encounter issues
echo.

echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo ===============================================

pnpm dev