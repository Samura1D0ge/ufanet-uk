import { useState, useEffect } from 'react';
import client from '../api/client';

export default function DispatcherDashboard() {
  const [tickets, setTickets] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [editingTickets, setEditingTickets] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTickets();
    loadWorkers();
  }, []);

  const loadTickets = () => {
    client.get('/tickets/')
      .then((res) => {
        const data = res.data.results || res.data;
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки заявок:', err);
        setLoading(false);
      });
  };

  const loadWorkers = () => {
    client.get('/auth/workers/')
      .then((res) => {
        const data = res.data.results || res.data;
        setWorkers(data);
      })
      .catch(err => console.error('Ошибка загрузки работников:', err));
  };

  const startEditing = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    setEditingTickets({
      ...editingTickets,
      [ticketId]: {
        status: ticket.status,
        assigned_to: ticket.assigned_to,
      }
    });
  };

  const cancelEditing = (ticketId) => {
    const newEditing = { ...editingTickets };
    delete newEditing[ticketId];
    setEditingTickets(newEditing);
  };

  const updateField = (ticketId, field, value) => {
    setEditingTickets({
      ...editingTickets,
      [ticketId]: {
        ...editingTickets[ticketId],
        [field]: value,
      }
    });
  };

  const saveChanges = async (ticketId) => {
    const changes = editingTickets[ticketId];
    if (!changes) return;

    setSaving(true);
    try {
      const { data } = await client.patch(`/tickets/${ticketId}/`, changes);
      setTickets(tickets.map(t => t.id === ticketId ? data : t));
      cancelEditing(ticketId);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = {
    NEW: '#ffc107',
    IN_PROGRESS: '#17a2b8',
    RESOLVED: '#28a745',
    REJECTED: '#dc3545',
  };

  const statusLabels = {
    NEW: 'Новая',
    IN_PROGRESS: 'В работе',
    RESOLVED: 'Выполнена',
    REJECTED: 'Отклонена',
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Панель диспетчера</h1>
      
      {/* Фильтры */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(status => (
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
            {status === 'ALL' ? 'Все' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Список заявок */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTickets.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Нет заявок</p>
        ) : (
          filteredTickets.map((ticket) => {
            const isEditing = editingTickets[ticket.id];
            const editData = isEditing || { status: ticket.status, assigned_to: ticket.assigned_to };

            return (
              <div key={ticket.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${statusColors[ticket.status] || '#ccc'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Заявка #{ticket.id}</strong>
                    <p style={{ margin: '0.5rem 0', color: '#333' }}>{ticket.description}</p>
                    <p style={{ margin: '0.5rem 0', color: '#28a745', fontWeight: '500' }}>
                       {ticket.apartament_address || 'Адрес не указан'}
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
                    {statusLabels[ticket.status]}
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
                    Исполнитель:
                  </label>
                  <select
                    value={editData.assigned_to || ''}
                    onChange={(e) => updateField(ticket.id, 'assigned_to', e.target.value || null)}
                    disabled={!isEditing}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minWidth: '200px',
                      opacity: isEditing ? 1 : 0.7,
                    }}
                  >
                    <option value="">Не назначен</option>
                    {workers
                      .filter(w => 
                        (ticket.category === 'PLUMBING' && w.role === 'PLUMBER') ||
                        (ticket.category === 'ELECTRICAL' && w.role === 'ELECTRICIAN')
                      )
                      .map(worker => (
                        <option key={worker.id} value={worker.id}>
                          {worker.first_name} {worker.last_name} ({worker.role === 'PLUMBER' ? 'Сантехник' : 'Электрик'})
                        </option>
                      ))
                    }
                  </select>

                  <label style={{ fontSize: '0.9rem', color: '#666', marginLeft: 'auto' }}>
                    Статус:
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) => updateField(ticket.id, 'status', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      opacity: isEditing ? 1 : 0.7,
                    }}
                  >
                    <option value="NEW">Новая</option>
                    <option value="IN_PROGRESS">В работе</option>
                    <option value="RESOLVED">Выполнена</option>
                    <option value="REJECTED">Отклонена</option>
                  </select>

                  {!isEditing ? (
                    <button
                      onClick={() => startEditing(ticket.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      ✏️ Редактировать
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => saveChanges(ticket.id)}
                        disabled={saving}
                        style={{
                          padding: '0.5rem 1rem',
                          background: saving ? '#999' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        {saving ? 'Сохранение...' : '💾 Сохранить'}
                      </button>
                      <button
                        onClick={() => cancelEditing(ticket.id)}
                        disabled={saving}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        ✖️ Отмена
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}