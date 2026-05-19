const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Jenkins CI/CD!',
    version: process.env.APP_VERSION || '1.0.0',
    buildNumber: process.env.BUILD_NUMBER || 'local',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

module.exports = app;
