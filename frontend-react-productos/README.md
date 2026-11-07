# Tema 5 — Frontend con React (React + JavaScript + Vite)

Proyecto para la exposición del **Tecnólogo en Análisis y Desarrollo de Software (ADSO) — SENA CIMM Regional Boyacá**.

## Características incluidas

1. **Componente principal (`src/App.jsx`)**:
   - Usa `useState` para almacenar la lista de productos y los campos del formulario (`nombre`, `precio`, `cantidad`).
   - Usa `useEffect` para consultar la API REST automáticamente al abrir la pantalla.
   - Permite alternar en vivo entre el backend de **Node.js + Express (`http://localhost:3000/productos`)** y **Java + Spring Boot (`http://localhost:8080/productos`)**.
   - **Respaldo automático**: Si la API no está encendida, carga productos de prueba en memoria para que la demostración nunca falle.
2. **Componente práctico para los compañeros (`src/components/ContadorReactivo.jsx`)**:
   - Ejercicio corto con `useState(0)` para demostrar en vivo cómo cambia la vista automáticamente cuando cambia el estado (reactividad).
3. **Modo de emergencia sin Node.js (`demo-en-vivo.html`)**:
   - Si en algún computador del salón aún no está instalado Node.js, puedes abrir `demo-en-vivo.html` con doble clic en cualquier navegador y ejecutará exactamente el mismo código React 18 con JSX, `useState` y `useEffect`.

---

## Cómo ejecutar el proyecto con Vite

> **Requisito previo:** Tener instalado [Node.js LTS](https://nodejs.org/).

1. Abre una terminal dentro de esta carpeta (`frontend-react-productos`):
   ```bash
   cd "c:\Users\chosj\Desktop\Expo 1\frontend-react-productos"
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. Abre en el navegador el enlace que aparece en consola (normalmente `http://localhost:5173`).

---

## Cómo subir este entregable a GitHub

```bash
git init
git add .
git commit -m "Tema 5: Frontend de Productos con React y Vite"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/frontend-react-productos.git
git push -u origin main
```

