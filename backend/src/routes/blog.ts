import { Hono, Next , Context} from "hono";
import {verify} from "hono/jwt";
import { createBlog, updateBlog, getAllBlogs, getUserBlogs, getBlogById, deleteBlog, correctGrammar } from "../controllers/blogController";

export const blogRouter = new Hono<{ Bindings: { DATABASE_URL: string; JWT_SECRET: string }; Variables: { userId: string } }>();

blogRouter.use("/*", async (c: Context, next: Next): Promise<void> => {
  const authHeader = c.req.header("authorization") || "";

  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user) {
      c.set("userId", user.id);
      await next(); // ✅ Proceed to the next middleware or route
    } else {
      c.json({ message: "You are not logged in" }, 403); // ✅ Return correct JSON response
    }
  } catch {
     c.json({ message: "You are not logged in" }, 403); // ✅ Return correct JSON response
  }
});

blogRouter.post("/", createBlog);
blogRouter.put("/", updateBlog);
blogRouter.get("/bulk", getAllBlogs);
blogRouter.get("/userid", getUserBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/blogDelete", deleteBlog);
blogRouter.post("/grammar-correction", correctGrammar);