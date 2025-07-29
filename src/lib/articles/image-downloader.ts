import fs from "fs";
import path from "path";
import sharp from "sharp";
import { Result, err, ok } from "neverthrow";
import type { NotionError } from "./types";

/**
 * 画像をダウンロードして、publicディレクトリに保存する
 * @param url ダウンロードする画像のURL
 * @param articleId 記事ID
 * @param options 変換オプション
 * @returns 保存した画像のパス or NotionError
 */
export async function downloadImage(
  url: string,
  articleId: string,
  options: {
    convertToWebP?: boolean;
    quality?: number;
    width?: number;
    height?: number;
  } = {},
): Promise<Result<string, NotionError>> {
  try {
    const urlObject = new URL(url);
    const pathnameParts = urlObject.pathname.split("/").filter(Boolean);
    const imageId =
      pathnameParts[pathnameParts.length - 2] || `image_${Date.now()}`;
    const originalFilename = pathnameParts[pathnameParts.length - 1];
    const extension = path.extname(originalFilename) || ".png";

    // WebP変換が有効な場合は拡張子を.webpに変更
    const finalExtension = options.convertToWebP ? ".webp" : extension;
    const imageName = `${imageId}${finalExtension}`;

    const directoryPath = path.join(
      process.cwd(),
      "public",
      "images",
      "articles",
      articleId,
    );
    const imagePath = path.join(directoryPath, imageName);
    const publicPath = path.join("/images", "articles", articleId, imageName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (fs.existsSync(imagePath)) {
      return ok(publicPath);
    }

    const response = await fetch(url);
    if (!response.ok) {
      return err({
        type: "FETCH_ERROR",
        message: `Failed to fetch image: ${response.statusText}`,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // WebP変換が有効な場合はsharpで変換
    if (options.convertToWebP) {
      let sharpInstance = sharp(buffer);

      // リサイズオプション
      if (options.width || options.height) {
        sharpInstance = sharpInstance.resize(options.width, options.height, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      // WebP変換
      const webpBuffer = await sharpInstance
        .webp({
          quality: options.quality || 80,
          effort: 4, // 圧縮レベル（0-6）
        })
        .toBuffer();

      fs.writeFileSync(imagePath, webpBuffer);
    } else {
      // 元の形式で保存
      fs.writeFileSync(imagePath, buffer);
    }

    return ok(publicPath);
  } catch (error) {
    console.error("Failed to download image", error);
    return err({
      type: "UNKNOWN",
      message: "Failed to download image",
      originalError: error,
    });
  }
}

/**
 * サムネイル画像をWebP形式でダウンロードする
 * @param url ダウンロードする画像のURL
 * @param articleId 記事ID
 * @param width サムネイルの幅
 * @param height サムネイルの高さ
 * @returns 保存した画像のパス or NotionError
 */
export async function downloadThumbnail(
  url: string,
  articleId: string,
  width: number = 400,
  height: number = 300,
): Promise<Result<string, NotionError>> {
  return downloadImage(url, articleId, {
    convertToWebP: true,
    quality: 85,
    width,
    height,
  });
}
