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

// Proxy principal a Binance API
app.all('/binance/*', async (req, res) => {
  try {
    // Extraer el path después de /binance/
    const binancePath = req.url.replace('/binance/', '');
    const binanceUrl = `https://api.binance.com/${binancePath}`;
    
    console.log(`🔄 Proxying to: ${binanceUrl}`);
    
    // Configurar request a Binance
    const config = {
      method: req.method,
      url: binanceUrl,
      headers: {
        'X-MBX-APIKEY': req.headers['x-mbx-apikey'] || ''
      },
      validateStatus: () => true // No rechazar por status codes
    };
    
    // Agregar query params si existen
    if (Object.keys(req.query).length > 0) {
      config.params = req.query;
    }
    
    // Agregar body para POST/PUT/DELETE
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      config.data = req.body;
    }
    
    // Hacer la petición a Binance
    const response = await axios(config);
    
    // Retornar la respuesta
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy:', error.message);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Binance Proxy Server - Railway.app',
    endpoints: {
      health: '/health',
      myIP: '/my-ip',
      binanceProxy: '/binance/*'
    },
    examples: {
      getPrice: '/binance/api/v3/ticker/price?symbol=BTCUSDT',
      getTime: '/binance/api/v3/time'
    },
    instructions: '1. Llama a /my-ip para obtener tu IP fija\n2. Agrega esa IP en Binance whitelist\n3. Usa /binance/* para proxear tus requests'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Binance Proxy Server                      ║
║  📡 Port: ${PORT}                                 ║
║  🌐 Environment: ${process.env.RAILWAY_ENVIRONMENT || 'local'} ║
╚═══════════════════════════════════════════════╝
  `);
  console.log('✅ Server is running!');
  console.log('🔗 Call /my-ip to get your fixed IP address');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
