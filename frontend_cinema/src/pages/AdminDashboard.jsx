import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaUserCog, FaFilm, FaDoorOpen, FaCalendarAlt, FaClipboardList, FaPlus, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!seccion) return;
  
      try {
        const token = localStorage.getItem('token');
      
        const endpoint = seccion === 'reservaciones'
          ? 'https://backendcinema-production.up.railway.app/api/reservas/todas'
          : `https://backendcinema-production.up.railway.app/api/${seccion}`;
      
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      
        const propiedad = {
          usuarios: 'usuarios',
          peliculas: 'peliculas',
          salas: 'salas',
          funciones: 'funciones',
          reservaciones: 'reservas'
        }[seccion];
      
        const data = res.data[propiedad];
      
        // Aquí está el filtro solo para usuarios
        const datosFiltrados = seccion === 'usuarios'
          ? data.filter((u) => u.activo === 1 || u.activo === true)
          : data;
      
        setDatos(Array.isArray(datosFiltrados) ? datosFiltrados : []);
      } catch (error) {
        console.error(`Error al cargar ${seccion}:`, error);
        setDatos([]);
      } 
    };
  
    fetchData();
  }, [seccion]);

  const renderAcciones = (item) => (
    <td className="acciones">
      {seccion === 'usuarios' && (
        <>
          <button className="btn editar" onClick={() => navigate(`/editar-usuario/${item.id}`)}>
            <FaEdit />
          </button>
          <button
            className="btn eliminar"
            onClick={async () => {
              const confirmado = window.confirm(`¿Estás seguro que deseas eliminar al usuario "${item.nombre}"?`);
              if (confirmado) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`https://backendcinema-production.up.railway.app/api/usuarios/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setDatos((prev) => prev.filter((u) => u.id !== item.id));
                } catch (error) {
                  alert('Error al eliminar usuario');
                }
              }
            }}
          >
            <FaTrash />
          </button>
        </>
      )}
  
      {seccion === 'peliculas' && (
        <>
          <button className="btn editar" onClick={() => navigate(`/pelicula_editar/${item.id}`)}>
            <FaEdit />
          </button>
          <button
            className="btn eliminar"
            onClick={async () => {
              const confirmado = window.confirm(`¿Eliminar la película "${item.titulo}"?`);
              if (confirmado) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`https://backendcinema-production.up.railway.app/api/peliculas/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setDatos((prev) => prev.filter((p) => p.id !== item.id));
                } catch (error) {
                  alert('Error al eliminar película');
                }
              }
            }}
          >
            <FaTrash />
          </button>
        </>
      )}
  
      {seccion === 'salas' && (
        <>
          <button className="btn editar" onClick={() => navigate(`/sala_editar/${item.id}`)}>
            <FaEdit />
          </button>
          <button
            className="btn eliminar"
            onClick={async () => {
              const confirmado = window.confirm(`¿Eliminar la sala "${item.nombre}"?`);
              if (confirmado) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`https://backendcinema-production.up.railway.app/api/salas/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setDatos((prev) => prev.filter((s) => s.id !== item.id));
                } catch (error) {
                  alert('Error al eliminar sala');
                }
              }
            }}
          >
            <FaTrash />
          </button>
        </>
      )}
  
      {seccion === 'funciones' && (
        <>
          <button className="btn editar" onClick={() => navigate(`/funcion_editar/${item.id}`)}>
            <FaEdit />
          </button>
          <button
            className="btn eliminar"
            onClick={async () => {
              const confirmado = window.confirm(`¿Eliminar esta función del sistema?`);
              if (confirmado) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`https://backendcinema-production.up.railway.app/api/funciones/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setDatos((prev) => prev.filter((f) => f.id !== item.id));
                } catch (error) {
                  alert('Error al eliminar función');
                }
              }
            }}
          >
            <FaTrash />
          </button>
        </>
      )}
  
      {seccion === 'reservaciones' && (
        <>          
          <button
            className="btn eliminar"
            onClick={async () => {
              const confirmado = window.confirm(`¿Eliminar esta reservación?`);
              if (confirmado) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`https://backendcinema-production.up.railway.app/api/reservas/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setDatos((prev) => prev.filter((r) => r.id !== item.id));
                } catch (error) {
                  alert('Error al eliminar reservación');
                }
              }
            }}
          >
            <FaTrash />
          </button>
        </>
      )}
    </td>
  );

  const renderUsuarios = () => (
    <>
      <div className="acciones-superiores">
          <button className="btn crear-grande" onClick={() => navigate('/crear-usuario')}>
              <FaPlus /> Crear Usuario
          </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datos.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.tipo}</td>
              {renderAcciones(u)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderPeliculas = () => (
    <>
      <div className="acciones-superiores">
        <button className="btn crear-grande" onClick={() => navigate('/pelicula_crear')}>
          <FaPlus /> Crear Película
        </button>
      </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Duración</th>
          <th>Sinopsis</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {datos.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.titulo}</td>
            <td>{p.duracion} min</td>
            <td>{p.sinopsis}</td>
            {renderAcciones(p)}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );

  const renderSalas = () => (
    <>
      <div className="acciones-superiores">
      <button className="btn crear-grande" onClick={() => navigate('/sala_crear')}>
        <FaPlus /> Crear Sala
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Filas</th>
          <th>Columnas</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {datos.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.nombre}</td>
            <td>{s.filas}</td>
            <td>{s.columnas}</td>
            {renderAcciones(s)}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );

  const renderFunciones = () => (
    <>
      <div className="acciones-superiores">
      <button className="btn crear-grande" onClick={() => navigate('/funcion_crear')}>
        <FaPlus /> Crear Función
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Película</th>
          <th>Sala</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {datos.map((f) => (
          <tr key={f.id}>
            <td>{f.id}</td>
            <td>{f.pelicula?.titulo}</td>
            <td>{f.sala?.nombre}</td>
            <td>{new Date(f.fecha).toLocaleDateString('es-ES')}</td>
            <td>{f.hora}</td>
            {renderAcciones(f)}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );

  const renderReservaciones = () => (
    <>
      <div className="acciones-superiores">
      <button className="btn crear-grande" onClick={() => navigate('/comprar_boleto')}>
        <FaPlus /> Crear Reservación
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Función</th>
          <th>Fila</th>
          <th>Columna</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {datos.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.usuario_nombre}</td>
            <td>{r.funcion_id}</td>
            <td>{r.fila}</td>
            <td>{r.columna}</td>
            {renderAcciones(r)}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );

  const renderContenido = () => {
    switch (seccion) {
      case 'usuarios': return renderUsuarios();
      case 'peliculas': return renderPeliculas();
      case 'salas': return renderSalas();
      case 'funciones': return renderFunciones();
      case 'reservaciones': return renderReservaciones();
      default:
        return (
          <>
            <h1>Panel de Control</h1>
            <p>Selecciona una opción del menú lateral para comenzar.</p>
          </>
        );
    }
  };

  return (
  <div className="admin-dashboard">
    <aside className="sidebar">
      <h2 className="sidebar-title">Administración</h2>
      <nav className="sidebar-menu">
        <a onClick={() => setSeccion('usuarios')}><FaUserCog /> Usuarios</a>
        <a onClick={() => setSeccion('peliculas')}><FaFilm /> Películas</a>
        <a onClick={() => setSeccion('salas')}><FaDoorOpen /> Salas</a>
        <a onClick={() => setSeccion('funciones')}><FaCalendarAlt /> Funciones</a>
        <a onClick={() => setSeccion('reservaciones')}><FaClipboardList /> Reservaciones</a>
        <a onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}><FaSignOutAlt /> Cerrar Sesión</a>

      </nav>   
      
      
    </aside>

    <main className="dashboard-content">
      {renderContenido()}
    </main>
  </div>
);
}

export default AdminDashboard;
