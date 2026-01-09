import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';
import { categoryRouter } from './routes/category';
import { adminRouter } from './routes/admin';
import { reportRouter } from './routes/report';
import { getPrisma } from './controllers/blogController';

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
app.get("/health",async(c)=>{
	const prisma = getPrisma(c.env);
  const id = 1;
  const blog = await prisma.blog.findFirst({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      publishedDate: true,
      categoryId: true, // ✅ Included
      category: { select: { name: true } }, // ✅ Get category name
      author: { select: { name: true } },
    },
  });

  if (!blog) return c.json({ message: "Blog not found" }, 404);

  return c.json({ blog },200);
})
export default app;