import moment from "moment";
import { useState, useEffect, FC, useRef, useContext } from "react";
import { useQuery } from "react-query";
import { Context } from "../context/Provider";
import { fetchConversations, getRooms } from "../apis/apis";
import Avatar from "./Avatar";

const ChatListItem: FC<{ room: any, id: any }> = ({ room, id }) => {
    // const { fetchConversations } = useConversation();
    const [roommessage, setroommessage] = useState<any>([]);
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    const [totalCounts, settotalCounts] = useState(0);
    const { roomstate, messagesDispatch, roomDispatch, roomPageNumberstate, roomPageNumberDispatch, setrecievedCall, socket } = useContext(Context)
    const { refetch: roomfetchQuery } = useQuery([id, currentPageNumber], fetchConversations, {
        refetchOnWindowFocus: false,
        enabled: false,
        notifyOnChangeProps: ['data'],
        onSuccess: (data) => {
            setroommessage(() => data?.chats);
            settotalCounts(() => data?.totalCount)
        }
    })
    const [typing, settyping] = useState(false)
    const toggle = useRef(true);
    const [userLoggedIn, setuserLoggedIn] = useState<any>({});
    const { refetch } = useQuery('rooms', getRooms, {
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    })

    useEffect(() => {
        if (id && toggle.current) {
            socket.emit('join', id)
            socket.on(id, (typing: any) => {
                if (typing.mode === 'IN') {
                    settyping(true);
                }
                else {
                    settyping(false)
                }
            })

            socket.on(`recieve_message:${id}`, (msg: any) => {
                setroommessage((e: any) => [...e, msg]);
            })

            socket.on(`recieve_call:${id}`, (gettingcall: any) => {
                // debugger
                setrecievedCall(gettingcall)
            })
            roomfetchQuery()
            toggle.current = false;
            setuserLoggedIn(JSON.parse(localStorage.getItem('chat-app-user') || ''))
        }
    }, [])

    useEffect(() => {
        if (roomstate?._id) {
            socket?.off(`recieve_message:${id}`);

            socket.on(`recieve_message:${id}`, (msg: any) => {
                (id === msg?.room_id) ? (() => {
                    setroommessage((e: any) => {
                        return [...e, msg]
                    });
                    // let updatedmessages = [...roommessage, msg];
                    // messagesDispatch({ type: 'MESSAGES', payload: updatedmessages });
                })() : setroommessage((e: any) => [...e, msg])
                refetch()
            })
        }
    }, [roomstate])

    useEffect(() => {
        if (roommessage?.length > 0) {
            roommessage[roommessage?.length - 1]?.room_id === roomstate?._id ? (() => {
                messagesDispatch({ type: 'MESSAGES', payload: roommessage })
            })()
                : ''
        }
    }, [roommessage])

    useEffect(() => {
        if (roomPageNumberstate.pageNumber) {
            (roomPageNumberstate?.id === id) && (() => {
                setcurrentPageNumber((val) => {
                    if (val !== roomPageNumberstate?.pageNumber) {
                        return roomPageNumberstate?.pageNumber
                    }
                });
            })()
        }
    }, [roomPageNumberstate])

    useEffect(() => {
        if (currentPageNumber !== 1 && currentPageNumber) {
            roomfetchQuery();
        }
    }, [currentPageNumber])


    return (
        <div
            onClick={() => {
                messagesDispatch({ type: 'MESSAGES', payload: roommessage });
                roomDispatch({ type: 'SELECTED_ROOM', payload: room })
                roomPageNumberDispatch({ type: 'PAGE_NUMBER', payload: { id: id, pageNumber: currentPageNumber, totalCount: totalCounts } })
            }}
            className={`${false ? 'bg-[#FDF9F0] border border-[#DEAB6C]' : 'bg-[#FAF9FE] border border-[#FAF9FE]'} p-2 rounded-[10px] shadow-sm cursor-pointer`} >
            <div className='flex justify-between items-center gap-3'>
                <div className='flex gap-3 items-center w-full'>
                    <Avatar>{room?.name}</Avatar>
                    <div className="w-full max-w-[150px]">
                        <h3 className='font-semibold text-sm text-gray-700'>{room?.name}</h3>
                        {typing ? <p className="text-xs font-light text-sky-400">Typing...</p> : <p className='font-light text-xs text-gray-600 truncate'>{roommessage[roommessage?.length - 1]?.user_id === userLoggedIn?._id ? `You: ${roommessage[roommessage?.length - 1]?.content}` : roommessage[roommessage?.length - 1]?.content}</p>}
                    </div>
                </div>
                <div className='text-gray-400 min-w-[55px]'>
                    <span className='text-xs'>{roommessage[roommessage?.length - 1]?.created_at ? moment(roommessage[roommessage?.length - 1]?.created_at).fromNow(true) : ''}</span>
                </div>
            </div>
        </div>
    )
}

export default ChatListItem