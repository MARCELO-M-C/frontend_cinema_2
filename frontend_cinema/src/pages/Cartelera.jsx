import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Cartelera.css';
import { FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Cartelera() {
  const [peliculas, setPeliculas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const res = await axios.get('https://backendcinema-production.up.railway.app/api/peliculas');
        setPeliculas(res.data.peliculas);
      } catch (error) {
        console.error('Error al cargar las películas:', error);
      }
    };
    fetchPeliculas();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="cartelera-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Cine Digital</h2>
        <div className="sidebar-menu">
          <a onClick={() => navigate('/comprar_boleto')}><FaTicketAlt /> Comprar Boleto</a>
        </div>
        <div className="sidebar-menu">
          <a onClick={cerrarSesion}><FaSignOutAlt /> Cerrar Sesión</a>
        </div>
      </aside>

      <main className="cartelera-content">
        <h1 className="titulo">Cartelera</h1>
        <div className="contenedor-peliculas">
          {peliculas.map((p) => (
            <div
              className="card"
              key={p.id}
              style={{ backgroundImage: `url('${p.poster_url}')` }}
            >
              <div className="overlay">
                <h3>{p.titulo}</h3>
                <p>{p.sinopsis}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Cartelera;