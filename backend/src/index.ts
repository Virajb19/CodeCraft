import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import cors from 'cors'
import { userRouter } from './routes/user.routes';
import session from 'express-session';
import cookieSession from 'cookie-session'
import { toNodeHandler } from "better-auth/node";
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { isAuthenticated } from './middleware/auth.middleware';
import { authRouter } from './routes/auth.routes';
import { executionRouter } from './routes/code-execution.routes';
import { snippetRouter } from './routes/snippet.routes';
import http from 'http'
import { Server } from 'socket.io'

import './lib/passport.config'
import { stripeRouter } from './routes/stripe.routes';
import { setUpSocketServer } from './lib/socket';
import {RedisStore} from "connect-redis"
import { redis } from './lib/redis';
import path from 'path'
import { auth } from './lib/auth'

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  // adapter: createAdapter(redis)
}) 

setUpSocketServer(io)
          
// app.all("/api/auth/*", toNodeHandler(auth));

app.use(cors({
  origin: process.env.CLIENT_BASE_URL! ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use((req: Request, res: Response, next: NextFunction) => {
   if(req.originalUrl === '/api/stripe/webhook') {
    express.raw({ type: 'application/json' })(req, res, next)
   } else {
    next()
   }
})

app.use(express.json({ limit: '100mb'}))

app.use(session({
  store: new RedisStore({client: redis}),
  secret: process.env.SESSION_SECRET || 'secret', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 15,
  }
})) 

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running')
})

app.use('/api/auth/', authRouter)
app.use('/api/user/', userRouter)
app.use('/api/codeExecution', isAuthenticated, executionRouter)
app.use('/api/snippet', isAuthenticated, snippetRouter)
app.use('/api/stripe', stripeRouter)

// app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
