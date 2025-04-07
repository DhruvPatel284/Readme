import { Hono } from "hono";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

export const categoryRouter = new Hono();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.put("/", updateCategory);
categoryRouter.delete("/", deleteCategory);