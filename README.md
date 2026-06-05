# MakeNTU

React + Socket.IO + Node.js 的探勘機器人監控介面。

前端負責顯示即時感測資料與發送控制指令，後端提供兩種資料來源：
1. 模擬模式：`server.js` + `SENSOR_MODE = "mock"`，適合 UI 開發與展示。
2. Pico 實機模式：`server.js` + `SENSOR_MODE = "serial"`，透過 USB Serial 與 Raspberry Pi Pico 通訊。

## 功能

1. 即時顯示溫度、瓦斯濃度、前方距離
2. 顯示 Socket 連線狀態與手動重連
3. 遙控按鈕：前進、左轉、右轉、後退、停止
4. 支援模擬資料與真實硬體資料切換

## 技術棧

1. Frontend: React, Vite, socket.io-client
2. Backend: Node.js, Express, Socket.IO
3. Hardware bridge: serialport + @serialport/parser-readline

電控可以直接修改 `hardware/robot-hardware.js`。

## 環境需求

1. Node.js 18+
2. npm 9+
3. 實機模式需 Raspberry Pi Pico 與可用序列埠

## 安裝

在專案根目錄執行：

```bash
npm install
```

檢查 `hardware/robot-hardware.js` 內的：
1. `SENSOR_MODE`
2. `SERIAL_PORT_PATH`
3. `BAUD_RATE`

## 啟動

Terminal 1（後端）：

```bash
node server.js
```

Terminal 2（前端）：

```bash
npm run dev -- --host
```

### 模擬模式

將 `hardware/robot-hardware.js` 的 `SENSOR_MODE` 設為 `"mock"`。

### 實機模式（Raspberry Pi Pico）

1. 先把 Pico 韌體燒錄好（用 `pico/micropython_main.py`）
2. 將 `hardware/robot-hardware.js` 的 `SENSOR_MODE` 設為 `"serial"`
3. 在 `hardware/robot-hardware.js` 設定序列埠參數（`SERIAL_PORT_PATH` 填 COM）
4. 依上面的「啟動」分別啟動後端與前端

## 網路與通訊設定

1. 後端預設監聽 `0.0.0.0:3000`
2. 前端 Socket 目標：`<當前頁面主機>:3000`
3. 手機/其他裝置測試時，需與後端主機在同一個區網
4. Pico 模式預設鮑率：`115200`

## 通訊協定

Socket 事件：
1. 後端 -> 前端：`robot-data`
2. 前端 -> 後端：`robot-cmd`

`robot-data` 範例：

```json
{
  "temp": 26.1,
  "gas": 2450,
  "dist": 120
}
```

`robot-cmd` 指令：
1. `W`: 前進
2. `A`: 左轉
3. `D`: 右轉
4. `X`: 後退
5. `S`: 停止

## 常用指令

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

1. `npm run dev`：啟動前端開發伺服器（Vite），用於本機開發與即時預覽。
2. `npm run build`：產生正式部署用的前端靜態檔案（輸出到 `dist/`）。
3. `npm run preview`：在本機啟動預覽伺服器，檢查 `build` 後成品是否正常。
4. `npm run lint`：執行 ESLint 檢查程式碼風格與潛在錯誤。

## 專案結構

```text
.
|- src/
|  |- App.jsx
|  |- App.css
|  |- main.jsx
|- hardware/
|  |- robot-hardware.js
|- pico/
|  |- micropython_main.py
|- server.js
|- package.json
```

## 參考文件

1. Vite: https://vite.dev/guide/
2. React: https://react.dev/
3. Socket.IO: https://socket.io/docs/v4/
4. Express: https://expressjs.com/
5. SerialPort: https://serialport.io/docs/guide-usage/
6. Window Location: 
	- https://developer.mozilla.org/en-US/docs/Web/API/Location/protocol
	- https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname