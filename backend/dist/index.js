"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = require("./routes/user.routes");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const auth_routes_1 = require("./routes/auth.routes");
const code_execution_routes_1 = require("./routes/code-execution.routes");
const snippet_routes_1 = require("./routes/snippet.routes");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
require("./lib/passport.config");
const stripe_routes_1 = require("./routes/stripe.routes");
const socket_1 = require("./lib/socket");
const connect_redis_1 = require("connect-redis");
const redis_1 = require("./lib/redis");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_BASE_URL,
        methods: ['GET', 'POST'],
        credentials: true
    },
    // adapter: createAdapter(redis)
});
(0, socket_1.setUpSocketServer)(io);
// app.all("/api/auth/*", toNodeHandler(auth));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((req, res, next) => {
    if (req.originalUrl === '/api/stripe/webhook') {
        express_1.default.raw({ type: 'application/json' })(req, res, next);
    }
    else {
        next();
    }
});
app.use(express_1.default.json({ limit: '100mb' }));
app.use((0, express_session_1.default)({
    store: new connect_redis_1.RedisStore({ client: redis_1.redis }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 3,
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth/', auth_routes_1.authRouter);
app.use('/api/user/', user_routes_1.userRouter);
app.use('/api/codeExecution', auth_middleware_1.isAuthenticated, code_execution_routes_1.executionRouter);
app.use('/api/snippet', auth_middleware_1.isAuthenticated, snippet_routes_1.snippetRouter);
app.use('/api/stripe', stripe_routes_1.stripeRouter);
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
