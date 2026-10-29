import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/projects/project/project.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import collaborationRoutes from './modules/collaboration/collaboration.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import userRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());

app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Management API is running',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/users", userRoutes);

export default app;