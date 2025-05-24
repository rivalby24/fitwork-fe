import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { securedApi } from "@/lib/api";
import ChatSidebar from "@/components/ChatSidebar";

interface ChatMessage {
  message: string;
  isUser: boolean;
  avatar?: string;
  isTyping?: boolean;
}

function ChatBot() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!selectedHistoryId) {
        setChatMessages([
          {
            message: "Hi, how can I help you with your career?",
            isUser: false,
            avatar: "AI",
          },
        ]);
        return;
      }

      try {
        const res = await securedApi.get(`/api/v1/ai/history/${selectedHistoryId}`);
        const formattedMessages = res.data.map((msg: any) => ({
          message: msg.content,
          isUser: msg.role === "user",
          avatar: msg.role === "user" ? "U" : "AI",
        }));
        setChatMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setChatMessages([
          { message: "Failed to load chat history.", isUser: false, avatar: "AI" },
        ]);
      }
    };

    loadChatHistory();
  }, [selectedHistoryId]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      message,
      isUser: true,
      avatar: "U",
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Show typing animation
    setChatMessages((prev) => [
      ...prev.filter((m) => !m.isTyping),
      {
        message: "Typing...",
        isUser: false,
        isTyping: true,
        avatar: "AI",
      },
    ]);

    try {
      const res = await securedApi.post("/api/v1/ai/consult/", {
        question: message,
        history_id: selectedHistoryId,
      });

      const botResponse = res.data.response;

      // Optional: Simulate typing like ChatGPT
      const typingSpeed = 20; // milliseconds per character
      let displayed = "";
      for (let i = 0; i <= botResponse.length; i++) {
        displayed = botResponse.slice(0, i);
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        setChatMessages((prev) => [
          ...prev.filter((m) => !m.isTyping),
          {
            message: displayed,
            isUser: false,
            isTyping: true,
            avatar: "AI",
          },
        ]);
      }

      setChatMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          message: botResponse,
          isUser: false,
          avatar: "AI",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          message: "Sorry, there was an error. Please try again.",
          isUser: false,
          avatar: "AI",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="px-6 py-10 ">
      <div className="flex flex-col lg:flex-row gap-6">
        <ChatSidebar
          onSelectHistory={(id) => {
            setSelectedHistoryId(id);
          }}
          selectedId={selectedHistoryId || undefined}
        />
        <div className="flex-1 flex flex-col h-[731px] bg-white">
          <div className="flex items-center justify-between px-6 py-4 ">
            <h2 className="text-lg font-semibold">AI Career Consultant</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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

          <div className="px-6 py-4 bg-white">
            <ChatInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSend={() => {
                handleSend(inputValue);
                setInputValue("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                  setInputValue("");
                }
              }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChatBot;
