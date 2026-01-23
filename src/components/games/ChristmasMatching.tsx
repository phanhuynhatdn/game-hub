import React from 'react';
import { Home, Users, Sparkles } from 'lucide-react';
import { useChristmasMatching } from '../../hooks/useChristmasMatching';
import { parseNames } from '../../utils/christmasUtils';
import { PairResult } from '../shared/PairResult';
import { NameList } from '../shared/NameList';

export const ChristmasMatching: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { inputNames, setInputNames, pairs, isMatching, showFireworks, snowflakes, showInput, handleMatch, handleReset } = useChristmasMatching('An;Bình;Chi;Dũng;Hoa;Khoa');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 relative overflow-hidden p-4">
      {snowflakes.map(id => (
        <div key={id} className="absolute text-white animate-fall" style={{ left: `${Math.random() * 100}%`, top: '-20px', animationDuration: `${3 + Math.random() * 2}s` }}>❄</div>
      ))}
      {showFireworks && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Sparkles className="text-yellow-300 animate-firework" size={100} /></div>}
      
      <div className="relative z-10 container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-3 bg-white/20 rounded-xl text-white"><Home /></button>
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">🎄 Merry Christmas</h1>
          <div className="w-10"></div>
        </div>

        {showInput && (
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl border-4 border-white/30 mb-8">
            <div className="flex items-center gap-3 mb-4 justify-center text-white"><Users /> <h2 className="text-2xl font-bold">Danh sách tên</h2></div>
            <textarea value={inputNames} onChange={(e) => setInputNames(e.target.value)} className="w-full p-4 rounded-xl border-4 border-yellow-300 text-lg outline-none" rows={4} />
            <button onClick={handleMatch} disabled={isMatching} className="w-full mt-6 bg-yellow-400 py-4 rounded-full text-2xl font-bold border-4 border-white hover:scale-105 transition-transform">
              {isMatching ? '🎁 Đang ghép...' : '🎄 Ghép Đôi 🎄'}
            </button>
          </div>
        )}

        {!showInput && pairs.length > 0 && <PairResult pairs={pairs} />}
        {!showInput && <div className="text-center"><button onClick={handleReset} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">🔄 Ghép Lại</button></div>}
        {showInput && <NameList names={parseNames(inputNames)} />}
      </div>
    </div>
  );
};