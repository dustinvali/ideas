import { useState } from 'react'
import './App.css'
import Form from "./Form"
import Header from "./Header"
import IdeaArea from './IdeaArea'

export interface Idea {
    id: number;
    ideaText: string
    date: Date;
}

const listIdeas: Idea[] = [
]

function App() {
  const [ideas, setIdeas] = useState(listIdeas);
  
  return (
    <div className="flex justify-center w-dvw h-dvh">
      <div className='w-[67ch] items-center flex flex-col'>
        <Header />
        <Form ideas={ideas} setIdeas={setIdeas} />
        <IdeaArea ideas={ideas} />
      </div>
    </div>
  )
}

export default App
