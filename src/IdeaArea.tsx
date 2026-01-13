import type { Idea } from "./models/types" 

const formatter = new Intl.DateTimeFormat("default", {
    month: "long",
    day: "numeric",
    year: "numeric"
})

export default function IdeaArea({ ideas, setIdeas }) {

    function removeItem(id: number) {
        setIdeas((prevIdeas)=> prevIdeas.filter((idea)=>idea.id !== id))
    }

    const ideaItemClass = "border w-full my-1 p-2 rounded-md flex flex-col justify-between"

    const ideaList = ideas.map((idea)=>(
                <div className={ideaItemClass} key={idea.id}>
                    <span className="flex justify-between p-0">
                        <p className="m-0 p-0">{idea.ideaText}</p>
                        <p className="cursor-pointer" onClick={()=>removeItem(idea.id)}>🗑️</p>
                    </span>
                    <div className="text-xs">{formatter.format(idea.date)}</div>
                </div>
    )).reverse()

    return <>{ideaList}</>
}

