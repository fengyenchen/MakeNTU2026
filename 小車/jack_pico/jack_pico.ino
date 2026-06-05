// 千斤頂 - pico

const int IN1 = 14; 
const int IN2 = 15;
  
void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
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
}