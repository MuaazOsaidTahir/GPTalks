import { FC, useEffect, useRef } from "react";
import ConversationItem from "./ConversationItem";

const Conversation: FC<{ data: any, auth: any, typing: boolean }> = ({ data, auth, typing }) => {
    const ref = useRef<any>(null);

    useEffect(() => {
        ref.current?.scrollTo(0, ref.current.scrollHeight)
    }, [data]);

    return (
        <div className='p-4 space-y-4 overflow-auto' ref={ref}>
            {
                data.map((item: any, index: any) => {
                    return <ConversationItem
                    first={index === 0}
                    room_id={item?.room_id}
                        right={item.user_id === auth?._id}
                        content={item.content}
                        typing={typing}
                        // username={users.get(item.user_id)}
                        key={item.id || index} />
                })
            }
            {/* {(typing) && <div className='flex gap-3 w-full'>
                <div className='mt-auto'>
                    <Avatar color='rgb(245 158 11)'>{username}</Avatar>
                </div>
                <div className='max-w-[65%] bg-gray-200 p-3 text-sm rounded-xl rounded-bl-none'>
                    <p>Typing...</p>
                </div>
            </div>} */}
        </div>
    )
}

export default Conversation;