// frontend/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Инициализация Firebase в сервис-воркере
firebase.initializeApp({
  apiKey: "AIzaSyCytMRO_FZzy-YrMj4dElQ5Nk3rf3SpXiA",
  authDomain: "practick-5ca0a.firebaseapp.com",
  projectId: "practick-5ca0a",
  storageBucket: "practick-5ca0a.firebasestorage.app",
  messagingSenderId: "338406720791",
  appId: "1:338406720791:web:ffce9a3bacacaa7b822352",
  measurementId: "G-74FHZ6SF8W"
});

const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Или путь к твоей иконке
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});