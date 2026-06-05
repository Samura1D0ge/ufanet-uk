import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function CreateTicket() {
  const [form, setForm] = useState({
    category: 'PLUMBING',
    description: '',
    priority: 'MEDIUM',
    apartament: '',
  });
  const [apartments, setApartments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      client.get('/auth/me/'),
      client.get('/properties/apartments/'),
    ])
      .then(([profileRes, apartmentsRes]) => {
        setUserProfile(profileRes.data);
        setApartments(apartmentsRes.data);
        if (profileRes.data.apartament) {
          setForm(prev => ({...prev, apartament: profileRes.data.apartament}));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/tickets/', form);
      navigate('/tickets');
    } catch (err) {
      const msg = err.response?.data?.description?.[0] || 'Ошибка создания заявки';
      setError(msg);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  };

  if (loading) return <div style={{ padding: '2rem' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Новая заявка</h1>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        {/* Выбор квартиры */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Ваша квартира *
        </label>
        <select
          value={form.apartament || ''}
          onChange={(e) => setForm({...form, apartament: e.target.value})}
          required
          style={inputStyle}
        >
          <option value="">Выберите квартиру</option>
          {apartments.map(apt => (
            <option key={apt.id} value={apt.id}>
              {apt.full_address || `Квартира ${apt.number}`}
            </option>
          ))}
        </select>

        {/* Категория */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Категория</label>
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} style={inputStyle}>
          <option value="PLUMBING">Сантехника</option>
          <option value="ELECTRICAL">Электрика</option>
        </select>

        {/* Приоритет */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Приоритет</label>
        <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} style={inputStyle}>
          <option value="LOW">Низкий</option>
          <option value="MEDIUM">Средний</option>
          <option value="HIGH">Высокий</option>
        </select>

        {/* Описание */}
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Описание проблемы</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          rows="5"
          required
          placeholder="Опишите проблему подробно (минимум 10 символов)"
          style={inputStyle}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{
            flex: 1,
            padding: '0.75rem',
            background: '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>
            Создать заявку
          </button>
          <button type="button" onClick={() => navigate('/tickets')} style={{
            padding: '0.75rem 1.5rem',
            background: '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}