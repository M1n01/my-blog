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

- Frontend: Next.js with TypeScript
- Style Framework: Mantine
- CMS: Notion
- Deploy: Cloudflare Pages
- CI/CD: GitHub Actions
- Testing: Jest
- Lint: ESLint
- Formatter: Prettier
- Package Manager: PNPM
- Version Control: Git
- Repository: GitHub

## 仕様

- ブログ記事は Notion のデータベースから取得する
- ブログ記事は Markdown で記述する
