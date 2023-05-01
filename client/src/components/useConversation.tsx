import { useState } from "react";
import { APP_CONFIG } from "../config";

const useConversation = () => {
    const [isLoading, setisLoading] = useState(false);
    const [Messages, setMessages] = useState<any>([])

    const fetchConversations = async ({id, page}: any) => {
        if (!id) return;

        setisLoading(true);

        try {
            const res = await fetch(`${APP_CONFIG.API_URL}/getConversations/${id}?page=${page}`)
    
            const data = await res.json();
            return data?.data
        } catch (error) {
            console.log('Error Message');
        }
    }

    return { isLoading, Messages, setMessages, fetchConversations }
}

export default useConversation;