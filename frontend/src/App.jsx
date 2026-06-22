import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import WorkerTickets from './pages/WorkerTickets';
import DispatcherDashboard from './pages/DispatcherDashboard';
import News from './pages/News';
import CreateNews from './pages/CreateNews';
import PushNotifications from './components/PushNotifications';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <PushNotifications />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={
          <ProtectedRoute><Tickets /></ProtectedRoute>
        } />
        <Route path="/create-ticket" element={
          <ProtectedRoute><CreateTicket /></ProtectedRoute>
        } />
        <Route path="/worker" element={
          <ProtectedRoute><WorkerTickets /></ProtectedRoute>
        } />
        <Route path="/dispatcher" element={
          <ProtectedRoute><DispatcherDashboard /></ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute><News /></ProtectedRoute>
        } />
        <Route path="/create-news" element={
          <ProtectedRoute><CreateNews /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}