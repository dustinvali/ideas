import { useState } from 'react'
import './App.css'
import Form from "./Form"
import Header from "./Header"
import IdeaArea from './IdeaArea'
import type { Idea } from "./models/types" 

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  
  return (
    <div className="flex justify-center w-dvw h-dvh">
      <div className='w-[67ch] items-center flex flex-col'>
        <Header />
        <Form ideas={ideas} setIdeas={setIdeas} />
        <IdeaArea ideas={ideas} setIdeas={setIdeas}/>
      </div>
    </div>
  )
}

export default App
