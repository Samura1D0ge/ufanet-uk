import { useEffect, useState } from 'react';
import client from '../api/client';

export default function DispatcherDashboard() {
  const [tickets, setTickets] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    client.get('/tickets/')
      .then(({ data }) => {
        setTickets(data.results || data);
        setLoading(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateTicket = async (ticketId, updates) => {
    try {
      await client.patch(`/tickets/${ticketId}/`, updates);
      setTickets(tickets.map(t => 
        t.id === ticketId ? { ...t, ...updates } : t
      ));
    } catch (error) {
      alert('Ошибка обновления');
    }
  };

  const statusColors = {
    NEW: '#ffc107',
    IN_PROGRESS: '#17a2b8',
    RESOLVED: '#28a745',
    REJECTED: '#dc3545',
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  if (loading) return <div style={{ padding: '2rem' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Панель диспетчера</h1>
      
      {/* Фильтры */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === status ? '#1a1a2e' : '#ddd',
              color: filter === status ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: filter === status ? '600' : '400',
            }}
          >
            {status === 'ALL' ? 'Все заявки' : 
             status === 'NEW' ? '🆕 Новые' : 
             status === 'IN_PROGRESS' ? '⚙️ В работе' : '✅ Выполненные'}
          </button>
        ))}
      </div>

      {/* Список заявок */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>Заявка #{ticket.id}</strong>
                <p style={{ margin: '0.5rem 0', color: '#333' }}>{ticket.description}</p>
                <p style={{ margin: '0.5rem 0', color: '#28a745', fontWeight: '500' }}>
                  📍 {ticket.apartament_address || 'Адрес не указан'}
                </p>
                <p style={{ margin: '0.5rem 0', color: '#17a2b8' }}>
                  📞 {ticket.user_phone || 'Телефон не указан'}
                </p>
                <small style={{ color: '#666' }}>
                  {ticket.category === 'PLUMBING' ? '🔧 Сантехника' : '⚡ Электрика'} • 
                  {' '}{ticket.user_name || 'Житель'} •
                  {' '}{new Date(ticket.created_at).toLocaleString('ru-RU')}
                </small>
              </div>
              <span style={{
                background: statusColors[ticket.status] || '#ccc',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontWeight: '600',
              }}>
                {ticket.status_display || ticket.status}
              </span>
            </div>

            {/* Управление */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center', 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #eee',
              flexWrap: 'wrap',
            }}>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>
                Назначить исполнителя:
              </label>
              <select
                value={ticket.assigned_to || ''}
                onChange={(e) => updateTicket(ticket.id, { assigned_to: e.target.value || null })}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minWidth: '200px',
                }}
              >
                <option value="">Не назначен</option>
                {/* Здесь должен быть список работников */}
                <option value="1">Иванов (Сантехник)</option>
                <option value="2">Петров (Электрик)</option>
              </select>

              <select
                value={ticket.status}
                onChange={(e) => updateTicket(ticket.id, { status: e.target.value })}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                }}
              >
                <option value="NEW">Новая</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="RESOLVED">Выполнена</option>
                <option value="REJECTED">Отклонена</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}