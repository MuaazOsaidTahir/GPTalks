import { FC, useContext } from "react"
import { Context } from "../context/Provider"
import Avatar from "./Avatar"

const ConversationItem: FC<{ right: boolean, content: string, typing: boolean, first: boolean, room_id: any }> = ({ right, content, first, room_id }) => {
    const { roomPageNumberstate, roomPageNumberDispatch } = useContext(Context)

    const loadMoreChats = () => {
        (roomPageNumberstate?.id === room_id) && roomPageNumberDispatch({ type: 'PAGE_NUMBER', payload: { id: room_id, pageNumber: roomPageNumberstate.pageNumber + 1 } })
    }

    return (
        <>
            {
                (first && roomPageNumberstate?.pageNumber * 20 < roomPageNumberstate?.totalCount  ) && <button className="inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm text-violet-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full" onClick={() => loadMoreChats()} >Load More</button>
            }
            {
                right ?
                    <div className='w-full flex justify-end'>
                        < div className='flex gap-3 justify-end' >
                            <div className=' bg-violet-500 p-3 text-sm rounded-xl rounded-br-none'>
                                <p className='text-white'>{content}</p>
                            </div>
                            <div className='mt-auto'>
                                {/* <Avatar>{username}</Avatar> */}
                            </div>
                        </div >
                    </div > : <div className='flex gap-3 w-full'>
                        <div className='mt-auto'>
                            {/* <Avatar color='rgb(245 158 11)'>{username}</Avatar> */}
                        </div>
                        <div className='bg-gray-200 p-3 text-sm rounded-xl rounded-bl-none'>
                            <p>{content}</p>
                        </div>
                    </div>
            }
        </>
    )
}

export default ConversationItem;