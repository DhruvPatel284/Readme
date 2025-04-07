import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// ✅ Fix: Initialize Prisma correctly using `env.DATABASE_URL`
const getPrisma = (env: any) => {
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(
    withAccelerate()
  );
};

// ✅ Create a new category
export const createCategory = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const { name } = await c.req.json();

  if (!name) return c.json({ message: "Category name is required" }, 400);

  try {
    const category = await prisma.category.create({ data: { name } });
    return c.json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ message: "Error creating category" }, 500);
  }
};

// ✅ Get all categories
export const getAllCategories = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);

  try {
    const categories = await prisma.category.findMany();
    return c.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ message: "Error fetching categories" }, 500);
  }
};

// ✅ Update a category
export const updateCategory = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const { id, name } = await c.req.json();

  if (!id || !name) return c.json({ message: "Category ID and name are required" }, 400);

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return c.json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ message: "Error updating category" }, 500);
  }
};

// ✅ Delete a category
export const deleteCategory = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const { id } = await c.req.json();

  if (!id) return c.json({ message: "Category ID is required" }, 400);

  try {
    await prisma.category.delete({ where: { id } });
    return c.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ message: "Error deleting category" }, 500);
  }
};