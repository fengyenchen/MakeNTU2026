import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
    getHardwareStatus,
    handleDriveCommand,
    readSensorData,
    setSensorDataListener,
    stopMotors
} from "./hardware/robot-hardware.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const hardwareStatus = getHardwareStatus();

if (hardwareStatus.sensorMode === "serial") {
    console.log("Pico 模式: serial");
    console.log("序列埠:", hardwareStatus.serialPath, "鮑率:", hardwareStatus.baudRate);
    if (!hardwareStatus.serialReady) {
        console.warn(hardwareStatus.serialErrorMessage);
    }
}

// serial 模式：資料由 Pico 主動推送，後端收到即轉發給前端。
if (hardwareStatus.sensorMode === "serial") {
    setSensorDataListener((robotData) => {
        io.emit("robot-data", robotData);
        console.log("接收並轉發數據:", robotData);
    });
} else {
    // mock 模式：後端自行定時產生資料。
    setInterval(() => {
        const robotData = readSensorData();
        io.emit("robot-data", robotData);
        console.log("發送數據:", robotData);
    }, 1000);
}

io.on("connection", (socket) => {
    console.log("裝置已連線");

    socket.on("robot-cmd", (cmd) => {
        // const command = String(cmd).charAt(0).toUpperCase();
        const command = String(cmd);
        
        handleDriveCommand(command);
        console.log("指令已發送:", command);
    });
});

process.on("SIGINT", () => {
    stopMotors();
    process.exit(0);
});

httpServer.listen(3000, "0.0.0.0", () => {
    console.log("後端伺服器跑在 http://localhost:3000");
});