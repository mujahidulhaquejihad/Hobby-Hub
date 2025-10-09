require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');

const app = express();

app.use(express.json())
app.use(cors());
app.use(cookieParser())


//#region // !Socket
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
    SocketServer(socket);
})
//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
//#endregion


const URI = process.env.MONGODB_URI;
mongoose.connect(URI)
.then(() => console.log("Database Connected!!"))
.catch(err => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 8080; // Make sure your client connects to this port
http.listen(port, () => {
  console.log("Listening on ", port);
});

