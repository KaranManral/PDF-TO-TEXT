import { NextRequest, NextResponse } from "next/server";
const pdf = require("pdf-parse");
const fs = require("fs");

export async function POST(req:NextRequest){
    if(req.method==="POST"){
        const data = await req.json();
        let obj=null;
        if(data){
            const dataBuffer = Buffer.from((data.url).split("base64,")[1],"base64");
            try{
                await pdf(dataBuffer).then(async function(data:any) {

                    obj = {
                        pagecount:data.numpages,
                        renderpagecount:data.numrender,
                        info:data.info,
                    };
                    
                    let text:string = await data.text;
                    text = text.replace(/\t/g," ");
                    text = text.replace(/\n/g," ");

                    try{
                        await fs.writeFileSync('data.txt',text);
                        console.log("Data Extracted Sucessfully");
                    }
                    catch(err){
                        console.log("Data Extraction Failed",err);
                    }
                });
            }
            catch(e){
                return NextResponse.json({message:"Failed",data:null});
            }
            finally{
                return NextResponse.json({message:"Success",data:obj});
            }
        }
        else{
            return NextResponse.json({message:"Bad Request",data:null});
        }
    }
    else{
        return NextResponse.json({message:"Method Not Allowed",data:null});
    }
}