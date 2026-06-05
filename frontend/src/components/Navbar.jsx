import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (!token) return null;

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
        <Link to="/tickets" style={{ color: 'white', textDecoration: 'none' }}>Заявки</Link>
        <Link to="/create-ticket" style={{ color: 'white', textDecoration: 'none' }}>Создать заявку</Link>
      </div>
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
    </nav>
  );
}