import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { securedApi } from "@/api";
import NavbarUser from "@/components/NavbarUser";

interface ChatMessage {
    message: string;
    isUser: boolean;
    avatar?: string;
    isTyping?: boolean;
}

function ChatBot() {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { message: "Hi, how can I help you with your career?", isUser: false },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSend = async (message: string) => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            message,
            isUser: true,
            avatar: "U",
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        setChatMessages((prev) => [
            ...prev,
            { message: "Bot is typing...", isUser: false, isTyping: true },
        ]);

        try {
            const res = await securedApi.post("/api/v1/ai/consult/", {
                question: message,
            });

            const aiResponse: ChatMessage = {
                message: res.data.response,
                isUser: false,
                avatar: "AI",
            };

            setChatMessages((prev) => [...prev.filter((m) => !m.isTyping), aiResponse]);
        } catch {
            setChatMessages((prev) => [
                ...prev.filter((m) => !m.isTyping),
                {
                    message: "Sorry, there was an error. Please try again.",
                    isUser: false,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            <NavbarUser />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-7xl shadow-sm">
                    <CardContent className="p-6 w-full">
                        <h2 className="text-xl font-medium mb-6">AI Career Consultation</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="bg-neutral-100 rounded-lg p-4 flex-1">
                                <div className="mb-4 space-y-4 max-h-[400px] overflow-y-auto">
                                    {chatMessages.map((msg, index) => (
                                        <ChatBubble
                                            key={index}
                                            message={msg.message}
                                            isUser={msg.isUser}
                                            avatar={msg.avatar}
                                            isTyping={msg.isTyping}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <ChatInput
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onSend={() => {
                                        handleSend(inputValue);
                                        setInputValue("");
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ChatBot;
