// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 BlogNest Backend is Running');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
