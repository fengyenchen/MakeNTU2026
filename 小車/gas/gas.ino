// 瓦斯探測

int MQ4A0 = A5;
int buzzer = 8;    // 定義蜂鳴器接在第 8 腳
int Standard = 35; // 400

void setup() {
  pinMode(MQ4A0, INPUT);
  pinMode(buzzer, OUTPUT); // 設定蜂鳴器腳位為輸出
  Serial.begin(9600);
}

void loop() {
  int result = analogRead(MQ4A0);
  Serial.print("MQ4: ");
  Serial.println(result);

  if (result > Standard) {
    Serial.println("Alert!");
    
    // 法 A：直接給高電位（適用於主動式蜂鳴器）
    digitalWrite(buzzer, HIGH); 
    
    // 法 B：發出特定頻率聲音（適用於被動式蜂鳴器，聽起來較響亮）
    // tone(buzzer, 1000); // 發出 1000Hz 的聲音
  } 
  else {
    digitalWrite(buzzer, LOW);
    // noTone(buzzer); // 如果使用法 B，則用這行關閉
  }

  delay(100);
}