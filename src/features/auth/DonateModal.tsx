import React from 'react';
import { Trophy } from 'lucide-react';
import { BaseModal, BaseButton } from '../../components/shared';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Premium Theme"
      description="Độ màu ưa thích của bạn bằng cách donate ủng hộ để mở khóa vĩnh viễn hình nền cao cấp này!"
      headerIcon={
        <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] animate-bounce" />
      }
      maxWidth="max-w-sm"
    >
      <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl mb-6 text-left space-y-2">
        <p className="text-xs text-slate-400">💳 Nộp tiền ủng hộ qua MoMo/Ngân hàng:</p>
        <p className="text-sm font-bold text-slate-200">BIDV: 31210000XXXXXX</p>
        <p className="text-[10px] text-slate-500">
          Nội dung chuyển khoản kèm theo Username của bạn để Admin duyệt mở khóa ngay lập tức!
        </p>
      </div>

      <BaseButton onClick={onClose} className="w-full">
        Đồng ý
      </BaseButton>
    </BaseModal>
  );
};
