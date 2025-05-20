import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatBubble from "@/components/ChatBubble";
import { Button } from "@/components/ui/button";
import { securedApi } from "@/api"; // axios instance dengan auth headers

interface ChatMessage {
  message: string;
  isUser: boolean;
  avatar?: string;
  isTyping?: boolean;
}

interface SuggestionListProps {
  suggestions: string[];
  onSelect: (topic: string) => void;
  disabled?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  "Career Path Analysis",
  "Skill Development",
  "Industry Trends",
];

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSelect, disabled }) => {
  const displaySuggestions = suggestions.length ? suggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {displaySuggestions.map((topic, idx) => (
        <Button
          key={idx}
          onClick={() => onSelect(topic)}
          disabled={disabled}
          variant="outline"
          className="whitespace-nowrap"
        >
          {topic}
        </Button>
      ))}
    </div>
  );
};

function ChatBotBox() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { message: "Hi, how can I help you with your career?", isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async (topic: string) => {
    if (!topic.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      message: topic,
      isUser: true,
      avatar: "U",
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Tambahkan indikator typing
    setChatMessages((prev) => [
      ...prev,
      { message: "Bot is typing...", isUser: false, isTyping: true },
    ]);

    try {
      const res = await securedApi.post("/api/v1/ai/consult/", {
        question: topic,
      });

      const aiResponse: ChatMessage = {
        message: res.data.response,
        isUser: false,
        avatar: "AI",
      };

      setChatMessages((prev) => [...prev.filter((m) => !m.isTyping), aiResponse]);

      // Update suggestions dari backend, fallback kalau kosong
      if (res.data.suggestions && Array.isArray(res.data.suggestions) && res.data.suggestions.length) {
        setSuggestions(res.data.suggestions);
      } else {
        setSuggestions(DEFAULT_SUGGESTIONS);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          message: "Sorry, there was an error. Please try again.",
          isUser: false,
        },
      ]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 py-16">
      <Card className="max-w-7xl mx-auto shadow-sm">
        <CardContent className="p-6">
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
              <SuggestionList suggestions={suggestions} onSelect={handleSend} disabled={isLoading} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatBotBox;
