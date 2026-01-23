import { useState, useCallback } from 'react';
import { Pair } from '../types/christmas.types';
import { parseNames, createPairs } from '../utils/christmasUtils';

export const useChristmasMatching = (initialNames: string) => {
  const [inputNames, setInputNames] = useState(initialNames);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [snowflakes, setSnowflakes] = useState<number[]>([]);
  const [showInput, setShowInput] = useState(true);

  const handleMatch = useCallback(() => {
    const names = parseNames(inputNames);
    if (names.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên!');
      return;
    }

    setIsMatching(true);
    setShowFireworks(true);
    setShowInput(false);
    setSnowflakes(Array.from({ length: 50 }, (_, i) => i));

    setTimeout(() => {
      setPairs(createPairs(names));
      setIsMatching(false);
      setTimeout(() => {
        setShowFireworks(false);
        setSnowflakes([]);
      }, 3000);
    }, 2000);
  }, [inputNames]);

  const handleReset = useCallback(() => {
    setPairs([]);
    setSnowflakes([]);
    setShowInput(true);
  }, []);

  return {
    inputNames,
    setInputNames,
    pairs,
    isMatching,
    showFireworks,
    snowflakes,
    showInput,
    handleMatch,
    handleReset
  };
};