import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';
import { signupInput, signinInput } from "@dhruv156328/medium-common";
import { googleAuth } from "@hono/oauth-providers/google";
import axios from "axios";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
	},
  Variables: {
    userId: string;
    isAdmin: boolean;
  }
}>();



userRouter.post('/signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      })
    }
    
    try {
      const user = await prisma.user.create({
        data:{
          username: body.username,
          password: body.password,
          name: body.name,
          isAdmin: body.isAdmin || false, // Set isAdmin based on input or default to false
        },
      })
        
      const jwt = await sign({
        id: user.id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin, // Include isAdmin in JWT
      }, c.env.JWT_SECRET || "kunjdave");
      
      return c.json(jwt)
      
    } catch(e) {
      console.log(e);
      c.status(411);
      return c.text("Invalid")
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      })
    }
    
    try {
      const user = await prisma.user.findFirst({
        where:{
          username: body.username,
          password: body.password,
        },
      })
        
      if(!user){
        c.status(403);
        return c.text('Invalid')
      }
      
      // Check if user is blocked
      if (user.isBlocked) {
        c.status(403);
        return c.json({ message: "Your account has been blocked. Please contact support." });
      }
      
      const jwt = await sign({
        id: user.id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin, // Include isAdmin in JWT
      }, c.env.JWT_SECRET || "kunjdave");
      
      return c.json(jwt)
      
    } catch(e) {
      c.status(411);
      return c.text("Invalid")
    }
})

userRouter.post('/google-auth', async (c) => {
    const { token } = await c.req.json();
    
    if (!token) {
      c.status(400);
      return c.json({ message: 'Token is required' });
    }
    
    try {
      // Verify the Google token and get user details
      const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      );
      
      const { email, name } = googleResponse.data;
      
      if (!email) {
        c.status(400);
        return c.json({ message: 'Invalid Google token' });
      }
      
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
      let user = await prisma.user.findUnique({
        where: { username: email },
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            username: email,
            name: name || 'Google User',
            password: 'xyz@kunj3740',
            // Google auth users are not admins by default
          },
        });
      }
      
      // Check if user is blocked
      if (user.isBlocked) {
        c.status(403);
        return c.json({ message: "Your account has been blocked. Please contact support." });
      }
      
      // Generate a JWT
      const jwt = await sign({
        id: user.id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin, // Include isAdmin in JWT
      }, c.env.JWT_SECRET || "kunjdave");
      
      return c.json({
        token: jwt,
      });
    } catch (error) {
      console.error('Google token validation error:', error);
      c.status(500);
      return c.json({ message: 'Internal server error' });
    }
});

// Admin routes for user management
userRouter.post('/admin/block/:userId',  async (c) => {
  const userId = Number(c.req.param('userId'));
  
  if (isNaN(userId)) {
    c.status(400);
    return c.json({ message: "Invalid user ID" });
  }
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }
    
    // Don't allow blocking other admins
    if (user.isAdmin) {
      c.status(403);
      return c.json({ message: "Cannot block admin users" });
    }
    
    // Update the user's blocked status
    const blockedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: true }
    });
    
    return c.json({ 
      message: "User blocked successfully", 
      user: {
        id: blockedUser.id,
        username: blockedUser.username,
        name: blockedUser.name,
        isBlocked: blockedUser.isBlocked
      } 
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    c.status(500);
    return c.json({ message: "Failed to block user" });
  }
});

userRouter.post('/admin/unblock/:userId', async (c) => {
  const userId = Number(c.req.param('userId'));
  
  if (isNaN(userId)) {
    c.status(400);
    return c.json({ message: "Invalid user ID" });
  }
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }
    
    // Update the user's blocked status
    const unblockedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false }
    });
    
    return c.json({ 
      message: "User unblocked successfully", 
      user: {
        id: unblockedUser.id,
        username: unblockedUser.username,
        name: unblockedUser.name,
        isBlocked: unblockedUser.isBlocked
      } 
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    c.status(500);
    return c.json({ message: "Failed to unblock user" });
  }
});

// Get all users (admin only)
userRouter.get('/admin/users',  async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        isAdmin: true,
        isBlocked: true,
        createdAt: true,
        _count: {
          select: {
            blogs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return c.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    c.status(500);
    return c.json({ message: "Failed to fetch users" });
  }
});