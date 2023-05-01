import { createContext, useReducer, useState } from 'react'
import reducer from './reducer';
import roomreducer from './roomreducer';
import typingreducer from './currentRoomPageNumber';

export const Context = createContext<any>(null);

interface Props {
    children: any
}

function Provider({ children }: Props) {
    const [messages, messagesDispatch] = useReducer(reducer, null)
    const [roomPageNumberstate, roomPageNumberDispatch] = useReducer(typingreducer, false)
    const [roomstate, roomDispatch] = useReducer(roomreducer, null)
    const [recievedCall, setrecievedCall] = useState<any>(null)
    const [socket, setsocket] = useState(null)
    return (
        <Context.Provider value={{
            messages, messagesDispatch,
            socket, setsocket,
            roomPageNumberstate, roomPageNumberDispatch,
            roomstate, roomDispatch,
            recievedCall, setrecievedCall
        }} >
            {children}
        </Context.Provider>
    )
}

export default Provider