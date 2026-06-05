import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/tickets/')
      .then(({ data }) => setTickets(data.results || data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    NEW: '#ffc107',
    IN_PROGRESS: '#17a2b8',
    RESOLVED: '#28a745',
    REJECTED: '#dc3545',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Мои заявки</h1>
        <Link to="/create-ticket" style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
        }}>
          + Новая заявка
        </Link>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : tickets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>У вас пока нет заявок</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${statusColors[ticket.status] || '#ccc'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Заявка #{ticket.id}</strong>
                <span style={{
                  background: statusColors[ticket.status] || '#ccc',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                }}>
                  {ticket.status_display || ticket.status}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0', color: '#333' }}>{ticket.description}</p>
              <small style={{ color: '#666' }}>
                {ticket.category} • {new Date(ticket.created_at).toLocaleString('ru-RU')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}