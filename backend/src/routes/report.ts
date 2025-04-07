import { Hono, Next, Context } from "hono";
import { verify } from "hono/jwt";
import { 
  createReport, 
  getAllReports, 
  deleteReport, 
  getUserReports 
} from "../controllers/reportController";

export const reportRouter = new Hono<{ 
  Bindings: { 
    DATABASE_URL: string; 
    JWT_SECRET: string 
  }; 
  Variables: { 
    userId: number;
    isAdmin: boolean; 
  } 
}>();

// Authentication middleware
reportRouter.use("/*", async (c: Context, next: Next): Promise<void> => {
  const authHeader = c.req.header("authorization") || "";
  
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    
    if (user) {
      c.set("userId", user.id);
      
      // Check if user is an admin based on email ending with @admin.com
      if (user.username && typeof user.username === "string" && user.username.endsWith("@admin.com")) {
        c.set("isAdmin", true);
      } else {
        c.set("isAdmin", false);
      }
      
      await next(); // Proceed to the next middleware or route
    } else {
      c.json({ message: "You are not logged in" }, 403);
    }
  } catch {
    c.json({ message: "You are not logged in" }, 403);
  }
});

// User routes
reportRouter.post("/", createReport);             // Create a report
reportRouter.get("/my-reports", getUserReports);  // Get user's own reports

// Admin routes (with admin check in controllers)
reportRouter.get("/admin/all", getAllReports);             // Get all reports
reportRouter.delete("/admin/delete/:reportId", deleteReport);     // Update report status

export default reportRouter;