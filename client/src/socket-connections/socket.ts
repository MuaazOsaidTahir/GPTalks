import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { APP_CONFIG } from "../config";

const useWebSockets = () => {
    const socket = useRef<any>(null)

    useEffect(() => {
        if(!socket.current){
            const URL = `${APP_CONFIG.API_URL}`;
            socket.current = io(URL);
    
            // socket.current.onAny((event: any, arg: any) => {
            //     console.log(event, arg);
            // });
        }

        return () => {
            socket.current.disconnect();
            socket.current = null;
        }
    }, [])

    // socket.on("hello", (arg) => {
    //     console.log(arg); // world
    // });

    return { socket: socket.current }
}

export default useWebSockets;