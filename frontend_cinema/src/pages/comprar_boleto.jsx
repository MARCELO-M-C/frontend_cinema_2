import React, { useState, useEffect } from 'react';
import QRModal from './QRModal';
import '../styles/comprar_boleto.css';

function ComprarBoleto() {
  const [funciones, setFunciones] = useState([]);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  const [butacas, setButacas] = useState([]);
  const [butacasSeleccionadas, setButacasSeleccionadas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [datosQR, setDatosQR] = useState(null);
  const [nombreReserva, setNombreReserva] = useState('');

  useEffect(() => {
  fetch('https://backendcinema-production.up.railway.app/api/funciones')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setFunciones(data);
      } else if (Array.isArray(data.funciones)) {
        setFunciones(data.funciones);
      } else {
        console.error('Formato inesperado de respuesta:', data);
      }
    })
    .catch(err => console.error('Error cargando funciones', err));
}, []);

  const cargarButacas = async (funcionId) => {
    const funcion = funciones.find(f => f.id === parseInt(funcionId));
    if (!funcion) return;

    setFuncionSeleccionada(funcion);
    setMostrarFormulario(false);
    setButacasSeleccionadas([]);

    const sala = funcion.sala;
    const totalFilas = sala.filas;
    const totalColumnas = sala.columnas;

    const res = await fetch(`https://backendcinema-production.up.railway.app/api/reservas/todas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    const todasLasReservas = Array.isArray(data.reservas) ? data.reservas : [];

    const reservadas = todasLasReservas.filter(
      r => r.funcion_id === funcion.id
    );

    const nuevasButacas = [];
    for (let fila = 0; fila < totalFilas; fila++) {
      for (let columna = 0; columna < totalColumnas; columna++) {
        const ocupada = reservadas.find(b => b.fila === fila && b.columna === columna);
        nuevasButacas.push({
          fila,
          columna,
          estado: ocupada ? 'reservado' : 'disponible'
        });
      }
    }

    setButacas(nuevasButacas);
  };

  const manejarSeleccion = (fila, columna) => {
    const index = butacas.findIndex(b => b.fila === fila && b.columna === columna);
    if (butacas[index].estado === 'reservado') return;

    const actualizado = [...butacas];
    if (actualizado[index].estado === 'disponible') {
      actualizado[index].estado = 'seleccionado';
      setButacasSeleccionadas([...butacasSeleccionadas, { fila, columna }]);
    } else {
      actualizado[index].estado = 'disponible';
      setButacasSeleccionadas(butacasSeleccionadas.filter(
        b => !(b.fila === fila && b.columna === columna)
      ));
    }

    setButacas(actualizado);
    setMostrarFormulario(actualizado.some(b => b.estado === 'seleccionado'));
  };

  const enviarFormulario = async (e) => {
  e.preventDefault();

  const form = e.target;
  const tarjeta = form.tarjeta.value.trim();
  const caducidad = form.caducidad.value.trim();
  const cvv = form.cvv.value.trim();
  const nombre = form.nombre.value.trim();

  if (!tarjeta || !caducidad || !cvv || !nombre) {
    alert('Por favor completa todos los campos del formulario.');
    return;
  }

  // Validaciones adicionales si querés forzarlas aquí también
  const tarjetaValida = /^\d{13,19}$/.test(tarjeta);
  const cvvValido = /^\d{3}$/.test(cvv);

  if (!tarjetaValida) {
    alert('Número de tarjeta inválido. Solo números (13-19 dígitos).');
    return;
  }

  if (!cvvValido) {
    alert('CVV inválido. Debe tener 3 números.');
    return;
  }

  const res = await fetch('https://backendcinema-production.up.railway.app/api/reservas/multiples', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      funcion_id: funcionSeleccionada.id,
      butacas: butacasSeleccionadas
    })
  });

  const data = await res.json();
  if (res.ok) {
    setConfirmado(true);
  } else {
    alert(data.message || 'Error al reservar');
  }
};

const PRECIO_UNITARIO = 480;
const precioTotal = butacasSeleccionadas.length * PRECIO_UNITARIO;

  return (
  <div className="compra-dashboard">
    <div className="compra-content">
      <div className="contenedor-compra">
        <h2>Comprando Boleto</h2>

        <label>Selecciona una función:</label>
        <select onChange={(e) => cargarButacas(e.target.value)} defaultValue="">
          <option value="" disabled>-- Elegir función --</option>
          {funciones.map(funcion => {
            const fechaFormateada = new Date(funcion.fecha).toISOString().split('T')[0];
            const titulo = funcion.pelicula?.titulo || 'Película';
            return (
              <option key={funcion.id} value={funcion.id}>
                {titulo} - {fechaFormateada} {funcion.hora}
              </option>
            );
          })}
        </select>

        <button
          className="boton-regresar"
          onClick={() => window.location.href = '/cartelera'}
          type="button"
        >
          Regresar a Cartelera
        </button>

        {/* grid de butacas */}
        {butacas.length > 0 && (
          <div className="matriz-container">
            <div className="pantalla">PANTALLA</div>
            <div
              className="grid-asientos"
              style={{
                gridTemplateColumns: `repeat(${funcionSeleccionada.sala.columnas}, 40px)`
              }}
            >
              {butacas.map((asiento, index) => (
                <div
                  key={index}
                  className={`asiento ${asiento.estado}`}
                  title={`Fila ${asiento.fila + 1}, Columna ${asiento.columna + 1}`}
                  onClick={() => manejarSeleccion(asiento.fila, asiento.columna)}
                />
              ))}
            </div>
          </div>
        )}

        {/* formulario */}
        {mostrarFormulario && (
          <form className="formulario-pago" onSubmit={enviarFormulario}>
            <h3>Pago de Boleto</h3>
            <div>
              <label>Butacas seleccionadas:</label>
              <input
                type="text"
                readOnly
                value={butacasSeleccionadas
                  .map(b => `F${b.fila + 1}-C${b.columna + 1}`)
                  .join(', ')}
              />
            </div>
            <div>
              <label>Tarjeta:</label>
              <input name="tarjeta" type="text" inputMode="numeric" pattern="\d{13,19}" placeholder="1234-5678-9012-3456"
                  title="Ingresa solo números (13-19 dígitos)"
                  onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  required
                />
            </div>
            <div>
            <div className="input-group">
              <label>Fecha de caducidad:</label>
              <input name="caducidad" type="month" required />
            </div>
            <div className="input-group">
              <label>CVV:</label>
              <input name="cvv" type="text" inputMode="numeric" pattern="\d{3}" maxLength={3} placeholder="123"
                title="CVV debe tener 3 números"
                onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                required
              />
            </div>
              <label>Nombre:</label>
              <input name="nombre" type="text" placeholder="Nombre completo" required
                value={nombreReserva}
                onChange={(e) => setNombreReserva(e.target.value)} />
            </div>
            <div className="grupo-precio">
              <label>Precio:</label>
              <input
                type="text"
                readOnly
                value={`C$ ${precioTotal}`}
                className="input-precio"
              />
            </div>
            <button type="submit">Pagar y Reservar</button>
            {confirmado && (
              <button
                className="boton-qr"
                onClick={() =>
                  setDatosQR({
                    nombre: nombreReserva,
                    funcion: funcionSeleccionada,
                    butacas: butacasSeleccionadas
                  }) || setMostrarQR(true)
                }
                type="button"
              >
                Generar QR
              </button>
            )}
          </form>          
        )}
        {confirmado && (
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
            ✅ Reservas realizadas con éxito
          </div>
        )}
      </div>
    </div>
          {mostrarQR && (
        <QRModal datos={datosQR} onClose={() => setMostrarQR(false)} />
      )}
  </div>
);
}

export default ComprarBoleto;