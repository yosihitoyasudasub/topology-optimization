# AI実装指令ファイル

## プロジェクト概要

**プロジェクト名:** ブラウザ版トポロジー最適化ソフト
**技術スタック:** Next.js 14+ (App Router) + Pyodide + NumPy
**デプロイ先:** Vercel
**詳細仕様:** `PROJECT_SPECIFICATION.md` を参照

---

## 基本方針

### 1. 仕様書の厳守
- **必ず** `PROJECT_SPECIFICATION.md` に記載されたフォルダ構成・ファイル構成に従うこと
- 勝手にフォルダ構成を変更しない
- 追加ライブラリのインストールが必要な場合は事前に確認する

### 2. 段階的実装
- Phase 1から順番に実装すること
- 一度に複数のPhaseを実装しない
- 各Phaseの完了後、動作確認を行う

### 3. コード品質
- クリーンで読みやすいコードを書く
- 適切なコメントを日本語で記述
- エラーハンドリングを必ず実装
- console.logでデバッグ情報を適切に出力

### 4. Next.js特有の注意
- Pyodide関連コンポーネントには必ず `'use client'` を付ける
- public/フォルダの静的ファイルは `/` から始まるパスで参照
- next.config.jsにCOOP/COEPヘッダーを設定

---

## 実装時の指示フォーマット

### AIに実装を依頼する際のテンプレート

```markdown
## 実装依頼: [Phase番号] - [タスク名]

### 目的
[何を実装するか、なぜ必要か]

### 実装対象ファイル
- [ ] ファイルパス1
- [ ] ファイルパス2

### 実装内容
1. [具体的な実装内容1]
2. [具体的な実装内容2]

### 確認事項
- [ ] 動作確認方法
- [ ] テストケース

### 参考
- PROJECT_SPECIFICATION.md の該当箇所: [行番号 or セクション名]
```

---

## コーディング規約

### JavaScript/JSX

#### ファイル命名規則
- コンポーネント: PascalCase (例: `ParameterPanel.jsx`)
- フック: camelCase、useプレフィックス (例: `usePyodide.js`)
- ユーティリティ: camelCase (例: `colormap.js`)

#### コンポーネント構造
```javascript
'use client'; // Pyodide使用時は必須

import { useState, useEffect } from 'react';

/**
 * コンポーネントの説明
 * @param {Object} props - プロパティ
 */
export default function ComponentName({ prop1, prop2 }) {
  // state
  const [state, setState] = useState(null);

  // effects
  useEffect(() => {
    // 処理
  }, [dependencies]);

  // handlers
  const handleClick = () => {
    // 処理
  };

  // render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### カスタムフック構造
```javascript
'use client';

import { useState, useEffect } from 'react';

/**
 * フックの説明
 * @returns {Object} 返り値の説明
 */
export function useCustomHook(param) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // 初期化処理
  }, [param]);

  return { state, setState };
}
```

### Python

#### ファイル命名規則
- snake_case (例: `fem.py`, `optimizer.py`)

#### コード構造
```python
"""
モジュールの説明
"""

import numpy as np

def function_name(param1, param2):
    """
    関数の説明

    Args:
        param1: パラメータ1の説明
        param2: パラメータ2の説明

    Returns:
        返り値の説明
    """
    # 実装
    return result
```

#### NumPy使用ルール
- 必ずベクトル化演算を使用（forループ最小化）
- メモリ効率を考慮（大きな配列のコピーを避ける）
- dtype指定（`np.float64`など）

---

## フォルダ構成チェックリスト

実装前に以下の構成が存在することを確認：

```
✓ app/
  ✓ layout.js
  ✓ page.js
  ✓ globals.css
  ✓ components/
✓ lib/
  ✓ hooks/
  ✓ utils/
✓ public/
  ✓ python/
    ✓ core/
    ✓ utils/
✓ examples/
✓ docs/
✓ tests/
```

---

## Phase別実装ガイド

### Phase 1: プロジェクトセットアップ

#### 実装順序
1. Next.jsプロジェクト初期化
2. フォルダ構成作成
3. 基本的なlayout.jsとpage.js作成
4. Pyodideローダー実装（usePyodide.js）
5. ローディング画面実装

#### 完了条件
- [ ] `npm run dev` でサーバーが起動する
- [ ] Pyodideがブラウザで正常にロードされる
- [ ] NumPyが使用可能
- [ ] ローディング画面が表示される

---

### Phase 2: FEMコア実装（Python）

#### 実装順序
1. `public/python/core/fem.py` - 基本的なFEM関数
2. `public/python/core/solver.py` - 線形ソルバー
3. `public/python/main.py` - JavaScript連携インターフェース
4. 簡単なテストケース（片持ち梁変位計算）

#### 完了条件
- [ ] FEMエンジンが動作する
- [ ] 変位ベクトルが正しく計算される
- [ ] JavaScriptから呼び出せる

---

### Phase 3: 最適化アルゴリズム（Python）

#### 実装順序
1. `public/python/core/optimizer.py` - SIMP法実装
2. `public/python/utils/filters.py` - 密度フィルター
3. OC法更新則の実装
4. 収束判定ロジック

#### 完了条件
- [ ] 最適化ループが動作する
- [ ] 体積制約が満たされる
- [ ] 密度分布が収束する

---

### Phase 4: UI/可視化（Next.js + React）

#### 実装順序
1. `app/page.js` - 基本レイアウト
2. `app/components/ParameterPanel.jsx` - 入力UI
3. `app/components/OptimizationCanvas.jsx` - Canvas描画
4. `app/components/ControlButtons.jsx` - 制御ボタン
5. `lib/hooks/useCanvas.js` - 描画ロジック
6. `lib/utils/colormap.js` - カラーマップ

#### 完了条件
- [ ] パラメータが入力できる
- [ ] Canvas上に密度分布が描画される
- [ ] 実行/停止ボタンが動作する

---

### Phase 5: 統合とリアルタイム更新

#### 実装順序
1. `lib/hooks/useOptimization.js` - 最適化制御
2. Pyodide-React間のデータ受け渡し
3. イテレーション毎の描画更新
4. プログレス表示

#### 完了条件
- [ ] リアルタイムで最適化が実行される
- [ ] イテレーション毎に画面が更新される
- [ ] 進捗が表示される

---

### Phase 6: 機能拡張

#### 実装順序
1. `app/components/PresetSelector.jsx`
2. `lib/utils/presets.js`
3. `app/components/ConvergenceChart.jsx`
4. PNG/JSONエクスポート
5. **DXFエクスポート**
   - `lib/utils/contourExtractor.js`
   - `lib/utils/dxfExporter.js`

#### 完了条件
- [ ] プリセット問題が選択できる
- [ ] 収束グラフが表示される
- [ ] 各種ファイルがエクスポートできる
- [ ] DXFファイルがCADで開ける

---

## 実装時の注意事項

### Pyodide関連

#### 1. ロード処理
```javascript
// ❌ 悪い例
const pyodide = loadPyodide();

// ✅ 良い例
const pyodide = await loadPyodide({
  indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
});
```

#### 2. Pythonコードの読み込み
```javascript
// public/python/main.pyを読み込む
const response = await fetch('/python/main.py');
const code = await response.text();
await pyodide.runPythonAsync(code);
```

#### 3. データ受け渡し
```javascript
// JavaScript → Python
pyodide.globals.set('data', data);

// Python → JavaScript
const result = pyodide.globals.get('result').toJs();
```

### Next.js関連

#### 1. next.config.js設定
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 2. パスエイリアス（jsconfig.json）
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Canvas描画

#### 1. Canvasリファレンス
```javascript
const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  // 描画処理
}, [densities]);
```

#### 2. ヒートマップ描画
```javascript
// 密度グリッドをヒートマップとして描画
function drawDensityMap(ctx, densities, colormap) {
  const nx = densities.length;
  const ny = densities[0].length;
  const cellWidth = canvas.width / nx;
  const cellHeight = canvas.height / ny;

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const color = colormap(densities[i][j]);
      ctx.fillStyle = color;
      ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}
```

---

## デバッグ方針

### 1. Pyodideのデバッグ
```javascript
// Pythonのprintはconsole.logに出力される
pyodide.runPython(`
    print("Debug: value =", value)
`);
```

### 2. NumPy配列の確認
```javascript
// NumPy配列をJavaScriptで確認
const arr = pyodide.globals.get('numpy_array').toJs();
console.log('NumPy array:', arr);
```

### 3. エラーハンドリング
```javascript
try {
  const result = await pyodide.runPythonAsync(code);
} catch (error) {
  console.error('Python execution error:', error);
  // ユーザーにエラー表示
}
```

---

## テスト方針

### 単体テスト（Python）
```python
# tests/test_fem.py
def test_cantilever_beam():
    """片持ち梁の変位計算テスト"""
    # 既知の解と比較
    assert np.allclose(displacement, expected_displacement, rtol=1e-5)
```

### 統合テスト（JavaScript）
```javascript
// 手動テスト項目
// 1. Pyodideロードが5秒以内に完了するか
// 2. パラメータ変更が反映されるか
// 3. 最適化が収束するか
// 4. DXFエクスポートが成功するか
```

---

## パフォーマンスチェックリスト

- [ ] Pyodideロード時間 < 5秒
- [ ] 30×30メッシュ: 1イテレーション < 100ms
- [ ] 60×30メッシュ: 1イテレーション < 500ms
- [ ] Canvas描画: 60fps維持
- [ ] メモリリークなし（長時間実行可能）

---

## トラブルシューティング

### Pyodideがロードできない
- COOP/COEPヘッダーが設定されているか確認
- ブラウザのコンソールでCORSエラーを確認
- Pyodideのバージョン確認

### Canvasが表示されない
- `'use client'` ディレクティブがあるか確認
- canvasRefが正しく設定されているか確認
- useEffectの依存配列を確認

### 最適化が収束しない
- パラメータ（penal, rmin, volfrac）を確認
- フィルター実装を確認
- 収束判定の閾値を確認

---

## 完成チェックリスト

### 機能
- [ ] Pyodideが正常にロードされる
- [ ] パラメータ入力ができる
- [ ] 最適化が実行できる
- [ ] リアルタイムで可視化される
- [ ] 収束グラフが表示される
- [ ] プリセット問題が動作する
- [ ] PNG/JSON/DXFエクスポートができる

### 品質
- [ ] エラーハンドリングが実装されている
- [ ] ローディング状態が表示される
- [ ] レスポンシブデザイン対応
- [ ] コードにコメントがある
- [ ] console.errorが適切に使われている

### デプロイ
- [ ] ローカルでビルドが成功する (`npm run build`)
- [ ] Vercelにデプロイできる
- [ ] 本番環境で動作する

---

## AIへの質問テンプレート

実装中に不明点がある場合：

```markdown
## 質問: [件名]

### 状況
[現在の実装状況、何をしようとしているか]

### 問題
[何ができないか、エラー内容]

### エラーメッセージ（あれば）
```
[エラーメッセージ]
```

### 試したこと
- [試したこと1]
- [試したこと2]

### 期待する動作
[どう動作してほしいか]
```

---

## 参考リンク

- [Pyodide公式ドキュメント](https://pyodide.org/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Vercelデプロイガイド](https://vercel.com/docs)
- [Canvas API リファレンス](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 最終更新
2025-12-28

---

## このファイルの使い方

1. 実装開始前にこのファイルを読む
2. 各Phaseの実装時に該当セクションを参照
3. 不明点があれば「AIへの質問テンプレート」を使用
4. 完成時に「完成チェックリスト」で確認
