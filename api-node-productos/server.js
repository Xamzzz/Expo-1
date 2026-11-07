const http = require('http');

const PORT = 3000;

// Lista de productos en memoria (Base de datos inicial de la API)
let productos = [
  { id: 1, nombre: 'Teclado Mecánico RGB', precio: 185000, cantidad: 12 },
  { id: 2, nombre: 'Mouse Inalámbrico Gamer', precio: 95000, cantidad: 25 },
  { id: 3, nombre: 'Monitor IPS 24 Pulgadas', precio: 620000, cantidad: 8 },
  { id: 4, nombre: 'Diadema USB con Micrófono', precio: 140000, cantidad: 15 },
];

// Función auxiliar para responder en formato JSON con cabeceras CORS habilitadas y sin caché
function responderJson(res, codigoEstado, datos) {
  res.writeHead(codigoEstado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  });
  res.end(JSON.stringify(datos));
}

// Función auxiliar para leer el cuerpo (body JSON) de las peticiones POST y PUT
function leerBodyJson(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', (chunk) => {
      cuerpo += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(cuerpo ? JSON.parse(cuerpo) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Servidor HTTP de la API REST (/productos)
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Preflight CORS para peticiones desde React (localhost:5173)
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // 1. GET /productos -> Listar todos los productos
  if (method === 'GET' && url === '/productos') {
    return responderJson(res, 200, productos);
  }

  // 2. POST /productos -> Crear un producto nuevo
  if (method === 'POST' && url === '/productos') {
    try {
      const { nombre, precio, cantidad } = await leerBodyJson(req);

      if (!nombre || precio === undefined || cantidad === undefined) {
        return responderJson(res, 400, {
          mensaje: 'Todos los campos (nombre, precio, cantidad) son obligatorios',
        });
      }

      const siguienteId =
        productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;

      const nuevoProducto = {
        id: siguienteId,
        nombre: String(nombre).trim(),
        precio: Number(precio),
        cantidad: Number(cantidad),
      };

      productos.push(nuevoProducto);
      return responderJson(res, 201, nuevoProducto);
    } catch (error) {
      return responderJson(res, 400, { mensaje: 'Formato JSON inválido' });
    }
  }

  // 3. PUT /productos/:id -> Actualizar un producto existente
  if (method === 'PUT' && url.startsWith('/productos/')) {
    const id = Number(url.split('/')[2]);
    const indice = productos.findIndex((p) => p.id === id);

    if (indice === -1) {
      return responderJson(res, 404, { mensaje: 'Producto no encontrado' });
    }

    try {
      const { nombre, precio, cantidad } = await leerBodyJson(req);
      productos[indice] = {
        ...productos[indice],
        nombre: nombre !== undefined ? String(nombre).trim() : productos[indice].nombre,
        precio: precio !== undefined ? Number(precio) : productos[indice].precio,
        cantidad: cantidad !== undefined ? Number(cantidad) : productos[indice].cantidad,
      };
      return responderJson(res, 200, productos[indice]);
    } catch (error) {
      return responderJson(res, 400, { mensaje: 'Formato JSON inválido' });
    }
  }

  // 4. DELETE /productos/:id -> Eliminar un producto
  if (method === 'DELETE' && url.startsWith('/productos/')) {
    const id = Number(url.split('/')[2]);
    const existe = productos.some((p) => p.id === id);

    if (!existe) {
      return responderJson(res, 404, { mensaje: 'Producto no encontrado' });
    }

    productos = productos.filter((p) => p.id !== id);
    return responderJson(res, 200, { mensaje: `Producto #${id} eliminado correctamente` });
  }

  return responderJson(res, 404, { mensaje: 'Ruta no encontrada. Usa /productos' });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ El puerto ${PORT} ya tiene la API de productos activa.`);
  } else {
    console.error('Error en servidor API:', err);
  }
});

server.listen(PORT, () => {
  console.log(`✅ API REST de Productos activa en: http://localhost:${PORT}/productos`);
});
