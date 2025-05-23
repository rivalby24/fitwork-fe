import React, { useEffect, useState } from "react";
import { securedApi } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ChatHistoryItem {
    id: string;
    title: string;
    created_at: string;
}

interface ChatSidebarProps {
    onSelectHistory: (id: string) => void;
    selectedId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectHistory, selectedId }) => {
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await securedApi.get("/api/v1/ai/sessions/");
                setHistory(res.data);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
            <div className="p-4 border-b font-semibold text-lg">Chat History</div>
            <ScrollArea className="h-full p-2">
                {history.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start mb-2 text-indigo-700 bg-gray-200 hover:bg-gray-300 ${
                            item.id === selectedId ? "font-semibold" : ""
                        }`}
                        onClick={() => onSelectHistory(item.id)}
                    >
                        {item.title || "Untitled"}
                    </Button>
                ))}
            </ScrollArea>
        </aside>
    );
};

export default ChatSidebar;
