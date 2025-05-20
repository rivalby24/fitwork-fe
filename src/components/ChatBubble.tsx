import React from "react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  avatar?: string;
  isTyping?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  avatar,
  isTyping,
}) => {
  return (
    <div className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mr-3 bg-gray-200">
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`rounded-lg p-3 max-w-[75%] text-base ${
          isUser
            ? "bg-gray-200 text-black"
            : isTyping
            ? "bg-gray-400 italic text-white"
            : "bg-indigo-500 text-white"
        }`}
      >
        {isTyping ? (
          message
        ) : (
          <ReactMarkdown>{message}</ReactMarkdown>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 ml-3 bg-gray-300">
          <AvatarFallback>{avatar || "U"}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
