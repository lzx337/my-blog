@echo off
chcp 65001 >nul
echo ====================================
echo   YQLCH Blog 服务器启动
echo ====================================
echo.
cd /d "%~dp0"
echo 正在检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
)
echo.
echo 正在启动服务器...
echo 后台地址: http://localhost:3000/pages/admin.html
echo 首页地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.
node server/server.js
pause