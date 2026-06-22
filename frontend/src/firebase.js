import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCytMRO_FZzy-YrMj4dElQ5Nk3rf3SpXiA",
  authDomain: "practick-5ca0a.firebaseapp.com",
  projectId: "practick-5ca0a",
  storageBucket: "practick-5ca0a.firebasestorage.app",
  messagingSenderId: "338406720791",
  appId: "1:338406720791:web:ffce9a3bacacaa7b822352",
  measurementId: "G-74FHZ6SF8W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Функция для получения токена
export const requestForToken = async () => {
  try {
    // Регистрация сервис-воркера
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker зарегистрирован:', registration);

    const currentToken = await getToken(messaging, {
      vapidKey: 'BN_G7GAOwuKz_qS8jTOsMYrUGAgoLBXO1khetIUT5Jk7y7MViCa3w8TsM4JsFnHEkjPCwCOvlxAPLsCHfOHLd6o',
      serviceWorkerRegistration: registration,
    });
    
    if (currentToken) {
      console.log('FCM Token получен:', currentToken);
      return currentToken;
    } else {
      console.log('Нет токена регистрации');
      return null;
    }
  } catch (err) {
    console.error('Ошибка получения токена:', err);
    return null;
  }
};

// Слушатель входящих сообщений
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Получено сообщение:', payload);
      resolve(payload);
    });
  });

export { messaging };