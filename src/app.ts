import express from 'express';
const app = express();
import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler';
import routeNotFound from './middleware/routeNotFound';
import Routes from './routes';
import paymentController from './modules/payment/payment.controller';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket';

app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook,
);

// middleWares
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: ['*', 'http://localhost:5173'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }),
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
setupSocket(io);

// make io available in controllers
app.set('io', io);

app.get('/', (req, res) => {
  res.send('Welcome to wiizyco server..!');
});

// Routes
app.use('/api/v1', Routes);

// route not found
app.use(routeNotFound);

// global error handler
app.use(globalErrorHandler);

export default app;
