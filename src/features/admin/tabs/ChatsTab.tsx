import React from 'react';
import { Trash2 } from 'lucide-react';
import { BaseAvatar, BaseButton } from '../../../components/shared';
import type { ChatMessage } from '../../../types/chat.types';

interface ChatsTabProps {
  chatHistory: ChatMessage[];
  onDeleteChat: (messageId: string) => void;
}

export const ChatsTab: React.FC<ChatsTabProps> = ({ chatHistory, onDeleteChat }) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-glass overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase select-none bg-slate-950/80">
            <th className="py-4 px-5">Time</th>
            <th className="py-4 px-5">User</th>
            <th className="py-4 px-5 w-1/2">Message</th>
            <th className="py-4 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {chatHistory.map((msg) => (
            <tr
              key={msg.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-3 px-5 text-slate-500 text-xs whitespace-nowrap">
                {new Date(msg.createdAt).toLocaleString()}
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-2">
                  <BaseAvatar username={msg.user.username} src={msg.user.avatarUrl} size="w-6 h-6" />
                  <span className="font-bold text-slate-300 text-xs">{msg.user.username}</span>
                </div>
              </td>
              <td className="py-3 px-5">
                <p className="text-slate-200 text-sm break-words whitespace-pre-wrap max-w-lg">
                  {msg.message}
                </p>
              </td>
              <td className="py-3 px-5 text-right">
                <BaseButton
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => onDeleteChat(msg.id)}
                >
                  Delete
                </BaseButton>
              </td>
            </tr>
          ))}
          {chatHistory.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                No chat history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
