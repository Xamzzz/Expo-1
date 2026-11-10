import { useState, useEffect } from 'react';

/**
 * Componente 2: FormularioProducto
 * Maneja el estado local de las cajas de texto (nombre, precio, cantidad) con useState.
 * Permite tanto CREAR un producto nuevo (POST) como ACTUALIZAR uno existente (PUT) de la API.
 */
function FormularioProducto({
  onAgregarProducto,
  onActualizarProducto,
  productoEditando,
  onCancelarEdicion,
}) {
  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Si el usuario selecciona un producto para editar, cargamos sus datos en las cajas de texto
  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(String(productoEditando.precio));
      setCantidad(String(productoEditando.cantidad));
    } else {
      setNombre('');
      setPrecio('');
      setCantidad('');
    }
  }, [productoEditando]);

  const manejarEnvio = (evento) => {
    // Evita que el navegador recargue la página
    evento.preventDefault();

    if (!nombre.trim() || !precio || !cantidad) {
      alert('Por favor completa todos los campos del producto.');
      return;
    }

    const datosProducto = {
      nombre: nombre.trim(),
      precio: Number(precio),
      cantidad: Number(cantidad),
    };

    if (productoEditando) {
      // Ejecuta el endpoint PUT /productos/{id}
      onActualizarProducto(productoEditando.id, datosProducto);
    } else {
      // Ejecuta el endpoint POST /productos
      onAgregarProducto(datosProducto);
    }

    // Limpiamos las cajas de texto después de guardar
    setNombre('');
    setPrecio('');
    setCantidad('');
  };

  return (
    <section className="tarjeta">
      <h2>{productoEditando ? `✏️ Editar Producto #${productoEditando.id}` : '➕ Agregar Producto'}</h2>
      <p className="descripcion-seccion">
        {productoEditando ? (
          <>
            Consumiendo endpoint <code>PUT /productos/{productoEditando.id}</code>
          </>
        ) : (
          <>
            Consumiendo endpoint <code>POST /productos</code> con <code>useState</code>
          </>
        )}
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

        <div className="botones-formulario">
          <button type="submit" className="btn-guardar">
            {productoEditando ? '💾 Actualizar Producto (PUT)' : '💾 Guardar Producto (POST)'}
          </button>

          {productoEditando && (
            <button
              type="button"
              className="btn-cancelar-edicion"
              onClick={onCancelarEdicion}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default FormularioProducto;
