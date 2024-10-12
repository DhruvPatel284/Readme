import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { Hono } from 'hono'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { cors } from 'hono/cors';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

const app = new Hono<{
	Bindings: {
		SUPABASE_API_KEY: string,
		SUPABASE_URL: string,
    OPENAI_API_KEY: string,
	}
}>();

app.use('*', cors());
app.post('/', async(c) => {

    try{

      const body = await c.req.json();
      const title = body.title;
      const content = body.content;
      
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize : 500 ,
        chunkOverlap : 50,
        separators : ['\n\n' , '\n' , ' ' , '' ]
      })
      const output =  await splitter.createDocuments([content])
  
      const sbApiKey = c.env.SUPABASE_API_KEY??""
      
      const sbURL = c.env.SUPABASE_URL??""
    
      
      const openAikey = c.env.OPENAI_API_KEY??""

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


app.post('/question', async (c) => {
  try {
    const body = await c.req.json();
    const question = body.inputValue;

    const sbApiKey = c.env.SUPABASE_API_KEY ?? "";
    const sbUrl = c.env.SUPABASE_URL ?? "";
    const openAIApiKey = c.env.OPENAI_API_KEY ?? "";

    const llm = new ChatOpenAI({ openAIApiKey , model: "gpt-4o"});
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });

    const client = createClient(sbUrl, sbApiKey);

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    });

    const retriever = vectorStore.asRetriever();

    // Generate standalone question
    const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:';
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

    // const answerTemplate = `
    //   You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. 
    //   Try to find the answer in the context. 
    //   If you really don't know the answer, say "I'm sorry, I don't know the answer to that." 
    //   Always speak as if you were chatting to a friend.
    //   context: {context}
    //   question: {question}
    //   answer: `;
    const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question based on the context provided. Your answer should summarize or define the topic based on the context.
    context: {context}
    question: {question}
    answer: `;

    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

    // Chains
    const standaloneQuestionChain = standaloneQuestionPrompt
      .pipe(llm)
      .pipe(new StringOutputParser());

    const retrieverChain = RunnableSequence.from([
      (prevResult: any) => {
        console.log("Generated Standalone Question:", prevResult);
        return prevResult.standalone_question;
      },
      retriever,
      (docs: any) => {
        console.log("Retrieved Documents:", docs);
        return combineDocuments(docs);
      },
    ]);

    const answerChain = answerPrompt
      .pipe(llm)
      .pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }: any) => original_input.question,
      },
      async ({ context, question }: any) => {
        // Log the context and question before feeding to answerChain
        console.log("Context before answerChain:", context);
        console.log("Question before answerChain:", question);

        // Execute the answer chain and log the response
        const result = await answerChain.invoke({ context, question });

        // Log the final response from the answer chain
        console.log("AnswerChain Response:", result);

        return result;
      }
    ]);

    // Invoke chain and get response
    const response = await chain.invoke({ question: question });

    // Log final response for debugging
    console.log("Final Response:", response);

    return c.json({
      message: "ok",
      response
    });

  } catch (e) {
    console.error("Error:", e);
    return c.json({ error: "An error occurred." }, 500);
  }
});

// Helper function to combine documents
export function combineDocuments(docs: any) {
  if (docs.length === 0) {
    console.log("No documents retrieved");
    return "No context found";
  }
  return docs.map((doc: any) => doc.pageContent).join('\n\n');
}

export default app;