"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./hook/useSocket";

export function ChatRoomClient({
    messages = [],
    id
}: {
    messages: { message: string }[];
    id: string;
}) {
    const [chats, setChats] = useState(messages || []);
    const [currentMessage, setCurrentMessage] = useState("");
    const { socket, loading } = useSocket();

    useEffect(() => {
        if (messages) {
            setChats(messages);
        }
    }, [messages]);

    useEffect(() => {
        if (!socket || loading) return;

        socket.send(JSON.stringify({
            type: "join_room",
            roomId: id
        }));

        const handleMessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "chat") {
                setChats((prevChats) => [...prevChats, { message: parsedData.message }]);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, loading, id]);

    return (
        <div>
            {Array.isArray(chats) && chats.length > 0 ? (
                chats.map((m, index) => (
                    <div key={index}>{m.message}</div>
                ))
            ) : (
                <p>No messages yet...</p>
            )}

            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button
                onClick={() => {
                    if (!currentMessage.trim()) return;
                    socket?.send(
                        JSON.stringify({
                            type: "chat",
                            roomId: id,
                            message: currentMessage
                        })
                    );
                    setCurrentMessage("");
                }}
            >
                Send Message
            </button>
        </div>
    );
}
