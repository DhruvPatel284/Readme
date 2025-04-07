import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';

export const adminRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: number;
    isAdmin: boolean;
  };
}>();

// Admin middleware to verify if the user is an admin
const adminAuthMiddleware = async (c: any, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as { id: number };

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!user || !user.isAdmin) {
      c.status(403);
      return c.json({ message: "Forbidden: Admin access required" });
    }

    c.set('userId', user.id);
    c.set('isAdmin', true);
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ message: "Invalid or expired token" });
  }
};

// Admin signin route
adminRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json<{ username: string; password: string; name:string; }>();

  if (!body.username || !body.password) {
    c.status(411);
    return c.json({ message: "Invalid inputs" });
  }

  try {
    if (!body.username.endsWith('@admin.com')) {
      c.status(403);
      return c.json({ message: "Invalid admin credentials" });
    }

    const user = await prisma.user.findUnique({
      where: { username: body.username }
    });

    if (!user) {
      const newAdmin = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: 'Admin User',
          isAdmin: true
        }
      });

      const jwt =  await sign({
        id: newAdmin.id,
        name : newAdmin.name,
        username : newAdmin.username
      },"kunjdave");

      return c.json(jwt);
    }

    if (user.password !== body.password) {
      c.status(403);
      return c.json({ message: "Invalid credentials" });
    }

    if (!user.isAdmin) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isAdmin: true }
      });
    }

    const jwt = await sign({
      id: user.id,
      name : user.name,
      username : user.username
    },"kunjdave");

    return c.json(jwt);
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});

// Get all reported blogs
adminRouter.get('/reported-blogs', adminAuthMiddleware, async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const reportedBlogs = await prisma.blog.findMany({
      where: { reports: { some: { status: 'PENDING' } } },
      include: { author: true, reports: true, category: true }
    });

    return c.json({ blogs: reportedBlogs });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});

// Block/unblock a user
adminRouter.patch('/users/:userId/block', adminAuthMiddleware, async (c) => {
  const userId = parseInt(c.req.param('userId'));
  const { block } = await c.req.json<{ block: boolean }>();

  if (isNaN(userId)) {
    c.status(400);
    return c.json({ message: "Invalid user ID" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: block }
    });

    return c.json({
      message: block ? "User blocked successfully" : "User unblocked successfully",
      user: updatedUser
    });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});

// Delete blog
adminRouter.delete('/blogs/:blogId', adminAuthMiddleware, async (c) => {
  const blogId = parseInt(c.req.param('blogId'));

  if (isNaN(blogId)) {
    c.status(400);
    return c.json({ message: "Invalid blog ID" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    await prisma.report.deleteMany({ where: { blogId } });
    await prisma.blog.delete({ where: { id: blogId } });

    return c.json({ message: "Blog deleted successfully" });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});

// Get all users
adminRouter.get('/users', adminAuthMiddleware, async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        isAdmin: true,
        isBlocked: true,
        createdAt: true,
        _count: { select: { blogs: true } }
      }
    });

    return c.json({ users });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});