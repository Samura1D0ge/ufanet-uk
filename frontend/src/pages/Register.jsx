import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

export default function Register() {
  const [form, setForm] = useState({
    phone: '', first_name: '', last_name: '',
    password: '', password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/auth/register/', form);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.phone?.[0] || 
                  err.response?.data?.password?.[0] || 
                  'Ошибка регистрации';
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Регистрация</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Телефон (+7999...)" value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Имя" value={form.first_name}
            onChange={(e) => setForm({...form, first_name: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Фамилия" value={form.last_name}
            onChange={(e) => setForm({...form, last_name: e.target.value})} required style={inputStyle} />
          <input type="password" placeholder="Пароль" value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})} required style={inputStyle} />
          <input type="password" placeholder="Повторите пароль" value={form.password2}
            onChange={(e) => setForm({...form, password2: e.target.value})} required style={inputStyle} />
          <button type="submit" style={{
            width: '100%',
            padding: '0.75rem',
            background: '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>
            Зарегистрироваться
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}