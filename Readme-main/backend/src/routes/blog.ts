import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';
import { createBlogInput,updateBlogInput } from "@dhruv156328/medium-common";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import AWS from "aws-sdk";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        AWS_REGION:string;
        AWS_S3_BUCKET_NAME:string;

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

blogRouter.post('/updateBlog', async (c) => {
    try {
        const body = await c.req.json();

        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: c.env.DATABASE_URL,
                },
            },
        }).$extends(withAccelerate());

        const blog = await prisma.blog.update({
            where: {
                id: body.id,  
            },
            data: {
                title: body.title,  
                content: body.content,  
            },
        });

        return c.json({
            message: "Blog updated successfully",
        });

    } catch (error:any) {
        console.error('Error deleting blog:', error);
        return c.json({
            message: "Error deleting blog",
            error: error.message,
        }, { status: 500 });
    }
});




blogRouter.post('/upload-avatar', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL,
            },
        },
    }).$extends(withAccelerate());
  
    // Configure the S3 client (AWS SDK v3)
    const s3Client = new S3Client({
      region: c.env.AWS_REGION,
      credentials: {
        accessKeyId: c.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  
    const formData = await c.req.parseBody();
    const document = formData.avatar as File;
  
    if (!document) {
      return c.text('Missing fields', 400);
    }
  
    const bucketName = c.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      return c.text('S3 bucket name is not configured', 500);
    }
  
    try {
      const documentId = uuidv4();
      const documentKey = `${documentId}-${document.name}`;
  
      const arrayBuffer = await document.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const userId = c.get("userId");
      console.log(userId)

      const uploadParams = {
        Bucket: bucketName,
        Key: documentKey,
        Body: uint8Array, // Use Uint8Array as the file content
        ContentType: document.type,
      };
  
      const command = new PutObjectCommand(uploadParams);
      const s3Response = await s3Client.send(command);
  
   
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: { avatar: `https://${bucketName}.s3.${c.env.AWS_REGION}.amazonaws.com/${documentKey}` }, 
      });
   
    // const updatedUser = await prisma.user.update({
    //     where: { id: Number(userId) }, 
    //     data: { avatar: 'some-url' },
    //   });
    //   console.log(updatedUser);
  
      return c.text('Document uploaded successfully', 200);
    } catch (error) {
      console.error('Document upload failed:', error);
      return c.text('Internal server error', 500);
    }
  });



blogRouter.get('/getAvatar', async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());;

  try {
    // Retrieve the userId from the request (you can also use headers, cookies, etc.)
    const userId = c.get("userId");  // Ensure this is properly passed
    console.log(userId)
    if (!userId) {
      return c.text('User ID is missing', 400);
    }

    // Fetch the user from the database
    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
      select: { avatar: true },
    });

    // If user or avatar is not found
    if (!user || !user.avatar) {
      return c.text('Avatar not found', 404);
    }

    // Return the avatar URL
    return c.json({ avatarUrl: user.avatar }, 200);
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return c.text('Internal server error', 500);
  }
});

