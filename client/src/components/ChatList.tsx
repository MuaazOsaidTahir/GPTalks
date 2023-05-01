import { FC, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { getRooms } from "../apis/apis";
import ChatListItem from "./ChatListItem"

const ChatList: FC<{ userId?: string, addroomName: string }> = ({ userId, addroomName }) => {
    // const [data, setData] = useState<any[]>([])
    // const [isLoading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState();
    const roomsToggle = useRef(true);
    const { data, isLoading, refetch } = useQuery('rooms', getRooms, {
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    })

    useEffect(() => {
        if (roomsToggle) {
            refetch();
            roomsToggle.current = false;
        }
    }, [])

    return (
        <div className="overflow-hidden space-y-3">
            {isLoading ? <p>Loading chat lists...</p> :
                data?.map((item: any, index: any) => {
                    return <ChatListItem
                        room={item}
                        id={item._id}
                        // onSelect={(idx) => onSelectedChat(idx, item)}
                        // room={{ ...item.room, users: item.users }}
                        key={item._id}
                    // selectedItem={selectedItem}
                    />
                })
            }
        </div>
    )
}

export default ChatList