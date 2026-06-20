import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Socket.io 伺服器位址
const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:3000`;
const socket = io(SOCKET_URL);

function App() {
  const [data, setData] = useState({
    temp: 0,
    gas: 0,
    dist: 0
  });
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    // 監聽 Socket.IO 事件
    socket.on('connect', () => { // 連線成功時觸發
      setStatus('Connected');
    });
    socket.on('disconnect', () => {
      setStatus('Disconnected'); // 連線斷開時觸發
    });
    socket.on('robot-data', (updateData) => {
      setData(prev => ({ ...prev, ...updateData }));
    });

    // 解除監聽
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('robot-data');
    };
  }, []);

  const sendCmd = (cmd) => socket.emit('robot-cmd', cmd);

  const reconnect = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };

  return (
    <div className="app-container">
      <nav>
        <h2>Exploration Robot Monitor</h2>
        <div className="top-right">
          <span className={`status ${status.toLowerCase()}`}>{status}</span>
          {status == 'Disconnected' && (
            <button className="disconnect-btn" onClick={reconnect}>
              Reconnect
            </button>
          )}
        </div>
      </nav>

      <div className="dashboard">
        <div className="card">
          <h4>溫度</h4>
          <div className="value">{data.temp}<span>°C</span></div>
        </div>
        <div className="card">
          <h4>瓦斯</h4>
          <div className="value">{data.gas}<span>ppm</span></div>
        </div>
        <div className="card danger">
          <h4>前方距離</h4>
          <div className="value">{data.dist}<span>cm</span></div>
        </div>
      </div>

      <div className='remote-control-container'>
        <div className="remote-control">
          方向按鈕
          <button onClick={() => sendCmd('W')}>前進</button>
          <div className="middle">
            <button onClick={() => sendCmd('A')}>左轉</button>
            <button className="stop" onClick={() => sendCmd('S')}>STOP</button>
            <button onClick={() => sendCmd('D')}>右轉</button>
          </div>
          <button onClick={() => sendCmd('X')}>後退</button>
        </div>
      </div>
    </div>
  );
}

export default App;