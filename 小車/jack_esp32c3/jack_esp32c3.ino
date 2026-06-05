// 千斤頂 - ESP32-C3

const int JACK_IN1 = 0; // GPIO0
const int JACK_IN2 = 1; // GPIO1

void setup() {
  pinMode(JACK_IN1, OUTPUT);
  pinMode(JACK_IN2, OUTPUT);
  
  // 初始狀態：停止
  digitalWrite(JACK_IN1, LOW);
  digitalWrite(JACK_IN2, LOW);
}

void liftUp() {
  digitalWrite(JACK_IN1, HIGH);
  digitalWrite(JACK_IN2, LOW);
}

void liftDown() {
  digitalWrite(JACK_IN1, LOW);
  digitalWrite(JACK_IN2, HIGH);
}

void stopMotor() {
  digitalWrite(JACK_IN1, LOW);
  digitalWrite(JACK_IN2, LOW);
}

void loop() {
  // 上升
  liftUp();
  delay(8000); 
  
  // 停止
  stopMotor();
  delay(2000);
  
  // 下降
  liftDown();
  delay(8000);
  
  // 停止
  stopMotor();
  delay(1000);
}