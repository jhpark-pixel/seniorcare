import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

import authRouter from './routes/auth';
import residentsRouter from './routes/residents';
import healthRecordsRouter from './routes/healthRecords';
import fallEventsRouter, { setSocketIO } from './routes/fallEvents';
import iotDevicesRouter from './routes/iotDevices';
import programsRouter from './routes/programs';
import guidesRouter from './routes/guides';
import dashboardRouter from './routes/dashboard';
import reportsRouter from './routes/reports';
import dailyTasksRouter from './routes/dailyTasks';
import managementRouter from './routes/management';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.IO 설정
setSocketIO(io);

io.on('connection', (socket) => {
  console.log(`클라이언트 연결: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`클라이언트 연결 해제: ${socket.id}`);
  });

  socket.on('join', (room: string) => {
    socket.join(room);
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/residents', residentsRouter);
app.use('/api/health-records', healthRecordsRouter);
app.use('/api/fall-events', fallEventsRouter);
app.use('/api/iot-devices', iotDevicesRouter);
app.use('/api/programs', programsRouter);
app.use('/api/guides', guidesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/daily-tasks', dailyTasksRouter);
app.use('/api/management', managementRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 프로덕션: 클라이언트 정적 파일 서빙
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);
});

export { io };
