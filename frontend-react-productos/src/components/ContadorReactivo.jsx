import { useState } from 'react';

/**
 * Componente de la actividad práctica ("Ahora háganlo ustedes" - 6 min)
 * Meta: Que los compañeros creen un componente con useState y vean cómo cambia
 * la vista automáticamente cuando cambian los datos (reactividad).
 */
function ContadorReactivo() {
  // 1. Creamos el estado inicializado en 0
  const [unidades, setUnidades] = useState(0);

  return (
    <div className="caja-reactividad">
      <div>
        <h3>⚡ Prueba de Reactividad en vivo (Ejercicio para compañeros)</h3>
        <p>
          Unidades seleccionadas en el carrito: <strong className="numero-destacado">{unidades}</strong>
        </p>
      </div>

      {/* 2. Al hacer clic, cambiamos el estado con setUnidades y React actualiza la vista solo */}
      <div className="botones-reactividad">
        <button
          type="button"
          className="btn-accion"
          onClick={() => setUnidades(unidades + 1)}
        >
          ➕ Agregar unidad
        </button>
        <button
          type="button"
          className="btn-accion btn-secundario"
          onClick={() => setUnidades(unidades > 0 ? unidades - 1 : 0)}
        >
          ➖ Quitar unidad
        </button>
        <button
          type="button"
          className="btn-accion btn-reiniciar"
          onClick={() => setUnidades(0)}
        >
          🔄 Reiniciar
        </button>
      </div>
    </div>
  );
}

export default ContadorReactivo;

