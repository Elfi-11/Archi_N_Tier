const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const socketController = require('./controllers/socketController');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);


socketController(io);

// run serv
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Test l'API à http://localhost:${PORT}`);
});
