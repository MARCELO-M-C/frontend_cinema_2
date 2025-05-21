import { QRCodeCanvas } from 'qrcode.react';
import '../styles/qr_modal.css';

function QRModal({ datos, onClose }) {
  const { nombre, funcion, butacas } = datos;
  const fechaFormateada = new Date(funcion.fecha).toISOString().split('T')[0];
  const contenido = `
    Reserva a nombre de: ${nombre}
    Película: ${funcion.pelicula?.titulo || 'Sin título'}
    Fecha: ${fechaFormateada} - Hora: ${funcion.hora}    
    Butacas: ${butacas.map(b => `F${b.fila + 1}-C${b.columna + 1}`).join(', ')}
    `.trim();

  return (
    <div className="qr-modal-overlay">
      <div className="qr-modal-content">
        <button className="qr-modal-close" onClick={onClose}>×</button>
        <h3>Escanea el código</h3>
        <QRCodeCanvas value={contenido} size={200} />
      </div>
    </div>
  );
}

export default QRModal;