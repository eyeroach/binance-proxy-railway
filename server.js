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
      message: '⭐ USA ESTA IP EN BINANCE/BYBIT/OTROS EXCHANGES WHITELIST ⭐',
      instructions: 'Agrega esta IP en API Management de cada exchange'
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

// ==================== BINANCE ====================

// Proxy para BINANCE SPOT API (api.binance.com)
app.all('/binance/*', async (req, res) => {
  try {
    const binancePath = req.url.replace('/binance/', '');
    const binanceUrl = `https://api.binance.com/${binancePath}`;
    
    console.log(`🔄 Proxying to Binance Spot: ${binanceUrl}`);
    
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
    console.error('❌ Error en proxy Binance Spot:', error.message);
    
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

// Proxy para BINANCE FUTURES API (fapi.binance.com)
app.all('/binance-futures/*', async (req, res) => {
  try {
    const binanceFuturesPath = req.url.replace('/binance-futures/', '');
    const binanceFuturesUrl = `https://fapi.binance.com/${binanceFuturesPath}`;
    
    console.log(`🔄 Proxying to Binance Futures: ${binanceFuturesUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: binanceFuturesUrl,
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
    console.error('❌ Error en proxy Binance Futures:', error.message);
    
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

// ==================== BYBIT ====================

// Proxy para BYBIT API (api.bybit.com) - Soporta SPOT y DERIVATIVES
// Bybit V5 API unifica todo en un solo endpoint
app.all('/bybit/*', async (req, res) => {
  try {
    const bybitPath = req.url.replace('/bybit/', '');
    const bybitUrl = `https://api.bybit.com/${bybitPath}`;
    
    console.log(`🔄 Proxying to Bybit (Spot/Derivatives): ${bybitUrl}`);
    
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

// ==================== OKX ====================

// Proxy para OKX API (www.okx.com) - Soporta SPOT, SWAP (Perpetual Futures), FUTURES
// OKX API V5 unifica todo en un solo endpoint
app.all('/okx/*', async (req, res) => {
  try {
    const okxPath = req.url.replace('/okx/', '');
    const okxUrl = `https://www.okx.com/${okxPath}`;
    
    console.log(`🔄 Proxying to OKX (Spot/Swap/Futures): ${okxUrl}`);
    
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

// ==================== KRAKEN ====================

// Proxy para KRAKEN SPOT API (api.kraken.com)
app.all('/kraken/*', async (req, res) => {
  try {
    const krakenPath = req.url.replace('/kraken/', '');
    const krakenUrl = `https://api.kraken.com/${krakenPath}`;
    
    console.log(`🔄 Proxying to Kraken Spot: ${krakenUrl}`);
    
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
    console.error('❌ Error en proxy Kraken Spot:', error.message);
    
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

// Proxy para KRAKEN FUTURES API (futures.kraken.com)
app.all('/kraken-futures/*', async (req, res) => {
  try {
    const krakenFuturesPath = req.url.replace('/kraken-futures/', '');
    const krakenFuturesUrl = `https://futures.kraken.com/${krakenFuturesPath}`;
    
    console.log(`🔄 Proxying to Kraken Futures: ${krakenFuturesUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: krakenFuturesUrl,
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
    console.error('❌ Error en proxy Kraken Futures:', error.message);
    
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

// ==================== KUCOIN ====================

// Proxy para KUCOIN SPOT API (api.kucoin.com)
app.all('/kucoin/*', async (req, res) => {
  try {
    const kucoinPath = req.url.replace('/kucoin/', '');
    const kucoinUrl = `https://api.kucoin.com/${kucoinPath}`;
    
    console.log(`🔄 Proxying to KuCoin Spot: ${kucoinUrl}`);
    
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
    console.error('❌ Error en proxy KuCoin Spot:', error.message);
    
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

// Proxy para KUCOIN FUTURES API (api-futures.kucoin.com)
app.all('/kucoin-futures/*', async (req, res) => {
  try {
    const kucoinFuturesPath = req.url.replace('/kucoin-futures/', '');
    const kucoinFuturesUrl = `https://api-futures.kucoin.com/${kucoinFuturesPath}`;
    
    console.log(`🔄 Proxying to KuCoin Futures: ${kucoinFuturesUrl}`);
    
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = req.headers[key];
      }
    });
    
    const config = {
      method: req.method,
      url: kucoinFuturesUrl,
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
    console.error('❌ Error en proxy KuCoin Futures:', error.message);
    
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

// ==================== DOCUMENTACIÓN ====================

// Ruta principal con documentación completa
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Multi-Exchange Proxy Server (Spot + Futures) - Render.com',
    serverIP: 'Llama a /my-ip para obtener tu IP fija europea',
    
    exchanges: {
      binance: {
        spot: {
          route: '/binance/*',
          target: 'api.binance.com',
          example: '/binance/api/v3/ticker/price?symbol=BTCUSDT'
        },
        futures: {
          route: '/binance-futures/*',
          target: 'fapi.binance.com',
          example: '/binance-futures/fapi/v1/ticker/24hr?symbol=BTCUSDT'
        }
      },
      
      bybit: {
        unified: {
          route: '/bybit/*',
          target: 'api.bybit.com',
          note: 'API V5 unifica Spot y Derivatives. Usa category=spot|linear|inverse',
          exampleSpot: '/bybit/v5/market/tickers?category=spot&symbol=BTCUSDT',
          exampleDerivatives: '/bybit/v5/market/tickers?category=linear&symbol=BTCUSDT'
        }
      },
      
      okx: {
        unified: {
          route: '/okx/*',
          target: 'www.okx.com',
          note: 'API V5 unifica todo. Usa instType=SPOT|SWAP|FUTURES',
          exampleSpot: '/okx/api/v5/market/ticker?instId=BTC-USDT',
          exampleSwap: '/okx/api/v5/market/ticker?instId=BTC-USDT-SWAP',
          exampleFutures: '/okx/api/v5/market/ticker?instId=BTC-USDT-240329'
        }
      },
      
      kraken: {
        spot: {
          route: '/kraken/*',
          target: 'api.kraken.com',
          example: '/kraken/0/public/Ticker?pair=XBTUSD'
        },
        futures: {
          route: '/kraken-futures/*',
          target: 'futures.kraken.com',
          example: '/kraken-futures/derivatives/api/v3/tickers'
        }
      },
      
      kucoin: {
        spot: {
          route: '/kucoin/*',
          target: 'api.kucoin.com',
          example: '/kucoin/api/v1/market/orderbook/level1?symbol=BTC-USDT'
        },
        futures: {
          route: '/kucoin-futures/*',
          target: 'api-futures.kucoin.com',
          example: '/kucoin-futures/api/v1/ticker?symbol=XBTUSDTM'
        }
      }
    },
    
    endpoints: {
      health: '/health - Status del servidor',
      myIP: '/my-ip - Obtener IP fija para whitelisting'
    },
    
    instructions: {
      step1: 'Obtén tu IP fija llamando a /my-ip',
      step2: 'Agrega esa IP en cada exchange (API Management → IP Whitelist)',
      step3: 'Reemplaza las URLs directas del exchange por este proxy',
      step4: 'Mantén todos los headers, params y signatures sin cambios'
    },
    
    note: 'Este proxy NO modifica las requests. Actúa como proxy transparente pasando todo tal cual.'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🚀 Multi-Exchange Proxy Server (Spot + Futures)      ║
║  📡 Port: ${PORT}                                         ║
║  🌐 Platform: Render.com (Europa)                     ║
║  🔒 Mode: Transparent Proxy                           ║
║                                                       ║
║  Exchanges & Productos:                               ║
║  • Binance: Spot + Futures                            ║
║  • Bybit: Spot + Derivatives (unified V5)             ║
║  • OKX: Spot + Swap + Futures (unified V5)            ║
║  • Kraken: Spot + Futures                             ║
║  • KuCoin: Spot + Futures                             ║
╚═══════════════════════════════════════════════════════╝
  `);
  console.log('✅ Server is running!');
  console.log('🔗 Call /my-ip to get your fixed IP address');
  console.log('⚠️  This proxy does NOT modify requests - transparent pass-through');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});
