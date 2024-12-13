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
	}
}>();



userRouter.post('/signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json();
  const { success } =  signupInput.safeParse(body);
  if(!success){
     c.status(411);
     return c.json({
      message:"Inputs not correct"
     })
  }
   
    try{
      const user = await prisma.user.create({
        data:{
          username: body.username,
          password: body.password,
          name:body.name
        },
    
      })
      
      const jwt = await sign({
        id: user.id,
        name : user.name,
        username : user.username
      },"DhruvP");
      // console.log(jwt)
      return c.json(jwt)
     
    }catch(e){
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
  const { success } =  signinInput.safeParse(body);
  if(!success){
     c.status(411);
     return c.json({
      message:"Inputs not correct"
     })
  }
   
    try{
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
      const jwt = await sign({
        id: user.id,
        name : user.name,
        username : user.username
      },"DhruvP");
  
      return c.json(jwt)
     
    }catch(e){
      c.status(411);
      return c.text("Invalid")
    }})

    
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
            },
          });
        }
    
        // Generate a JWT
        const jwt = await sign({
          id: user.id,
          name : user.name,
          username : user.username
        },"DhruvP");
    
        return c.json({
          token: jwt,
        });
      } catch (error) {
        console.error('Google token validation error:', error);
        c.status(500);
        return c.json({ message: 'Internal server error' });
      }
    });
    