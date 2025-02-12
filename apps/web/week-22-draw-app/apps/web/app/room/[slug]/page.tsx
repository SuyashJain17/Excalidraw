import axios from "axios"
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

const getRoomId = async (slug: string) => {
    try {
        const response = await axios.get(`http://localhost:3001/room/${slug}`, {
            timeout: 5000  // Add timeout
        })
        return response.data
    } catch (error) {
        console.error('Error fetching room data:', error)
        throw error
    }
}

export default async function ChatRoom1({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = (await params).slug;
    console.log(`Slug received in ChatRoom1: ${slug}`);
    const roomId = await getRoomId(slug);

    return <ChatRoom id={roomId}></ChatRoom>
}