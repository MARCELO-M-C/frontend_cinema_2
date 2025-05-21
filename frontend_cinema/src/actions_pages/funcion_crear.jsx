import '../actions_pages_styles/funcion_crear.css';
import { FaFilm, FaVideo, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FuncionCrear() {
  const [peliculaId, setPeliculaId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 8);
  const max = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resPeliculas, resSalas] = await Promise.all([
        axios.get('https://backendcinema-production.up.railway.app/api/peliculas', config),
        axios.get('https://backendcinema-production.up.railway.app/api/salas', config)
      ]);

      setPeliculas(resPeliculas.data.peliculas ?? []);
      setSalas(resSalas.data.salas ?? []);
    };

    cargarDatos();
  }, []);

  const handleCrear = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('https://backendcinema-production.up.railway.app/api/funciones', {
        pelicula_id: peliculaId,
        sala_id: salaId,
        fecha,
        hora
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensajeExito('Función creada exitosamente');
      setTimeout(() => {
        setMensajeExito('');
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al crear función:', error);
      alert('Error al crear función');
    }
  };

  return (
    <div className="funcion-crear-page">
      <div className="funcion-crear-card">
        <h2>Crear Función</h2>

        <div className="funcion-crear-field">
          <FaFilm className="funcion-crear-icon" />
          <select value={peliculaId} onChange={(e) => setPeliculaId(e.target.value)}>
            <option value="">Seleccionar Película</option>
            {peliculas.map(p => (
              <option key={p.id} value={p.id}>{p.titulo}</option>
            ))}
          </select>
        </div>

        <div className="funcion-crear-field">
          <FaVideo className="funcion-crear-icon" />
          <select value={salaId} onChange={(e) => setSalaId(e.target.value)}>
            <option value="">Seleccionar Sala</option>
            {salas.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div className="funcion-crear-field">
          <FaCalendarAlt className="funcion-crear-icon" />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={today}
            max={max}
          />
        </div>

        <div className="funcion-crear-field">
          <FaClock className="funcion-crear-icon" />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <button className="funcion-crear-button" onClick={handleCrear}>
          Crear Función
        </button>
        <button className="funcion-volver-button" onClick={() => navigate('/AdminDashboard')}>
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

export default FuncionCrear;