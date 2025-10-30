@echo off
echo ========================================
echo   健身计划追踪应用 - 启动脚本
echo ========================================
echo.

echo [1/2] 安装依赖...
call npm install

echo.
echo [2/2] 启动开发服务器...
echo.
echo 浏览器将自动打开 http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

