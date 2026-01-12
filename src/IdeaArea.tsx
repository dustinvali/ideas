import type { Idea } from "./App" 

export default function IdeaArea({ ideas }) {
    const ideaList = ideas.map(idea => <div className="border w-full my-1 p-2 rounded-md flex justify-between" key={idea.id}>{idea.ideaText} <span>{idea.date.toLocaleString('default', { month: 'long' })} {idea.date.getDate()}, {idea.date.getFullYear()}</span></div>)
    return <>{ideaList}</>
}

