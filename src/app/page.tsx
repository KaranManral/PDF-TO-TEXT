"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export default function Home(this: any) {
  const [pageCount,setPageCount] = useState(0);
  useEffect(()=>{},[pageCount]);

  const handleUpload = async (e:any)=>{
    e.target.disabled = true;
    const reader = new FileReader();
    reader.addEventListener("load",()=>{
      let Url = reader.result;
      axios.post("/api/upload",{"url":Url},{
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }}).then((response:AxiosResponse)=>{
          
          const upload = document.getElementById("upload");
          const search = document.getElementById("searchForm");
          if(upload&&search){
            upload.classList.remove("flex");
            search.classList.remove("hidden");
            upload.classList.add("hidden");
            search.classList.add("flex");
            setPageCount(response.data.data.renderpagecount);
          }
          else window.location.reload();
      }).catch((error:AxiosError)=>{
        e.target.disabled = false;
        console.log(error);
      });
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  const submitQuestion =async (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    let searchQues = document.getElementById("search") as HTMLInputElement | null;
    let submitBtn = document.getElementById("submit") as HTMLInputElement | null;
    if(searchQues&&submitBtn){
      searchQues.disabled = true;
      submitBtn.disabled = true;
    }
    if(pageCount===null||pageCount===undefined||pageCount===0){
      alert("Solution PDF has no readable answers");
      window.location.reload();
      return false;
    }
    else{
      if(searchQues&&submitBtn){
        let ques = searchQues.value;
        if(ques===null||ques===undefined||ques===""){
          alert("Invalid Question");
          searchQues.disabled = false;
          submitBtn.disabled = false;
          return false;
        }
        else{
          axios.get(`/api/find-answers?search=${ques}`).then((res:AxiosResponse)=>{
            let ans = document.getElementById("answer");
            if(ans){
              console.log(res);
              ans.innerHTML+= res.data.data.answer;
              ans.innerHTML+=`<br/><br/>Accuracy = ${res.data.data.score} `;
            }
          }).catch((error:AxiosError)=>{
            if(searchQues&&submitBtn){
              searchQues.disabled = false;
              submitBtn.disabled = false;
            }
            console.log(error);
          });
        }
      }
      else{
        alert("Invalid Question");
        if(searchQues&&submitBtn){
          searchQues.disabled = false;
          submitBtn.disabled = false;
        }
        return false;
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container flex justify-center items-center min-h-screen border-2 border-gray-400 rounded-lg p-5">
        <label htmlFor='pdf' className="p-12 text-2xl w-fit flex flex-col items-center border border-black cursor-pointer" id='upload'>
          <h1>PDF FILE</h1>
          <FontAwesomeIcon icon={faArrowUp} width={32} height={32} />
          <input type="file" name="pdf" id="pdf" accept='application/pdf' className='hidden' onChange={handleUpload.bind(this)} />
          <br />
          <label htmlFor="pdf" className='p-4 my-0 mx-auto rounded-md text-gray-100 cursor-pointer bg-green-500 hover:bg-green-600'>Upload File</label>
        </label>
        <form method='get' action={"/api/find-answers"} id='searchForm' className="search hidden flex-col justify-center items-center" onSubmit={submitQuestion.bind(this)}>
          <input type="text" name="search" id="search" maxLength={1000} className='p-2 border border-gray-200 rounded-md' placeholder='Enter your query here.' />
          <br />
          <input type="submit" id='submit' className='p-4 rounded-lg text-gray-100 bg-blue-500 cursor-pointer hover:bg-blue-600' value="Find Answer" />
          <br />
          <div className="container border-2 border-b-gray-400 rounded-md p-12 text-xl text-center" id='answer'>
            <h1>Answer</h1>
          </div>
        </form>
      </div>
    </main>
  )
}
