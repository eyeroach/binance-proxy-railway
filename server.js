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

// Proxy para BINANCE API
app.all('/binance/*', async (req, res) => {
  try {
    const binancePath = req.url.replace('/binance/', '');
    const binanceUrl = `https://api.binance.com/${binancePath}`;
    
    console.log(`🔄 Proxying to Binance: ${binanceUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: binanceUrl,
      headers: headers,
      validateStatus: () => true,
      maxRedirects: 0
    };
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    const response = await axios(config);
    
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy Binance:', error.message);
    
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

// Proxy para BYBIT API
app.all('/bybit/*', async (req, res) => {
  try {
    const bybitPath = req.url.replace('/bybit/', '');
    const bybitUrl = `https://api.bybit.com/${bybitPath}`;
    
    console.log(`🔄 Proxying to Bybit: ${bybitUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: bybitUrl,
      headers: headers,
      validateStatus: () => true,
      maxRedirects: 0
    };
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    const response = await axios(config);
    
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy Bybit:', error.message);
    
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

// Proxy para OKX API
app.all('/okx/*', async (req, res) => {
  try {
    const okxPath = req.url.replace('/okx/', '');
    const okxUrl = `https://www.okx.com/${okxPath}`;
    
    console.log(`🔄 Proxying to OKX: ${okxUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: okxUrl,
      headers: headers,
      validateStatus: () => true,
      maxRedirects: 0
    };
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    const response = await axios(config);
    
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy OKX:', error.message);
    
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

// Proxy para KRAKEN API
app.all('/kraken/*', async (req, res) => {
  try {
    const krakenPath = req.url.replace('/kraken/', '');
    const krakenUrl = `https://api.kraken.com/${krakenPath}`;
    
    console.log(`🔄 Proxying to Kraken: ${krakenUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: krakenUrl,
      headers: headers,
      validateStatus: () => true,
      maxRedirects: 0
    };
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    const response = await axios(config);
    
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy Kraken:', error.message);
    
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

// Proxy para KUCOIN API
app.all('/kucoin/*', async (req, res) => {
  try {
    const kucoinPath = req.url.replace('/kucoin/', '');
    const kucoinUrl = `https://api.kucoin.com/${kucoinPath}`;
    
    console.log(`🔄 Proxying to KuCoin: ${kucoinUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: kucoinUrl,
      headers: headers,
      validateStatus: () => true,
      maxRedirects: 0
    };
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }
    }
    
    const response = await axios(config);
    
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    
    res.status(response.status).send(response.data);
    
  } catch (error) {
    console.error('❌ Error en proxy KuCoin:', error.message);
    
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

// Ruta principal con documentación
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Multi-Exchange Proxy Server - Render.com',
    serverIP: 'Llama a /my-ip para obtener tu IP fija',
    supportedExchanges: {
      binance: {
        baseUrl: '/binance/*',
        example: '/binance/api/v3/ticker/price?symbol=BTCUSDT',
        apiDocs: 'https://binance-docs.github.io/apidocs/spot/en/'
      },
      bybit: {
        baseUrl: '/bybit/*',
        example: '/bybit/v5/market/tickers?category=spot&symbol=BTCUSDT',
        apiDocs: 'https://bybit-exchange.github.io/docs/v5/intro'
      },
      okx: {
        baseUrl: '/okx/*',
        example: '/okx/api/v5/market/ticker?instId=BTC-USDT',
        apiDocs: 'https://www.okx.com/docs-v5/en/'
      },
      kraken: {
        baseUrl: '/kraken/*',
        example: '/kraken/0/public/Ticker?pair=XBTUSD',
        apiDocs: 'https://docs.kraken.com/rest/'
      },
      kucoin: {
        baseUrl: '/kucoin/*',
        example: '/kucoin/api/v1/market/orderbook/level1?symbol=BTC-USDT',
        apiDocs: 'https://docs.kucoin.com/'
      }
    },
    endpoints: {
      health: '/health',
      myIP: '/my-ip'
    },
    note: 'Este proxy NO modifica las requests. Pasa todo tal cual a cada exchange.',
    usage: 'Reemplaza https://api.EXCHANGE.com por https://TU-DOMINIO.onrender.com/EXCHANGE'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Multi-Exchange Proxy Server               ║
║  📡 Port: ${PORT}                                 ║
║  🌐 Platform: Render.com                      ║
║  🔒 Mode: Transparent Proxy                   ║
║                                               ║
║  Exchanges soportados:                        ║
║  • Binance (/binance/*)                       ║
║  • Bybit (/bybit/*)                           ║
║  • OKX (/okx/*)                               ║
║  • Kraken (/kraken/*)                         ║
║  • KuCoin (/kucoin/*)                         ║
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
