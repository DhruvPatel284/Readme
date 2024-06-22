import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';
import { createBlogInput,updateBlogInput } from "@dhruv156328/medium-common";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	}
    Variables:{
        userId:string;
    }
}>();

blogRouter.use("/*", async (c,next) =>{
   const authHeader = c.req.header("authorization") || "";
   try{
    const user = await verify(authHeader,c.env.JWT_SECRET);
    if(user){
     c.set("userId",user.id)
     await next();
    } else {
         c.status(403)
         return c.json({
         message:"You are  not logged in"
         })
    }
   } catch(e){
    c.status(403);
    return c.json({
        message:"You are not logged in"
    })
   }

})


blogRouter.post('/',async (c) => {
   try {
     const body = await c.req.json();
     const { success } =  createBlogInput.safeParse(body);
     if(!success){
        c.status(411);
        return c.json({
         message:"Inputs not correct"
        })
     }
 
     const authorId = c.get("userId");
     const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
     }).$extends(withAccelerate())
     
     const blog = await prisma.blog.create({
         data: {
              title: body.title,
              content: body.content,
              authorId: Number(authorId)
         }
     })
 
     return c.json({
         id: blog.id
     })
   } catch (error) {
      console.log(error)
      return c.json({
        error
      })
   }

})

blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const { success } =  updateBlogInput.safeParse(body);
    if(!success){
       c.status(411);
       return c.json({
        message:"Inputs not correct"
       })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blog = await prisma.blog.update({
        where: {
            id:body.id
        },
        data: {
             title: body.title,
             content: body.content,
            
        }
    })

    return c.json({
        id: blog.id
    })
})


blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blogs = await prisma.blog.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            publishedDate:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });

	return c.json({
        blogs
    })
})

blogRouter.get('/userid', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const token = c.req.header("authorization") || ""; 
        const user = await verify(token,c.env.JWT_SECRET);
    
        const userId = user.id;
    
        const blogs = await prisma.blog.findMany({
          where: {
            authorId: userId,
          },
          select: {
            content: true,
            title: true,
            id: true,
            publishedDate:true,
            author: {
              select: {
                name: true,
              },
            },
          },
        });
    
        return c.json({
          blogs,
        });
      } catch (error) {
        console.error('Error fetching user blogs:', error);
        return c.status(500);
      }
})


blogRouter.get('/:id', async (c) => {
    const id =  c.req.param("id");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try{
        const blog = await prisma.blog.findFirst({
            where: {
                id:Number(id)
            },
            select: {
                id:true,
                title: true,
                content: true,
                publishedDate:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })

        return c.json({
            blog
        })
    } catch(e) {
        c.status(411)
        return c.json({
            message:"Error While fetching blog post"
        })
    }
})

blogRouter.post('/blogDelete', async (c) => {
    try {
        // Parse the request body
        const body = await c.req.json();

        // Initialize Prisma Client
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: c.env.DATABASE_URL,
                },
            },
        }).$extends(withAccelerate());

        console.log(body);

        // Delete the blog from the database
        const blog = await prisma.blog.delete({
            where: {
                id: body.id,
            },
        });

        // Return success response
        return c.json({
            message: "Blog deleted successfully",
            blog,
        });

    } catch (error:any) {
        console.error('Error deleting blog:', error);
        return c.json({
            message: "Error deleting blog",
            error: error.message,
        }, { status: 500 });
    }
});
