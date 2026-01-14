import { useEffect, useState } from 'react'
import './App.css'
import Form from "./Form"
import Header from "./Header"
import IdeaArea from './IdeaArea'
import type { Idea } from "./models/types" 

const apiBase = import.meta.env.DEV
  ? "http://localhost:6969"
  : window.location.origin

type ApiIdea = Omit<Idea, "date"> & { date: string }

const parseIdea = (idea: ApiIdea): Idea => ({
  ...idea,
  date: new Date(idea.date)
})

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const response = await fetch(`${apiBase}/ideas`)

        if (!response.ok) {
          return
        }

        const data: ApiIdea[] = await response.json()
        setIdeas(data.map(parseIdea))
      } catch {
        return
      }
    }

    void loadIdeas()
  }, [])

  const addIdea = async (ideaText: string) => {
    try {
      const response = await fetch(`${apiBase}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ideaText })
      })

      if (!response.ok) {
        return
      }

      const created: ApiIdea = await response.json()
      setIdeas((prevIdeas) => [...prevIdeas, parseIdea(created)])
    } catch {
      return
    }
  }

  const updateIdea = async (id: number, ideaText: string) => {
    try {
      const response = await fetch(`${apiBase}/ideas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ideaText })
      })

      if (!response.ok) {
        return
      }

      const updated: ApiIdea = await response.json()
      const parsed = parseIdea(updated)

      setIdeas((prevIdeas) => prevIdeas.map((idea) => (idea.id === id ? parsed : idea)))
    } catch {
      return
    }
  }

  const removeIdea = async (id: number) => {
    try {
      const response = await fetch(`${apiBase}/ideas/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        return
      }

      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id))
    } catch {
      return
    }
  }
  
  return (
    <div className="flex justify-center w-dvw h-dvh">
      <div className='w-[67ch] items-center flex flex-col'>
        <Header />
        <Form onAdd={addIdea} />
        <IdeaArea ideas={ideas} onDelete={removeIdea} onUpdate={updateIdea} />
      </div>
    </div>
  )
}

export default App
