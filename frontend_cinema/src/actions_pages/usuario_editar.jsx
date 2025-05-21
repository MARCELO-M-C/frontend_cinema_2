import '../actions_pages_styles/usuario_editar.css';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UsuarioEditar() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://backendcinema-production.up.railway.app/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setNombre(res.data.nombre ?? '');
      setEmail(res.data.email ?? '');
      setTipo(res.data.tipo ?? '');
    };
  
    obtenerUsuario();
  }, [id]);

  const handleEditar = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`https://backendcinema-production.up.railway.app/api/usuarios/${id}`, {
        nombre,
        email,
        tipo, 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensajeExito('Usuario actualizado exitosamente');
      setTimeout(() => {
        setMensajeExito('');
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al editar usuario:', error);
      alert('Error al editar usuario');
    }
  };

  return (
    <div className="usuario-editar-page">
      <div className="usuario-editar-card">
        <h2>Editar Usuario</h2>

        <div className="usuario-editar-field">
          <FaUser className="usuario-editar-icon" />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="usuario-editar-field">
          <FaEnvelope className="usuario-editar-icon" />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="usuario-editar-button" onClick={handleEditar}>
          Guardar Cambios
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

export default UsuarioEditar;