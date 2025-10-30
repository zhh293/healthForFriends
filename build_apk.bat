@echo off
echo ========================================
echo   构建 Android APK
echo ========================================
echo.

echo [1/3] 构建前端项目...
call npm run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [2/3] 同步到 Android...
call npx cap sync android
if errorlevel 1 (
    echo 同步失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 打开 Android Studio...
echo.
echo 请在 Android Studio 中：
echo 1. 等待 Gradle 同步完成
echo 2. 点击 Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 3. 构建完成后，APK 位置：android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause

call npx cap open android

pause

