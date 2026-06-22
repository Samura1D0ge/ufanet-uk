import { useState, useEffect } from 'react';
import client from '../api/client';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/news/')
      .then((res) => {
        // Обрабатываем пагинацию Django REST
        const data = res.data.results || res.data;
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки новостей:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1a1a2e' }}>Новости</h1>
      
      {news.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Новостей пока нет</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {news.map((item) => (
            <div key={item.id} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{item.title}</h2>
              <p style={{ margin: '0.5rem 0', color: '#333', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {item.content}
              </p>
              <small style={{ color: '#666' }}>
                {item.author_name || 'Администрация'} • {new Date(item.created_at).toLocaleString('ru-RU')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}