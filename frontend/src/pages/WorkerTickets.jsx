import { useEffect, useState } from 'react';
import client from '../api/client';

export default function WorkerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получаем данные текущего пользователя
    client.get('/auth/me/')
      .then(({ data }) => {
        setUser(data);
        // Загружаем заявки, назначенные этому работнику
        return client.get('/tickets/');
      })
      .then(({ data }) => {
        const allTickets = data.results || data;
        // Фильтруем только назначенные этому работнику
        const myTickets = allTickets.filter(t => 
          t.assigned_to === user.id
        );
        setTickets(myTickets);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statusColors = {
    NEW: '#ffc107',
    IN_PROGRESS: '#17a2b8',
    RESOLVED: '#28a745',
    REJECTED: '#dc3545',
  };

  const updateStatus = async (ticketId, newStatus) => {
    try {
      await client.patch(`/tickets/${ticketId}/`, { status: newStatus });
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Мои заявки</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Специальность: {user?.role === 'PLUMBER' ? 'Сантехник' : 'Электрик'}
      </p>

      {tickets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          У вас пока нет назначенных заявок
        </p>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <strong>Заявка #{ticket.id}</strong>
                  <p style={{ margin: '0.5rem 0', color: '#333' }}>{ticket.description}</p>
                  <small style={{ color: '#666' }}>
                    {ticket.apartament_address || 'Адрес не указан'} • 
                    {' '}{ticket.user_name || 'Житель'} • 
                    {' '}{new Date(ticket.created_at).toLocaleString('ru-RU')}
                  </small>
                </div>
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

              {/* Кнопки изменения статуса */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {ticket.status === 'NEW' && (
                  <button
                    onClick={() => updateStatus(ticket.id, 'IN_PROGRESS')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Взять в работу
                  </button>
                )}
                {ticket.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateStatus(ticket.id, 'RESOLVED')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Выполнено
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}