import '../actions_pages_styles/usuario_crear.css';
import { FaUser, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CrearUsuario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [tipo, setTipo] = useState('');
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');

  const handleCrear = async () => {
  if (!nombre.trim() || !email.trim() || !contraseña.trim()) {
    alert('Por favor, completa todos los campos obligatorios');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const nuevoUsuario = {
      nombre,
      email,
      contraseña
    };

    if (tipo.trim()) {
      nuevoUsuario.tipo = tipo.trim();
    }

    await axios.post('https://backendcinema-production.up.railway.app/api/usuarios', nuevoUsuario, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMensajeExito('Usuario creado exitosamente');
    setTimeout(() => {
      setMensajeExito('');
      navigate('/AdminDashboard');
    }, 3000);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    alert('Error al crear usuario');
  }
};

  return (
    <div className="usuario-crear-page">
      <div className="usuario-crear-card">
        <h2>Crear Usuario</h2>

        <div className="usuario-crear-field">
          <FaUser className="usuario-crear-icon" />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="usuario-crear-field">
          <FaEnvelope className="usuario-crear-icon" />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="usuario-crear-field">
          <FaLock className="usuario-crear-icon" />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <div className="usuario-crear-field">
          <FaUserShield className="usuario-crear-icon" />
          <input
            type="text"
            placeholder="Tipo de usuario (opcional)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </div>

        <p className="usuario-crear-hint">
          Escribir <strong>'admin'</strong> si se va a crear otro usuario de tipo Administrador. Sino, dejar el campo vacío.
        </p>

        <button className="usuario-crear-button" onClick={handleCrear}>
          Crear Usuario
        </button>
        <button className="usuario-volver-button" onClick={() => navigate('/AdminDashboard')}>
          Volver al Panel de Control
        </button>
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

export default CrearUsuario;