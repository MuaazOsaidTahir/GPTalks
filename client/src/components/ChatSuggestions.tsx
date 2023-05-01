import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import { getSuggestionsfromGpt } from '../apis/apis'
import Loader from './Loader'

function ChatSuggestions({ lastMessage, message_input }: any) {
    const { mutate, isLoading, data, error } = useMutation(getSuggestionsfromGpt)

    let prompt = `I am passing you a message & i want one sentence response in simple english for this message. There should not be more than 3 characters in eacg message. They should have a positive vibe. And they should be different from each other. Just return one word.\n\n${lastMessage}`

    useEffect(() => {
        if (lastMessage) {
            mutate({ prompt })
        }
    }, [lastMessage])

    return (
        <div className='bg-white p-3 rounded-md flex items-center justify-between' >
            {data?.error && <p>Error occured while fetching suggestions.</p>}
            {
                isLoading ? <Loader /> : <>
                    {
                        data?.choices?.map((m: any, i: any) => {
                            return <button onClick={() => message_input.current.value = m?.message?.content} key={i} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded">{m?.message?.content}</button>
                        })
                    }
                </>
            }
        </div>
    )
}

export default ChatSuggestions