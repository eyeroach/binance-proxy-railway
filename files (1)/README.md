# 🚀 Binance Proxy Railway

Servidor proxy para Binance API con IP fija para whitelist.

## 📦 PASO 1: Instalar dependencias

Abre PowerShell en esta carpeta y ejecuta:

```powershell
npm install
```

## 🐙 PASO 2: Subir a GitHub

```powershell
git init
git add .
git commit -m "Initial commit - Binance proxy"
```

Luego:
1. Ve a https://github.com/new
2. Nombre: `binance-proxy-railway`
3. Público
4. NO marques nada más
5. Click "Create repository"

Copia y pega los comandos que GitHub te muestra:

```powershell
git remote add origin https://github.com/TU-USUARIO/binance-proxy-railway.git
git branch -M main
git push -u origin main
```

## 🚂 PASO 3: Deploy en Railway

1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project"
4. "Deploy from GitHub repo"
5. Selecciona `binance-proxy-railway`
6. Espera que termine el deploy
7. En Settings → Networking → "Generate Domain"

## 🎯 PASO 4: Obtener IP fija

Abre en tu navegador:
```
https://tu-proyecto.up.railway.app/my-ip
```

Guarda esa IP.

## 🔐 PASO 5: Configurar en Binance

1. Ve a Binance → API Management
2. Edit API Key
3. "Restrict access to trusted IPs only"
4. Agrega la IP que obtuviste
5. Habilita "Enable Spot & Margin Trading"
6. Guarda

## ✅ PASO 6: Probar

```
https://tu-proyecto.up.railway.app/binance/api/v3/ticker/price?symbol=BTCUSDT
```

## 🔧 Usar desde tu sitio Lovable

```javascript
const PROXY_URL = 'https://tu-proyecto.up.railway.app';

// Obtener precio
const response = await fetch(`${PROXY_URL}/binance/api/v3/ticker/price?symbol=BTCUSDT`, {
  headers: {
    'X-MBX-APIKEY': 'tu-api-key'
  }
});

const data = await response.json();
console.log(data);
```

## 📊 Endpoints disponibles

- `GET /` - Información del servidor
- `GET /health` - Status del servidor
- `GET /my-ip` - Obtener IP fija
- `ALL /binance/*` - Proxy a Binance API

## 💰 Costos

- Gratis por 30 días ($5 crédito)
- Después: ~$5/mes

---

¿Problemas? Revisa los logs en Railway Dashboard.
