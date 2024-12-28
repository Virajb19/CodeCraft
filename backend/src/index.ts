import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRouter } from './routes/user.routes';
import session from 'express-session';
import passport from 'passport'
import { isAuthenticated } from './middleware/auth.middleware';
import { authRouter } from './routes/auth.routes';
import { executionRouter } from './routes/code-execution.routes';
import { snippetRouter } from './routes/snippet.routes';
import './lib/passport.config'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.on('connection', socket => {
    console.log(`user connected ${socket.id}`)

    socket.join
})

app.use(cors({
  origin: process.env.CLIENT_BASE_URL ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth/', authRouter)
app.use('/api/user/', userRouter)
app.use('/api/codeExecution', isAuthenticated, executionRouter)
app.use('/api/snippet', isAuthenticated, snippetRouter)

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  