import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
        return response.data.message || []; // Add fallback empty array
    } catch (error) {
        console.error('Error fetching chats:', error);
        return []; // Return empty array on error
    }
}

export async function ChatRoom({id}: {
    id: string
}) {
    const messages = await getChats(id);
    
    return (
        <div>
            <ChatRoomClient messages={messages} id={id} />
        </div>
    );
}