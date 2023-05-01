import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import './App.css'
import Avatar from './components/Avatar';
import ChatList from './components/ChatList';
import Conversation from './components/Conversations';
import Login from './components/Login';
import { Context } from './context/Provider';
import { addChat, getRooms } from './apis/apis';
import useWebSockets from './socket-connections/socket'
import moment from "moment";
import useVideoCallHooks from './custom-hooks/useVideoCallHooks';
import global from 'global'
import * as process from "process";
import Video from './components/Video';
import UserModal from './components/UserModal';
import ChatSuggestions from './components/ChatSuggestions';
global.process = process;

function App() {
  const { socket } = useWebSockets();
  const [auth, setAuthUser] = useState<any>();
  const [addroom, setaddroom] = useState(false);
  const { messages, typingstate, roomstate, recievedCall, call, setsocket } = useContext(Context);
  const addroomInput = useRef<any>(null)
  const [addChatRoomName, setaddChatRoomName] = useState('')
  const [addingUserModal, setaddingUserModal] = useState(false)
  const message_input = useRef<HTMLInputElement>(null)
  const { refetch } = useQuery('rooms', getRooms, {
    refetchOnWindowFocus: false,
    enabled: false // disable this query from automatically running
  })
  const [callToggler, setcallToggler] = useState(false);
  const { mutate } = useMutation(addChat, {
    onSuccess: (data) => {
      if (data?.status === 'success') {
        refetch();
      }
    }
  });

  useEffect(() => {
    if (socket) {
      setsocket(socket);
    }
  }, [socket])


  const signOut = () => {
    setAuthUser(undefined);
  }

  const submitMessage = (e: any) => {
    e.preventDefault();

    if (!(e.target.message.value)) {
      return;
    }

    let obj = {
      chat_type: "TEXT",
      content: e.target.message.value,
      room_id: roomstate?._id,
      user_id: auth?._id
    }

    socket.emit('send_message', obj);
    e.target.message.value = '';
  }

  const onFocusChange = () => {
    let obj = {
      id: 0,
      chat_type: "TYPING",
      mode: 'OUT',
      room_id: roomstate?._id,
      user_id: auth?._id
    }

    socket.emit('check_typing', obj);
  }

  const updateFocus = () => {
    let obj = {
      id: 0,
      chat_type: "TYPING",
      mode: 'IN',
      room_id: roomstate?._id,
      user_id: auth?._id
    }

    socket.emit('check_typing', obj);
    let messageTypingState = setTimeout(() => {
      onFocusChange();
    }, 5000);

    return () => {
      clearTimeout(messageTypingState);
    }
  }

  const addChatRoom = () => {
    mutate({ addroomName: addroomInput.current.value })
    setaddChatRoomName(() => addroomInput.current.value)
    setaddroom((e) => !e)
  }

  const callingUser = () => {
    setcallToggler(true);
  }

  // useEffect(() => {
  //   if (recievedCall) {
  //     setcallToggler(true);
  //   }
  // }, [recievedCall])


  return (
    <>
      {!auth && <Login setAuth={setAuthUser} />}
      {auth && <div className={`bg-gradient-to-b from-orange-400 to-rose-400 h-screen p-12`}>
        <main className='flex w-full max-w-[1020px] h-[700px] mx-auto bg-[#FAF9FE] rounded-[25px] backdrop-opacity-30 opacity-95'>
          <aside className='bg-[#F0EEF5] w-[325px] h-[700px] rounded-l-[25px] p-4 overflow-auto relative pt-20'>
            <button onClick={() => setaddroom((e) => !e)} className='text-xs w-full max-w-[295px] p-3 rounded-[10px] bg-violet-200 font-semibold text-violet-600 text-center absolute top-4'>{addroom ? 'CLOSE' : 'ADD'} CHAT</button>
            {
              addroom && <>
                <input
                  ref={addroomInput}
                  name="Adding Room"
                  className='p-2 mb-1 placeholder-gray-600 text-sm w-full rounded-full bg-violet-200 focus:outline-none'
                  placeholder='Create Room...' />
                <button onClick={() => addChatRoom()} className='text-xs w-full max-w-[295px] p-3 rounded-[10px] bg-violet-200 font-semibold text-violet-600 text-center mb-2'>ADD ROOM</button>
              </>
            }
            <hr className='bg-[#F0EEF5]' />
            <ChatList addroomName={addChatRoomName} />
            <button onClick={signOut} className='text-xs w-full max-w-[295px] p-3 rounded-[10px] bg-violet-200 font-semibold text-violet-600 text-center absolute bottom-4'>LOG OUT</button>
          </aside>
          {roomstate?._id && (<section className='rounded-r-[25px] w-full max-w-[690px] grid grid-rows-[80px_minmax(450px,_1fr)_65px]'>
            <div className='rounded-tr-[25px] w-ful'>
              <div className='flex gap-3 p-3 items-center justify-between'>
                {/* <div> */}
                <Avatar color='rgb(245 158 11)'>{roomstate?.name}</Avatar>
                <div>
                  <p className='font-semibold text-gray-600 text-base'>{roomstate?.name}</p>
                  <div className='text-xs text-gray-400'>{messages[messages?.length - 1]?.created_at ? moment(messages[messages?.length - 1]?.created_at).fromNow() : ''}</div>
                </div>
                {/* </div> */}
                <button className='bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={() => setaddingUserModal(() => true)} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </button>
                {/* <button className='bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={callingUser} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </button> */}
              </div>
              <hr className='bg-[#F0EEF5]' />
            </div>
            {/* {(isLoading && Selectedroom?._id) && <p className="px-4 text-slate-500">Loading conversation...</p>} */}
            <Conversation data={messages} auth={auth} typing={typingstate} />
            <ChatSuggestions lastMessage={messages[messages?.length - 1]?.content} message_input={message_input} />
            <div className='w-full'>
              <form onSubmit={submitMessage} className='flex gap-2 items-center rounded-full border border-violet-500 bg-violet-200 p-1 m-2'>
                <input
                  onBlur={onFocusChange}
                  // onFocus={updateFocus}
                  onChange={updateFocus}
                  ref={message_input}
                  name="message"
                  className='p-2 placeholder-gray-600 text-sm w-full rounded-full bg-violet-200 focus:outline-none'
                  placeholder='Type your message here...' />
                <button type='submit' className='bg-violet-500 rounded-full py-2 px-6 font-semibold text-white text-sm'>Sent</button>
              </form>
            </div>
          </section>)}
        </main>
      </div>}
      {addingUserModal && <UserModal setaddingUserModal={setaddingUserModal} />}
      {/* {(callToggler || call) && <Video socket={socket} auth={auth} callToggler={callToggler} setcallToggler={setcallToggler} />} */}
    </>
  )
}

export default App
