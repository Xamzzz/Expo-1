import { useState, useEffect } from 'react';
import Encabezado from './components/Encabezado.jsx';
import ContadorReactivo from './components/ContadorReactivo.jsx';
import FormularioProducto from './components/FormularioProducto.jsx';
import ListaProductos from './components/ListaProductos.jsx';
import './App.css';

// URL por defecto de la API (Puerto 3000 para Node.js/Express - Tema 3, o 8080 para Spring Boot - Tema 1)
const API_URL_DEFAULT = 'http://localhost:3000/productos';

// Datos de respaldo automáticos si la API no está encendida en el momento de la prueba
const PRODUCTOS_RESPALDO = [
  { id: 1, nombre: 'Teclado Mecánico RGB', precio: 185000, cantidad: 12 },
  { id: 2, nombre: 'Mouse Inalámbrico Gamer', precio: 95000, cantidad: 25 },
  { id: 3, nombre: 'Monitor IPS 24 Pulgadas', precio: 620000, cantidad: 8 },
  { id: 4, nombre: 'Diadema USB con Micrófono', precio: 140000, cantidad: 15 },
];

/**
 * Componente Principal: App
 * - Guarda la lista de productos y el estado del modo oscuro con useState.
 * - Consulta y sincroniza en tiempo real con la API REST usando useEffect.
 * - Une y coordina los componentes hijos pasándoles datos y funciones por props.
 */
function App() {
  // 1. ESTADOS PRINCIPALES (useState)
  const [productos, setProductos] = useState([]);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [apiUrl, setApiUrl] = useState(API_URL_DEFAULT);
  const [conectadoApi, setConectadoApi] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('Verificando conexión con API...');

  // Función para activar o desactivar el modo oscuro
  const alternarModoOscuro = () => {
    const nuevoModo = !modoOscuro;
    setModoOscuro(nuevoModo);
    document.body.classList.toggle('tema-oscuro', nuevoModo);
  };

  // 2. EFECTO (useEffect) -> Trae los productos al iniciar y sincroniza en vivo cada 1.5 segundos
  // Así, si se envía un POST/PUT/DELETE desde Postman, aparece en pantalla sin recargar la página.
  useEffect(() => {
    obtenerProductos(apiUrl);

    const intervaloSincronizacion = setInterval(() => {
      obtenerProductos(apiUrl, true);
    }, 1500);

    return () => clearInterval(intervaloSincronizacion);
  }, [apiUrl]);

  // Función para pedir la lista de productos (GET)
  const obtenerProductos = async (urlDestino, silencioso = false) => {
    try {
      const respuesta = await fetch(urlDestino, { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('Respuesta no válida del servidor');
      const datos = await respuesta.json();
      setProductos(datos);
      setConectadoApi(true);
      setMensajeEstado(`Conectado en vivo a ${urlDestino}`);
    } catch (error) {
      // Si la API local no está encendida, usamos los datos de respaldo automáticamente
      if (!silencioso) {
        console.warn('API no detectada, activando datos de respaldo:', error.message);
        setProductos((prev) => (prev.length > 0 ? prev : PRODUCTOS_RESPALDO));
      }
      setConectadoApi(false);
      setMensajeEstado('Modo Local Activo (Datos de respaldo automáticos)');
    }
  };

  // Función que recibe el nuevo producto desde <FormularioProducto /> y lo guarda (POST)
  const agregarProducto = async (nuevoProducto) => {
    try {
      const respuesta = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('No se pudo guardar en la API');
      const productoCreado = await respuesta.json();

      // Actualizamos el estado inmediatamente sin recargar la página
      setProductos((prevProductos) => [...prevProductos, productoCreado]);
    } catch (error) {
      // Si estamos en modo local (sin API), asignamos un ID consecutivo en memoria
      setProductos((prevProductos) => {
        const siguienteId =
          prevProductos.length > 0
            ? Math.max(...prevProductos.map((p) => Number(p.id) || 0)) + 1
            : 1;

        return [...prevProductos, { id: siguienteId, ...nuevoProducto }];
      });
    }
  };

  // Función para eliminar un producto desde <ListaProductos /> (DELETE)
  const eliminarProducto = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    } catch (error) {
      // Ignoramos error de red si estamos en modo respaldo
    }
    setProductos((prevProductos) => prevProductos.filter((prod) => prod.id !== id));
  };

  // 3. COMPOSICIÓN DE COMPONENTES (JSX)
  return (
    <div className={`contenedor ${modoOscuro ? 'tema-oscuro' : ''}`}>
      {/* Componente 1: Encabezado, botón de modo oscuro y estado de la API */}
      <Encabezado
        conectadoApi={conectadoApi}
        mensajeEstado={mensajeEstado}
        apiUrl={apiUrl}
        onCambiarApi={setApiUrl}
        onReconectar={() => obtenerProductos(apiUrl)}
        modoOscuro={modoOscuro}
        onAlternarModoOscuro={alternarModoOscuro}
      />

      {/* Componente 2: Ejercicio práctico de useState para los compañeros */}
      <ContadorReactivo />

      {/* Contenedor principal con los dos componentes del CRUD */}
      <div className="grid-principal">
        {/* Componente 3: Formulario para crear un producto */}
        <FormularioProducto onAgregarProducto={agregarProducto} />

        {/* Componente 4: Catálogo de productos en tarjetas */}
        <ListaProductos
          productos={productos}
          onEliminarProducto={eliminarProducto}
        />
      </div>
    </div>
  );
}

export default App;
