import { useState, useEffect } from 'react';
import Encabezado from './components/Encabezado.jsx';
import ContadorReactivo from './components/ContadorReactivo.jsx';
import FormularioProducto from './components/FormularioProducto.jsx';
import ListaProductos from './components/ListaProductos.jsx';
import './App.css';

// URL por defecto apuntando al Tema 1: API REST conectada a Base de Datos SQL (puerto 8080)
const API_URL_DEFAULT = 'http://localhost:8080/productos';

/**
 * Componente Principal: App
 * Consume los 4 endpoints del CRUD del Tema 1 (Con Base de Datos SQL - puerto 8080)
 * y Tema 3 (En Memoria - puerto 3000), sin ningún dato quemado en memoria en el Frontend:
 * 1. GET    /productos      -> SELECT de la Base de Datos (useEffect)
 * 2. POST   /productos      -> INSERT en la Base de Datos
 * 3. PUT    /productos/{id} -> UPDATE en la Base de Datos
 * 4. DELETE /productos/{id} -> DELETE en la Base de Datos
 */
function App() {
  // 1. ESTADOS PRINCIPALES (useState) -> Inicia vacío, se llena desde la Base de Datos
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [apiUrl, setApiUrl] = useState(API_URL_DEFAULT);
  const [conectadoApi, setConectadoApi] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('Conectando a la Base de Datos...');

  // Función para activar o desactivar el modo oscuro
  const alternarModoOscuro = () => {
    const nuevoModo = !modoOscuro;
    setModoOscuro(nuevoModo);
    document.body.classList.toggle('tema-oscuro', nuevoModo);
  };

  // 2. EFECTO (useEffect) -> Consulta la Base de Datos al iniciar y sincroniza en vivo cada 1.5s
  useEffect(() => {
    obtenerProductos(apiUrl);

    const intervaloSincronizacion = setInterval(() => {
      obtenerProductos(apiUrl, true);
    }, 1500);

    return () => clearInterval(intervaloSincronizacion);
  }, [apiUrl]);

  // ENDPOINT 1: GET /productos -> Consultar registros desde la API / Base de Datos
  const obtenerProductos = async (urlDestino, silencioso = false) => {
    try {
      const respuesta = await fetch(urlDestino, { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('Respuesta no válida del servidor');
      const datos = await respuesta.json();
      setProductos(datos);
      setConectadoApi(true);
      const tipoAlmacenamiento = urlDestino.includes('8080')
        ? 'MySQL Workbench (db_inventario.producto - :8080)'
        : 'Lista en Memoria (Tema 3 - :3000)';
      setMensajeEstado(`Conectado a ${tipoAlmacenamiento}`);
    } catch (error) {
      if (!silencioso) {
        console.error('No se pudo conectar con la API:', error.message);
        setProductos([]);
      }
      setConectadoApi(false);
      setMensajeEstado('API desconectada (Ejecuta npm run dev)');
    }
  };

  // ENDPOINT 2: POST /productos -> Insertar un producto nuevo en la Base de Datos
  const agregarProducto = async (nuevoProducto) => {
    try {
      const respuesta = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('No se pudo guardar en la Base de Datos');
      const productoCreado = await respuesta.json();

      // Actualizamos el estado con el registro real insertado en la Base de Datos
      setProductos((prevProductos) => [...prevProductos, productoCreado]);
    } catch (error) {
      alert('Error al guardar en la API: verifica que el servidor esté encendido.');
    }
  };

  // ENDPOINT 3: PUT /productos/{id} -> Actualizar un producto en la Base de Datos
  const actualizarProducto = async (id, datosActualizados) => {
    try {
      const respuesta = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...datosActualizados }),
      });

      if (!respuesta.ok) throw new Error('No se pudo actualizar en la Base de Datos');
      const productoActualizado = await respuesta.json();

      setProductos((prevProductos) =>
        prevProductos.map((prod) => (prod.id === id ? productoActualizado : prod))
      );
      setProductoEditando(null);
    } catch (error) {
      alert('Error al actualizar el producto en la Base de Datos.');
    }
  };

  // ENDPOINT 4: DELETE /productos/{id} -> Eliminar un producto de la Base de Datos
  const eliminarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!respuesta.ok) throw new Error('No se pudo eliminar de la Base de Datos');

      setProductos((prevProductos) => prevProductos.filter((prod) => prod.id !== id));
      if (productoEditando && productoEditando.id === id) {
        setProductoEditando(null);
      }
    } catch (error) {
      alert('Error al eliminar el producto de la Base de Datos.');
    }
  };

  // 3. COMPOSICIÓN DE COMPONENTES (JSX)
  return (
    <div className={`contenedor ${modoOscuro ? 'tema-oscuro' : ''}`}>
      {/* Componente 1: Encabezado, botón de modo oscuro y selector de API (Tema 1 BD / Tema 3 Memoria) */}
      <Encabezado
        conectadoApi={conectadoApi}
        mensajeEstado={mensajeEstado}
        apiUrl={apiUrl}
        onCambiarApi={(nuevaUrl) => {
          setProductoEditando(null);
          setApiUrl(nuevaUrl);
        }}
        onReconectar={() => obtenerProductos(apiUrl)}
        modoOscuro={modoOscuro}
        onAlternarModoOscuro={alternarModoOscuro}
      />

      {/* Componente 2: Ejercicio práctico de useState para los compañeros */}
      <ContadorReactivo />

      {/* Contenedor principal con los dos componentes del CRUD */}
      <div className="grid-principal">
        {/* Componente 3: Formulario para crear (POST) o actualizar (PUT) un producto */}
        <FormularioProducto
          onAgregarProducto={agregarProducto}
          onActualizarProducto={actualizarProducto}
          productoEditando={productoEditando}
          onCancelarEdicion={() => setProductoEditando(null)}
        />

        {/* Componente 4: Catálogo de productos en tarjetas (GET, PUT y DELETE) */}
        <ListaProductos
          productos={productos}
          onSeleccionarEditar={(producto) => setProductoEditando(producto)}
          onEliminarProducto={eliminarProducto}
        />
      </div>
    </div>
  );
}

export default App;
