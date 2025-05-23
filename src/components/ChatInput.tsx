import React, { forwardRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // ✅ tambahkan ini
}

// Menggunakan forwardRef agar bisa menerima ref dari parent
const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ value, onChange, onSend, disabled, onKeyDown }, ref) => {
    return (
      <div className="flex gap-2">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown} // ✅ gunakan onKeyDown di sini
          className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring"
          placeholder="Type your message..."
          disabled={disabled}
        />
        <button
          onClick={onSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    );
  }
);

export default ChatInput;
