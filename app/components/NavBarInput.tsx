function NavBarInput() {
    return (
        <>
            <div className="  flex justify-center p-2">
                <input type="url" placeholder="git hub link ..." className="rounded- shadow-lg rounded-sm text-left text-black "  />
                <button
                  type="submit"
                  className="place-content-center text-red-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                  </svg>
                </button>  
            </div>
            
            <div className='flex flex-row px-2'>
                <div className=" text-sm w-full">
                    Project: GPTINK
                </div>
                <div className=" text-sm w-full text-right">
                    version: 4.1
                </div>
            </div>
        </>
    );
}

export default NavBarInput;