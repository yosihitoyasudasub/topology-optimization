# ブラウザ版トポロジー最適化ソフト

Pyodide + NumPyを使用したブラウザ上で動作する2Dトポロジー最適化ソフトウェア

## 概要

インストール不要でWebブラウザから構造最適化をリアルタイムに実行・可視化できるアプリケーション。

### 主な機能

- 2D有限要素法（FEM）による構造解析
- SIMP法によるトポロジー最適化
- リアルタイム密度分布可視化
- インタラクティブなパラメータ調整UI
- プリセット問題（片持ち梁、MBB梁など）
- 最適化履歴の可視化
- DXFファイル出力（CAD連携用）

## 技術スタック

- **Next.js 14+** (App Router)
- **Pyodide** (ブラウザ上でPython実行)
- **NumPy** (数値計算)
- **Vercel** (デプロイ)

## 開発環境セットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd topology-optimization
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 4. ビルド

```bash
npm run build
npm run start
```

## プロジェクト構成

```
topology-optimization/
├── .claude/              # Claude Code指示ファイル
├── app/                  # Next.js App Router
├── lib/                  # ライブラリ・ユーティリティ
├── public/python/        # Pythonファイル（静的配信）
├── docs/                 # ドキュメント
└── examples/             # サンプル問題設定
```

## ドキュメント

- [開発仕様書](docs/PROJECT_SPECIFICATION.md) - 詳細な技術仕様
- [アルゴリズム説明](docs/algorithm.md) - SIMP法の詳細
- [使用方法](docs/usage.md) - ユーザーガイド
- [Python API仕様](docs/api.md) - Pythonモジュール仕様

## デプロイ

### Vercelへのデプロイ

```bash
npx vercel
```

または、GitHubリポジトリと連携して自動デプロイ

## ライセンス

（未定）

## 作成日

2025-12-28
