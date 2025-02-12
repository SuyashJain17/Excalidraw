"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./hook/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[];
    id: string;
}) {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const { socket, loading } = useSocket();

    useEffect(() => {
        if (!socket || loading || socket.readyState !== WebSocket.OPEN) return;

        console.log("Joining room:", id);
        socket.send(JSON.stringify({
            type: "join_room",
            roomId: id
        }));

        const handleMessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "chat") {
                setChats(c => [...c, { message: parsedData.message }]);
            }
        };

        // Attach event listener
        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, loading, id]);

    const sendMessage = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open, cannot send message.");
            return;
        }

        socket.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }));

        setCurrentMessage("");
    };

    return (
        <div>
            {chats.map((m, index) => (
                <div key={index}>{m.message}</div>
            ))}

            <input
                type="text"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send message</button>
        </div>
    );
}
