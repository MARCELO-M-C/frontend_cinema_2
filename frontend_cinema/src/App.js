import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cartelera from './pages/Cartelera';
import RutaProtegida from './components/RutaProtegida';

import CrearUsuario from './actions_pages/usuario_crear';
import UsuarioEditar from './actions_pages/usuario_editar';

import PeliculaCrear from './actions_pages/pelicula_crear';
import PeliculaEditar from './actions_pages/pelicula_editar';

import SalaCrear from './actions_pages/sala_crear';
import SalaEditar from './actions_pages/sala_editar';

import FuncionCrear from './actions_pages/funcion_crear';
import FuncionEditar from './actions_pages/funcion_editar';

import ComprarBoleto from './pages/comprar_boleto';

function App() {
  return (
    <Routes>      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/comprar_boleto" element={<ComprarBoleto />} />

      {/* Ruta protegida SOLO para admins */}
      <Route
        path="/AdminDashboard"
        element={
          <RutaProtegida tipoRequerido="admin">
            <AdminDashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/crear-usuario"
        element={
          <RutaProtegida tipoRequerido="admin">
            <CrearUsuario />
          </RutaProtegida>
        }
      />
      <Route
        path="/editar-usuario/:id"
        element={
          <RutaProtegida tipoRequerido="admin">
            <UsuarioEditar />
          </RutaProtegida>
        }
      />
      <Route
        path="/pelicula_crear"
        element={
          <RutaProtegida tipoRequerido="admin">
            <PeliculaCrear />
          </RutaProtegida>
        }
      />
      <Route
        path="/pelicula_editar/:id"
        element={
          <RutaProtegida tipoRequerido="admin">
            <PeliculaEditar />
          </RutaProtegida>
        }
      />
      <Route
        path="/sala_crear"
        element={
          <RutaProtegida tipoRequerido="admin">
            <SalaCrear />
          </RutaProtegida>
        }
      />
      <Route
        path="/sala_editar/:id"
        element={
          <RutaProtegida tipoRequerido="admin">
            <SalaEditar />
          </RutaProtegida>
        }
      />
      <Route
        path="/funcion_crear"
        element={
          <RutaProtegida tipoRequerido="admin">
            <FuncionCrear />
          </RutaProtegida>
        }
      />
      <Route
        path="/funcion_editar/:id"
        element={
          <RutaProtegida tipoRequerido="admin">
            <FuncionEditar />
          </RutaProtegida>
        }
      />   
      
      {/* Ruta protegida SOLO para clientes */}
      <Route
        path="/cartelera"
        element={
          <RutaProtegida tipoRequerido="cliente">
            <Cartelera />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}

export default App;
