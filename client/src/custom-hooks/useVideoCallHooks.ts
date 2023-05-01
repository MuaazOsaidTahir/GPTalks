import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Peer from "simple-peer"
import { Context } from '../context/Provider';

const useVideoCallHooks = (socket: any, auth: any) => {
    const { recievedCall } = useContext(Context);
    const [callAccepted, setcallAccepted] = useState(false)
    const [call, setCall] = useState<any>(null);
    const [stream, setStream] = useState<any>()

    const toggler = useRef(true);
    const myVideo = useRef<HTMLVideoElement>(null);
    // const [myVideo, setmyVideo] = useState<HTMLVideoElement>()
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<any>()

    useEffect(() => {
        if (toggler.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream: any) => {
                    setStream(currentStream);
                });

                // socket.on(`recieve_call`, (gettingcall: any) => {
                //     setCall(gettingcall)
                //     setrecievedCall(true);
                // })

            toggler.current = false;
        }
    }, [])

    useEffect(() => {
        if (recievedCall) {
            debugger
            setCall({ ...recievedCall, isReceivingCall: true });
        }
    }, [recievedCall])

    // useEffect(() => {
    //     if (callAccepted) {

    //     }
    // }, [callAccepted])



    useEffect(() => {
        if (auth) {
            // socket.on(`recieve_call:${auth?._id}`, (data: any) => {
            //     // debugger
            // })
        }
    }, [auth])


    useEffect(() => {
        if (stream && myVideo.current) {
            myVideo.current!.srcObject = stream;
        }
    }, [stream, myVideo])

    const answerCall = () => {
        setcallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream: stream });

        peer.on('signal', (data) => {
            // debugger
            socket.emit('answerCall', { signal: data, to: call.to, from: call.from });
        });

        // socket.on(`recieve_call`, (gettingcall: any) => {
        //     setrecievedCall(() => gettingcall)
        // })

        peer.on('stream', (currentStream) => {
            userVideo.current!.srcObject = currentStream;
        });

        peer.on('data', (chunk) => {
            console.log(`GOT A: ${chunk}`)
        })

        peer.on('connect', () => {
            peer.send('Reciever')
        })

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = (id: any, name: any) => {
        setCall({ isReceivingCall: false, to: { id: id, name: name } });
        const peer = new Peer({ initiator: true, trickle: false, stream: stream });

        peer.on('signal', (data) => {
            // debugger
            socket.emit('calluser', { signal: data, to: { id: id, name: name }, from: { name: auth?.username, id: id } })
        })

        peer.on('connect', () => {
            peer.send('Caller')
        })

        peer.on('data', (chunk) => {
            console.log(`GOT A: ${chunk}`)
        })

        peer.on('stream', (currentStream) => {
            userVideo.current!.srcObject = currentStream
        })

        socket.on('callAccepted', ({ signal }: any) => {
            setcallAccepted(true);
            debugger
            peer.signal(signal)
        })
        connectionRef.current = peer;
    }

    return { stream, myVideo, callUser, userVideo, call, setCall, callAccepted, setcallAccepted, answerCall }
}

export default useVideoCallHooks