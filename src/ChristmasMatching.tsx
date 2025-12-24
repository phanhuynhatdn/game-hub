import React, { useState } from 'react';
import { Gift, Sparkles, Users } from 'lucide-react';

interface Pair {
  names: string[];
}

const ChristmasMatching = () => {
  const [inputNames, setInputNames] = useState('An;Bình;Chi;Dũng;Hoa;Khoa;Mai;Nam;Phương;Quân;Trang;Vân');
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [snowflakes, setSnowflakes] = useState<number[]>([]);
  const [showInput, setShowInput] = useState(true);

  const parseNames = (input: string): string[] => {
    return input
      .split(/[;,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  const handleMatch = () => {
    const allNames = parseNames(inputNames);
    
    if (allNames.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên!');
      return;
    }

    setIsMatching(true);
    setShowFireworks(true);
    setShowInput(false);
    
    const flakes = Array.from({ length: 50 }, (_, i) => i);
    setSnowflakes(flakes);
    
    setTimeout(() => {
      const shuffled = [...allNames].sort(() => Math.random() - 0.5);
      const newPairs: Pair[] = [];
      
      // Ghép đôi hoặc ghép ba
      let i = 0;
      while (i < shuffled.length) {
        // Nếu còn lại 3 người hoặc là người cuối lẻ
        if (shuffled.length - i === 3 || (shuffled.length - i === 1 && newPairs.length > 0)) {
          // Ghép 3 người
          const group = shuffled.slice(i, i + 3);
          if (group.length === 3) {
            newPairs.push({ names: group });
            i += 3;
          } else {
            // Trường hợp còn 1 người, thêm vào nhóm cuối
            if (newPairs.length > 0) {
              newPairs[newPairs.length - 1].names.push(group[0]);
            }
            i += 1;
          }
        } else if (i + 1 < shuffled.length) {
          // Ghép đôi bình thường
          newPairs.push({ names: [shuffled[i], shuffled[i + 1]] });
          i += 2;
        } else {
          // Người cuối lẻ, thêm vào nhóm cuối
          if (newPairs.length > 0) {
            newPairs[newPairs.length - 1].names.push(shuffled[i]);
          } else {
            newPairs.push({ names: [shuffled[i]] });
          }
          i += 1;
        }
      }
      
      setPairs(newPairs);
      setIsMatching(false);
      
      setTimeout(() => {
        setShowFireworks(false);
        setSnowflakes([]);
      }, 3000);
    }, 2000);
  };

  const handleReset = () => {
    setPairs([]);
    setSnowflakes([]);
    setShowInput(true);
  };

  const renderNames = () => {
    const allNames = parseNames(inputNames);
    if (allNames.length === 0) return null;

    const midPoint = Math.ceil(allNames.length / 2);
    const leftNames = allNames.slice(0, midPoint);
    const rightNames = allNames.slice(midPoint);

    return (
      <div className="flex items-start justify-center gap-8 mb-12">
        {/* Left Column */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-red-400 to-red-500 rounded-full animate-pulse"></div>
            <div className="space-y-4">
              {leftNames.map((name, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slide-in-left border-2 border-red-400"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{name}</span>
                    <span className="text-2xl">🎅</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Tree */}
        <div className="flex flex-col items-center justify-center px-8">
          <div className="text-9xl animate-swing mb-4">
            🎄
          </div>
          <div className="flex gap-4 animate-bounce-slow">
            <span className="text-4xl">🔔</span>
            <span className="text-4xl">🎁</span>
            <span className="text-4xl">⭐</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <div className="absolute -right-4 top-0 bottom-0 w-2 bg-gradient-to-b from-green-500 via-green-400 to-green-500 rounded-full animate-pulse"></div>
            <div className="space-y-4">
              {rightNames.map((name, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slide-in-right border-2 border-green-400"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎀</span>
                    <span className="font-semibold text-lg">{name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 relative overflow-hidden">
      {snowflakes.map((id) => (
        <div
          key={id}
          className="absolute text-white text-opacity-80 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            fontSize: `${10 + Math.random() * 10}px`
          }}
        >
          ❄
        </div>
      ))}

      {showFireworks && (
        <>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-firework"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              <Sparkles className="text-yellow-300" size={24} />
            </div>
          ))}
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-12 text-white animate-pulse-slow">
          <span className="inline-block animate-bounce-slow">🎄</span>
          {' '}Merry Christmas{' '}
          <span className="inline-block animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🎄</span>
        </h1>

        {/* Input Section */}
        {showInput && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-4 border-white border-opacity-30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="text-white" size={32} />
                <h2 className="text-3xl font-bold text-white">Nhập Danh Sách Tên</h2>
              </div>
              <p className="text-white text-center mb-6 text-lg">
                Nhập tên cách nhau bởi dấu <span className="font-bold text-yellow-300">;</span> hoặc <span className="font-bold text-yellow-300">,</span>
              </p>
              <textarea
                value={inputNames}
                onChange={(e) => setInputNames(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-xl border-4 border-yellow-300 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 transition-all"
                rows={4}
                placeholder="Ví dụ: An;Bình;Chi,Dũng,Hoa..."
              />
              <p className="text-white text-center mt-4 text-sm opacity-80">
                💡 Nếu số người lẻ, sẽ có 1 nhóm 3 người
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {pairs.length === 0 ? (
          showInput ? renderNames() : null
        ) : (
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
              <Gift className="animate-bounce" />
              Kết Quả Ghép Đôi
              <Gift className="animate-bounce" style={{ animationDelay: '0.2s' }} />
            </h2>
            <div className="space-y-4">
              {pairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in border-4 border-yellow-300"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="grid items-center gap-4 text-xl font-bold" style={{ 
                    gridTemplateColumns: pair.names.length === 2 
                      ? '1fr auto 1fr' 
                      : '1fr auto 1fr auto 1fr'
                  }}>
                    {pair.names.map((name, i) => (
                      <React.Fragment key={i}>
                        <span className={`flex items-center gap-2 ${i === 0 ? 'justify-end' : i === pair.names.length - 1 ? 'justify-start' : 'justify-center'}`}>
                          {i % 2 === 0 && '🎅'} {name} {i % 2 === 1 && '🎀'}
                        </span>
                        {i < pair.names.length - 1 && (
                          <span className="text-3xl animate-pulse justify-self-center">💝</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          {pairs.length === 0 ? (
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl border-4 border-white ${
                isMatching ? 'animate-pulse-scale' : 'animate-bounce-button'
              }`}
            >
              {isMatching ? '🎁 Đang Ghép...' : '🎄 Ghép Đôi Thần Kỳ 🎄'}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl border-4 border-white animate-bounce-button"
            >
              🔄 Ghép Lại
            </button>
          )}
        </div>

        <div className="fixed top-10 left-10 text-6xl animate-spin-slow">⭐</div>
        <div className="fixed top-10 right-10 text-6xl animate-spin-slow" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="fixed bottom-10 left-10 text-5xl animate-bounce">🎁</div>
        <div className="fixed bottom-10 right-10 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        @keyframes firework {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(3) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        
        @keyframes fade-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounce-button {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
        
        .animate-firework {
          animation: firework 1s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-bounce-button {
          animation: bounce-button 2s ease-in-out infinite;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChristmasMatching;