## 重要

私はあなたよりプログラミングが得意だが、時短のためにあなたにコーディングを依頼する。

2回以上連続でテストを失敗した時は、現在の状況を整理して、一緒に解決方法を考える。仮説のないまま試行錯誤を繰り返すのは避ける。

あなたは GitHub から学習した広範な知識を持っており、個別のアルゴリズムやライブラリの使い方は私が実装するよりも速い。テストコードを書いて動作確認しながら、私に説明しながらコードを書く。

反面、現在のコンテキストに応じた処理は苦手だ。コンテキストが不明瞭な時は、私に確認する。

- 最初に型と、それを処理する関数のインターフェースを考える
- コードのコメントとして、そのファイルがどういう仕様化を可能な限り明記する
- 実装が内部状態を持たないとき、 class による実装を避けて関数を優先する
- 副作用を抽象するために、アダプタパターンで外部依存を抽象し、テストではインメモリなアダプタで処理する

---

## 本プロジェクトの概要

ブログサイトを作成する。

## 技術スタック

### Frontend

- Next.js v15.0.3 (App Router) with TypeScript v5.7.2
- Style: Mantine v7.14.3
- React v18.3.1
- React DOM v18.3.1

### CMS and Deployment

- CMS: Notion (@notionhq/client v2.2.15)
- Deploy: Cloudflare Pages (Wrangler v3.96.0, @cloudflare/next-on-pages v1.13.6)
- CI/CD: GitHub Actions
- Testing: Jest
- Lint: ESLint v8.57.1
- Formatter: Prettier v3.4.1
- Package Manager: PNPM v9.14.4
- Version Control: Git
- Repository: GitHub

### その他の依存関係

- @tabler/icons-react v3.23.0
- @next/third-parties v15.1.7
- react-share v5.2.2
- vercel v39.1.1

### プロジェクト情報

- バージョン: 0.1.0
- プライベートパッケージ: true

## 仕様

- ブログ記事は Notion のデータベースから取得する
- ブログ記事は Markdown で記述する
