/**
 * Componente 1: Encabezado
 * Muestra el título de la aplicación, el botón para cambiar entre Modo Claro / Modo Oscuro
 * y el estado/selector de conexión con la API REST.
 */
function Encabezado({
  conectadoApi,
  mensajeEstado,
  apiUrl,
  onCambiarApi,
  onReconectar,
  modoOscuro,
  onAlternarModoOscuro,
}) {
  return (
    <header className="encabezado">
      <div>
        <h1>📦 Gestión de Productos — Frontend con React</h1>
        <p className="subtitulo">SENA · Tecnólogo ADSO · Tema 5 (React + Vite + Hooks)</p>
      </div>

      <div className="panel-conexion">
        <div className="fila-controles-superiores">
          <span className={`badge ${conectadoApi ? 'badge-online' : 'badge-local'}`}>
            {conectadoApi ? '🟢 ' : '🟡 '}
            {mensajeEstado}
          </span>

          {/* Botón que ejecuta la función para activar/desactivar el Modo Oscuro */}
          <button
            type="button"
            className="btn-modo-oscuro"
            onClick={onAlternarModoOscuro}
            title="Cambiar entre modo claro y modo oscuro"
          >
            {modoOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </div>

        <div className="selector-api">
          <label htmlFor="select-api">Backend API:</label>
          <select
            id="select-api"
            value={apiUrl}
            onChange={(e) => onCambiarApi(e.target.value)}
          >
            <option value="http://localhost:3000/productos">
              Node.js + Express (localhost:3000)
            </option>
            <option value="http://localhost:8080/productos">
              Java + Spring Boot (localhost:8080)
            </option>
          </select>

          <button
            type="button"
            className="btn-recargar"
            onClick={onReconectar}
            title="Reintentar conexión con la API"
          >
            🔄 Reconectar
          </button>
        </div>
      </div>
    </header>
  );
}

export default Encabezado;
