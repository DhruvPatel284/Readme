import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Initialize Prisma with Accelerate
const getPrisma = (env: any) => {
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(
    withAccelerate()
  );
};

// Create a new report
export const createReport = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const body = await c.req.json();
  const reporterId: number = c.get("userId");

  if (!reporterId) return c.json({ message: "Unauthorized" }, 401);
  
  // Validate input
  if (!body.blogId || !body.reason) {
    return c.json({ message: "Blog ID and reason are required" }, 400);
  }

  try {
    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: Number(body.blogId) }
    });

    if (!blog) {
      return c.json({ message: "Blog not found" }, 404);
    }

    // Check if user already reported this blog
    const existingReport = await prisma.report.findFirst({
      where: {
        blogId: Number(body.blogId),
        reporterId: reporterId
      }
    });

    if (existingReport) {
      return c.json({ message: "You have already reported this blog" }, 400);
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        reason: body.reason,
        blogId: Number(body.blogId),
        reporterId: reporterId
      }
    });

    return c.json({ 
      message: "Blog reported successfully", 
      reportId: report.id 
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return c.json({ message: "Failed to create report" }, 500);
  }
};

// Get all reports (admin only)
export const getAllReports = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const isAdmin: boolean = c.get("isAdmin");

  if (!isAdmin) {
    return c.json({ message: "Unauthorized. Admin access required" }, 403);
  }

  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        blog: {
          select: {
            id: true,
            title: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return c.json({ message: "Error fetching reports" }, 500);
  }
};

// Delete a report (admin only)
export const deleteReport = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);

  const reportId = c.req.param('reportId');
  
  if (!reportId) {
    return c.json({ message: "Report ID is required" }, 400);
  }

  try {
    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: Number(reportId) }
    });

    if (!report) {
      return c.json({ message: "Report not found" }, 404);
    }

    // Delete the report
    await prisma.report.delete({
      where: { 
        id: Number(reportId) 
      }
    });

    return c.json({ 
      message: "Report deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return c.json({ message: "Failed to delete report" }, 500);
  }
};

// Get reports by user
export const getUserReports = async (c: Context): Promise<Response> => {
  const prisma = getPrisma(c.env);
  const reporterId: number = c.get("userId");

  if (!reporterId) return c.json({ message: "Unauthorized" }, 401);

  try {
    const reports = await prisma.report.findMany({
      where: {
        reporterId: reporterId
      },
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        blog: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({ reports });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return c.json({ message: "Error fetching reports" }, 500);
  }
};