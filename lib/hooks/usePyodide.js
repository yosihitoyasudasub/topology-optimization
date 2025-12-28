'use client';

import { useState, useEffect } from 'react';

/**
 * Pyodideの初期化と管理を行うカスタムフック
 * @returns {Object} { pyodide, loading, error }
 */
export function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadPyodideAndPackages() {
      try {
        console.log('Pyodideロード開始...');

        // PyodideをCDNから動的にロード
        const loadPyodideScript = () => {
          return new Promise((resolve, reject) => {
            // 既にロード済みの場合
            if (window.loadPyodide) {
              resolve(window.loadPyodide);
              return;
            }

            // scriptタグを動的に追加
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = () => resolve(window.loadPyodide);
            script.onerror = () => reject(new Error('Pyodideスクリプトのロードに失敗しました'));
            document.head.appendChild(script);
          });
        };

        const loadPyodide = await loadPyodideScript();
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });

        console.log('Pyodideロード完了');

        // NumPyのロード
        console.log('NumPyロード開始...');
        await pyodideInstance.loadPackage('numpy');
        console.log('NumPyロード完了');

        // Pythonコードの読み込み（後で実装）
        // const response = await fetch('/python/main.py');
        // const code = await response.text();
        // await pyodideInstance.runPythonAsync(code);

        if (mounted) {
          setPyodide(pyodideInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error('Pyodideロードエラー:', err);
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadPyodideAndPackages();

    // クリーンアップ
    return () => {
      mounted = false;
    };
  }, []);

  return { pyodide, loading, error };
}
