import '../styles/Register.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');

  const handleRegistro = async () => {
  if (!nombre.trim() || !email.trim() || !contraseña.trim()) {
    alert('Por favor, completa todos los campos');
    return;
  }

  try {
    const res = await axios.post('https://backendcinema-production.up.railway.app/api/usuarios', {
      nombre,
      email,
      contraseña,
    });

    console.log('Usuario creado:', res.data);
    setMensajeExito('Cuenta creada exitosamente');
    setTimeout(() => {
      setMensajeExito('');
      navigate('/login');
    }, 3000);
  } catch (error) {
    console.error('Error en el registro:', error.response?.data || error);
    alert('Error al crear cuenta');
  }
};

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-icon">
          <FaUser className="login-icon-image" />
        </div>
        <h2>Crear Cuenta</h2>

        <div className="register-field">
          <FaUser className="register-icon-input" />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="register-field">
          <FaEnvelope className="register-icon-input" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="register-field">
          <FaLock className="register-icon-input" />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <button className="register-button" onClick={handleRegistro}>
          Registrarse
        </button>
        <p className="register-link-text">
          ¿Ya tienes una cuenta?{' '}
          <span className="register-link" onClick={() => navigate('/login')}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
      {mensajeExito && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 999
        }}>
          ✅ {mensajeExito}
        </div>
      )}
    </div>
  );
}

export default Register;