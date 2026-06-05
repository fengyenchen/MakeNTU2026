from machine import Pin, ADC, PWM
import time
import ujson
import uselect
import sys
import random

# === 馬達腳位 (L298N) === 測試
MOTOR_IN3 = Pin(3, Pin.OUT)   # GP3 - 正
MOTOR_IN4 = Pin(4, Pin.OUT)   # GP4 - 反

# 感測器腳位



def move_forward():
    MOTOR_IN3.on()
    MOTOR_IN4.off()

def move_backward():
    MOTOR_IN3.off()
    MOTOR_IN4.on()

def turn_left():
    # 先停止
    stop_motors()

def turn_right():
    # 先停止
    stop_motors()

def stop_motors():
    MOTOR_IN3.off()
    MOTOR_IN4.off()

def handle_cmd(cmd):
    if cmd == "W":
        move_forward()
    elif cmd == "A":
        turn_left()
    elif cmd == "S":
        stop_motors()
    elif cmd == "D":
        turn_right()
    elif cmd == "X":
        move_backward()


def read_sensors():
    # 先模擬
    temp = 20 + random.random() * 15
    gas = int(2000 + random.random() * 1023)
    dist = int(random.random() * 200)
    return {
        "temp": round(temp, 1),
        "gas": gas,
        "dist": dist
    }


# 建立非阻塞輪詢器，用來檢查 USB 序列埠是否有新指令
poller = uselect.poll()
poller.register(sys.stdin, uselect.POLLIN)

# 啟動時先停
stop_motors()
last_send = time.ticks_ms()

while True:
    # 有收到字元就讀一個命令，轉大寫後交給控制函式
    events = poller.poll(0)
    if events:
        raw = sys.stdin.read(1)
        if raw:
            handle_cmd(raw[0].upper())

    # 輸出感測器資料
    now = time.ticks_ms()
    if time.ticks_diff(now, last_send) >= 500:
        payload = read_sensors()
        print(ujson.dumps(payload))
        last_send = now

    time.sleep_ms(10)