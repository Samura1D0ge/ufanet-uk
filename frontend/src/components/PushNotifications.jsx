import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

export default function PushNotifications() {
  const [notification, setNotification] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Запрашиваем разрешение и получаем токен
    requestForToken().then((token) => {
      if (token) {
        setToken(token);
        // TODO: Отправить токен на бэкенд (когда будет готов endpoint)
        // await client.post('/auth/fcm-token/', { token });
      }
    });

    // Слушаем входящие сообщения
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification?.title || 'Уведомление',
          body: payload.notification?.body || '',
        });
        
        // Показываем браузерное уведомление
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'Уведомление', {
            body: payload.notification?.body,
          });
        }
      })
      .catch((err) => console.error('Failed to receive message:', err));
  }, []);

  // Запрашиваем разрешение на уведомления
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!notification) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '350px',
      borderLeft: '4px solid #17a2b8',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{notification.title}</h4>
          <p style={{ margin: 0, color: '#333' }}>{notification.body}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999',
            padding: '0',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}