import '../actions_pages_styles/sala_editar.css';
import { FaChair, FaThLarge, FaKeyboard } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SalaEditar() {
  const [nombre, setNombre] = useState('');
  const [filas, setFilas] = useState('');
  const [columnas, setColumnas] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const obtenerSala = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://backendcinema-production.up.railway.app/api/salas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Sala recibida:", res.data);

        const datos = res.data.sala; 

        setNombre(datos.nombre ?? '');
        setFilas(datos.filas !== undefined && datos.filas !== null ? String(datos.filas) : '');
        setColumnas(datos.columnas !== undefined && datos.columnas !== null ? String(datos.columnas) : '');

      } catch (error) {
        console.error('Error al obtener sala:', error);
        alert('Error al cargar los datos de la sala');
      }
    };

    obtenerSala();
  }, [id]);

  const handleEditar = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`https://backendcinema-production.up.railway.app/api/salas/${id}`, {
        nombre,
        filas: parseInt(filas),
        columnas: parseInt(columnas)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensajeExito('Sala actualizada correctamente');
      setTimeout(() => {
        setMensajeExito('');
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al editar sala:', error);
      alert('Error al editar sala');
    }
  };

  return (
    <div className="sala-editar-page">
      <div className="sala-editar-card">
        <h2>Editar Sala</h2>

        <div className="sala-editar-field">
          <FaKeyboard className="sala-editar-icon" />
          <input
            type="text"
            placeholder="Nombre de la sala"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="sala-editar-field">
          <FaThLarge className="sala-editar-icon" />
          <input
            type="number"
            placeholder="Número de filas"
            value={filas}
            onChange={(e) => setFilas(e.target.value)}
          />
        </div>

        <div className="sala-editar-field">
          <FaChair className="sala-editar-icon" />
          <input
            type="number"
            placeholder="Número de columnas"
            value={columnas}
            onChange={(e) => setColumnas(e.target.value)}
          />
        </div>

        <button className="sala-editar-button" onClick={handleEditar}>
          Guardar Cambios
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

export default SalaEditar;