import express from 'express';

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || Math.random().toString(36).slice(2);
  res.setHeader('X-Request-Id', req.id);
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time-ms', ms.toFixed(2));
    }
  });
  next();
});

// Task 1: Streaming & backpressure + client abort awareness
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'application/x-ndjson');
  let count = 0;
  const interval = setInterval(() => {
    if (res.writableEnded) {
      clearInterval(interval);
      return;
    }
    const data = JSON.stringify({ number: count });
    const flushed = res.write(data + '\n');
    count++;
    if (count > 50) {
      clearInterval(interval);
      res.end();
    }
    if (!flushed) {
      clearInterval(interval);
    }
  }, 100);
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Task 2: Reusable content negotiation middleware
function negotiate(req, res, next) {
  res.negotiate = (obj) => {
    const accept = req.headers['accept'] || '';
    if (accept.includes('application/xml')) {
      res.type('application/xml');
      const xml = `<root>\n${Object.entries(obj)
        .map(([key, value]) => `  <${key}>${value}</${key}>`)
        .join('\n')}\n</root>`;
      res.send(xml);
    } else {
      res.type('application/json');
      res.send(obj);
    }
  };
  next();
}

app.use('/content', negotiate);

app.get('/content', (req, res) => {
  res.negotiate({ message: 'Hello, Negotiated World!' });
});

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(500).json({ error: err.message || 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//http://localhost:3000/stream