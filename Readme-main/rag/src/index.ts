import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { Hono } from 'hono'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { cors } from 'hono/cors';


const app = new Hono()
app.use('*', cors());
app.post('/', async(c) => {

    try{

      const body = await c.req.json();
      const title = body.title;
      const content = body.content;
      console.log(body)
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize : 500 ,
        chunkOverlap : 50,
        separators : ['\n\n' , '\n' , ' ' , '' ]
      })
      const output =  await splitter.createDocuments([content])
  
      const sbApiKey = process.env.SUPABASE_API_KEY??""
      
      const sbURL = process.env.SUPABASE_URL??""
      
      const openAikey = process.env.OPENAI_API_KEY??""

      const client = createClient( sbURL , sbApiKey );
  
      await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({openAIApiKey : openAikey} ,),
        {
          client , 
          tableName : 'documents'
        }
      )
      return c.text("embeded successfully");
    }catch(e){
      console.log(e)
      return c.text("embeding error");
    }
})
export default app