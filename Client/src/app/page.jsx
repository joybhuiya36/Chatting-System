"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const App = () => {
  const [id,setId]=useState("");
  const navigate=useRouter();
  return (
    <div>
      <input type="text" value={id} onChange={(e)=>setId(e.target.value)}/>
      <button onClick={()=>navigate.push(`/chat/${id}`)}>Go to Chatbox</button>
    </div>
  )
}

export default App