import '../actions_pages_styles/sala_crear.css';
import { FaChair, FaThLarge, FaKeyboard } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SalaCrear() {
  const [nombre, setNombre] = useState('');
  const [filas, setFilas] = useState('');
  const [columnas, setColumnas] = useState('');
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');

  const handleCrear = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('https://backendcinema-production.up.railway.app/api/salas', {
        nombre,
        filas,
        columnas
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensajeExito('Sala creada exitosamente');
      setTimeout(() => {
        setMensajeExito('');
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al crear sala:', error);
      alert('Error al crear sala');
    }
  };

  return (
    <div className="sala-crear-page">
      <div className="sala-crear-card">
        <h2>Crear Sala</h2>

        <div className="sala-crear-field">
          <FaKeyboard className="sala-crear-icon" />
          <input
            type="text"
            placeholder="Nombre de la sala"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="sala-crear-field">
          <FaThLarge className="sala-crear-icon" />
          <input
            type="number"
            placeholder="Número de filas"
            value={filas}
            onChange={(e) => setFilas(e.target.value)}
          />
        </div>

        <div className="sala-crear-field">
          <FaChair className="sala-crear-icon" />
          <input
            type="number"
            placeholder="Número de columnas"
            value={columnas}
            onChange={(e) => setColumnas(e.target.value)}
          />
        </div>

        <button className="sala-crear-button" onClick={handleCrear}>
          Crear Sala
        </button>
        <button className="sala-volver-button" onClick={() => navigate('/AdminDashboard')}>
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

export default SalaCrear;