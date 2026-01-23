import React, { useState, useCallback, useMemo } from "react";
import { Gift, Sparkles, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Pair {
  names: string[];
}

const ChristmasMatching: React.FC = () => {
  const { t } = useTranslation();
  
  const [inputNames, setInputNames] = useState("An;Bình;Chi;Dũng;Hoa;Khoa;Mai;Nam;Phương;Quân;Trang;Vân");
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [snowflakes, setSnowflakes] = useState<number[]>([]);
  const [showInput, setShowInput] = useState(true);

  // Helper: Shuffle mảng theo thuật toán Fisher-Yates (Senior Standard)
  const shuffle = (array: string[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const parseNames = useCallback((input: string): string[] => {
    return input
      .split(/[;,]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }, []);

  const handleMatch = () => {
    const allNames = parseNames(inputNames);

    if (allNames.length < 2) {
      alert(t("christmas.alertMinNames")); // Đã fix i18n
      return;
    }

    setIsMatching(true);
    setShowFireworks(true);
    setShowInput(false);
    setSnowflakes(Array.from({ length: 50 }, (_, i) => i));

    setTimeout(() => {
      const shuffled = shuffle(allNames);
      const newPairs: Pair[] = [];

      let i = 0;
      while (i < shuffled.length) {
        // Logic ghép nhóm 2 hoặc 3
        if (shuffled.length - i === 3 || (shuffled.length - i === 1 && newPairs.length > 0)) {
          const group = shuffled.slice(i, i + 3);
          if (group.length === 3) {
            newPairs.push({ names: group });
            i += 3;
          } else {
            if (newPairs.length > 0) newPairs[newPairs.length - 1].names.push(group[0]);
            i += 1;
          }
        } else if (i + 1 < shuffled.length) {
          newPairs.push({ names: [shuffled[i], shuffled[i + 1]] });
          i += 2;
        } else {
          if (newPairs.length > 0) newPairs[newPairs.length - 1].names.push(shuffled[i]);
          else newPairs.push({ names: [shuffled[i]] });
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

  // Chia danh sách tên hiển thị (Memoized để tối ưu)
  const columns = useMemo(() => {
    const allNames = parseNames(inputNames);
    const mid = Math.ceil(allNames.length / 2);
    return { left: allNames.slice(0, mid), right: allNames.slice(mid) };
  }, [inputNames, parseNames]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 relative overflow-hidden">
      {/* Hiệu ứng tuyết rơi */}
      {snowflakes.map((id) => (
        <div key={id} className="absolute text-white text-opacity-80 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            fontSize: `${10 + Math.random() * 10}px`,
          }}
        >❄</div>
      ))}

      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute animate-firework"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <Sparkles className="text-yellow-300" size={24} />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-white animate-pulse-slow">
          🎄 {t("christmas.title")} 🎄
        </h1>

        {showInput && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-white/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="text-white" size={32} />
                <h2 className="text-2xl md:text-3xl font-bold text-white">{t("christmas.inputLabel")}</h2>
              </div>
              <p className="text-white text-center mb-6 text-sm md:text-lg">
                {t('christmas.inputHint')}
              </p>
              <textarea
                value={inputNames}
                onChange={(e) => setInputNames(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-xl border-4 border-yellow-300 focus:border-yellow-400 outline-none transition-all"
                rows={4}
                placeholder={t('christmas.inputPlaceholder')}
              />
            </div>
          </div>
        )}

        {/* Danh sách tên đang nhập */}
        {showInput && columns.left.length > 0 && (
          <div className="flex flex-col md:flex-row items-start justify-center gap-8 mb-12">
            <div className="flex-1 w-full max-w-xs space-y-4">
              {columns.left.map((name, idx) => (
                <div key={idx} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg animate-slide-in-left border-2 border-red-400">
                  <div className="flex justify-between font-semibold"><span>{name}</span><span>🎅</span></div>
                </div>
              ))}
            </div>
            <div className="text-8xl md:text-9xl animate-swing">🎄</div>
            <div className="flex-1 w-full max-w-xs space-y-4">
              {columns.right.map((name, idx) => (
                <div key={idx} className="bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-3 rounded-lg animate-slide-in-right border-2 border-green-400">
                  <div className="flex justify-between font-semibold"><span>🎀</span><span>{name}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kết quả ghép đôi */}
        {pairs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
              <Gift className="animate-bounce" /> {t("christmas.resultTitle")} <Gift className="animate-bounce" />
            </h2>
            <div className="space-y-4">
              {pairs.map((pair, idx) => (
                <div key={idx} className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-5 rounded-2xl shadow-xl animate-fade-in border-4 border-yellow-300">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xl font-bold">
                    {pair.names.map((name, i) => (
                      <React.Fragment key={i}>
                        <span className="flex items-center gap-2">
                          {i % 2 === 0 ? "🎅" : "🎀"} {name}
                        </span>
                        {i < pair.names.length - 1 && <span className="text-3xl animate-pulse">💝</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Điều khiển */}
        <div className="flex justify-center gap-6">
          <button
            onClick={showInput ? handleMatch : handleReset}
            disabled={isMatching}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white animate-bounce-button"
          >
            {isMatching ? '🎁 ...' : showInput ? t("christmas.btnMatch") : t("christmas.btnReset")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChristmasMatching;