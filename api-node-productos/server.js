const http = require('http');
const { execFileSync } = require('child_process');

const PORT_SPRING_MYSQL = 8080; // Puerto Tema 1: API conectada a MySQL Workbench (db_inventario.producto)
const PORT_NODE_MEM = 3000;     // Puerto Tema 3: API en Memoria (para comparar)

// =========================================================================
// 1. CONFIGURACIÓN DE CONEXIÓN A MYSQL WORKBENCH (db_inventario -> producto)
// =========================================================================
const MYSQL_CONFIG = {
  binPath: 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'db_inventario',
  table: 'producto',
};

// Ejecuta una sentencia SQL en MySQL 8.0 (db_inventario) y devuelve el resultado
function ejecutarSqlMySQL(sqlQuery) {
  const salida = execFileSync(
    MYSQL_CONFIG.binPath,
    [
      `-h${MYSQL_CONFIG.host}`,
      `-P${MYSQL_CONFIG.port}`,
      `-u${MYSQL_CONFIG.user}`,
      `-p${MYSQL_CONFIG.password}`,
      '--default-character-set=utf8mb4',
      '-D',
      MYSQL_CONFIG.database,
      '-N',
      '-B',
      '-e',
      sqlQuery,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return salida.trim();
}

// Escapar comillas simples para prevenir errores de sintaxis en cadenas SQL
function escaparTextoSql(texto) {
  return String(texto).replace(/\\/g, '\\\\').replace(/'/g, "''");
}

// Lista en memoria para el puerto 3000 (Tema 3 - Comparación Memoria vs Base de Datos MySQL)
let productosEnMemoria = [];

// Función auxiliar para responder en formato JSON con cabeceras CORS habilitadas
function responderJson(res, codigoEstado, datos) {
  res.writeHead(codigoEstado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

// =========================================================================
// 2. CONTROLADOR CONECTADO A MYSQL (db_inventario.producto - PUERTO 8080)
// =========================================================================
async function manejarPeticionMySQL(req, res) {
  const { method } = req;
  const urlLimpia = (req.url || '/').split('?')[0].replace(/^\/api(?=\/productos)/, '');

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  try {
    // 1. GET /productos -> SELECT id, nombre, precio, cantidad FROM db_inventario.producto
    if (method === 'GET' && urlLimpia === '/productos') {
      const sql = `
        SELECT COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT('id', id, 'nombre', nombre, 'precio', precio, 'cantidad', cantidad)
          ),
          JSON_ARRAY()
        )
        FROM (SELECT id, nombre, precio, cantidad FROM producto ORDER BY id ASC) AS t;
      `;
      const jsonTexto = ejecutarSqlMySQL(sql);
      const productos = jsonTexto ? JSON.parse(jsonTexto) : [];
      return responderJson(res, 200, productos);
    }

    // GET /productos/:id -> Consultar un producto por ID en MySQL
    if (method === 'GET' && urlLimpia.startsWith('/productos/')) {
      const id = Number(urlLimpia.split('/')[2]);
      const sql = `
        SELECT JSON_OBJECT('id', id, 'nombre', nombre, 'precio', precio, 'cantidad', cantidad)
        FROM producto
        WHERE id = ${id};
      `;
      const jsonTexto = ejecutarSqlMySQL(sql);
      if (!jsonTexto) {
        return responderJson(res, 404, { mensaje: 'Producto no encontrado en MySQL' });
      }
      return responderJson(res, 200, JSON.parse(jsonTexto));
    }

    // 2. POST /productos -> INSERT INTO db_inventario.producto (nombre, precio, cantidad)
    if (method === 'POST' && urlLimpia === '/productos') {
      const { nombre, precio, cantidad } = await leerBodyJson(req);

      if (!nombre || precio === undefined || cantidad === undefined) {
        return responderJson(res, 400, {
          mensaje: 'Todos los campos (nombre, precio, cantidad) son obligatorios',
        });
      }

      const nombreSeguro = escaparTextoSql(nombre.trim());
      const precioNum = Number(precio);
      const cantidadNum = Number(cantidad);

      const sql = `
        INSERT INTO producto (nombre, precio, cantidad)
        VALUES ('${nombreSeguro}', ${precioNum}, ${cantidadNum});
        SELECT JSON_OBJECT('id', id, 'nombre', nombre, 'precio', precio, 'cantidad', cantidad)
        FROM producto
        WHERE id = LAST_INSERT_ID();
      `;
      const jsonTexto = ejecutarSqlMySQL(sql);
      const productoCreado = JSON.parse(jsonTexto);

      console.log(
        `[MySQL db_inventario.producto] INSERT -> ID #${productoCreado.id} (${productoCreado.nombre})`
      );
      return responderJson(res, 201, productoCreado);
    }

    // 3. PUT /productos/:id -> UPDATE db_inventario.producto SET ... WHERE id = :id
    if (method === 'PUT' && urlLimpia.startsWith('/productos/')) {
      const id = Number(urlLimpia.split('/')[2]);
      const { nombre, precio, cantidad } = await leerBodyJson(req);

      const nombreSeguro = escaparTextoSql(nombre.trim());
      const precioNum = Number(precio);
      const cantidadNum = Number(cantidad);

      const sql = `
        UPDATE producto
        SET nombre = '${nombreSeguro}', precio = ${precioNum}, cantidad = ${cantidadNum}
        WHERE id = ${id};
        SELECT JSON_OBJECT('id', id, 'nombre', nombre, 'precio', precio, 'cantidad', cantidad)
        FROM producto
        WHERE id = ${id};
      `;
      const jsonTexto = ejecutarSqlMySQL(sql);
      if (!jsonTexto) {
        return responderJson(res, 404, { mensaje: 'Producto no encontrado en MySQL' });
      }

      console.log(`[MySQL db_inventario.producto] UPDATE -> ID #${id}`);
      return responderJson(res, 200, JSON.parse(jsonTexto));
    }

    // 4. DELETE /productos/:id -> DELETE FROM db_inventario.producto WHERE id = :id
    if (method === 'DELETE' && urlLimpia.startsWith('/productos/')) {
      const id = Number(urlLimpia.split('/')[2]);
      const sql = `DELETE FROM producto WHERE id = ${id};`;
      ejecutarSqlMySQL(sql);

      console.log(`[MySQL db_inventario.producto] DELETE -> ID #${id}`);
      return responderJson(res, 200, {
        mensaje: `Producto #${id} eliminado de MySQL (db_inventario.producto)`,
      });
    }

    return responderJson(res, 404, { mensaje: 'Ruta no encontrada. Usa /productos' });
  } catch (error) {
    console.error('Error en consulta MySQL:', error.message);
    return responderJson(res, 500, {
      mensaje: 'Error al consultar MySQL (db_inventario.producto)',
      detalle: error.message,
    });
  }
}

// =========================================================================
// 3. CONTROLADOR EN MEMORIA (TEMA 3 - PUERTO 3000 - PARA COMPARAR)
// =========================================================================
async function manejarPeticionMemoria(req, res) {
  const { method } = req;
  const urlLimpia = (req.url || '/').split('?')[0].replace(/^\/api(?=\/productos)/, '');

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  if (method === 'GET' && urlLimpia === '/productos') {
    return responderJson(res, 200, productosEnMemoria);
  }

  if (method === 'POST' && urlLimpia === '/productos') {
    try {
      const { nombre, precio, cantidad } = await leerBodyJson(req);
      if (!nombre || precio === undefined || cantidad === undefined) {
        return responderJson(res, 400, { mensaje: 'Campos incompletos' });
      }
      const siguienteId =
        productosEnMemoria.length > 0 ? Math.max(...productosEnMemoria.map((p) => p.id)) + 1 : 1;
      const nuevoProducto = {
        id: siguienteId,
        nombre: String(nombre).trim(),
        precio: Number(precio),
        cantidad: Number(cantidad),
      };
      productosEnMemoria.push(nuevoProducto);
      return responderJson(res, 201, nuevoProducto);
    } catch (error) {
      return responderJson(res, 400, { mensaje: 'JSON inválido' });
    }
  }

  if (method === 'PUT' && urlLimpia.startsWith('/productos/')) {
    const id = Number(urlLimpia.split('/')[2]);
    const indice = productosEnMemoria.findIndex((p) => p.id === id);
    if (indice === -1) return responderJson(res, 404, { mensaje: 'No encontrado' });

    const { nombre, precio, cantidad } = await leerBodyJson(req);
    productosEnMemoria[indice] = {
      ...productosEnMemoria[indice],
      nombre: nombre !== undefined ? String(nombre).trim() : productosEnMemoria[indice].nombre,
      precio: precio !== undefined ? Number(precio) : productosEnMemoria[indice].precio,
      cantidad: cantidad !== undefined ? Number(cantidad) : productosEnMemoria[indice].cantidad,
    };
    return responderJson(res, 200, productosEnMemoria[indice]);
  }

  if (method === 'DELETE' && urlLimpia.startsWith('/productos/')) {
    const id = Number(urlLimpia.split('/')[2]);
    productosEnMemoria = productosEnMemoria.filter((p) => p.id !== id);
    return responderJson(res, 200, { mensaje: `Producto #${id} eliminado de memoria` });
  }

  return responderJson(res, 404, { mensaje: 'Ruta no encontrada. Usa /productos' });
}

// Levantar Servidor Tema 1 (Puerto 8080 - Conectado a MySQL Workbench db_inventario.producto)
const serverMySQL = http.createServer(manejarPeticionMySQL);
serverMySQL.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ Puerto ${PORT_SPRING_MYSQL} (Tema 1 - MySQL) ya está en uso.`);
  }
});
serverMySQL.listen(PORT_SPRING_MYSQL, () => {
  console.log(
    `✅ API Tema 1 (MySQL Workbench -> db_inventario.producto) activa en: http://localhost:${PORT_SPRING_MYSQL}/productos`
  );
});

// Levantar Servidor Tema 3 (Puerto 3000 - En Memoria para comparar)
const serverMem = http.createServer(manejarPeticionMemoria);
serverMem.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ Puerto ${PORT_NODE_MEM} (Tema 3 - Memoria) ya está en uso.`);
  }
});
serverMem.listen(PORT_NODE_MEM, () => {
  console.log(
    `✅ API Tema 3 (Lista en Memoria) activa en: http://localhost:${PORT_NODE_MEM}/productos`
  );
});
