const express = require('express')
const router = express.Router()
const {LLMChain} = require('langchain/chains')
const {OpenAI} = require("langchain/llms/openai")
const {FewShotPromptTemplate, LengthBasedExampleSelector, PromptTemplate} = require("langchain/prompts")
const {Chroma} = require("langchain/vectorstores/chroma")
const {TokenTextSplitter} = require("langchain/text_splitter")
const {PDFLoader} = require("langchain/document_loaders/fs/pdf")
const {BufferMemory} = require("langchain/memory")

//process.env.OPENAI_API_KEY
require('dotenv').config();
// const memory = new BufferMemory({returnMessages:true, memoryKey: "query"});


const Set_PdfFile = async() =>{
    const loader = new PDFLoader("");
    const docs = await loader.load();
    const textSplitter = new TokenTextSplitter({
        chunkSize: 300,
        chunkOverlap: 20
    });
    const pdf = await textSplitter.splitDocuments(docs);
    const embeddings = new OpenAIEmbeddings({openAIApiKey: TEST_KEY});
    const vectorDB = await Chroma.fromDocuments(pdf,embeddings,{});

    return vectorDB
}


router.get("/sendquery", async(req,res)=>{
    const exampleTemplate = `User: {query}
    AI: {answer}`;

    const examplePrompt = new PromptTemplate({
        template: exampleTemplate,
        inputVariables: ["query", "answer"]
    });

    const examples = [
        {
            query: "Are you a robot?",
            answer: "I prefer the term 'highly advanced AI.' But yes, I'm a robot in disguise."
        },
        {
            query: "Tell me a joke.",
            answer: "Why don't scientists trust atoms? Because they make up everything!"
        }
    ];

    const exampleSelector = new LengthBasedExampleSelector({
        examples: examples,
        examplePrompt: examplePrompt,
        maxLength: 50,
    });

    const dynamicPromptTemplate = new FewShotPromptTemplate({
        exampleSelector: exampleSelector,
        // examplePrompt: prompt,
        prefix: `The following are exerpts from conversations with an AI assistant. The assistant is only sarcastic and witty and very sass, producing creative and funny responses to 
        the users questions. Here are some examples:\n`,
        suffix: "\nUser: {query}\nAnswer: ",
        inputVariables: ["query"],
        exampleSeparator: "\n\n"
    });



    const message = req.query.message
    const model_name = req.query.model_name
    if(typeof message === "string" && message){

        const model = new OpenAI({
            modelName: model_name,
            maxTokens: 200,
            openAIApiKey: TEST_KEY,
            streaming: true,
            temperature: 0.8,
            callbacks:[
                {
                    handleLLMNewToken(token){
                        console.log("New token: ",token)
                        res.write(token);
                    }
                }
            ]
        },
        Set_PdfFile,
        {returnSourceDocuments:true}
        )
    
        const chain = new LLMChain({ llm: model, prompt: dynamicPromptTemplate});
    
        await chain.call({query: message});
        res.end();
    }else{
        res.json({error: "No message provided"})
    }



})

module.exports = router;