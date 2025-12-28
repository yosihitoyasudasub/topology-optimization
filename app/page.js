'use client';

import { useState } from 'react';
import { usePyodide } from '@/lib/hooks/usePyodide';
import LoadingScreen from './components/LoadingScreen';

/**
 * メインページコンポーネント
 * トポロジー最適化アプリケーションのエントリーポイント
 */
export default function Home() {
  const { pyodide, loading, error } = usePyodide();

  // ローディング中の表示
  if (loading) {
    return <LoadingScreen />;
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            エラーが発生しました
          </h1>
          <p className="text-gray-700">{error.message}</p>
        </div>
      </div>
    );
  }

  // メインアプリケーション
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          トポロジー最適化ソフト
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Pyodide + NumPy ブラウザ版
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-700">
            Pyodideロード完了！実装を進めます...
          </p>
        </div>
      </main>
    </div>
  );
}
