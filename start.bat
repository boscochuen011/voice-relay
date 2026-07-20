@echo off
chcp 65001 >nul
cd /d %~dp0
echo ================================================
echo   語音直送 啟動中...
echo   一陣間下面會出一個 https://xxx.trycloudflare.com 網址
echo   手機同電腦都用嗰個網址開，入同一個房間碼就得
echo   (閂咗呢個窗 = 停止服務)
echo ================================================
start "voice-relay-server" /min node server.js
timeout /t 2 >nul
cloudflared.exe tunnel --url http://localhost:3000
