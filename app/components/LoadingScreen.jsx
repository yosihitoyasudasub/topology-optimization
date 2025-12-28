'use client';

import { useState, useEffect } from 'react';

/**
 * Pyodideロード中のローディング画面コンポーネント
 */
export default function LoadingScreen() {
  const [dots, setDots] = useState('');

  // アニメーション用のドット更新
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* スピナー */}
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>

        {/* ローディングテキスト */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pyodideロード中{dots}
        </h2>
        <p className="text-gray-600 mb-4">
          NumPyと計算エンジンを初期化しています
        </p>

        {/* プログレス表示（オプション） */}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            初回ロードには5-10秒かかる場合があります
          </p>
        </div>
      </div>
    </div>
  );
}
