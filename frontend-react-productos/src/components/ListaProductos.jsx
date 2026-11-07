/**
 * Componente 3: ListaProductos
 * Recibe el arreglo de productos por props y los muestra en tarjetas individuales usando .map().
 */
function ListaProductos({ productos, onEliminarProducto }) {
  return (
    <section className="tarjeta">
      <div className="cabecera-tabla">
        <h2>📋 Catálogo de Productos ({productos.length})</h2>
        <span className="etiqueta-codigo">Componente ListaProductos.jsx</span>
      </div>

      {productos.length === 0 ? (
        <p className="mensaje-vacio">No hay productos registrados en este momento.</p>
      ) : (
        <div className="grid-tarjetas-productos">
          {productos.map((prod) => (
            <article key={prod.id} className="tarjeta-producto">
              <div className="tarjeta-producto-top">
                <span className="id-pill">ID #{prod.id}</span>
                <span className="stock-pill">📦 {prod.cantidad} en stock</span>
              </div>

              <h3 className="tarjeta-producto-nombre">{prod.nombre}</h3>

              <div className="tarjeta-producto-precio">
                ${Number(prod.precio).toLocaleString('es-CO')} <small>COP</small>
              </div>

              <div className="tarjeta-producto-acciones">
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => onEliminarProducto(prod.id)}
                  title="Eliminar producto"
                >
                  🗑️ Eliminar producto
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaProductos;
