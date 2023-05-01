import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../context/Provider';
import useVideoCallHooks from '../custom-hooks/useVideoCallHooks';

const Video: FC<{ socket: any, auth: any, callToggler?: any, setcallToggler?: any }> = ({ socket, auth, callToggler, setcallToggler }) => {
    const { callUser, myVideo, userVideo, call, setCall, callAccepted, answerCall } = useVideoCallHooks(socket, auth)
    const { roomstate } = useContext(Context);
    // const ref = useRef<HTMLVideoElement | any>()

    useEffect(() => {
        if (callToggler) {
            callUser(roomstate?._id, roomstate?.name);
            // setcallToggler(false);
        }
    }, [callToggler])

    useEffect(() => {
        if(call){
            setcallToggler(true);
        }
    }, [call])

    return (
        <>
            <div className="fixed z-10 overflow-y-auto inset-0">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={() => { }}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                    <div className="relative w-fit p-4 mx-auto bg-white rounded-md shadow-lg">
                        <div className="mt-3 sm:flex">
                            <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                                {!call?.isReceivingCall ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                                </svg> :

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                                    </svg>}
                            </div>
                            <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                <h4 className="text-lg font-medium text-gray-800">
                                    {call?.isReceivingCall ? `${call?.from?.name} is calling` : `Calling ${roomstate?.name}`}
                                </h4>
                                <div className='flex items-center content-center mt-6' >
                                    <video playsInline autoPlay muted ref={myVideo} style={{ width: '400px' }} />
                                    <video playsInline autoPlay muted ref={userVideo} style={{ width: '400px' }} />
                                </div>
                                <div className="items-center gap-2 mt-3 sm:flex">
                                    {(call?.isReceivingCall && !callAccepted) && <button
                                        className="w-full mt-2 p-2.5 flex-1 text-white bg-emerald-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
                                        onClick={() => answerCall()}
                                    >
                                        Accept
                                    </button>}
                                    <button
                                        className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                        onClick={() =>
                                            setCall(null)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Video