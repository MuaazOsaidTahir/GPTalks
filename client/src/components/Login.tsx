import React, { FC, useEffect, useRef } from 'react'
import { APP_CONFIG } from '../config';

async function createAccount({ username, phone }: any) {
    try {
        const url = `${APP_CONFIG.API_URL}/login`;
        let result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, phone })
        });
        return result.json();
    } catch (e) {
        return Promise.reject(e);
    }
}

const Login:FC<{setAuth: any}> = ({ setAuth }) => {
    const toggle = useRef(true);

    useEffect(() => {
        if(toggle.current){
            setAuth(JSON.parse(localStorage.getItem('chat-app-user')!))

            toggle.current = false;
        }
    }, [])
    

    const onCreateUsername = async (e: any) => {
        e.preventDefault();
        let username = e.target.username.value;
        let phone = e.target.phone.value;
        if (username === "" || phone === "") {
            return;
        }

        let res = await createAccount({ username, phone });
        if (res === null || res?.data === null || res?.status === 'error') {
            alert("Failed to create account");
            return;
        }

        setAuth(res?.data)

        localStorage.setItem('chat-app-user', JSON.stringify(res?.data))
    }

    return (
        <form className="mt-4 space-y-2" onSubmit={onCreateUsername}>
            <div>
                <label className="text-sm font-light">Username</label>
                <input required type="text" name="username" placeholder="Jhon Doe"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
            </div>

            <div>
                <label className="text-sm font-light">Phone</label>
                <input required type="text" name="phone" placeholder="+1111..."
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
            </div>

            <div className="flex items-baseline justify-between">
                <button type="submit"
                    className="px-6 py-2 mt-4 text-white bg-violet-600 rounded-lg hover:bg-violet-700 w-full">Submit</button>
            </div>
        </form>
    )
}

export default Login