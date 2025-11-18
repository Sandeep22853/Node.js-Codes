import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const certDir = path.resolve('./certs');
const certPath = path.join(certDir, 'server.crt');
const keyPath = path.join(certDir, 'server.key');
const caPath = path.join(certDir, 'ca.crt');

function loadOptions() {
  console.log('Loading certificates...');
  console.log('Server cert size:', fs.statSync(certPath).size);
  console.log('Key size:', fs.statSync(keyPath).size);
  console.log('CA cert size:', fs.statSync(caPath).size);

  return {
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
    ca: fs.readFileSync(caPath, 'utf8'),
    requestCert: true,
    rejectUnauthorized: true,
    secureOptions:
      crypto.constants.SSL_OP_NO_TLSv1 |
      crypto.constants.SSL_OP_NO_TLSv1_1, 
  };
}

let options = loadOptions();

const server = https.createServer(options, (req, res) => {
  if (!req.socket.authorized) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized client certificate');
    console.log('Unauthorized client tried to connect');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('mTLS connection established');
  console.log('Authorized client connected');
});

server.listen(8443, () => {
  console.log('mTLS server listening on port 8443');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

[certPath, keyPath, caPath].forEach((filePath) => {
  fs.watchFile(filePath, () => reloadCert());
});

function reloadCert() {
  try {
    console.log('Reloading TLS certificates...');
    options = loadOptions();
    const secureContext = https.createSecureContext(options);
    server.setSecureContext(secureContext);
    console.log('TLS certificates reloaded successfully');
  } catch (err) {
    console.error('Failed to reload certificates:', err);
  }
}