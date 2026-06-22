import { useState, useEffect } from 'react';
import client from '../api/client';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/tickets/')
      .then((res) => {
        // Обрабатываем пагинацию Django REST
        const data = res.data.results || res.data;
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки заявок:', err);
        setTickets([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Мои заявки</h1>
      
      {tickets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>У вас пока нет заявок</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3>Заявка #{ticket.id}</h3>
              <p>{ticket.description}</p>
              <small>
                {ticket.category === 'PLUMBING' ? 'Сантехника' : 'Электрика'} • 
                Статус: {ticket.status_display || ticket.status}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}