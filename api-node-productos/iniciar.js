const path = require('path');
const { spawn } = require('child_process');

// 1. Iniciar la API REST de Productos en http://localhost:3000/productos
require('./server.js');

// 2. Iniciar el servidor de desarrollo de Vite para React en http://localhost:5173
const carpetaFrontend = path.resolve(__dirname, '..', 'frontend-react-productos');
const viteBin = path.join(carpetaFrontend, 'node_modules', 'vite', 'bin', 'vite.js');

const procesoVite = spawn(process.execPath, [viteBin], {
  cwd: carpetaFrontend,
  stdio: 'inherit',
});

procesoVite.on('error', (err) => {
  console.error('Error al iniciar Vite:', err.message);
});

