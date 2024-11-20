const express = require('express');
const dotevn = require("dotenv");
const app = express();
const PORT = 3000;
dotevn.config();

const authRoutes = require('./routes/authRoutes');

app.use(express.static('views'));

// Use routes
app.use(authRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

