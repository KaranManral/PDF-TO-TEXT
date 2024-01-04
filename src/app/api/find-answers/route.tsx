import { pipeline } from '@xenova/transformers';
import { NextRequest, NextResponse } from "next/server";
const fs = require("fs");

const deleteTempFile = async ()=>{
    try {
        fs.unlinkSync('data.txt');
        console.log('Temp File is deleted.');
      } catch (err) {
        console.error(err);
    }
}

export async function GET(req:NextRequest){
    if(req.method==="GET"){
        const ques = req.nextUrl.searchParams.get('search');
        if(ques===null||ques===undefined||ques===""){
            await deleteTempFile();
            return NextResponse.json({message:"Invalid Question",data:null});
        }
        else{
            const answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
            try{
                const context:string = await fs.readFileSync("data.txt","utf8");
                if(context===null||context===undefined||context===""){
                    await deleteTempFile();                    
                    return NextResponse.json({message:"Failed: Data Empty",data:null});
                }
                else{
                    const output = await answerer(ques, context);
                    await deleteTempFile();                    
                    return NextResponse.json({message:"Success",data:output});
                }
            }
            catch(err){
                console.log(err);
                await deleteTempFile();                    
                return NextResponse.json({messgae:"Data Read Failed",data:null});
            }
        }
    }
    else{
        await deleteTempFile();                    
        return NextResponse.json({message:"Method Not Allowed",data:null});
    }
}