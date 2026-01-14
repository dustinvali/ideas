import { useState } from "react"
import type { Idea } from "./models/types" 

const formatter = new Intl.DateTimeFormat("default", {
    month: "long",
    day: "numeric",
    year: "numeric"
})

interface IdeaAreaProps {
    ideas: Idea[]
    onDelete: (id: number) => void | Promise<void>
    onUpdate: (id: number, ideaText: string) => void | Promise<void>
}

export default function IdeaArea({ ideas, onDelete, onUpdate }: IdeaAreaProps) {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingText, setEditingText] = useState("")
    const ideaItemClass = "border w-full my-1 p-2 rounded-md flex flex-col justify-between"

    const copyIdea = (ideaText: string) => {
        void navigator.clipboard.writeText(ideaText)
    }

    const startEdit = (idea: Idea) => {
        setEditingId(idea.id)
        setEditingText(idea.ideaText)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingText("")
    }

    const saveEdit = (id: number) => {
        const trimmed = editingText.trim()

        if (!trimmed) {
            return
        }

        void onUpdate(id, trimmed)
        cancelEdit()
    }

    const ideaList = ideas.map((idea)=> {
        const isEditing = editingId === idea.id

        return (
            <div className={ideaItemClass} key={idea.id}>
                <span className="flex justify-between p-0">
                    {isEditing ? (
                        <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="px-2 py-1 rounded-md resize-none text-sm border w-full mr-2"
                        />
                    ) : (
                        <p className="m-0 p-0">{idea.ideaText}</p>
                    )}
                    <span className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button className="text-sm" type="button" onClick={() => saveEdit(idea.id)}>Save</button>
                                <button className="text-sm" type="button" onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="text-sm" type="button" onClick={() => copyIdea(idea.ideaText)}>Copy</button>
                                <button className="text-sm" type="button" onClick={() => startEdit(idea)}>Edit</button>
                                <button className="cursor-pointer" type="button" onClick={() => onDelete(idea.id)}>🗑️</button>
                            </>
                        )}
                    </span>
                </span>
                <div className="text-xs">{formatter.format(idea.date)}</div>
            </div>
        )
    }).reverse()

    return <>{ideaList}</>
}

