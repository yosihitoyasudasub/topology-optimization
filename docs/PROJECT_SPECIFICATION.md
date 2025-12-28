# ブラウザ版トポロジー最適化ソフト 開発仕様書

## プロジェクト概要

Pyodide + NumPyを使用したブラウザ上で動作する2Dトポロジー最適化ソフトウェア。
インストール不要でWebブラウザから構造最適化をリアルタイムに実行・可視化できるアプリケーション。

### 主な機能
- 2D有限要素法（FEM）による構造解析
- SIMP法によるトポロジー最適化
- リアルタイム密度分布可視化
- インタラクティブなパラメータ調整UI
- プリセット問題（片持ち梁、MBB梁など）
- 最適化履歴の可視化
- **DXFファイル出力**（CAD連携用）

---

## 技術スタック

### フロントエンド
- **Next.js 14+**: Reactフレームワーク（App Router使用）
- **React 18+**: UIライブラリ
- **JavaScript/JSX**: 開発言語
- **CSS Modules / Tailwind CSS**: スタイリング

### 計算エンジン
- **Pyodide 0.24+**: ブラウザ上でPython実行（クライアントサイドのみ）
- **NumPy**: 数値計算・線形代数
- **SciPy** (オプション): スパース行列ソルバー

### 可視化
- **Canvas 2D API**: 密度分布ヒートマップ描画
- **Chart.js / Recharts**: 収束グラフ表示

### エクスポート機能
- **dxf-writer**: DXFファイル生成ライブラリ
- **Marching Squares**: 輪郭抽出アルゴリズム（形状境界検出）

### デプロイ
- **Vercel**: ホスティング・CD/CI

### 開発ツール
- **ESLint**: コード品質管理
- **npm/yarn/pnpm**: パッケージ管理

---

## プロジェクト構成

```
topology-optimization/
├── public/                      # 静的ファイル
│   ├── favicon.ico
│   └── python/                  # Pythonファイル（静的配信）
│       ├── core/
│       │   ├── fem.py           # 有限要素法エンジン
│       │   ├── optimizer.py     # SIMP法最適化アルゴリズム
│       │   └── solver.py        # 線形方程式ソルバー
│       ├── utils/
│       │   ├── filters.py       # 密度フィルター
│       │   └── mesh.py          # メッシュ生成
│       └── main.py              # Pythonエントリーポイント
│
├── app/                         # Next.js App Router
│   ├── layout.js                # ルートレイアウト
│   ├── page.js                  # メインページ（'use client'）
│   ├── globals.css              # グローバルスタイル
│   │
│   └── components/              # UIコンポーネント
│       ├── ParameterPanel.jsx   # パラメータ入力UI
│       ├── OptimizationCanvas.jsx # Canvas描画・可視化
│       ├── ConvergenceChart.jsx # 収束グラフ
│       ├── ControlButtons.jsx   # 実行/停止/リセットボタン
│       ├── PresetSelector.jsx   # プリセット問題選択
│       └── LoadingScreen.jsx    # Pyodideロード中画面
│
├── lib/                         # ライブラリ・ユーティリティ
│   ├── hooks/                   # カスタムフック
│   │   ├── usePyodide.js        # Pyodide初期化・管理
│   │   ├── useOptimization.js   # 最適化実行ロジック
│   │   └── useCanvas.js         # Canvas描画ロジック
│   │
│   └── utils/                   # ユーティリティ関数
│       ├── colormap.js          # カラーマップ生成
│       ├── presets.js           # プリセット問題定義
│       ├── contourExtractor.js  # 輪郭抽出（Marching Squares）
│       └── dxfExporter.js       # DXFファイル生成
│
├── examples/                    # サンプル問題設定（API Routes経由で配信可能）
│   ├── cantilever.json          # 片持ち梁問題
│   └── mbb-beam.json            # MBB梁問題
│
├── docs/                        # ドキュメント
│   ├── algorithm.md             # アルゴリズム説明
│   ├── usage.md                 # 使用方法
│   └── api.md                   # Python API仕様
│
├── tests/                       # テストコード
│   └── test_fem.py              # FEM検証テスト
│
├── .gitignore
├── package.json
├── next.config.js               # Next.js設定
├── jsconfig.json                # パスエイリアス設定
├── PROJECT_SPECIFICATION.md     # 本ファイル
└── README.md
```

---

## 主要ファイルの役割

### Next.js App Router

#### `app/layout.js`
- HTML構造定義
- メタデータ設定
- グローバルスタイル読み込み

#### `app/page.js`
- メインページコンポーネント（'use client'指定）
- アプリケーション全体の状態管理
- Pyodide初期化制御
- UIコンポーネント統合

### React コンポーネント

#### `ParameterPanel.jsx`
- 問題設定パラメータ入力
  - メッシュサイズ（nx, ny）
  - 体積制約率（volfrac）
  - フィルター半径（rmin）
  - ペナルティパラメータ（penal）
- 境界条件設定UI
- 荷重条件設定UI

#### `OptimizationCanvas.jsx`
- Canvas要素管理
- 密度分布のヒートマップ描画
- マウスインタラクション（ズーム、パンなど）

#### `ControlButtons.jsx`
- 最適化実行/一時停止/停止
- リセット機能
- 結果エクスポート
  - PNG画像エクスポート
  - JSONデータエクスポート
  - **DXFファイルエクスポート**（CAD連携用）

#### `PresetSelector.jsx`
- プリセット問題選択ドロップダウン
- 問題パラメータの自動設定

### カスタムフック

#### `lib/hooks/usePyodide.js`
```javascript
// Pyodideの初期化と管理（クライアントサイドのみで実行）
'use client';
import { useState, useEffect } from 'react';

export function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pyodideロード処理
    // NumPy, SciPy等のパッケージロード
    // Pythonコードの読み込み（public/python/から）
  }, []);

  return { pyodide, loading, error };
}
```

#### `useOptimization.js`
```javascript
// 最適化ロジックの実行管理
export function useOptimization(pyodide, params) {
  // 最適化ループ制御
  // 進捗状態管理
  // 結果データ取得
  return { run, pause, stop, results, iteration };
}
```

#### `useCanvas.js`
```javascript
// Canvas描画ロジック
export function useCanvas(canvasRef) {
  // 描画関数
  // カラーマップ適用
  return { drawDensity, clear };
}
```

### Python コア

#### `public/python/core/fem.py`
- 要素剛性マトリクス計算
- 全体剛性マトリクス組立
- 境界条件適用
- 変位・応力計算

#### `public/python/core/optimizer.py`
- SIMP法実装
- 感度解析（∂c/∂ρ）
- OC法（Optimality Criteria）更新則
- 収束判定

#### `public/python/core/solver.py`
- NumPyベース線形ソルバー
- スパース行列対応（SciPy利用時）

#### `public/python/utils/filters.py`
- 密度フィルター（チェッカーボード防止）
- 感度フィルター

#### `public/python/main.py`
- JavaScript-Python間のインターフェース
- 最適化実行関数
- 結果データのシリアライズ

### エクスポート機能

#### `lib/utils/contourExtractor.js`
- Marching Squaresアルゴリズム実装
- 密度分布から形状輪郭を抽出
- しきい値処理（例: 密度 ≥ 0.5を材料領域として判定）
- 輪郭ポリゴン生成

```javascript
// 使用例
export function extractContours(densityGrid, threshold = 0.5) {
  // 2D密度グリッドから輪郭線を抽出
  // Marching Squaresアルゴリズム実装
  return contourPolygons; // [{x, y}の配列]の配列
}
```

#### `lib/utils/dxfExporter.js`
- DXFフォーマット生成
- 輪郭ポリゴンをDXFエンティティ（POLYLINE/LWPOLYLINE）に変換
- ブラウザでファイルダウンロード

```javascript
// 使用例
import DxfWriter from 'dxf-writer';
export function exportToDXF(contours, filename = 'topology_result.dxf') {
  const dxf = new DxfWriter();
  // 輪郭線をDXFに変換
  // ファイルダウンロード
}
```

---

## 実装ステップ

### Phase 1: プロジェクトセットアップ
1. **Next.js プロジェクト初期化**
   - `npx create-next-app@latest .`
   - App Router選択
   - JavaScriptテンプレート
   - 依存パッケージインストール

2. **基本フォルダ構成作成**
   - `app/components/`, `lib/hooks/`, `lib/utils/` ディレクトリ
   - `public/python/` ディレクトリ（Pythonコード配置）
   - `.gitignore`, `jsconfig.json` 設定

3. **Pyodideローダー実装**
   - `lib/hooks/usePyodide.js` カスタムフック作成
   - NumPy読み込みテスト
   - ローディング画面実装（`app/components/LoadingScreen.jsx`）

### Phase 2: FEMコア実装（Python）
4. **2D矩形要素FEMエンジン**
   - `public/python/core/fem.py`: 4節点平面応力要素実装
   - 要素剛性マトリクス計算
   - 全体剛性マトリクス組立関数

5. **線形ソルバー**
   - `public/python/core/solver.py`: NumPy.linalg.solve 実装
   - 境界条件処理

6. **単純な静的解析テスト**
   - 片持ち梁の変位計算検証

### Phase 3: 最適化アルゴリズム（Python）
7. **SIMP法実装**
   - `public/python/core/optimizer.py`: 密度ペナルティモデル
   - コンプライアンス最小化
   - 感度解析（チェーンルール）

8. **OC法更新則**
   - ラグランジュ乗数の二分探索
   - 密度更新式実装

9. **密度フィルター**
   - `public/python/utils/filters.py`: 重み付き平均フィルター
   - チェッカーボードパターン抑制

### Phase 4: UI/可視化（Next.js + React）
10. **基本レイアウト構築**
    - `app/page.js`: グリッドレイアウト（'use client'）
    - ヘッダー、サイドパネル、メインキャンバス

11. **パラメータ入力パネル**
    - `app/components/ParameterPanel.jsx`: フォーム実装
    - スライダー/入力フィールド
    - バリデーション

12. **Canvas描画実装**
    - `app/components/OptimizationCanvas.jsx`: Canvas要素
    - `lib/hooks/useCanvas.js`: ヒートマップ描画
    - カラーマップ（Viridis風）

13. **制御ボタン**
    - `app/components/ControlButtons.jsx`: 実行/停止/リセット
    - 状態管理連携

### Phase 5: 統合とリアルタイム更新
14. **Pyodide-React連携**
    - `lib/hooks/useOptimization.js`: 最適化ループ実装
    - イテレーション毎にReact状態更新
    - requestAnimationFrameで描画最適化

15. **プログレス表示**
    - イテレーション数表示
    - 目的関数値グラフ
    - 体積制約達成率表示

### Phase 6: 機能拡張
16. **プリセット問題実装**
    - `app/components/PresetSelector.jsx`: ドロップダウン
    - `lib/utils/presets.js`: 片持ち梁、MBB梁定義

17. **収束グラフ**
    - `app/components/ConvergenceChart.jsx`: Chart.js/Recharts統合
    - コンプライアンス履歴表示

18. **結果エクスポート**
    - PNG画像ダウンロード（Canvas.toBlob）
    - JSON結果データダウンロード

19. **DXFエクスポート機能**
    - `lib/utils/contourExtractor.js`: Marching Squares実装
    - `lib/utils/dxfExporter.js`: DXF生成ロジック
    - しきい値スライダーUI（密度カットオフ調整）
    - DXFダウンロードボタン追加

### Phase 7: 最適化とテスト
20. **パフォーマンス改善**
    - Web Workerでの最適化実行検討
    - メモリ管理最適化

21. **ドキュメント整備**
    - README.md作成
    - アルゴリズム解説
    - 使用方法ガイド

---

## 推奨する最初の実装対象

### 片持ち梁問題（Cantilever Beam）

**問題設定:**
- 領域: 60×30要素（アスペクト比2:1）
- 境界条件: 左端完全固定
- 荷重: 右下隅に下向き単位荷重
- 体積制約: 50%（元体積の半分）
- フィルター半径: 1.5要素分
- ペナルティ: 3.0

**期待される結果:**
- 左上から右下への斜めトラス構造
- 滑らかな密度分布（0-1の中間値を含む）

**検証項目:**
- 体積制約が満たされているか
- 収束履歴が単調減少しているか
- チェッカーボードパターンが出現していないか

---

## 開発環境セットアップ手順

### 1. プロジェクト初期化
```bash
npx create-next-app@latest .
# 選択肢:
# - TypeScript: No
# - ESLint: Yes
# - Tailwind CSS: Yes (推奨)
# - src/ directory: No
# - App Router: Yes
# - import alias: Yes (@/*)
```

### 2. 追加パッケージ（必要に応じて）
```bash
# グラフ表示用
npm install chart.js react-chartjs-2
# または
npm install recharts  # Next.js互換性の高いグラフライブラリ

# DXFエクスポート用
npm install dxf-writer
```

### 3. 開発サーバー起動
```bash
npm run dev
# http://localhost:3000 で起動
```

### 4. ローカルビルド & プレビュー
```bash
npm run build
npm run start
```

### 5. Vercelデプロイ
```bash
# GitHubリポジトリと連携後、Vercelが自動デプロイ
# または手動デプロイ:
npx vercel
```

---

## Next.js 特有の実装注意事項

### クライアントサイド専用コンポーネント
PyodideはブラウザAPIに依存するため、すべてのPyodide関連コンポーネントには`'use client'`ディレクティブが必要です。

```javascript
// app/page.js
'use client';

import { usePyodide } from '@/lib/hooks/usePyodide';
import OptimizationCanvas from './components/OptimizationCanvas';

export default function Home() {
  const { pyodide, loading } = usePyodide();
  // ...
}
```

### Pythonファイルの読み込み
Pyodideから`public/python/`配下のファイルを読み込む際のパス指定：

```javascript
// lib/hooks/usePyodide.js
useEffect(() => {
  loadPyodide().then(async (py) => {
    await py.loadPackage('numpy');

    // Pythonコードの読み込み
    const response = await fetch('/python/main.py');
    const code = await response.text();
    await py.runPythonAsync(code);

    setPyodide(py);
  });
}, []);
```

### next.config.js 設定
Pyodideのロードに必要なヘッダー設定：

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pyodide用のヘッダー設定（CORS、COOP/COEP）
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

### Vercelデプロイ時の注意点
- Pyodideの初回ロードには時間がかかる（5-10秒）
- Vercel Functionsのタイムアウト制限は関係なし（完全クライアントサイド）
- public/フォルダは自動的に静的ファイルとして配信される
- Edge Runtimeは使用不可（Pyodideはブラウザ専用）

---

## アルゴリズム概要

### SIMP法（Solid Isotropic Material with Penalization）

**目的関数:**
```
minimize: C(ρ) = U^T K U
制約条件: V(ρ)/V0 ≤ f
         0 < ρ_min ≤ ρ ≤ 1
```

- C: コンプライアンス（柔軟性、最小化対象）
- ρ: 要素密度（設計変数）
- f: 体積制約率（例: 0.5）
- ρ_min: 最小密度（数値安定性のため、例: 0.001）

**材料モデル:**
```
E(ρ) = E_min + ρ^p (E_0 - E_min)
```
- p: ペナルティパラメータ（通常3.0）
- 中間密度を不利にして0/1解に導く

**感度解析:**
```
∂C/∂ρ_e = -p ρ_e^(p-1) (E_0 - E_min) u_e^T k_0 u_e
```

**OC法更新則:**
```
ρ_new = max(ρ_min, max(ρ-m, min(1, min(ρ+m, ρ B_e^η))))
B_e = -(∂C/∂ρ_e) / (λ ∂V/∂ρ_e)
```
- λ: ラグランジュ乗数（二分探索で決定）
- η: 数値ダンピング（通常0.5）
- m: 移動制限（通常0.2）

---

## DXFエクスポートアルゴリズム

### Marching Squares法による輪郭抽出

**概要:**
密度分布グリッドから材料領域と空隙領域の境界線を抽出するアルゴリズム。

**処理フロー:**
1. **しきい値処理**
   - ユーザー指定のしきい値（例: 0.5）で密度グリッドを二値化
   - `ρ ≥ threshold` → 材料（1）
   - `ρ < threshold` → 空隙（0）

2. **Marching Squares適用**
   - 2×2セルごとに4隅の値をチェック
   - 16パターン（2^4）の輪郭線分を生成
   - 線分を接続して閉じた輪郭ポリゴンを形成

3. **座標変換**
   - グリッド座標（i, j）→ 実座標（x, y）
   - スケール適用（要素サイズ考慮）

4. **輪郭最適化（オプション）**
   - Douglas-Peuckerアルゴリズムで頂点削減
   - スムージング処理

**実装例:**
```javascript
function marchingSquares(densityGrid, threshold) {
  const nx = densityGrid.length;
  const ny = densityGrid[0].length;
  const contours = [];

  for (let i = 0; i < nx - 1; i++) {
    for (let j = 0; j < ny - 1; j++) {
      // 4隅の値取得
      const val = [
        densityGrid[i][j] >= threshold ? 1 : 0,
        densityGrid[i+1][j] >= threshold ? 1 : 0,
        densityGrid[i+1][j+1] >= threshold ? 1 : 0,
        densityGrid[i][j+1] >= threshold ? 1 : 0
      ];

      // パターンインデックス計算
      const caseId = val[0] * 8 + val[1] * 4 + val[2] * 2 + val[3];

      // 輪郭線分生成（lookup table使用）
      // ...
    }
  }

  return contours;
}
```

### DXF生成

**DXFエンティティ:**
- **LWPOLYLINE**: 軽量ポリライン（推奨）
- **POLYLINE**: 従来型ポリライン
- **LINE**: 個別線分（シンプル）

**DXFファイル構造:**
```
HEADER    # ファイルヘッダー
TABLES    # レイヤー・線種定義
ENTITIES  # 図形エンティティ（輪郭線）
  LWPOLYLINE
    頂点1 (x1, y1)
    頂点2 (x2, y2)
    ...
EOF       # ファイル終端
```

**実装例（dxf-writer使用）:**
```javascript
import DxfWriter from 'dxf-writer';

function exportToDXF(contours, elementSize = 1.0) {
  const dxf = new DxfWriter();

  contours.forEach((contour, idx) => {
    dxf.addPolyline(contour.map(pt => ({
      x: pt.x * elementSize,
      y: pt.y * elementSize
    })));
  });

  const dxfString = dxf.stringify();

  // ブラウザでダウンロード
  const blob = new Blob([dxfString], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'topology_result.dxf';
  a.click();
}
```

### CADソフトでの読み込み

生成されたDXFファイルは以下のCADソフトで読み込み可能：
- AutoCAD
- Fusion 360
- SolidWorks
- FreeCAD
- LibreCAD
- DraftSight

---

## UI設計方針

### レイアウト
- **左サイドパネル（300px）**: パラメータ入力エリア
- **メインエリア**: Canvas描画エリア（レスポンシブ）
- **下部パネル（オプション）**: 収束グラフ

### カラースキーム
- 密度0（空隙）: 白 (#FFFFFF)
- 密度1（材料）: 濃紺 (#003366)
- グラデーション: Viridis風カラーマップ

### インタラクション
- スライダー変更時: 即座にパラメータ反映
- 実行中: イテレーション毎に自動再描画
- Canvas: ツールチップで密度値表示（オプション）
- **DXFエクスポートUI:**
  - しきい値スライダー（0.0～1.0、デフォルト0.5）
  - リアルタイムプレビュー（輪郭線をCanvas上にオーバーレイ）
  - エクスポートボタン（DXFファイルダウンロード）

---

## パフォーマンス目標

- Pyodideロード: 5秒以内
- 30×30メッシュ: 1イテレーション < 100ms
- 60×30メッシュ: 1イテレーション < 500ms
- 100イテレーションで収束

---

## 今後の拡張可能性

- **DXF機能拡張**
  - スプライン曲線による輪郭スムージング
  - 寸法線・注釈の自動追加
  - レイヤー分け（輪郭/寸法/メッシュ）
  - 複数輪郭の自動検出（穴あき形状対応）
- 3D可視化（Three.js）
- 複数荷重ケース対応
- 応力制約追加
- メッシュ細分化（アダプティブ）
- STLエクスポート（3Dプリント用）
- クラウド保存機能
- 複数材料対応

---

## 参考文献・リソース

1. **99 line topology optimization code**
   - Ole Sigmund (2001)
   - MATLABベースの教育的実装

2. **Pyodide公式ドキュメント**
   - https://pyodide.org/

3. **トポロジー最適化入門**
   - Bendsøe & Sigmund (2003)

---

## ライセンス

（後で決定）

---

## 作成日
2025-12-28

## 最終更新
2025-12-28

## 変更履歴
- 2025-12-28: 初版作成（Vite + React）
- 2025-12-28: Next.js + Vercelデプロイに変更
- 2025-12-28: DXFファイルエクスポート機能を追加
