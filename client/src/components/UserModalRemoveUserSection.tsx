import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Context } from '../context/Provider';
import { getUsersinChat, updateUserinChat } from '../apis/apis';
import Loader from './Loader';

function UserModalRemoveUserSection() {
    const { roomstate } = useContext(Context);
    const [currentUser, setcurrentUser] = useState(JSON.parse(localStorage.getItem("chat-app-user")!)._id)
    const { refetch, data, isLoading } = useQuery([`${roomstate?._id}users`, roomstate?._id], getUsersinChat, {
        refetchOnWindowFocus: false,
    })
    const { mutate, data: removedUser } = useMutation(updateUserinChat)

    const removeUser = (id: any) => {
        mutate({ type: "remove", userid: id, roomid: roomstate?._id })
    }

    useEffect(() => {
        if(removedUser?.status === "success"){
            refetch()
        }
    }, [removeUser])
    

    return (
        <>
            {isLoading ? <Loader /> : <ul>
                {
                    data?.data?.map((user: any) => {
                        return user?._id !== currentUser && <li key={user?._id}
                            className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50 flex items-center justify-between">
                            <p>{user?.username}</p> <button className='bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                onClick={() => removeUser(user?._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                </svg>
                            </button>
                        </li>
                    })
                }
            </ul>}
        </>
    )
}

export default UserModalRemoveUserSection