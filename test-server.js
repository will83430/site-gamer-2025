const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
  res.json({ message: 'FONCTIONNE!' });
});

app.listen(3000, () => {
  console.log('Test sur port 3000');
});