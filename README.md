# my-blog

## table of contents

- [my-blog](#my-blog)
  - [table of contents](#table-of-contents)
  - [1. Getting Started](#1-getting-started)
    - [how to run](#how-to-run)
    - [how to get Notion token and database id](#how-to-get-notion-token-and-database-id)
    - [how to access](#how-to-access)
  - [2. Tech Stack](#2-tech-stack)
  - [3. Git Commit Message prefix](#3-git-commit-message-prefix)

## 1. Getting Started

### how to run

```bash
# clone the project
$ git clone git@github.com:M1n01/my-blog.git

# install dependencies
$ cd my-blog
$ pnpm install

# create .env file
$ touch .env.local
$ echo "NEXT_PUBLIC_NOTION_TOKEN=<your-notion-token>\nNEXT_PUBLIC_DATABASE_ID=<your-notion-database-id>" > .env.local

# start the development server
$ pnpm dev
```

### how to get Notion token and database id

- [Document](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id)

### how to access

```
# open the browser and visit
http://localhost:3000
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 2. Tech Stack

- Next.js
- Notion API
- Mantine
- Sharp (画像処理・WebP変換)
- cloudflare # for deployment

## 3. Image Processing Features

### WebP Conversion
画像をWebP形式に変換してパフォーマンスを向上させる機能を追加しました。

#### 主な機能
- **自動WebP変換**: 画像をダウンロード時にWebP形式に変換
- **サムネイル生成**: 最適化されたサムネイル画像の自動生成
- **品質調整**: 用途に応じた品質設定（thumbnail: 85%, hero: 90%, content: 80%）
- **リサイズ機能**: 指定したサイズに自動リサイズ

#### 使用例
```typescript
import { downloadImage, downloadThumbnail } from './lib/articles/image-downloader';

// 通常の画像ダウンロード
const result = await downloadImage(imageUrl, articleId);

// WebP変換付きダウンロード
const webpResult = await downloadImage(imageUrl, articleId, {
  convertToWebP: true,
  quality: 90,
  width: 1200,
  height: 800,
});

// サムネイル生成
const thumbnailResult = await downloadThumbnail(imageUrl, articleId, 400, 300);
```

#### 最適化設定
- **thumbnail**: 400x300px, 85%品質
- **hero**: 1200x800px, 90%品質  
- **content**: 800x600px, 80%品質

<p align="right">(<a href="#top">トップへ</a>)</p>

## 4. Git Commit Message prefix

```
fix: バグ修正
feat: 新機能追加
update: 機能更新
change: 仕様変更
perf: パフォーマンス改善
refactor: コードのリファクタリング
docs: ドキュメントのみの変更
style: コードのフォーマットに関する変更
test: テストコードの変更
revert: 変更の取り消し
chore: その他の変更
```

<p align="right">(<a href="#top">トップへ</a>)</p>
