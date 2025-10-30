@echo off
chcp 65001 >nul
echo ========================================
echo   手动下载 Gradle 并构建 APK
echo ========================================
echo.

echo 抱歉，需要手动下载 Gradle 才能继续。
echo.
echo 这是最简单的解决方案：
echo.
echo 1. 打开浏览器访问：
echo    https://services.gradle.org/distributions/gradle-8.0.2-all.zip
echo    或使用迅雷等下载工具
echo.
echo 2. 下载后，解压文件
echo.
echo 3. 将解压的文件夹（gradle-8.0.2-all）放到：
echo    C:\Users\%USERNAME%\.gradle\wrapper\dists\gradle-8.0.2-all\
echo.
echo    如果没有 gradle-8.0.2-all 文件夹，请创建一个
echo    然后在里面创建一个任意名称的子文件夹（如：gradle-8.0.2）
echo    将解压的内容放到这个子文件夹中
echo.
echo 例如最终路径：
echo C:\Users\%USERNAME%\.gradle\wrapper\dists\gradle-8.0.2-all\xyz123\gradle-8.0.2-all\
echo.
echo ---------------------------------------
echo.
echo 或者，更简单的方法：
echo.
echo 直接安装 Android Studio（推荐）
echo https://developer.android.com/studio
echo.
echo 安装后会自动处理所有这些问题！
echo.
echo ---------------------------------------
echo.
echo 下载并解压完成后，按任意键继续构建...
pause

cd android
if exist "gradlew.bat" (
    echo.
    echo 开始构建...
    call gradlew.bat assembleDebug
    echo.
    echo 构建完成！
    echo.
    echo APK 位置：
    echo android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo 错误：找不到 gradlew.bat
)

pause

