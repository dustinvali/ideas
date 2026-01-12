import type { Idea } from "./App"
import { useState } from "react"
import type { FormEvent } from 'react'

export default function Form({ ideas, setIdeas }) {
    const [text, setText] = useState('')


    function update_list(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const greatestId = ideas.length ? Math.max(...ideas.map(i => i.id)) : 0
        const newIdea: Idea = { 
            ideaText: text, 
            id: greatestId + 1, 
            date: new Date() 
        }

        setIdeas((old_ideas) => [...old_ideas, newIdea])
        setText("")
        console.log(ideas)
    }

    return (
        <div className="my-3 w-[67ch]">
            <form onSubmit={update_list} className="flex flex-col">
                <textarea value={text} onChange={(e) => { setText(e.target.value) }} className="px-3 py-2 rounded-lg resize-none text-lg border">

                </textarea>
                <button className="mt-1 rounded-md w-fit py-1 px-2 text-white bg-blue-500 flex-1" type="submit">Submit ⌘⏎</button>
            </form>
        </div>
    )
}