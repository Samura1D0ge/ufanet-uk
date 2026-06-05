import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    client.get('/auth/me/')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
        setUser(null);
    navigate('/login', { replace: true });
    window.location.href = '/login';
  };

  if (!user) return null;

  // Определяем, какой пункт меню показать
  let menuItems = [];
  
  if (user.role === 'RESIDENT') {
    menuItems = [
      { to: '/tickets', label: 'Мои заявки' },
      { to: '/create-ticket', label: 'Создать заявку' },
    ];
  } else if (user.role === 'PLUMBER' || user.role === 'ELECTRICIAN') {
    menuItems = [
      { to: '/worker', label: 'Мои заявки' },
    ];
  } else if (user.role === 'DISPATCHER' || user.role === 'ADMIN') {
    menuItems = [
      { to: '/dispatcher', label: 'Панель диспетчера' },
    ];
  }

  return (
    <nav style={{
      background: '#1a1a2e',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {menuItems.map(item => (
          <Link 
            key={item.to} 
            to={item.to} 
            style={{ color: 'white', textDecoration: 'none' }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
          {user.first_name} {user.last_name} ({user.role})
        </span>
        <button onClick={handleLogout} style={{
          background: '#e94560',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Выйти
        </button>
      </div>
    </nav>
  );
}