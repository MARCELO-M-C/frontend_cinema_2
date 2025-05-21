import '../styles/Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://backendcinema-production.up.railway.app/api/usuarios/login', {
        email,
        contraseña,
      });

      const { token, usuario } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (usuario.tipo === 'admin') {
        navigate('/AdminDashboard'); 
      } else {
        navigate('/cartelera');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error);
      alert('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <FaUser className="login-icon-image" />
        </div>

        <div className="login-field">
          <FaUser className="login-icon-input" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <FaLock className="login-icon-input" />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <div className="login-options"></div>

        <button className="login-button" onClick={handleLogin}>
          INICIAR SESIÓN
        </button>
        <p className="login-link-text">
            ¿No tienes una cuenta aún?{' '}
            <span className="login-link" onClick={() => navigate('/register')}>
              Regístrate aquí
            </span>
          </p>
      </div>
    </div>
  );
}

export default Login;