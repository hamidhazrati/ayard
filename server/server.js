const express = require('express');
const http = require('http');
const path = require('path');
const process = require('process');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const port = process.env.PORT || 8080;
const distDir = process.env.DIST_DIR || path.join(__dirname, 'dist');

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: {
      policy: ['same-origin'],
    },
    hsts: {
      maxAge: 31536000,
    },
    frameguard: {
      action: 'deny',
    },
  }),
);

app.get('/actuator/health', (req, res) => {
  res.json({ status: 'ok', info: {}, error: {}, details: {} });
});

app.get('/config', (_, res) => {
  res.json({
    API_URL: process.env.API_URL || 'https://dev1-operations-portal-bff.development.gcpfidn.net',
    AUTH_URL: process.env.AUTH_URL || 'https://nonprod-keycloak.organisation.gcpfidn.net/auth',
    AUTH_REALM: process.env.AUTH_REALM || 'dev1',
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID || 'operations-portal',
  });
});

app.use(express.static(distDir));
app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));

process.on('SIGINT', () => {
  process.exit();
});

process.on('SIGTERM', () => {
  process.exit();
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on port:${port}`));
