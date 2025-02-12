import { useEffect, useState } from "react";
import { WS_URL } from "../../app/config";

export function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout | null = null;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No auth token found");
            return;
        }

        const connectWebSocket = () => {
            ws = new WebSocket(`${WS_URL}?token=${token}`);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setSocket(ws);
                setLoading(false);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws?.close();
            };

            ws.onclose = (event) => {
                console.warn("WebSocket closed, attempting reconnect...", event);
                setLoading(true);
                setSocket(null);
            };
        };

        connectWebSocket();

        return () => {
            console.log("Cleaning up WebSocket...");
            if (ws) {
                ws.close();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
        };
    }, []);

    return { socket, loading };
}
