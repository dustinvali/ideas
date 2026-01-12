

export default function Form() {
    return (
        <div className="mt-3 w-[67ch]">
            <form className="flex flex-col">
                <textarea className="px-3 py-2 rounded-lg resize-none text-xl border-1">

                </textarea>
                <button className="mt-1 rounded-md w-20 p-1 text-white bg-blue-500 flex-1" type="submit">Submit</button>
            </form>
        </div>
    )
}