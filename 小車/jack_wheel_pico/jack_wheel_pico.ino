// 千斤頂 - pico
// 小車輪子 - R Pi Pico

const int IN1 = 14; 
const int IN2 = 15;

const int L_IN1 = 2; 
const int L_IN2 = 3; 
const int R_IN1 = 5; 
const int R_IN2 = 6;

void forward() {
  digitalWrite(L_IN1, HIGH); 
  digitalWrite(L_IN2, LOW);

  digitalWrite(R_IN1, HIGH); 
  digitalWrite(R_IN2, LOW);
}

void backward() {
  digitalWrite(L_IN1, LOW); 
  digitalWrite(L_IN2, HIGH);

  digitalWrite(R_IN1, LOW); 
  digitalWrite(R_IN2, HIGH);
}

void leftTurn() {
  digitalWrite(L_IN1, LOW); 
  digitalWrite(L_IN2, HIGH);

  digitalWrite(R_IN1, HIGH); 
  digitalWrite(R_IN2, LOW);
}

void rightTurn() {
  digitalWrite(L_IN1, HIGH); 
  digitalWrite(L_IN2, LOW);

  digitalWrite(R_IN1, LOW); 
  digitalWrite(R_IN2, HIGH);
}

void stopCar() {
  digitalWrite(L_IN1, LOW); 
  digitalWrite(L_IN2, LOW);

  digitalWrite(R_IN1, LOW); 
  digitalWrite(R_IN2, LOW);
}

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);

  digitalWrite(L_IN1, HIGH); 
  digitalWrite(L_IN2, LOW);

  digitalWrite(R_IN1, HIGH); 
  digitalWrite(R_IN2, LOW);

  pinMode(L_IN1, OUTPUT); 
  pinMode(L_IN2, OUTPUT);
  pinMode(R_IN1, OUTPUT); 
  pinMode(R_IN2, OUTPUT);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
}

void stopMotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
}

void loop() {
  moveForward();
  delay(8000);

  stopMotor();
  delay(1000);

  moveBackward();
  delay(12000);
  
  stopMotor();
  delay(1000);

  // 前進
  forward();
  delay(2000);
  stopCar();
  delay(1000);

  // 後退
  backward();
  delay(2000);
  stopCar();
  delay(1000);

  // 左轉
  leftTurn();
  delay(1000);
  stopCar();
  delay(1000);

  // 右轉
  rightTurn();
  delay(1000);
  stopCar();
  delay(1000);
}