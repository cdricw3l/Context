
function NavBarButton() {
    return (
        <>
            <div className='flex flex-row px-2'>
                 
                 <button
                   type="submit"
                   className="place-content-center text-red-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
                 > 
                 </button> 
               <div className=" text-sm w-full text-right">
                 <button
                   type="submit"
                   className="place-content-center text-red-500 rounded-sm hover:bg-slate-400 hover:text-slate-500 flex items-center"
                 >
                  
                 </button> 
               </div>
             </div>
        
        </>
        
    );
}

export default NavBarButton;