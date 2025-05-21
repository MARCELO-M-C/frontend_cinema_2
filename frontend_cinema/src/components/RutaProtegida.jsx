import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, tipoRequerido }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay sesión
  if (!token || !usuario) {
    return <Navigate to="/login" />;
  }

  // Si hay sesión, pero no es del tipo requerido (ej: admin)
  if (tipoRequerido && usuario.tipo !== tipoRequerido) {
    return <Navigate to="/" />;
  }
  
  return children;
}

export default RutaProtegida;