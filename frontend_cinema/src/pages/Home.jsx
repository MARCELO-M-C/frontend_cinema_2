import { useNavigate } from 'react-router-dom'; // opcional si querés separar estilos
import logo from '../assets/logo_principal.jpg'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <img
            src={logo}
            alt="Logo Cine Virtual"
            style={{ width: '100px', marginBottom: '20px' }}
/>
    <h1>Cine Digital</h1>
      <div style={{
        display: 'inline-block',
        padding: '3rem',
        border: '2px solid #aaa',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
        color: '#fff',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'        
      }}>
        <h2 style={{ color: '#000' }}>¡Bienvenido!</h2>
        <p style={{ color: '#000' }}>Inicia sesión o regístrate para reservar tus entradas</p>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#6a0dad',
            color: '#fff',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            borderRadius: '5px'
          }}
        >
          Crear Cuenta
        </button>
        <p style={{ marginTop: '1rem', color: '#888' }}>
          Las mejores películas en la mejor experiencia
        </p>
      </div>
    </div>
  );
}

export default Home;