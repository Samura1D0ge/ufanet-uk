import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function CreateNews() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    audience: 'ALL',
    house: '',
  });
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/properties/houses/')
      .then((res) => {
        const data = res.data.results || res.data;
        setHouses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Ошибка загрузки домов:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        content: form.content,
        audience: form.audience,
        house: form.audience === 'HOUSE' && form.house ? form.house : null,
      };

      await client.post('/news/', payload);
      setSuccess('Новость успешно создана!');
      setTimeout(() => navigate('/news'), 1500);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.title?.[0] || 
                  err.response?.data?.content?.[0] || 
                  'Ошибка создания новости';
      setError(msg);
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Создать новость</h1>
      
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          background: '#d4edda', 
          color: '#155724', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Заголовок *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="Введите заголовок новости"
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Содержание *
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows="8"
          required
          placeholder="Введите текст новости"
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Аудитория *
        </label>
        <select
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value })}
          style={inputStyle}
        >
          <option value="ALL">Всем жителям</option>
          <option value="HOUSE">Жителям конкретного дома</option>
        </select>

        {form.audience === 'HOUSE' && (
          <>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Выберите дом *
            </label>
            <select
              value={form.house}
              onChange={(e) => setForm({ ...form, house: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">-- Выберите дом --</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.city}, {house.street}, {house.building_number}
                </option>
              ))}
            </select>
          </>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: loading ? '#999' : '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/news')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}