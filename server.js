const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Endpoint para obtener la IP fija del servidor
app.get('/my-ip', async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    res.json({ 
      serverIP: response.data.ip,
      message: '⭐ USA ESTA IP EN BINANCE WHITELIST ⭐',
      instructions: 'Ve a Binance → API Management → Edit API → Restrict access to trusted IPs'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Proxy principal a Binance API - SIN MODIFICAR NADA
app.all('/binance/*', async (req, res) => {
  try {
    // Extraer el path después de /binance/
    const binancePath = req.url.replace('/binance/', '');
    const binanceUrl = `https://api.binance.com/${binancePath}`;
    
    console.log(`🔄 Proxying to: ${binanceUrl}`);
    
    // Copiar TODOS los headers originales (excepto host)
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      // No copiar headers de infraestructura
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    // Configurar request a Binance - PASAR TODO TAL CUAL
    const config = {
      method: req.method,
      url: binanceUrl,
      headers: headers,
      validateStatus: () => true, // Aceptar cualquier status code
      maxRedirects: 0 // No seguir redirects
    };
    
    // Agregar body si existe (para POST/PUT/DELETE)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    // Hacer la petición a Binance
    const response = await axios(config);
    
    // Copiar headers de respuesta
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    // Retornar la respuesta exacta
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy:', error.message);
    
    // Si hay respuesta de Binance, retornarla
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Proxy error',
        message: error.message
      });
    }
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Binance Proxy Server - Render.com',
    endpoints: {
      health: '/health',
      myIP: '/my-ip',
      binanceProxy: '/binance/*'
    },
    examples: {
      getPrice: '/binance/api/v3/ticker/price?symbol=BTCUSDT',
      getTime: '/binance/api/v3/time',
      getAccount: '/binance/api/v3/account?timestamp=XXX&signature=XXX (con headers X-MBX-APIKEY)'
    },
    note: 'Este proxy NO modifica las requests. Pasa todo tal cual a Binance.'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Binance Proxy Server                      ║
║  📡 Port: ${PORT}                                 ║
║  🌐 Platform: Render.com                      ║
║  🔒 Mode: Transparent Proxy (no modifications)║
╚═══════════════════════════════════════════════╝
  `);
  console.log('✅ Server is running!');
  console.log('🔗 Call /my-ip to get your fixed IP address');
  console.log('⚠️  This proxy does NOT add or modify any parameters');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});
