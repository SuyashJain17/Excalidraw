import { WebSocketServer, WebSocket } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || !decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

wss.on('connection', (ws, request) => {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    users.push({ userId, rooms: [], ws });

    ws.on('message', async (data) => {
        try {
            const parsedData = JSON.parse(data as unknown as string);

            if (parsedData.type === "join_room") {
                const user = users.find(x => x.ws === ws);
                if (user) {
                    user.rooms.push(String(parsedData.roomId));
                }
            }

            if (parsedData.type === "leave_room") {
                const user = users.find(x => x.ws === ws);
                if (user) {
                    user.rooms = user.rooms.filter(room => room !== String(parsedData.roomId));
                }
            }

            if (parsedData.type === "chat") {
                const roomId = String(parsedData.roomId);
                const message = parsedData.message;

                await prismaClient.chat.create({
                    data: { roomId: Number(roomId), message, userId }
                });

                users.forEach((user, index) => {
                    if (user.rooms.includes(roomId)) {
                        try {
                            user.ws.send(JSON.stringify({ type: "chat", message, roomId }));
                        } catch (err) {
                            console.error(`Failed to send message to user ${user.userId}:`, err);
                            user.ws.close();
                            users.splice(index, 1);
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Error handling message:", err);
        }
    });

    ws.on('close', () => {
        const index = users.findIndex(user => user.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }
        console.log("Client disconnected.");
    });
});
