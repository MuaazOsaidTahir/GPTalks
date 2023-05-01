import { APP_CONFIG } from "../config";
import axios from "../axios";

const addChat = async ({ addroomName }: any) => {
    const res = await axios(`${APP_CONFIG.API_URL}/room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ name: addroomName })
    })

    return res?.data;
}

const getRooms = async () => {
    const res = await axios(`${APP_CONFIG.API_URL}/getRooms`);
    return res?.data?.data;
}

const fetchConversations = async ({ queryKey }: any) => {
    const res = await axios(`${APP_CONFIG.API_URL}/getConversations/${queryKey[0]}?page=${queryKey[1]}`);

    return res?.data?.data
}

const fetchUser = async ({ queryKey }: any) => {
    const res = await axios(`${APP_CONFIG.API_URL}/searching_user?type=${queryKey[2]?.toLowerCase()}&user=${queryKey[1]?.toLowerCase()}`);

    return res.data;
}

const updateUserinChat = async ({ type, roomid, userid }: any) => {
    const res = await axios(`${APP_CONFIG.API_URL}/updating_user_in_chat?userid=${userid}&roomid=${roomid}&type=${type}`, {
        method: "POST"
    });

    return res.data
}

const getUsersinChat = async ({ queryKey }: any) => {
    const res = await axios(`${APP_CONFIG.API_URL}/users_in_chat?roomid=${queryKey[1]}`);

    return res.data
}

const getSuggestionsfromGpt = async ({ prompt }: any) => {
    try {
        const response = await fetch(APP_CONFIG.OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${APP_CONFIG.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                // temperature: 0.5,
                // max_tokens: 10,
                n: 3,
                model: "gpt-3.5-turbo",
                // frequency_penalty: 0.5,
                // presence_penalty: 0.5,
            })
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.log(error);
    }
}

export { addChat, getRooms, fetchConversations, fetchUser, updateUserinChat, getUsersinChat, getSuggestionsfromGpt }