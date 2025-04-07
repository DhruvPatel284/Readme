import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

// ✅ Fix: Initialize Prisma with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  publishedDate?: Date;
  categoryId?: number; // ✅ Added categoryId
}

// ✅ Fix: Pass `env.DATABASE_URL` explicitly
const getPrisma = (env: any) => {
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(
    withAccelerate()
  );
};

// ✅ Create a new blog
export const createBlog = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const authorId: number | undefined = c.get("userId");

  if (!authorId) return c.json({ message: "Unauthorized" }, 401);

  const blog: Blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId,
      categoryId: body.categoryId ?? null, // ✅ Optional categoryId
    },
  });

  return c.json({ id: blog.id });
};

// ✅ Update an existing blog
export const updateBlog = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();

  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: { title: body.title, content: body.content },
  });

  return c.json({ id: blog.id });
};

// ✅ Get all blogs (Fix: Include `categoryId` and `category.name`)
export const getAllBlogs = async (c: Context): Promise<Response> => {
  try {
    const prisma = getPrisma(c.env);

    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        publishedDate: true,
        categoryId: true, // ✅ Included
        category: { select: { name: true } }, // ✅ Get category name
        author: { select: { name: true } },
      },
    });

    return c.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return c.json({ message: "Error fetching blogs" }, 500);
  }
};

// ✅ Get user-specific blogs
export const getUserBlogs = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const token = c.req.header("authorization") || "";
  const user = await verify(token, c.env.JWT_SECRET);

  if (!user || !user.id) return c.json({ message: "Unauthorized" }, 401);

  const blogs = await prisma.blog.findMany({
    where: { authorId: user.id },
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

  return c.json({ blogs });
};

// ✅ Get a blog by ID (Fix: Include `categoryId`)
export const getBlogById = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const id = Number(c.req.param("id"));

  if (isNaN(id)) return c.json({ message: "Invalid blog ID" }, 400);

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

  return c.json({ blog });
};

// ✅ Delete a blog
export const deleteBlog = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();

  if (!body.id) return c.json({ message: "Blog ID is required" }, 400);

  const blog = await prisma.blog.delete({ where: { id: body.id } });

  return c.json({ message: "Blog deleted successfully", blog });
};

// ✅ Mock AI Grammar Correction (Temporary)
export const correctGrammar = async (c: Context): Promise<Response> => {
  const body = await c.req.json();

  if (!body.text) return c.json({ error: "Text is required for grammar correction." }, 400);

  return c.json({ correctedText: `${body.text} (corrected)` });
};