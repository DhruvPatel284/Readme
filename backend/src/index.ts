import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';
import { categoryRouter } from './routes/category';
import { adminRouter } from './routes/admin';
import { reportRouter } from './routes/report';


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

app.use('/*',cors());
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);
app.route("/api/v1/category",categoryRouter);
app.route("/api/v1/report",reportRouter);

export default app;