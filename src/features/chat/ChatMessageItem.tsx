import React from 'react';
import { BaseAvatar } from '../../components/shared';
import type { ChatMessage } from '../../types/chat.types';

interface ChatMessageItemProps {
  msg: ChatMessage;
  isSelf: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg, isSelf }) => {
  return (
    <div className={`flex gap-2.5 items-end ${isSelf ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for other users */}
      {!isSelf && (
        <div className="select-none flex-shrink-0">
          <BaseAvatar src={msg.user.avatarUrl} username={msg.user.username} />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[70%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
        {/* Username for other users */}
        {!isSelf && (
          <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1 select-none">
            {msg.user.username}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
            isSelf
              ? 'bg-indigo-600 text-white rounded-br-sm shadow-[0_0_15px_rgba(79,70,229,0.2)]'
              : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700 shadow-glass'
          }`}
        >
          {msg.message}
        </div>
      </div>
    </div>
  );
};
