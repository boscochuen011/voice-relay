# 語音直送 Voice Relay 🎙️

**手機講嘢，電腦收字。** Speak on your phone, get the text on your computer — instantly.

手機開網頁撳「開始收音」講嘢（支援廣東話 yue-Hant-HK），文字即時經 WebSocket 出現喺電腦嘅同一個網頁度，一撳就 copy。

## ✨ 功能

- 🎙️ **語音轉文字** — 用瀏覽器內置 Web Speech API，支援廣東話／中文（香港）／國語／普通話／English
- ⚡ **即時同步** — WebSocket 推送，手機講完電腦即刻見到，仲有講緊嘅字嘅即時預覽
- 📱 **QR code 入房** — 電腦撳「QR 入房」，手機相機一掃就自動入到同一間房，唔使打字
- 🔑 **房間碼私隱** — 自訂房間碼就係你嘅「鎖匙」，兩部裝置入同一個碼先連到埋一齊
- 📋 **一鍵複製** — 每段有「複製」掣，亦可以「全部複製」
- ⌨️ **打字後備** — 唔支援收音嘅瀏覽器可以打字，或者用鍵盤咪高風聽寫
- 🌗 **深淺色主題** — 自動跟系統

## 🚀 點樣行

```bash
npm install
npm start        # http://localhost:3000
```

### 畀手機連上嚟（要 HTTPS，因為收音功能需要）

用 [cloudflared](https://github.com/cloudflare/cloudflared/releases) 開免費臨時隧道：

```bash
cloudflared tunnel --url http://localhost:3000
```

佢會畀一個 `https://xxx.trycloudflare.com` 公開網址你。Windows 用戶：下載 `cloudflared-windows-amd64.exe` 做 `cloudflared.exe` 放喺項目資料夾，撳兩下 `start.bat` 就會一次過開伺服器＋隧道。

> ⚠️ trycloudflare 網址每次重開都會轉，而且要部電腦開住先有得用。

### 想要固定網址、唔使開電腦？

Deploy 上 [Render](https://render.com) 或者 [Railway](https://railway.app)（免費層都得）：

1. Fork / clone 呢個 repo
2. 新增 Web Service，連接個 repo
3. Build command：`npm install`；Start command：`npm start`
4. 佢會自動用 `PORT` 環境變數，唔使改嘢

## 📖 用法

1. 手機同電腦都開個網址
2. 電腦輸入一個自訂**房間碼**（愈難估愈私隱），撳「QR 入房」
3. 手機相機掃個 QR code → 自動入房
4. 手機撳「🎙️ 開始收音」講嘢 → 電腦即時見到 → 撳「複製」

### iPhone Safari 收唔到音？

- **設定 → Apps → Safari → 咪高風** → 允許
- **設定 → 一般 → 鍵盤 → 啟用「聽寫」**（Safari 嘅語音識別靠系統聽寫服務）
- 第一次撳「開始收音」會彈權限提示，記得撳允許

## 🛠️ 技術

- Node.js + Express + [ws](https://github.com/websockets/ws)（WebSocket）
- 語音識別：瀏覽器內置 Web Speech API（免費、唔使 API key）
- QR code：[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)（本地產生，冇外部請求）
- 冇資料庫 — 房間紀錄存喺記憶體（每房最多 500 條），重開伺服器就清空

## 📄 License

MIT
