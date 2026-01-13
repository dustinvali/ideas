import { useState } from "react"
import type { FormEvent } from 'react'
import type { Idea } from "./models/types" 

export default function Form({ ideas, setIdeas }) {
    const [text, setText] = useState('')


    function updateList(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (text.length === 0) {
            return
        } 
        const trimmed = text.trim()
        const greatestId = ideas.length ? Math.max(...ideas.map(i => i.id)) : 0
        const newIdea: Idea = { 
            ideaText: trimmed, 
            id: greatestId + 1, 
            date: new Date(), 
            isEdit: false}
        

        setIdeas((oldIdeas) => [...oldIdeas, newIdea])
        setText("")
    }


    return (
        <div className="my-3 w-[67ch]">
            <form onSubmit={updateList} className="flex flex-col">
                <textarea onKeyDown={(e)=>
                    {if (e.key==='Enter' && e.metaKey) {
                        e.preventDefault()
                        e.currentTarget.form?.requestSubmit();
                    }}} 
                    value={text} onChange={(e) => { setText(e.target.value) }} className="px-3 py-2 rounded-lg resize-none text-lg border" />
                <button className="mt-1 rounded-md w-fit py-1 px-2 text-white bg-blue-500 flex-1" type="submit">Submit ⌘⏎</button>
            </form>
        </div>
    )
}