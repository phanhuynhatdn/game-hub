import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { BaseButton } from '../../components/shared';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [typedMessage, setTypedMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || disabled) return;

    onSend(typedMessage);
    setTypedMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-slate-900/80 border-t border-white/5 backdrop-blur-md">
      <input
        type="text"
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        maxLength={200}
        className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
      />
      <BaseButton
        type="submit"
        disabled={!typedMessage.trim() || disabled}
        className="!px-3.5 !rounded-xl"
      >
        <Send className="w-4 h-4" />
      </BaseButton>
    </form>
  );
};
