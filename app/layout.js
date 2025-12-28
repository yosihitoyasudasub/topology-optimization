import './globals.css'

export const metadata = {
  title: 'トポロジー最適化ソフト',
  description: 'Pyodide + NumPyを使用したブラウザ版2Dトポロジー最適化ソフトウェア',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
