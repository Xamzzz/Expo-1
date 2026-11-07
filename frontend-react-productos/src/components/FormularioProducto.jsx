import { useState } from 'react';

/**
 * Componente 2: FormularioProducto
 * Maneja el estado local de las cajas de texto (nombre, precio, cantidad) con useState
 * y envía el nuevo producto al componente padre (App) mediante la prop onAgregarProducto.
 */
function FormularioProducto({ onAgregarProducto }) {
  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const manejarEnvio = (evento) => {
    // Evita que el navegador recargue la página
    evento.preventDefault();

    if (!nombre.trim() || !precio || !cantidad) {
      alert('Por favor completa todos los campos del producto.');
      return;
    }

    // Enviamos el objeto con el nuevo producto al componente padre (App)
    onAgregarProducto({
      nombre: nombre.trim(),
      precio: Number(precio),
      cantidad: Number(cantidad),
    });

    // Limpiamos las cajas de texto después de guardar
    setNombre('');
    setPrecio('');
    setCantidad('');
  };

  return (
    <section className="tarjeta">
      <h2>➕ Agregar Producto</h2>
      <p className="descripcion-seccion">
        Componente <code>FormularioProducto.jsx</code> — Enlazado con <code>useState</code>.
      </p>

      <form onSubmit={manejarEnvio} className="formulario">
        <label>
          Nombre del producto:
          <input
            type="text"
            placeholder="Ej. Audífonos Bluetooth"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Precio ($ COP):
          <input
            type="number"
            min="1"
            placeholder="Ej. 120000"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </label>

        <label>
          Cantidad en stock:
          <input
            type="number"
            min="0"
            placeholder="Ej. 15"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-guardar">
          💾 Guardar Producto
        </button>
      </form>
    </section>
  );
}

export default FormularioProducto;

