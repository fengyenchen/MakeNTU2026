import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const SENSOR_MODE = "serial"; // "mock" 或 "serial"
const SERIAL_PORT_PATH = "COM5";
const BAUD_RATE = 115200;

let latestSensorData = {
    temp: 0,
    gas: 0,
    dist: 0
};

let onSensorData = null;
let serialReady = false;
let serialErrorMessage = "";
let port = null;

if (SENSOR_MODE === "serial") {
    initSerialBridge();
}

export function getHardwareStatus() {
    return {
        sensorMode: SENSOR_MODE,
        serialPath: SERIAL_PORT_PATH,
        baudRate: BAUD_RATE,
        serialReady,
        serialErrorMessage
    };
}

export function setSensorDataListener(listener) {
    onSensorData = listener;
}

export function handleDriveCommand(cmd) {
    if (SENSOR_MODE !== "serial") {
        return;
    }

    if (!port || !serialReady) {
        return;
    }

    const raw = String(cmd).trim();
    const command = raw.charAt(0).toUpperCase();
    
    port.write(command, (error) => {
        if (error) serialErrorMessage = error.message;
    });    
}

export function stopMotors() {
    handleDriveCommand("S");
}

export function readSensorData() {
    if (SENSOR_MODE === "mock") {
        return {
            temp: Number((25 + Math.random() * 2).toFixed(1)),
            gas: Math.floor(2200 + Math.random() * 800),
            dist: Math.floor(50 + Math.random() * 150)
        };
    }

    return latestSensorData;
}

function initSerialBridge() {
    port = new SerialPort({ path: SERIAL_PORT_PATH, baudRate: BAUD_RATE }, (error) => {
        if (error) {
            serialErrorMessage = error.message;
        }
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    port.on("open", () => {
        serialReady = true;
        serialErrorMessage = "";
        console.log("Pico 序列埠已連接:", SERIAL_PORT_PATH, BAUD_RATE);
    });

    port.on("close", () => {
        serialReady = false;
    });

    port.on("error", (error) => {
        serialReady = false;
        serialErrorMessage = error.message;
        console.log("序列埠錯誤:", error.message);
    });

    parser.on("data", (line) => {
        const text = String(line).trim();
        if (!text) {
            return;
        }

        try {
            const parsed = JSON.parse(text);
            latestSensorData = {
                temp: Number(parsed.temp ?? 0),
                gas: Number(parsed.gas ?? 0),
                dist: Number(parsed.dist ?? 0)
            };

            if (onSensorData) {
                onSensorData(latestSensorData);
            }
        } catch (error) {
            console.log("-- 非 JSON 格式:", text);
        }
    });
}
