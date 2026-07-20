# 語音直送 Voice Relay 🎤

**手機講嘢，電腦收字。** Speak on your phone, get the text on your computer — instantly.

手機開網頁，撳入文字欄用**鍵盤內置嘅 🎤 聽寫**講嘢（iPhone／Android 都支援廣東話），文字即時經 WebSocket 出現喺電腦嘅同一個網頁度，一撳就 copy。

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/boscochuen011/voice-relay)

## ✨ 功能

- 🎤 **語音輸入** — 用手機鍵盤內置聽寫（穩定、支援廣東話、唔使任何權限設定）
- ⚡ **即時同步** — WebSocket 推送，手機講完電腦即刻見到
- 📱 **QR code 入房** — 電腦撳「QR 入房」，手機相機一掃就自動入到同一間房
- 🔑 **房間碼私隱** — 自訂房間碼就係你嘅「鎖匙」，兩部裝置入同一個碼先連到埋一齊
- 📋 **一鍵複製** — 每段有「複製」掣，亦可以「全部複製」
- 🌗 **深淺色主題** — 自動跟系統

## 📖 用法

1. 手機同電腦都開個網址
2. 電腦輸入一個自訂**房間碼**（愈難估愈私隱），撳「QR 入房」
3. 手機相機掃個 QR code → 自動入房
4. 手機撳入文字欄 → 撳鍵盤上嘅 **🎤** → 講嘢 → 撳「送出」→ 電腦即時見到 → 撳「複製」

## 🚀 部署（固定網址，唔使開電腦）

撳上面個 **Deploy to Render** 掣：

1. 用 GitHub 帳號登入 Render（免費）
2. 撳 **Deploy** — 佢會自動讀 `render.yaml`，唔使填任何嘢
3. 幾分鐘後就有一個固定網址，例如 `https://voice-relay-xxxx.onrender.com`

> 💡 免費層閒置 15 分鐘會瞓覺，再次打開要等大約 30–60 秒起身，之後就正常快。

## 💻 本機行（開發用）

```bash
npm install
npm start        # http://localhost:3000
```

想畀手機經互聯網連入本機，可以用 [cloudflared](https://github.com/cloudflare/cloudflared/releases) 開免費臨時隧道：

```bash
cloudflared tunnel --url http://localhost:3000
```

Windows：下載 `cloudflared-windows-amd64.exe` 做 `cloudflared.exe` 放喺項目資料夾，撳兩下 `start.bat`。

## 🛠️ 技術

- Node.js + Express + [ws](https://github.com/websockets/ws)（WebSocket）
- 語音輸入：手機鍵盤內置聽寫（冇用任何語音 API，唔使 key）
- QR code：[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)（本地產生，冇外部請求）
- 冇資料庫 — 房間紀錄存喺記憶體（每房最多 500 條），重開伺服器就清空

## 📄 License

MIT
