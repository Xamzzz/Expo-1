# TEMA 5: Frontend con React (React + JavaScript + Vite)

**Contexto de la exposición (SENA - ADSO)**
- **Categoría:** Cliente web (Frontend)
- **Tecnología:** React + JavaScript (con el empaquetador Vite)
- **Modalidad:** *Aprender enseñando* (20 minutos en total: 3 min introducción, 8 min demostración en vivo, 6 min actividad con compañeros, 3 min preguntas).
- **Caso de estudio unificado:** CRUD / Gestión de **Productos** (`id`, `nombre`, `precio`, `cantidad`).

---

## 1. Las 3 Preguntas Clave (Recomendación final del instructor)

Antes de pasar al frente, todo el grupo debe dominar estas tres respuestas:

1. **¿Qué problema resuelve React?**
   En el desarrollo web tradicional, cada vez que cambiaba un dato (por ejemplo, agregar un producto a una tabla), había que manipular manualmente el HTML con JavaScript (`document.getElementById`, crear filas, borrar nodos) o recargar toda la página. React resuelve esto mediante **interfaces declarativas y reactivas**: tú solo defines *cómo debe verse la pantalla según los datos (el estado)*, y cuando los datos cambian, React actualiza automáticamente solo la parte exacta de la pantalla que cambió gracias a su **Virtual DOM**.
2. **¿En qué se diferencia de las demás tecnologías (especialmente Angular)?**
   Mientras que **Angular** (Tema 4) es un *framework completo y estricto* que usa TypeScript y separa obligatoriamente cada componente en varios archivos (`.ts`, `.html`, `.css`), **React** es una *librería flexible* centrada en la interfaz de usuario que une la lógica (JavaScript) y la vista (HTML) en un solo lugar mediante **JSX**, usando funciones simples llamadas **Componentes Funcionales** y **Hooks** (`useState`, `useEffect`).
3. **¿Cómo lo demuestro en vivo?**
   Levantando el proyecto con Vite (`npm run dev`), mostrando cómo al cargar la página `useEffect` trae los productos de la API, y cómo al escribir un nuevo producto en el formulario y dar clic en "Guardar", `useState` actualiza la lista y el producto aparece instantáneamente en la tabla **sin recargar el navegador**.

---

## 2. ¿Qué deben investigar? (Marco Teórico para la Exposición)

### 2.1 ¿Qué es React y qué es un componente funcional?
* **React:** Es una biblioteca de JavaScript de código abierto creada por **Meta (Facebook)** para construir interfaces de usuario interactivas (SPA - *Single Page Applications*).
* **Filosofía basada en componentes:** En lugar de hacer una página entera en un solo archivo gigante, React divide la pantalla en piezas pequeñas, independientes y reutilizables (como bloques de LEGO): un componente para la barra de navegación, otro para el formulario y otro para la tabla de productos.
* **Componente Funcional:** Es simplemente una **función de JavaScript** (cuyo nombre empieza siempre con **Mayúscula**, ej. `function ListaProductos()`) que recibe datos opcionales llamados `props` y **retorna código JSX** (lo que se verá en pantalla).

```jsx
// Ejemplo mínimo de un Componente Funcional
function Saludo() {
  return <h1>Catálogo de Productos - ADSO</h1>;
}
```

### 2.2 ¿Qué es JSX (JavaScript XML)?
* **Definición:** Es una extensión de sintaxis para JavaScript que permite escribir etiquetas idénticas a HTML directamente dentro del código JavaScript.
* **¿Por qué se usa?** Porque en React la lógica de la interfaz (qué pasa al hacer clic, cómo se recorre una lista de productos) está íntimamente ligada a cómo se muestra en pantalla. El navegador no entiende JSX directamente; **Vite** se encarga de traducirlo a JavaScript puro (`React.createElement`) en milisegundos.
* **3 Reglas de oro de JSX para explicar en clase:**
  1. **Las llaves `{ }` son una ventana a JavaScript:** Todo lo que pongas dentro de `{ }` se evalúa como código JS (variables, operaciones matemáticas o `.map()` para recorrer listas). Ejemplo: `<td>${producto.precio}</td>`.
  2. **`className` en lugar de `class`:** Como `class` es una palabra reservada de JavaScript, para dar estilos CSS se escribe `<div className="tarjeta">`.
  3. **Un solo elemento raíz:** Un componente debe devolver un único contenedor padre (como un `<div>...</div>` o un fragmento vacío `<>...</>`).

### 2.3 ¿Qué son los Hooks? (`useState` y `useEffect`)
Los **Hooks** ("anzuelos" o "ganchos") son funciones especiales de React (todas empiezan con la palabra `use`) que permiten "enganchar" superpoderes como memoria (estado) y ciclo de vida a los componentes funcionales.

#### A) `useState` (El estado o memoria reactiva)
* **¿Por qué no usar una variable normal (`let productos = []`)?** Porque si cambias una variable normal con `productos.push(...)`, JavaScript cambia el dato en memoria, **pero React no se entera y no redibuja la pantalla**.
* **¿Cómo funciona `useState`?** Devuelve un arreglo con dos elementos:
  1. El **valor actual** del estado (ej. `productos`).
  2. La **función actualizadora** para cambiarlo (ej. `setProductos`).
* Cuando llamas a `setProductos(nuevosDatos)`, React detecta el cambio y **vuelve a renderizar (dibujar) la vista automáticamente**.

```jsx
// Estructura de useState: [variable, funcionParaCambiarla] = useState(valorInicial)
const [productos, setProductos] = useState([]);
```

#### B) `useEffect` (Efectos secundarios y conexión con el exterior)
* **¿Para qué sirve?** Sirve para ejecutar código automáticamente en momentos específicos del ciclo de vida del componente, como **consultar una API REST apenas se abre la pantalla**.
* **Partes de `useEffect`:** Recibe dos cosas:
  1. Una función con el código a ejecutar (el `fetch` a la API).
  2. Un **arreglo de dependencias `[]`**: Si se deja vacío `[]`, le dice a React: *"Ejecuta esto una sola vez cuando el componente aparezca en pantalla por primera vez"*.

```jsx
useEffect(() => {
  // Este código se ejecuta automáticamente al abrir la pantalla
  cargarProductosDesdeAPI();
}, []); // <-- El [] vacío evita que se repita en un bucle infinito
```

---

## 3. Comparación React vs Angular (Entregable #3)

Esta tabla resume las diferencias clave frente al **Tema 4 (Angular)** para mostrar en la exposición y entregar al instructor:

| Característica | React (Tema 5) | Angular (Tema 4) |
| :--- | :--- | :--- |
| **¿Qué es?** | **Librería (Biblioteca)** enfocada en la interfaz de usuario (UI). | **Framework completo** ("todo incluido": rutas, peticiones HTTP, formularios). |
| **Creador** | Meta (Facebook). | Google. |
| **Lenguaje principal** | **JavaScript** (con JSX) o TypeScript opcional. | **TypeScript** obligatorio por defecto. |
| **Estructura de un componente** | **1 solo archivo (`.jsx`)** que une lógica y vista HTML en una función. | **3 o 4 archivos separados** (`.ts` lógica, `.html` plantilla, `.css` estilos, `.spec.ts` pruebas). |
| **Enlace de datos (Data Binding)** | **Unidireccional (One-way):** Los datos fluyen del estado a la vista (`value={nombre}` + `onChange`). Da mayor control. | **Bidireccional (Two-way):** Con `[(ngModel)]` la vista y la variable cambian al mismo tiempo. |
| **Cómo recorre listas en el HTML** | Usa JavaScript nativo: `{productos.map(p => ...)}`. | Usa directivas propias en el HTML: `*ngFor` o `@for`. |
| **Cómo consume la API REST** | Usa `fetch()` nativo del navegador o `axios` dentro de `useEffect`. | Usa su propio módulo inyectable `HttpClient` con Observables (`RxJS`). |
| **Curva de aprendizaje** | **Rápida / Flexible:** Si sabes JavaScript moderno, aprendes React muy rápido. | **Más empinada / Estructurada:** Requiere aprender TypeScript, decoradores (`@Component`) e inyección de dependencias. |

---

## 4. ¿Qué deben hacer? (Construir y mostrar paso a paso)

### Paso 1: Crear el proyecto con Vite (`npm create vite`)

Ejecutar en la terminal (PowerShell o CMD):

```bash
# 1. Crear el proyecto indicando la plantilla de React con JavaScript
npm create vite@latest frontend-react-productos -- --template react

# 2. Entrar a la carpeta del proyecto
cd frontend-react-productos

# 3. Instalar las dependencias base de React
npm install

# 4. Levantar el servidor de desarrollo
npm run dev
```

**Estructura de carpetas que deben señalar en VS Code:**
* `package.json`: Lista las librerías instaladas (`react`, `react-dom`) y los comandos (`dev`, `build`).
* `index.html`: El único archivo HTML real del proyecto. Tiene un `<div id="root"></div>` vacío donde React inyectará toda nuestra aplicación.
* `src/main.jsx`: El punto de entrada que toma ese `#root` y dibuja el componente principal `<App />`.
* `src/App.jsx`: Donde programaremos nuestra pantalla de **Productos**.

---

### Paso 2, 3 y 4: Código Completo del Componente de Productos (`src/App.jsx`)

Reemplaza el contenido de `src/App.jsx` con este código:

```jsx
import { useState, useEffect } from 'react';
import './App.css';

// URL de la API (Cambia a 8080 si conectas con Spring Boot del Tema 1, o 3000 para Node.js del Tema 3)
const API_URL = 'http://localhost:3000/productos';

// Datos de respaldo por si la API del otro grupo no está encendida durante la exposición
const PRODUCTOS_RESPALDO = [
  { id: 1, nombre: 'Teclado Mecánico RGB', precio: 185000, cantidad: 12 },
  { id: 2, nombre: 'Mouse Inalámbrico Gamer', precio: 95000, cantidad: 25 },
  { id: 3, nombre: 'Monitor IPS 24 Pulgadas', precio: 620000, cantidad: 8 },
];

function App() {
  // 1. ESTADOS (useState) -> La memoria reactiva de nuestro componente
  const [productos, setProductos] = useState([]);
  const [modoConexion, setModoConexion] = useState('Cargando...');

  // Estados para los campos del formulario de nuevo producto
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  // 2. EFECTO (useEffect) -> Se ejecuta 1 sola vez al cargar la pantalla para traer los productos
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');
      const datos = await respuesta.json();
      setProductos(datos);
      setModoConexion('Conectado a la API REST en vivo');
    } catch (error) {
      // Si la API no está prendida, usamos los datos de respaldo automáticamente
      console.warn('API no disponible, usando datos locales de respaldo:', error.message);
      setProductos(PRODUCTOS_RESPALDO);
      setModoConexion('Modo Local (Datos de respaldo activos)');
    }
  };

  // 3. FUNCIÓN PARA CREAR UN PRODUCTO DESDE EL FORMULARIO
  const agregarProducto = async (evento) => {
    // Evita que el navegador recargue la página al enviar el formulario
    evento.preventDefault();

    if (!nombre.trim() || !precio || !cantidad) {
      alert('Por favor completa todos los campos');
      return;
    }

    const nuevoProducto = {
      nombre: nombre,
      precio: Number(precio),
      cantidad: Number(cantidad),
    };

    try {
      // Intentamos enviarlo a la API con el verbo POST
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('No se pudo guardar en la API');
      const productoCreado = await respuesta.json();

      // Actualizamos el estado agregando el producto que devolvió la API
      setProductos([...productos, productoCreado]);
    } catch (error) {
      // Si estamos sin API, le asignamos un ID local y actualizamos el estado (reactividad inmediata)
      const productoLocal = {
        id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
        ...nuevoProducto,
      };
      setProductos([...productos, productoLocal]);
    }

    // Limpiamos las cajas de texto del formulario
    setNombre('');
    setPrecio('');
    setCantidad('');
  };

  // 4. VISTA (JSX) -> Lo que se dibuja en el navegador
  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>📦 Gestión de Productos con React</h1>
        <span className="badge">{modoConexion}</span>
      </header>

      <div className="grid-principal">
        {/* SECCIÓN 1: FORMULARIO PARA CREAR PRODUCTO */}
        <section className="tarjeta">
          <h2>➕ Nuevo Producto</h2>
          <form onSubmit={agregarProducto} className="formulario">
            <label>
              Nombre del producto:
              <input
                type="text"
                placeholder="Ej. Audífonos Bluetooth"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>

            <label>
              Precio ($ COP):
              <input
                type="number"
                placeholder="Ej. 120000"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </label>

            <label>
              Cantidad en stock:
              <input
                type="number"
                placeholder="Ej. 15"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </label>

            <button type="submit" className="btn-guardar">
              Guardar Producto
            </button>
          </form>
        </section>

        {/* SECCIÓN 2: LISTA DE PRODUCTOS */}
        <section className="tarjeta">
          <h2>📋 Lista de Productos ({productos.length})</h2>
          {productos.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>${Number(prod.precio).toLocaleString('es-CO')}</td>
                    <td>{prod.cantidad} uds.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
```

---

## 5. ¿Qué deben lograr que sus compañeros hagan? (Actividad de 6 minutos)

**Meta pedagógica:** Que los compañeros creen un componente con `useState` y vean cómo cambia la vista cuando cambian los datos (reactividad).

### Ejercicio guiado para los compañeros (10 líneas de código)

Pídanles que agreguen esta función dentro de `src/App.jsx` y la coloquen debajo del `<header>`:

```jsx
function ContadorReactivo() {
  // 1. Creamos el estado inicializado en 0
  const [unidades, setUnidades] = useState(0);

  return (
    <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>⚡ Prueba de Reactividad en vivo (Hecho por compañeros)</h3>
      <p>Unidades en el carrito: <strong>{unidades}</strong></p>

      {/* 2. Al hacer clic, cambiamos el estado y React actualiza el número solo */}
      <button onClick={() => setUnidades(unidades + 1)}>➕ Agregar unidad</button>
      <button onClick={() => setUnidades(unidades - 1)} style={{ marginLeft: '10px' }}>
        ➖ Quitar unidad
      </button>
    </div>
  );
}
```

---

## 6. Guion Minuto a Minuto para los 20 Minutos de Exposición

| Momento | Tiempo | Qué hace y dice el grupo |
| :--- | :---: | :--- |
| **1. Introducción al tema** | **3 min** | - Presentar qué es **React** y qué problema resuelve.<br>- Explicar **Componente funcional**, **JSX** y **Hooks** (`useState`, `useEffect`).<br>- Mostrar la **Tabla Comparativa React vs Angular**. |
| **2. Demostración en vivo** | **8 min** | - Mostrar la estructura creada con Vite y señalar `App.jsx`.<br>- Explicar las líneas de `useState`, `useEffect` y `.map()`.<br>- Crear un producto desde el formulario y mostrar cómo aparece en la tabla sin recargar la página. |
| **3. "Ahora háganlo ustedes"** | **6 min** | - Guiar a los compañeros a crear el componente `ContadorReactivo` con `useState(0)` para experimentar la reactividad en vivo. |
| **4. Preguntas y cierre** | **3 min** | - Responder dudas de los compañeros y del instructor. |

