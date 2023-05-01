import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/Provider';
import { useMutation, useQuery } from 'react-query';
import { fetchUser, updateUserinChat } from '../apis/apis';
import UserModalRemoveUserSection from './UserModalRemoveUserSection';
import Loader from './Loader';

type Options = "PHONE" | "ID";

type Categories = "ADDING" | "REMOVING";

const CATEGORIES_NAVIGATION: Array<Categories> = ["ADDING", "REMOVING"]

const SEARCH_OPTIONS: Array<Options> = ["PHONE", "ID"]

function UserModal({ setaddingUserModal }: any) {
    const [searchOptions, setsearchOptions] = useState<Options>('PHONE');
    const [expandOptions, setexpandOptions] = useState(false)
    const { roomstate } = useContext(Context);
    const [UserSearch, setUserSearch] = useState("")
    const [ChatRoomCategory, setChatRoomCategory] = useState<Categories>("ADDING");
    const { data, refetch, isLoading } = useQuery(["user", UserSearch, searchOptions], fetchUser, {
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    })
    const { mutate, data: addedUser } = useMutation(updateUserinChat)
    // const { data: addedUser, refetch: addUser } = useQuery(["add", roomstate?._id, data?.data?._id], updateUserinChat, {
    //     refetchOnWindowFocus: false,
    //     enabled: false // disable this query from automatically running
    // })

    const searchUser = (e: any) => {
        e.preventDefault();

        let current_user = JSON.parse(localStorage.getItem("chat-app-user")!)._id;

        if (!UserSearch) {
            alert("The Search Field cannot be empty");
            return;
        } else if (UserSearch === current_user) {
            alert("Id is of current user logged in");
            return;
        }
        refetch()
    }

    useEffect(() => {
        if (addedUser?.status === "success" && !addedUser?.message) {
            alert("User Successfully Added");
            setaddingUserModal(false);
        }
        else if (addedUser?.message && addedUser?.status === "success") {
            alert(addedUser?.message);
            setaddingUserModal(false);
        }
    }, [addedUser])

    const addUser = () => {
        mutate({ type: "add", roomid: roomstate?._id, userid: data?.data?._id })
    }


    return (
        <div className="fixed z-10 overflow-y-auto inset-0">
            <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => { setaddingUserModal(() => false) }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-fit p-4 mx-auto bg-white rounded-md shadow-lg w-3/4 ">
                    <div className="mb-4 border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" >
                            {
                                CATEGORIES_NAVIGATION.map((e: Categories, i) => (
                                    <li key={i} role="presentation">
                                        <button onClick={() => setChatRoomCategory(() => e)} className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${(e === ChatRoomCategory) && "text-gray-600 border-gray-300 dark:text-gray-300"}`}
                                            type="button" role="tab" aria-selected="false">{e}</button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    {ChatRoomCategory === "ADDING" ? <> <h4 className="text-lg font-medium text-gray-800">
                        Add User to {roomstate?.name}
                    </h4>
                        <div className="mt-3 sm:flex flex flex-col ">
                            <div className="flex items-center w-full mx-auto">
                                <div className="flex w-full">
                                    <div className='flex flex-col' >
                                        <button onClick={() => setexpandOptions(() => !expandOptions)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">{searchOptions} <svg aria-hidden="true" className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></button>
                                        {expandOptions && <div className={`${!expandOptions && "hidden"} z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                                {
                                                    SEARCH_OPTIONS.map((e: Options, i) => (
                                                        <li key={i} >
                                                            <button type="button" onClick={() => setsearchOptions(e)} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{e}</button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>}
                                    </div>
                                    <div className="relative w-full">
                                        <form onSubmit={searchUser} >
                                            <input onChange={(e) => setUserSearch(() => e.target
                                                .value)} type="search" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder={`Search user by ${searchOptions}...`} required />
                                            <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                <span className="sr-only">Search</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                <div className='flex items-center content-center' >
                                    {
                                        isLoading &&
                                        <Loader />
                                    }
                                    {data?.data && <div className='flex flex-col' >
                                        <h4 className="text-lg font-medium text-gray-800">
                                            Searched User
                                        </h4>
                                        <ul>
                                            <li
                                                className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50 flex items-center justify-between">
                                                <p>{data?.data?.username}</p> <button className='bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                                    onClick={() => addUser()}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                                    </svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>}
                                </div>
                                <div className="items-center gap-2 mt-3 sm:flex">
                                    <button
                                        className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                        onClick={() =>
                                            setaddingUserModal(() => false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </> : <UserModalRemoveUserSection />
                    }
                </div>
            </div>
        </div>
    )
}

export default UserModal